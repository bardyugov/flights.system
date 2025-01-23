import { IAuthService } from '../../../application/services/auth.service'
import { Inject, OnModuleDestroy, OnModuleInit, Provider } from '@nestjs/common'
import {
   AuthTokenRes,
   EmployeeRoles,
   error,
   GetAirplanesRes,
   IJwtService,
   InjectServices,
   IProducerService,
   JwtPayload,
   KafkaRequest,
   KafkaResult,
   MyLoggerService,
   ok,
   RegisterEmployeeReq,
   Topic
} from '@flights.system/shared'
import { DataSource } from 'typeorm'
import {
   EmployeeEntity,
   EmployeeRoleEnum
} from '../../entities/employee.entity'
import { BcryptService } from '../internal/bcrypt.service'
import { es, Faker } from '@faker-js/faker'
import { QualificationEntity } from '../../entities/qulification.entity'
import {
   EmployeeStatusEntity,
   EmployeeStatusEnum
} from '../../entities/employee.status.entity'
import { ConfigService } from '@nestjs/config'
import { ClientEntity } from '../../entities/client.entity'
import { InsertResultWithId } from '../../database/query-types'
import { QualificationToEmployeeEntity } from '../../entities/qualification.to.employee.entity'

class AuthService implements IAuthService, OnModuleInit, OnModuleDestroy {
   private readonly faker = new Faker({ locale: [es] })

   constructor(
      @Inject(AuthService.name)
      private readonly logger: MyLoggerService,
      @Inject(InjectServices.ProducerService)
      private readonly producer: IProducerService,
      @Inject(InjectServices.JwtService)
      private readonly jwtService: IJwtService,
      private readonly dataSource: DataSource,
      private readonly bcryptService: BcryptService,
      private readonly config: ConfigService
   ) {}

   private buildTokens(id: number, role: EmployeeRoles) {
      const payload: JwtPayload = { id, role }
      const access = this.jwtService.create(
         payload,
         this.config.get<number>('ACCESS_TTL')
      )
      const refresh = this.jwtService.create(
         payload,
         this.config.get<number>('REFRESH_TTL')
      )

      return [access, refresh]
   }

   private getRandomAirplanes(traceId: string) {
      const count = this.faker.number.int({
         min: 1,
         max: 20
      })

      return this.producer.produceWithReply<number, GetAirplanesRes[]>(
         Topic.AIRPLANE_GET,
         {
            traceId,
            data: count
         }
      )
   }

   private getRepositoryByRole(role: EmployeeRoles) {
      switch (role) {
         case 'client':
            return this.dataSource.getRepository(ClientEntity)
         case 'pilot':
            return this.dataSource.getRepository(EmployeeEntity)
         case 'stewardess':
            return this.dataSource.getRepository(EmployeeEntity)
      }
   }

   private async registerEmployee(
      req: KafkaRequest<RegisterEmployeeReq>
   ): Promise<KafkaResult<AuthTokenRes>> {
      return this.dataSource.transaction(async transactionManager => {
         const existEmployee = await transactionManager.findOne(
            EmployeeEntity,
            {
               where: {
                  name: req.data.name,
                  surname: req.data.surname,
                  lastName: req.data.lastName
               }
            }
         )
         if (existEmployee) {
            this.logger.warn('Employee already exist', { trace: req.traceId })
            return error('Employee already exist', req.traceId)
         }

         const hashPassword = this.bcryptService.create(req.data.password)

         const status = await transactionManager
            .getRepository(EmployeeStatusEntity)
            .findOne({
               where: {
                  status: EmployeeStatusEnum.Working
               }
            })

         if (!status) {
            this.logger.warn('Not found employee role', { trace: req.traceId })
            return error('Not found employee role', req.traceId)
         }

         const role =
            req.data.role === 'pilot'
               ? EmployeeRoleEnum.Pilot
               : EmployeeRoleEnum.Stewardess

         const { raw } = await transactionManager
            .createQueryBuilder()
            .insert()
            .into(EmployeeEntity)
            .values({
               name: req.data.name,
               surname: req.data.surname,
               lastName: req.data.lastName,
               birthDate: req.data.birthDate,
               password: hashPassword,
               role: role,
               status: status
            })
            .returning(['id'])
            .execute()

         const employeeId = raw[0].id as number

         if (role === EmployeeRoleEnum.Pilot) {
            const result = await this.getRandomAirplanes(req.traceId)
            if (result.data.state === 'error') {
               this.logger.warn(result.data.message, { trace: req.traceId })
               return error(result.data.message, req.traceId)
            }

            const { raw }: InsertResultWithId = await transactionManager
               .createQueryBuilder()
               .insert()
               .into(QualificationEntity)
               .values(
                  result.data.value.map(v => ({
                     airplaneId: v.id,
                     name: `qualification-${v.pid}`
                  }))
               )
               .orIgnore('airplane_id')
               .returning(['id'])
               .execute()

            await transactionManager
               .createQueryBuilder()
               .insert()
               .into(QualificationToEmployeeEntity)
               .values(
                  raw.map(qualification => ({
                     qualification: () => qualification.id.toString(),
                     employee: () => employeeId.toString()
                  }))
               )
               .execute()
         }

         const [access, refresh] = this.buildTokens(employeeId, role)

         await transactionManager
            .createQueryBuilder()
            .update(EmployeeEntity)
            .set({ refreshToken: refresh })
            .where('id = :id', { id: employeeId })
            .execute()

         this.logger.log('Success created employee', { trace: req.traceId })
         return ok({ access, refresh }, req.traceId)
      })
   }

   private async registerClient(
      req: KafkaRequest<RegisterEmployeeReq>
   ): Promise<KafkaResult<AuthTokenRes>> {
      return this.dataSource.transaction(async transactionManager => {
         const existClient = await transactionManager.findOne(ClientEntity, {
            where: {
               name: req.data.name,
               surname: req.data.surname,
               lastName: req.data.lastName
            }
         })
         if (existClient) {
            this.logger.warn('Client already exist', { trace: req.traceId })
            return error('Client already exist', req.traceId)
         }

         const hashPassword = this.bcryptService.create(req.data.password)

         const { raw }: InsertResultWithId = await transactionManager
            .createQueryBuilder()
            .insert()
            .into(ClientEntity)
            .values({
               name: req.data.name,
               surname: req.data.surname,
               lastName: req.data.lastName,
               birthDate: req.data.birthDate,
               password: hashPassword
            })
            .returning(['id'])
            .execute()

         const clientId = raw[0].id
         const [access, refresh] = this.buildTokens(clientId, req.data.role)

         await transactionManager
            .createQueryBuilder()
            .update(ClientEntity)
            .set({ refreshToken: refresh })
            .where('id = :id', { clientId })
            .execute()

         this.logger.log('Success created employee', { trace: req.traceId })
         return ok({ access, refresh }, req.traceId)
      })
   }

   async register(
      req: KafkaRequest<RegisterEmployeeReq>
   ): Promise<KafkaResult<AuthTokenRes>> {
      switch (req.data.role) {
         case 'client':
            return this.registerClient(req)
         case 'pilot':
            return this.registerEmployee(req)
         case 'stewardess':
            return this.registerEmployee(req)
      }
   }

   async refresh(
      req: KafkaRequest<string>
   ): Promise<KafkaResult<AuthTokenRes>> {
      const payload = this.jwtService.encode(req.data)
      if (!payload) {
         this.logger.warn('Invalid token', { trace: req.traceId })
         return error('Invalid token', req.traceId)
      }

      const repository = this.getRepositoryByRole(payload.role)
      const employee = await repository.findOne({ where: { id: payload.id } })
      if (!employee) {
         this.logger.warn('Not found employee', { trace: req.traceId })
         return error('Not found employee', req.traceId)
      }

      const [access, refresh] = this.buildTokens(payload.id, payload.role)
      await repository
         .createQueryBuilder()
         .update()
         .set({ refreshToken: refresh })
         .where('id = :id', { id: payload.id })
         .execute()

      return ok({ access, refresh }, req.traceId)
   }

   async logout(req: KafkaRequest<JwtPayload>): Promise<KafkaResult<string>> {
      const repository = this.getRepositoryByRole(req.data.role)
      const employee = await repository.findOne({ where: { id: req.data.id } })
      if (!employee) {
         this.logger.warn('Not found employee', { trace: req.traceId })
         return error('Not found employee', req.traceId)
      }

      await repository
         .createQueryBuilder()
         .update()
         .set({ refreshToken: null })
         .where('id = :id', { id: req.data.id })
         .execute()

      return ok('Success logout', req.traceId)
   }

   async onModuleInit() {
      await this.producer.connect()
      await this.producer.subscribeOfReply(Topic.AIRPLANE_GET_REPLY)
   }

   async onModuleDestroy() {
      await this.producer.disconnect()
   }
}

const AuthServiceProvider: Provider = {
   provide: InjectServices.AuthService,
   useClass: AuthService
}

export { AuthServiceProvider, AuthService }

import { IAuthService } from '../../../application/services/auth.service'
import { Inject, OnModuleDestroy, OnModuleInit, Provider } from '@nestjs/common'
import {
   AuthTokenRes,
   error,
   GetAirplanesRes,
   GlobalRoles,
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

   private buildTokens(id: number, role: GlobalRoles) {
      const payload: JwtPayload = { id, role }
      const access = this.jwtService.create(
         payload,
         this.config.get<string>('ACCESS_TTL')
      )
      const refresh = this.jwtService.create(
         payload,
         this.config.get<string>('REFRESH_TTL')
      )

      return [access, refresh]
   }

   private async getNextval(table: string) {
      const [{ nextval }] = (await this.dataSource.query(
         `SELECT nextval(pg_get_serial_sequence('${table}', 'id'))`
      )) as { nextval: string }[]

      return Number(nextval)
   }

   private async getRandomAirplanes(traceId: string) {
      const count = this.faker.number.int({
         min: 1,
         max: 20
      })

      return await this.producer.produceWithReply<number, GetAirplanesRes[]>(
         Topic.AIRPLANE_GET_TOPIC,
         {
            traceId,
            data: count
         }
      )
   }

   async registerEmployee(
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

         const nextval = await this.getNextval('employee')

         const role =
            req.data.role === 'pilot'
               ? EmployeeRoleEnum.Pilot
               : EmployeeRoleEnum.Stewardess

         const [access, refresh] = this.buildTokens(nextval, role)

         if (role === EmployeeRoleEnum.Pilot) {
            const result = await this.getRandomAirplanes(req.traceId)
            if (result.data.state === 'error') {
               this.logger.warn(result.data.message, { trace: req.traceId })
               return error(result.data.message, req.traceId)
            }

            await transactionManager
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
               .execute()
         }

         await transactionManager
            .createQueryBuilder()
            .insert()
            .into(EmployeeEntity)
            .values({
               name: req.data.name,
               surname: req.data.surname,
               lastName: req.data.lastName,
               birthDate: req.data.birthDate,
               password: hashPassword,
               refreshToken: refresh,
               role: role,
               status: () => status.id.toString()
            })
            .execute()

         this.logger.log('Success created employee', { trace: req.traceId })
         return ok({ access, refresh }, req.traceId)
      })
   }

   async registerClient(
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

         const nextval = await this.getNextval('client')
         const hashPassword = this.bcryptService.create(req.data.password)
         const [access, refresh] = this.buildTokens(nextval, req.data.role)

         await transactionManager
            .createQueryBuilder()
            .insert()
            .into(ClientEntity)
            .values({
               name: req.data.name,
               surname: req.data.surname,
               lastName: req.data.lastName,
               birthDate: req.data.birthDate,
               password: hashPassword,
               refreshToken: refresh
            })
            .execute()

         this.logger.log('Success created employee', { trace: req.traceId })
         return ok({ access, refresh }, req.traceId)
      })
   }

   async onModuleInit() {
      await this.producer.connect()
      await this.producer.subscribeOfReply(Topic.AIRPLANE_GET_TOPIC_REPLY)
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

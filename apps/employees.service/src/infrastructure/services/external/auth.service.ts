import { IAuthService } from '../../../application/services/auth.service'
import { Inject, OnModuleDestroy, OnModuleInit, Provider } from '@nestjs/common'
import {
   AuthTokenRes,
   error,
   GetAirplanesRes,
   GlobalRole,
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
   EmployeeTypeEnum
} from '../../entities/employee.entity'
import { JwtService } from '../internal/jwt.service'
import { BcryptService } from '../internal/bcrypt.service'
import { es, Faker } from '@faker-js/faker'
import { QualificationEntity } from '../../entities/qulification.entity'
import {
   EmployeeStatusEntity,
   EmployeeStatusEnum
} from '../../entities/employee.status.entity'
import { ConfigService } from '@nestjs/config'

class AuthService implements IAuthService, OnModuleInit, OnModuleDestroy {
   private readonly faker = new Faker({ locale: [es] })

   constructor(
      @Inject(AuthService.name)
      private readonly logger: MyLoggerService,
      @Inject(InjectServices.ProducerService)
      private readonly producer: IProducerService,
      private readonly jwtService: JwtService,
      private readonly dataSource: DataSource,
      private readonly bcryptService: BcryptService,
      private readonly config: ConfigService
   ) {}

   private buildTokens(id: number, role: GlobalRole) {
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
         this.logger.log('Handled', { trace: req.traceId })
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
         const result = await this.getRandomAirplanes(req.traceId)
         if (result.data.state === 'error') {
            this.logger.warn(result.data.message, { trace: req.traceId })
            return error(result.data.message, req.traceId)
         }

         const employeeType = await transactionManager
            .getRepository(EmployeeStatusEntity)
            .findOne({
               where: {
                  status: EmployeeStatusEnum.Working
               }
            })

         if (!employeeType) {
            this.logger.warn('Not found employee type', { trace: req.traceId })
            return error('Not found employee type', req.traceId)
         }

         const [{ nextval }] = (await this.dataSource.query(
            "SELECT nextval(pg_get_serial_sequence('employee', 'id'))"
         )) as { nextval: string }[]

         const [access, refresh] = this.buildTokens(
            Number(nextval),
            req.data.role
         )

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
               type:
                  req.data.role === 'pilot'
                     ? EmployeeTypeEnum.Pilot
                     : EmployeeTypeEnum.Stewardess,
               status: () => employeeType.id.toString()
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

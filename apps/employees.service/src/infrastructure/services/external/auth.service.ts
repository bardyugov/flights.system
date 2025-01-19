import { IAuthService } from '../../../application/services/auth.service'
import { Injectable, Provider, Inject } from '@nestjs/common'
import {
  AuthTokenResponse,
  InjectServices,
  KafkaRequest,
  KafkaResult, MyLoggerService,
  RegisterEmployeeReq,
  error,
  ok, JwtPayload, GlobalRole
} from '@flights.system/shared'
import { DataSource } from 'typeorm'
import { EmployeeEntity, EmployeeTypeEnum } from '../../entities/employee.entity'
import { JwtService } from '../internal/jwt.service'
import { BcryptService } from '../internal/bcrypt.service'

@Injectable()
class AuthService implements IAuthService {
  constructor(
    @Inject(InjectServices.AuthServiceLogger)
    private readonly logger: MyLoggerService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly bcryptService: BcryptService
  ) {
  }

  private buildTokens(id: number, role: GlobalRole) {
    const payload: JwtPayload = { id, role }
    const access = this.jwtService.create(payload, 30)
    const refresh = this.jwtService.create(payload, 60)

    return [access, refresh]
  }

  async registerEmployee(req: KafkaRequest<RegisterEmployeeReq>): Promise<KafkaResult<AuthTokenResponse>> {
    return this.dataSource.transaction(async transactionManager => {
      const existEmployee = await transactionManager.find(EmployeeEntity,
        {
          where: {
            name: req.data.name,
            surname:
            req.data.surname,
            lastName:
            req.data.lastName
          }
        }
      )
      if (existEmployee) {
        this.logger.log('Employee already exist', { trace: req.traceId })
        return error('Employee already exist')
      }

      const hashPassword = this.bcryptService.create(req.data.password)
      const dbEmployeeTypeEnum = req.data.role === 'pilot' ? EmployeeTypeEnum.Pilot : EmployeeTypeEnum.Stewardess

      const employee = new EmployeeEntity(
        req.data.name,
        req.data.surname,
        req.data.lastName,
        req.data.birthDate,
        dbEmployeeTypeEnum,
        hashPassword)
      const { id } = await transactionManager.save(employee)

      const [access, refresh] = this.buildTokens(id, req.data.role)

      await transactionManager
        .createQueryBuilder()
        .update(EmployeeEntity)
        .set({ refreshToken: refresh })
        .where('id := id', { id })
        .execute()

      this.logger.log('Success created employee', { trace: req.traceId })
      return ok({ access, refresh })
    })
  }
}

const AuthServiceProvider: Provider = {
  provide: InjectServices.AuthService,
  useClass: AuthService
}

export {
  AuthServiceProvider,
  AuthService
}

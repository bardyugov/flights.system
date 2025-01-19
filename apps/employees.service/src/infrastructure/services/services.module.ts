import { Module } from '@nestjs/common'
import { DatabaseModule, InjectServices, MyLoggerModule } from '@flights.system/shared'
import { EmployeeEntity } from '../entities/employee.entity'
import { EmployeeStatusEntity } from '../entities/employee.status.entity'
import { QualificationEntity } from '../entities/qulification.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientEntity } from '../entities/client.entity'
import { AuthService, AuthServiceProvider } from './external/auth.service'
import { JwtService } from './internal/jwt.service'
import { JwtModule } from '@nestjs/jwt'
import { BcryptService } from './internal/bcrypt.service'

const entities = [EmployeeEntity, EmployeeStatusEntity, QualificationEntity, ClientEntity]

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    DatabaseModule.register(entities),
    JwtModule.register({}),
    MyLoggerModule.register(AuthService.name)
  ],
  providers: [
    AuthServiceProvider,
    JwtService,
    BcryptService
  ],
  exports: [
    AuthServiceProvider
  ]
})
class ServicesModule {
}

export { ServicesModule }

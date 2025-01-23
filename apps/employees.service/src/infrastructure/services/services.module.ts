import { Module } from '@nestjs/common'
import {
   DatabaseModule,
   MyLoggerModule,
   ProducerModule,
   MyJwtModule
} from '@flights.system/shared'
import { EmployeeEntity } from '../entities/employee.entity'
import { EmployeeStatusEntity } from '../entities/employee.status.entity'
import { QualificationEntity } from '../entities/qulification.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientEntity } from '../entities/client.entity'
import { AuthService, AuthServiceProvider } from './external/auth.service'
import { BcryptService } from './internal/bcrypt.service'
import { QualificationToEmployeeEntity } from '../entities/qualification.to.employee.entity'

const entities = [
   EmployeeEntity,
   EmployeeStatusEntity,
   QualificationEntity,
   ClientEntity,
   QualificationToEmployeeEntity
]

@Module({
   imports: [
      TypeOrmModule.forFeature(entities),
      DatabaseModule.register(entities),
      MyJwtModule,
      MyLoggerModule.register(AuthService.name),
      ProducerModule
   ],
   providers: [AuthServiceProvider, BcryptService],
   exports: [AuthServiceProvider]
})
class ServicesModule {}

export { ServicesModule }

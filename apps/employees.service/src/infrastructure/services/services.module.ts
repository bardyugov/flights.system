import { Module } from '@nestjs/common'
import { DatabaseModule } from '@flights.system/shared'
import { EmployeeEntity } from '../entities/employee.entity'
import { EmployeeStatusEntity } from '../entities/employee.status.entity'
import { QualificationEntity } from '../entities/qulification.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeEntity, EmployeeStatusEntity, QualificationEntity]),
    DatabaseModule.register([EmployeeEntity, EmployeeStatusEntity, QualificationEntity])
  ]
})
class ServicesModule {
}

export { ServicesModule }

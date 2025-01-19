import { Module } from '@nestjs/common'
import { DatabaseModule } from '@flights.system/shared'
import { EmployeeEntity } from '../entities/employee.entity'
import { EmployeeStatusEntity } from '../entities/employee.status.entity'
import { QualificationEntity } from '../entities/qulification.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

const entities = [EmployeeEntity, EmployeeStatusEntity, QualificationEntity]

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    DatabaseModule.register(entities)
  ]
})
class ServicesModule {
}

export { ServicesModule }

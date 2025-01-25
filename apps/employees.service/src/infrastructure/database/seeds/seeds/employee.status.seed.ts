import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'
import {
   EmployeeStatusEntity,
   EmployeeStatusEnum
} from '../../../entities/employee.status.entity'

class EmployeeStatusSeeder implements Seeder {
   track?: boolean
   async run(dataSource: DataSource) {
      const repository = dataSource.getRepository(EmployeeStatusEntity)

      await repository.save([
         new EmployeeStatusEntity(EmployeeStatusEnum.Relaxing),
         new EmployeeStatusEntity(EmployeeStatusEnum.Working)
      ])
   }
}

export { EmployeeStatusSeeder }

import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { Faker, es } from '@faker-js/faker'
import { FlightEntity } from '../../../entities/flight.entity'
import { FlightInsertQuery } from '../../query-types'
import { maxCountWritten } from '../../constants'

class FlightSeeder implements Seeder {
   track?: boolean
   async run(dataSource: DataSource): Promise<void> {
      const faker = new Faker({ locale: [es] })
      const inserts: FlightInsertQuery[] = []

      for (let i = 0; i < maxCountWritten; i++) {
         const cmd: FlightInsertQuery = {
            landingTime: faker.date.soon({ days: 2 }),
            departureTime: faker.date.soon({ days: 1 }),
            from: () =>
               faker.number.int({ min: 1, max: maxCountWritten }).toString(),
            to: () =>
               faker.number.int({ min: 1, max: maxCountWritten }).toString()
         }

         inserts.push(cmd)
      }

      await dataSource
         .createQueryBuilder()
         .insert()
         .into(FlightEntity)
         .values(inserts)
         .execute()
   }
}

export { FlightSeeder }

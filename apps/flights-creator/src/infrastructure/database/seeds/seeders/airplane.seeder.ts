import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'
import { AirplaneStatusEntity } from '../../../entities/airplane.status.entity'
import { Faker, es } from '@faker-js/faker'
import { maxCountWritten } from '../../constants'
import { AirplaineInsertQuery } from '../../query-types'

class AirplaneSeeder implements Seeder {
    track?: boolean
    async run(dataSource: DataSource): Promise<void> {
        const faker = new Faker({ locale: [es] })
        const countAirplaneStatuses = await dataSource
            .getRepository(AirplaneStatusEntity)
            .count()

        const randomStatus = faker.number.int({
            min: 1,
            max: countAirplaneStatuses
        })
        const inserts: AirplaineInsertQuery = []

        for (let i = 0; i < maxCountWritten; i++) {
            const randomStatus = faker.number.int({
                min: 1,
                max: countAirplaneStatuses
            })
        }
    }
}

export default AirplaneSeeder

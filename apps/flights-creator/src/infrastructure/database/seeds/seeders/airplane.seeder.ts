import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'
import { AirplaneStatusEntity } from '../../../entities/airplane.status.entity'
import { Faker, es } from '@faker-js/faker'
import { maxCountWritten } from '../../constants'
import { AirplaneInsertQuery } from '../../query-types'
import { AirplaneEntity } from '../../../entities/airplane.entity'

class AirplaneSeeder implements Seeder {
    track?: boolean
    async run(dataSource: DataSource): Promise<void> {
        const faker = new Faker({ locale: [es] })
        const countAirplaneStatuses = await dataSource
            .getRepository(AirplaneStatusEntity)
            .count()

        const inserts: AirplaneInsertQuery[] = []

        for (let i = 0; i < maxCountWritten; i++) {
            inserts.push({
                pid: faker.number.int({
                    min: 300,
                    max: maxCountWritten
                }),
                amountPlaces: faker.number.int({
                    min: 30,
                    max: 300
                }),
                status: () =>
                    faker.number
                        .int({
                            min: 1,
                            max: countAirplaneStatuses
                        })
                        .toString(),
                currentCity: () =>
                    faker.number
                        .int({
                            min: 1,
                            max: maxCountWritten
                        })
                        .toString()
            })
        }

        await dataSource
            .createQueryBuilder()
            .insert()
            .into(AirplaneEntity)
            .values(inserts)
            .execute()
    }
}

export { AirplaneSeeder }

import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { DataSource } from 'typeorm'
import { es, Faker } from '@faker-js/faker'
import { FlightEntity } from '../../entities/flight.entity'
import { AirplaneEntity } from '../../entities/airplane.entity'
import { CityEntity} from '../../entities/city.entity'
import { FlightInsertQuery } from '../../database/query-types'

@Injectable()
class AccumulatorService {
    private readonly logger = new Logger(AccumulatorService.name)
    private readonly faker = new Faker({ locale: [es] })

    constructor(private readonly context: DataSource) {}

    @Cron('45 * * * * *')
    async update() {
        await this.context.transaction(async transactionManager => {
            const airplaneCount = await transactionManager
                .getRepository(AirplaneEntity)
                .count()

            const cityCount = await transactionManager.getRepository(CityEntity).count()

            const randomAirplaneId = this.faker.number.int({
                min: 1,
                max: airplaneCount
            })

            const randomCityId = this.faker.number.int({
              min: 1, max: cityCount
            })

            await transactionManager
              .createQueryBuilder()
              .update(FlightEntity)
              .set({ currentCity: randomCityId })
              .where("id = :id", { id: randomAirplaneId })
              .execute()

            const newFlight = await transactionManager
                .createQueryBuilder()
                .insert()
                .into(FlightEntity)
                .values(FlightInsertQuery.)
                .execute()
        })
    }
}

export { AccumulatorService }

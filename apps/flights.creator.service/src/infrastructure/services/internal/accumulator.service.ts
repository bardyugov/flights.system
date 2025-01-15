import { Inject, Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { DataSource } from 'typeorm'
import { es, Faker } from '@faker-js/faker'
import { FlightEntity } from '../../entities/flight.entity'
import { AirplaneEntity } from '../../entities/airplane.entity'
import { CityEntity } from '../../entities/city.entity'
import { FlightInsertQuery } from '../../database/query-types'
import { InjectServices, MyLoggerService } from '@flights.system/shared'

@Injectable()
class AccumulatorService {
  private readonly faker = new Faker({ locale: [es] })

  constructor(
    @Inject(InjectServices.AccumulatorServiceLogger)
    private readonly logger: MyLoggerService,
    private readonly context: DataSource
  ) {
  }

  @Cron('45 * * * * *')
  async update() {
    await this.context.transaction(async transactionManager => {
      const airplaneCount = await transactionManager
        .getRepository(AirplaneEntity)
        .count()
      const cityCount = await transactionManager
        .getRepository(CityEntity)
        .count()

      const randomAirplaneId = this.faker.number.int({
        min: 1,
        max: airplaneCount
      })
      const randomFromId = this.faker.number.int({
        min: 1,
        max: cityCount
      })
      const randomToId = this.faker.number.int({
        min: 1,
        max: cityCount
      })

      await transactionManager
        .createQueryBuilder()
        .update(AirplaneEntity)
        .set({ currentCity: randomFromId, status: 4 })
        .where('id = :id', { id: randomAirplaneId })
        .execute()

      const departureTime = new Date()
      const landingTime = new Date()
      departureTime.setHours(departureTime.getHours() + 4)
      landingTime.setHours(departureTime.getHours() + 8)

      const flightInsert: FlightInsertQuery = {
        departureTime: departureTime,
        landingTime: landingTime,
        from: () => randomFromId.toString(),
        to: () => randomToId.toString()
      }

      const newFlight = await transactionManager
        .createQueryBuilder()
        .insert()
        .into(FlightEntity)
        .values(flightInsert)
        .returning(['id'])
        .execute()

      this.logger.log(`Created flight with id ${newFlight.raw[0].id}`)
    })
  }
}

export { AccumulatorService }

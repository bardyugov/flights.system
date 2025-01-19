import { Module } from '@nestjs/common'
import { CityProvider, CityService } from './external/сity.service'
import { DatabaseModule } from '@flights.system/shared'
import { AccumulatorService } from './internal/accumulator.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CityEntity } from '../entities/city.entity'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { redisStore } from 'cache-manager-redis-yet'
import { MyLoggerModule, InjectServices } from '@flights.system/shared'
import { AirplaneEntity } from '../entities/airplane.entity'
import { FlightEntity } from '../entities/flight.entity'
import { AirplaneStatusEntity } from '../entities/airplane.status.entity'

const entities = [CityEntity, AirplaneEntity, FlightEntity, AirplaneStatusEntity]

@Module({
  imports: [
    DatabaseModule.register(entities),
    TypeOrmModule.forFeature(entities),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          username: config.get<string>('REDIS_USERNAME'),
          password: config.get<string>('REDIS_PASSWORD'),
          socket: {
            port: config.get<number>('REDIS_PORT'),
            host: config.get<string>('REDIS_HOST')
          }
        })
      })
    }),
    MyLoggerModule.register(AccumulatorService.name),
    MyLoggerModule.register(CityService.name)
  ],
  providers: [CityProvider, AccumulatorService],
  exports: [CityProvider]
})
class ServicesModule {
}

export { ServicesModule }

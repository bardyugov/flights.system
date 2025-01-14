import { Module } from '@nestjs/common'
import { CityProvider } from './external/сity.service'
import { DatabaseModule } from '../database/database.module'
import { AccumulatorService } from './internal/accumulator.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CityEntity } from '../entities/city.entity'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import { redisStore } from 'cache-manager-redis-yet'

@Module({
   imports: [
      DatabaseModule,
      TypeOrmModule.forFeature([CityEntity]),
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
      })
   ],
   providers: [CityProvider, AccumulatorService],
   exports: [CityProvider]
})
class ServicesModule {}

export { ServicesModule }

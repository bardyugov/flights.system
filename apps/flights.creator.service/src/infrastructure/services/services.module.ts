import { Module } from '@nestjs/common'
import { CityProvider } from './external/сity.service'
import { DatabaseModule } from '../database/database.module'
import { AccumulatorService } from './internal/accumulator.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CityEntity } from '../entities/city.entity'
/*
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigService } from '@nestjs/config'
import * as redisStore from 'cache-manager-redis-store'
*/

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([CityEntity])
        /*CacheModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                store: redisStore,
                host: 'localhost',
                port: 6379
            })
        })*/
    ],
    providers: [CityProvider, AccumulatorService],
    exports: [CityProvider]
})
class ServicesModule {}

export { ServicesModule }

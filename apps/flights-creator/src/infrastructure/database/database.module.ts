import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { AirplaneEntity } from '../entities/airplane.entity'
import { AirplaneStatusEntity } from '../entities/airplane.status.entity'
import { CityEntity } from '../entities/city.entity'
import { FlightEntity } from '../entities/flight.entity'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                port: config.get<number>('DB_PORT'),
                host: config.get<string>('POSTGRES_HOST'),
                username: config.get<string>('POSTGRES_USER'),
                password: config.get<string>('POSTGRES_PASSWORD'),
                database: config.get<string>('POSTGRES_DB'),
                synchronize: false,
                entities: [
                    AirplaneEntity,
                    AirplaneStatusEntity,
                    CityEntity,
                    FlightEntity
                ]
            })
        })
    ]
})
class DatabaseModule {}
export { DatabaseModule }

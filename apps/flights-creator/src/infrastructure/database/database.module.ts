import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

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
                entities: ['../entities/*.entity.ts'],
                migrations: ['./migrations']
            })
        })
    ]
})
class DatabaseModule {}

export { DatabaseModule }

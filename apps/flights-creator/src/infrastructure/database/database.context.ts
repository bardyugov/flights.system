import { DataSource, DataSourceOptions } from 'typeorm'
import dotenv from 'dotenv'
import path from 'path'
import { SeederOptions } from 'typeorm-extension'

if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV environment variable is missing')
}

dotenv.config({
    path: path.join(__dirname, `../.././assets/.${process.env.NODE_ENV}.env`)
})

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    port: +process.env.DB_PORT,
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    entities: ['./src/infrastructure/entities/*.entity.ts'],
    migrations: ['./src/infrastructure/database/migrations/*.ts'],
    seeds: ['src/infrastructure/database/seeds/seeders/*.seeder.ts'],
    factories: ['src/infrastructure/database/seeds/factories/*.factory.ts']
}

export default new DataSource(dataSourceOptions)

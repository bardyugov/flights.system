import { DataSource, DataSourceOptions } from 'typeorm'
import dotenv from 'dotenv'
import path from 'path'
import * as process from 'node:process'

if (!process.env.NODE_ENV) {
   throw new Error('NODE_ENV environment variable is missing')
}

dotenv.config({
   path: path.join(__dirname, `../.././assets/.${process.env.NODE_ENV}.env`)
})

export const dataSourceOptions: DataSourceOptions = {
   type: 'postgres',
   port: +process.env.DB_PORT,
   host: process.env.POSTGRES_HOST,
   username: process.env.POSTGRES_USER,
   password: process.env.POSTGRES_PASSWORD,
   database: process.env.POSTGRES_DB,
   synchronize: false,
   entities: ['./src/infrastructure/entities/*.entity{.ts, .js}'],
   migrations: ['./src/infrastructure/database/migrations/*.ts']
}

export default new DataSource(dataSourceOptions)

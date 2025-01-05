import { Module } from '@nestjs/common'
import { FlightsRepository } from './flights.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from '../database/database.context'

@Module({
    imports: [TypeOrmModule.forRoot(dataSourceOptions)],
    providers: [FlightsRepository]
})
export class RepositoriesModule {}

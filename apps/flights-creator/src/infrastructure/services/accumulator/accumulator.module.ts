import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { AccumulatorService } from './accumulator.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { dataSourceOptions } from '../../database/database.context'

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forRoot(dataSourceOptions)
    ],
    providers: [AccumulatorService]
})
class AccumulatorModule {}

export { AccumulatorModule }

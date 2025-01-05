import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { AccumulatorService } from './accumulator.service'

@Module({
    imports: [ScheduleModule.forRoot()],
    providers: [AccumulatorService]
})
class AccumulatorModule {}

export { AccumulatorModule }

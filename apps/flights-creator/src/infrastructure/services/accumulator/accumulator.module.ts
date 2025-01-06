import { Module } from '@nestjs/common'
import { AccumulatorService } from './accumulator.service'

@Module({
    providers: [AccumulatorService]
})
class AccumulatorModule {}

export { AccumulatorModule }

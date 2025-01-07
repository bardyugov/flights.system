import { Module } from '@nestjs/common'
import { CityProvider } from './external/сity.service'
import { DatabaseModule } from '../database/database.module'
import { AccumulatorService } from './internal/accumulator.service'

@Module({
    imports: [DatabaseModule],
    providers: [CityProvider, AccumulatorService],
    exports: [CityProvider]
})
class ServicesModule {}

export { ServicesModule }

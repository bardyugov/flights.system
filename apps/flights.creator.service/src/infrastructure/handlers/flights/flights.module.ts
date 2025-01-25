import { Module } from '@nestjs/common'
import { FlightsHandler } from './flights.handler'
import { ConsumerModule } from '@flights.system/shared'
import { ServicesModule } from '../../services/services.module'

@Module({
   imports: [ConsumerModule, ServicesModule],
   providers: [FlightsHandler]
})
class FlightHandlerModule {}

export { FlightHandlerModule }

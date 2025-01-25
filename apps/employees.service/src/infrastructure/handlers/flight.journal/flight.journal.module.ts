import { Module } from '@nestjs/common'
import { FlightJournalHandler } from './flight.journal.handler'
import { ServicesModule } from '../../services/services.module'
import { ConsumerModule } from '@flights.system/shared'

@Module({
   imports: [ServicesModule, ConsumerModule],
   providers: [FlightJournalHandler]
})
class FlightJournalModuleHandler {}

export { FlightJournalModuleHandler }

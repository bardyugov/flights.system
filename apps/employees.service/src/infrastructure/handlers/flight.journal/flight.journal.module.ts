import { Module } from '@nestjs/common'
import { FlightJournalHandler } from './flight.journal.handler'

@Module({
   providers: [FlightJournalHandler]
})
class FlightJournalModuleHandler {}

export { FlightJournalModuleHandler }

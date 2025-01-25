import {
   AddFlightJournalReq,
   KafkaRequest,
   KafkaResult
} from '@flights.system/shared'

interface IFlightsJournalService {
   addFlight(
      req: KafkaRequest<AddFlightJournalReq>
   ): Promise<KafkaResult<string>>
   compensateAddedFlight(req: KafkaRequest<AddFlightJournalReq>): Promise<void>
}

export { IFlightsJournalService }

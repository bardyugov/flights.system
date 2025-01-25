import {
   Inject,
   Injectable,
   OnModuleDestroy,
   OnModuleInit
} from '@nestjs/common'
import {
   AddFlightJournalReq,
   IConsumerService,
   InjectServices,
   Topic
} from '@flights.system/shared'
import { IFlightsJournalService } from '../../../application/services/flights.journal.service'

@Injectable()
class FlightJournalHandler implements OnModuleInit, OnModuleDestroy {
   constructor(
      @Inject(InjectServices.ConsumerService)
      private readonly consumer: IConsumerService,
      @Inject(InjectServices.FlightJournalService)
      private readonly flightJournalService: IFlightsJournalService
   ) {}

   async onModuleInit() {
      await this.consumer.connect()

      await this.consumer.subscribeWithReply<AddFlightJournalReq, string>(
         Topic.FLIGHT_JOURNAL,
         async req => await this.flightJournalService.addFlight(req)
      )

      await this.consumer.subscribe<AddFlightJournalReq>(
         Topic.FLIGHT_JOURNAL_COMPENSATION,
         async req => await this.flightJournalService.compensateAddedFlight(req)
      )
   }

   async onModuleDestroy() {
      await this.consumer.disconnect()
   }
}

export { FlightJournalHandler }

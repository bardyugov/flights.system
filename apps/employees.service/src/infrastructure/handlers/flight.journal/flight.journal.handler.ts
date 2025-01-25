import {
   Inject,
   Injectable,
   OnModuleDestroy,
   OnModuleInit
} from '@nestjs/common'
import {
   AddFlightJournalCmd,
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

      await this.consumer.subscribeWithReply<AddFlightJournalCmd, string>(
         Topic.FLIGHT_JOURNAL,
         async req => await this.flightJournalService.addFlight(req)
      )

      await this.consumer.subscribe<AddFlightJournalCmd>(
         Topic.FLIGHT_JOURNAL_COMPENSATION,
         async req => await this.flightJournalService.compensateAddedFlight(req)
      )
   }

   async onModuleDestroy() {
      await this.consumer.disconnect()
   }
}

export { FlightJournalHandler }

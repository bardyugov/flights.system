import {
   Inject,
   Injectable,
   OnModuleDestroy,
   OnModuleInit
} from '@nestjs/common'
import {
   IConsumerService,
   InjectServices,
   ReservationPlaceReq,
   ReservationPlaceRes,
   Topic
} from '@flights.system/shared'
import { IFlightsService } from '../../../application/services/flights.service'

@Injectable()
class FlightsHandler implements OnModuleInit, OnModuleDestroy {
   constructor(
      @Inject(InjectServices.ConsumerService)
      private readonly consumer: IConsumerService,
      @Inject(InjectServices.FlightsService)
      private readonly flightsService: IFlightsService
   ) {}

   async onModuleInit() {
      await this.consumer.disconnect()

      await this.consumer.subscribeWithReply<
         ReservationPlaceReq,
         ReservationPlaceRes
      >(
         Topic.FLIGHT_RESERVATION_PLACE,
         async req => await this.flightsService.reservePlace(req)
      )

      await this.consumer.subscribe<ReservationPlaceReq>(
         Topic.FLIGHT_RESERVATION_PLACE_COMPENSATION,
         async req => await this.flightsService.compensateReservedPlace(req)
      )
   }

   async onModuleDestroy() {
      await this.consumer.disconnect()
   }
}

export { FlightsHandler }

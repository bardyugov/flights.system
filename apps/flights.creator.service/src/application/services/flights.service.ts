import {
   KafkaRequest,
   KafkaResult,
   ReservationPlaceReq,
   ReservationPlaceRes
} from '@flights.system/shared'

interface IFlightsService {
   reservePlace(
      req: KafkaRequest<ReservationPlaceReq>
   ): Promise<KafkaResult<ReservationPlaceRes>>
   compensateReservedPlace(
      req: KafkaRequest<ReservationPlaceReq>
   ): Promise<void>
}

export { IFlightsService }

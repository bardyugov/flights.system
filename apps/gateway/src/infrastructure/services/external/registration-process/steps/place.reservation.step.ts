import {
   InjectServices,
   IProducerService,
   KafkaRequest,
   MyLoggerService,
   ReservationPlaceReq,
   ReservationPlaceRes,
   SagaException,
   SagaStep,
   Topic
} from '@flights.system/shared'
import {
   Inject,
   Injectable,
   OnModuleDestroy,
   OnModuleInit
} from '@nestjs/common'

@Injectable()
class PlaceReservationStep
   extends SagaStep<KafkaRequest<ReservationPlaceReq>, ReservationPlaceRes>
   implements OnModuleInit, OnModuleDestroy
{
   compensationArg: KafkaRequest<ReservationPlaceReq>

   constructor(
      @Inject(InjectServices.ProducerService)
      private readonly producer: IProducerService,
      @Inject(PlaceReservationStep.name)
      private readonly logger: MyLoggerService
   ) {
      super('place-reservation-step')
   }

   async invoke(
      arg: KafkaRequest<ReservationPlaceReq>
   ): Promise<ReservationPlaceRes> {
      this.compensationArg = arg
      this.logger.log(`${this.name} invoke`, { trace: arg.traceId })

      const result = await this.producer.produceWithReply<
         ReservationPlaceReq,
         ReservationPlaceRes
      >(Topic.FLIGHT_RESERVATION_PLACE, arg)

      if (result.data.state === 'error') {
         throw new SagaException(result.data.message)
      }

      return result.data.value
   }

   async withCompensation(): Promise<void> {
      this.logger.warn(`${this.name} withCompensation`, {
         trace: this.compensationArg.traceId
      })

      await this.producer.produce<ReservationPlaceReq>(
         Topic.FLIGHT_RESERVATION_PLACE_COMPENSATION,
         this.compensationArg
      )
   }

   async onModuleInit() {
      await this.producer.connect()

      await this.producer.subscribeOfReply(Topic.FLIGHT_RESERVATION_PLACE_REPLY)
   }

   async onModuleDestroy() {
      await this.producer.disconnect()
   }
}

export { PlaceReservationStep }

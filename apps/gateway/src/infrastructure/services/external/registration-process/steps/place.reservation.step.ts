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
import { RegistrationProcessService } from '../registration.process.service'

@Injectable()
class PlaceReservationStep
   extends SagaStep<KafkaRequest<ReservationPlaceReq>, ReservationPlaceRes>
   implements OnModuleInit, OnModuleDestroy
{
   constructor(
      @Inject(InjectServices.ProducerService)
      private readonly producer: IProducerService,
      @Inject(RegistrationProcessService.name)
      private readonly logger: MyLoggerService
   ) {
      super('place-reservation-step')
   }

   async invoke(
      arg: KafkaRequest<ReservationPlaceReq>
   ): Promise<ReservationPlaceRes> {
      this.setCompensationArgs(arg)
      this.logger.log(`${this.name} invoke`, { trace: arg.traceId })

      const result = await this.producer.produceWithReply<
         ReservationPlaceReq,
         ReservationPlaceRes
      >(Topic.FLIGHT_RESERVATION_PLACE, arg)

      if (result.data.state === 'error') {
         this.logger.warn(result.data.message)
         throw new SagaException(result.data.message)
      }

      return result.data.value
   }

   async withCompensation(): Promise<void> {
      const arg = this.getCompensationArgs()
      this.logger.warn(`${this.name} withCompensation`, {
         trace: arg.traceId
      })

      await this.producer.produce<ReservationPlaceReq>(
         Topic.FLIGHT_RESERVATION_PLACE_COMPENSATION,
         arg
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

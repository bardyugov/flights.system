import {
   Inject,
   Injectable,
   OnModuleDestroy,
   OnModuleInit
} from '@nestjs/common'
import { IAirplaneService } from '../../../application/services/airplane.service'
import {
   GetAirplanesRes,
   IConsumerService,
   InjectServices,
   KafkaRequest,
   KafkaResult,
   Topic
} from '@flights.system/shared'

@Injectable()
class AirplaneHandler implements OnModuleInit, OnModuleDestroy {
   constructor(
      @Inject(InjectServices.AirplaneService)
      private readonly cityService: IAirplaneService,
      @Inject(InjectServices.ConsumerService)
      private readonly consumer: IConsumerService
   ) {}

   async onModuleInit() {
      await this.consumer.connect()
      await this.consumer.subscribeWithReply<
         KafkaRequest<number>,
         KafkaResult<GetAirplanesRes[]>
      >(Topic.AIRPLANE_GET_TOPIC, async req => await this.cityService.get(req))
   }

   async onModuleDestroy() {
      await this.consumer.disconnect()
   }
}

export { AirplaneHandler }

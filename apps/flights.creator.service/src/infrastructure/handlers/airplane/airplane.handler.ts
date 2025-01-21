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
   MyLoggerService,
   Topic
} from '@flights.system/shared'

@Injectable()
class AirplaneHandler implements OnModuleInit, OnModuleDestroy {
   constructor(
      @Inject(InjectServices.AirplaneService)
      private readonly airplaneService: IAirplaneService,
      @Inject(InjectServices.ConsumerService)
      private readonly consumer: IConsumerService,
      @Inject(AirplaneHandler.name)
      private readonly logger: MyLoggerService
   ) {}

   async onModuleInit() {
      await this.consumer.connect()

      await this.consumer.subscribeWithReply<
         KafkaRequest<number>,
         KafkaResult<GetAirplanesRes[]>
      >(Topic.AIRPLANE_GET_TOPIC, async req => {
         this.logger.log('Handled', { trace: req.traceId })
         console.log(this.airplaneService)
         return await this.airplaneService.get(req)
      })
   }

   async onModuleDestroy() {
      await this.consumer.disconnect()
   }
}

export { AirplaneHandler }

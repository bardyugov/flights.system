import {
   Inject,
   Injectable,
   OnModuleDestroy,
   OnModuleInit
} from '@nestjs/common'
import {
   CreateCityReq,
   CreatedCityRes,
   GetCityReq,
   IConsumerService,
   InjectServices,
   Topic
} from '@flights.system/shared'
import { ICityService } from '../../../application/services/city.service'

@Injectable()
class CityHandler implements OnModuleInit, OnModuleDestroy {
   constructor(
      @Inject(InjectServices.ConsumerService)
      private readonly consumerService: IConsumerService,
      @Inject(InjectServices.CityService)
      private readonly cityService: ICityService
   ) {}

   async onModuleInit() {
      await this.consumerService.connect()

      await this.consumerService.subscribeWithReply<
         CreateCityReq,
         CreatedCityRes
      >(
         Topic.CITY_CREATE_TOPIC,
         async req => await this.cityService.create(req)
      )

      await this.consumerService.subscribeWithReply<
         GetCityReq,
         CreatedCityRes[]
      >(Topic.CITY_GET_TOPIC, async req => await this.cityService.getMany(req))

      await this.consumerService.subscribeWithReply<string, CreatedCityRes>(
         Topic.CITY_FIND_BY_NAME_TOPIC,
         async req => await this.cityService.findByName(req)
      )
   }

   async onModuleDestroy() {
      await this.consumerService.disconnect()
   }
}

export { CityHandler }

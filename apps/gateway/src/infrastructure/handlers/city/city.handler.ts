import {
   Controller,
   Get,
   Inject,
   OnModuleDestroy,
   OnModuleInit,
   Post,
   Query,
   BadRequestException,
   Body
} from '@nestjs/common'
import {
   CreateCityReq,
   CreatedCityRes,
   InjectServices,
   IProducerService,
   KafkaResult,
   Topic,
   LoggerService
} from '@flights.system/shared'
import { ApiOkResponse, ApiBadRequestResponse, ApiBody } from '@nestjs/swagger'

@Controller('/city')
class CityHandler implements OnModuleInit, OnModuleDestroy {
   private readonly logger = new LoggerService(CityHandler.name)
   constructor(
      @Inject(InjectServices.ProducerService)
      private readonly producer: IProducerService
   ) {}

   @Post('/create')
   @ApiOkResponse({
      description: 'New created city'
   })
   @ApiBadRequestResponse({
      description: 'City already exists'
   })
   @ApiBody({
      description: 'Creating city dto',
      type: CreateCityReq
   })
   async create(@Body() dto: CreateCityReq) {
      const subject = await this.producer.produceWithReply<
         CreateCityReq,
         CreatedCityRes
      >(Topic.CITY_CREATE_TOPIC, dto)
      return new Promise(res => subject.subscribe(res))
   }

   @Get()
   async get() {
      const subject = await this.producer.produceEmptyMsgWithReply<
         CreatedCityRes[]
      >(Topic.CITY_GET_TOPIC)

      return new Promise(res => subject.subscribe(res))
   }

   @Get('/search')
   async find(@Query('name') name: string) {
      if (!name) {
         throw new BadRequestException('Invalid query args')
      }

      this.logger.debug(`Searching for ${name}`)

      const subject = await this.producer.produceWithReply<
         string,
         KafkaResult<CreatedCityRes>
      >(Topic.CITY_FIND_BY_NAME_TOPIC, name)

      return new Promise(res => subject.subscribe(res))
   }

   async onModuleInit() {
      await this.producer.subscribeOfReply(Topic.CITY_CREATE_TOPIC_REPLY)
      await this.producer.subscribeOfReply(Topic.CITY_GET_TOPIC_REPLY)
      await this.producer.subscribeOfReply(Topic.CITY_FIND_BY_NAME_TOPIC_REPLY)
   }

   async onModuleDestroy() {
      await this.producer.disconnect()
   }
}

export { CityHandler }

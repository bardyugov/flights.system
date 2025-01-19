import {
  Controller,
  Get,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
  Post,
  Query,
  BadRequestException,
  Body, Req
} from '@nestjs/common'
import {
  CreateCityReq,
  CreatedCityRes,
  InjectServices,
  IProducerService,
  KafkaResult,
  Topic,
  MyLoggerService, RequestTrace, KafkaRequest,
  GetCityReq
} from '@flights.system/shared'
import { ApiOkResponse, ApiBadRequestResponse, ApiBody } from '@nestjs/swagger'

@Controller('/city')
class CityHandler implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(InjectServices.ProducerService)
    private readonly producer: IProducerService,
    @Inject(CityHandler.name)
    private readonly logger: MyLoggerService
  ) {
  }

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
  async create(@Body() dto: CreateCityReq, @Req() req: RequestTrace) {
    this.logger.log('Handled /city/create', { trace: req.traceId })

    const result = await this.producer.produceWithReply<
      KafkaRequest<CreateCityReq>,
      KafkaResult<CreatedCityRes>
    >(Topic.CITY_CREATE_TOPIC, { traceId: req.traceId, data: dto })

    return result
  }

  @Get()
  @ApiOkResponse({
    description: 'Getting cities with offset and limit'
  })
  @ApiBadRequestResponse({
    description: 'Limit is max'
  })
  async get(@Query('limit') limit: number, @Query('offset') offset: number, @Req() req: RequestTrace) {
    this.logger.log('Handled /city', { trace: req.traceId })

    const result = await this.producer.produceWithReply<
      KafkaRequest<GetCityReq>,
      KafkaResult<CreatedCityRes>
    >(Topic.CITY_GET_TOPIC, { traceId: req.traceId, data: { limit, offset } })

    return result
  }

  @Get('/search')
  @ApiOkResponse({
    description: 'Getting city by name'
  })
  @ApiBadRequestResponse({
    description: 'Not found city'
  })
  async find(@Query('name') name: string, @Req() req: RequestTrace) {
    if (!name) {
      this.logger.warn('Invalid query {name}', { trace: req.traceId })
      throw new BadRequestException('Invalid query args')
    }

    this.logger.log(`Handled /city/search?name=${name}`, { trace: req.traceId })

    const result = await this.producer.produceWithReply<
      KafkaRequest<string>,
      KafkaResult<CreatedCityRes>
    >(Topic.CITY_FIND_BY_NAME_TOPIC, { traceId: req.traceId, data: name })

    return result
  }

  async onModuleInit() {
    await this.producer.connect()

    await this.producer.subscribeOfReply(Topic.CITY_CREATE_TOPIC_REPLY)
    await this.producer.subscribeOfReply(Topic.CITY_GET_TOPIC_REPLY)
    await this.producer.subscribeOfReply(Topic.CITY_FIND_BY_NAME_TOPIC_REPLY)
  }

  async onModuleDestroy() {
    await this.producer.disconnect()
  }
}

export { CityHandler }

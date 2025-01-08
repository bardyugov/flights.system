import {
    Controller,
    Inject,
    Logger,
    OnModuleDestroy,
    OnModuleInit
} from '@nestjs/common'
import {
    CreateCityReq,
    CreatedCityRes,
    IConsumerService,
    InjectServices,
    KafkaResult,
    Topic
} from '@flights.system/shared'
import { ICityService } from '../../../application/services/city.service'

@Controller()
class CityHandler implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(CityHandler.name)

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
            KafkaResult<CreatedCityRes>
        >(
            Topic.CITY_CREATE_TOPIC,
            async msg => await this.cityService.create(msg)
        )

        await this.consumerService.subscribeEmptyMsgWithReply<CreatedCityRes[]>(
            Topic.CITY_GET_TOPIC,
            async () => this.cityService.getMany(20)
        )

        await this.consumerService.subscribeWithReply<
            string,
            KafkaResult<CreatedCityRes>
        >(
            Topic.CITY_FIND_BY_NAME_TOPIC,
            async msg => await this.cityService.findByName(msg)
        )
    }

    async onModuleDestroy() {
        await this.consumerService.disconnect()
    }
}

export { CityHandler }

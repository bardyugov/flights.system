import {
    Controller,
    Inject,
    Logger,
    OnModuleDestroy,
    OnModuleInit
} from '@nestjs/common'
import {
    CreateCityDto,
    IConsumerService,
    InjectServices,
    Topic
} from '@flights.system/shared'
import { ICityService } from '../../../application/services/city.service'
import { CityEntity } from '../../entities/city.entity'

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
            CreateCityDto,
            CityEntity
        >(Topic.CITY_CREATE_TOPIC, this.cityService.create)
    }

    async onModuleDestroy() {
        await this.consumerService.disconnect()
    }
}

export { CityHandler }

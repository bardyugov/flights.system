import {
    Controller,
    Inject,
    Logger,
    OnModuleDestroy,
    OnModuleInit
} from '@nestjs/common'
import {
    AirplaneCreateReq,
    CityCreateReq,
    CityCreateRes,
    IConsumerService,
    InjectServices,
    Topic
} from '@flights.system/shared'

@Controller()
class CityHandler implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(CityHandler.name)
    constructor(
        @Inject(InjectServices.ConsumerService)
        private readonly consumerService: IConsumerService
    ) {}

    async onModuleInit() {
        await this.consumerService.connect()

        await this.consumerService.subscribe<AirplaneCreateReq>(
            Topic.AIRPLANE_TOPIC,
            async msg => {
                this.logger.debug(`Received msg ${JSON.stringify(msg)}`)
            }
        )

        await this.consumerService.subscribeWithReply<
            CityCreateReq,
            CityCreateRes
        >(Topic.CITY_TOPIC, async msg => {
            this.logger.debug(`Received msg ${JSON.stringify(msg)}`)
            return {
                id: 'new id',
                name: msg.name
            }
        })
    }

    async onModuleDestroy() {
        await this.consumerService.disconnect()
    }
}

export { CityHandler }

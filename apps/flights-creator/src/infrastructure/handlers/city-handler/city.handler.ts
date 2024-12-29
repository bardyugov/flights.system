import {
    Controller,
    Inject,
    Logger,
    OnModuleDestroy,
    OnModuleInit
} from '@nestjs/common'
import {
    InjectServices,
    IConsumerService,
    CityCreateReq,
    CityCreateRes,
    AirplaneCreateReq,
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
                this.logger.log(`Recieved PID: ${msg.PID}`)
            }
        )
    }

    async onModuleDestroy() {
        await this.consumerService.disconnect()
    }
}

export { CityHandler }

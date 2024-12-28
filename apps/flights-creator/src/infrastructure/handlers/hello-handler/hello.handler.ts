import {
    Controller,
    Inject,
    Logger,
    OnModuleDestroy,
    OnModuleInit
} from '@nestjs/common'
import { InjectServices } from '@flights.system/shared'
import { IConsumerService } from '@flights.system/shared'

@Controller()
class HelloHandler implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger()
    constructor(
        @Inject(InjectServices.ConsumerService)
        private readonly consumerService: IConsumerService
    ) {}

    async onModuleInit() {
        await this.consumerService.connect()

        await this.consumerService.subscribeWithReply(
            'city.topic',
            async value => {
                this.logger.log(`Received ${value.message.value.toString()}`)
                return 'Hello from consumer'
            }
        )
    }

    async onModuleDestroy() {
        await this.consumerService.disconnect()
    }
}

export { HelloHandler }

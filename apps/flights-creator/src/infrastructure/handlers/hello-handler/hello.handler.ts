import {
    Controller,
    Inject,
    OnModuleDestroy,
    OnModuleInit
} from '@nestjs/common'
import { InjectServices } from '@flights.system/shared'
import { IConsumerService } from '../../../application/services/consumer/consumer.inteface'

@Controller('')
class HelloHandler implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(InjectServices.ConsumerService)
        private readonly consumerService: IConsumerService
    ) {}

    async onModuleInit() {
        await this.consumerService.connect()

        await this.consumerService.subscribe('city.topic', async payload => {
            console.log(payload.message.value.toString())
        })
    }

    async onModuleDestroy() {
        await this.consumerService.disconnect()
    }
}

export { HelloHandler }

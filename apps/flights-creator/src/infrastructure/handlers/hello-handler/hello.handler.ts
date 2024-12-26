import { Controller, Inject, OnModuleInit } from '@nestjs/common'
import { InjectServices } from '../../utils/constants'
import { IConsumerService } from '../../../application/services/consumer/consumer.inteface'

@Controller('')
class HelloHandler implements OnModuleInit {
    constructor(
        @Inject(InjectServices.IConsumerService)
        private readonly consumerService: IConsumerService
    ) {}

    async onModuleInit() {
        await this.consumerService.connect()
        await this.consumerService.subscribe('', () => {})
    }
}

export { HelloHandler }

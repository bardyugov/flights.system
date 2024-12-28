import {
    Controller,
    Inject,
    OnModuleDestroy,
    OnModuleInit,
    Post
} from '@nestjs/common'
import {
    IConsumerService,
    InjectServices,
    IProducerService
} from '@flights.system/shared'
import { Observable, Subject } from 'rxjs'

@Controller('/city')
class CityHandler implements OnModuleInit, OnModuleDestroy {
    private readonly subject = new Subject<string>()
    constructor(
        @Inject(InjectServices.ProducerService)
        private readonly producer: IProducerService,
        @Inject(InjectServices.ConsumerService)
        private readonly consumer: IConsumerService
    ) {}

    async sendMessageWithReply() {
        await this.producer.produce('city.topic', {
            message: 'Hello from producer'
        })
    }

    @Post('/send')
    async send() {
        await this.sendMessageWithReply()
        return new Promise(res => {
            this.subject.subscribe(res)
        })
    }

    async onModuleInit() {
        await this.consumer.connect()
        await this.consumer.send('city.topic.reply', async payload => {
            this.subject.next(payload.message.value.toString())
        })
    }

    async onModuleDestroy() {
        await this.producer.disconnect()
        await this.consumer.disconnect()
    }
}

export { CityHandler }

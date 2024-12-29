import {
    Controller,
    Inject,
    OnModuleDestroy,
    OnModuleInit,
    Post
} from '@nestjs/common'
import {
    AirplaneCreateReq,
    CityCreateReq,
    CityCreateRes,
    InjectServices,
    IProducerService,
    Topic
} from '@flights.system/shared'

@Controller('/city')
class CityHandler implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(InjectServices.ProducerService)
        private readonly producer: IProducerService
    ) {}

    @Post('/create')
    async send() {
        const subject = await this.producer.produceWithReply<
            CityCreateReq,
            CityCreateRes
        >(Topic.CITY_TOPIC, {
            name: 'New city'
        })
        return new Promise(res => subject.subscribe(res))
    }

    async onModuleInit() {
        await this.producer.subscribeOfReply(Topic.CITY_TOPIC_REPLY)
    }

    async onModuleDestroy() {
        await this.producer.disconnect()
    }
}

export { CityHandler }

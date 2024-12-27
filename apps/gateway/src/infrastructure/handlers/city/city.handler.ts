import {
    Body,
    Controller,
    Inject,
    OnModuleDestroy,
    OnModuleInit,
    Post
} from '@nestjs/common'
import { Kafka } from '@nestjs/microservices/external/kafka.interface'
import { Producer } from 'kafkajs'
import { InjectServices } from '@flights.system/shared'
import { ClientKafka } from '@nestjs/microservices'

@Controller('/city')
class CityHandler implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(InjectServices.ClientKafka) private readonly client: ClientKafka
    ) {}

    @Post('/send')
    async send() {
        this.client.se
    }

    async onModuleInit() {
        await this.client.connect()
    }

    async onModuleDestroy() {
        await this.client.close()
    }
}

export { CityHandler }

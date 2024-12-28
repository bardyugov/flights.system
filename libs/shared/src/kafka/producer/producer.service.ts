import { Injectable, Logger, Provider } from '@nestjs/common'
import { Kafka, Producer } from 'kafkajs'
import {
    initKafkaLogger,
    parseArrayFromConfig,
    InjectServices
} from '../../utils/utils'
import { IProducerService } from './producer.inteface'
import { ConfigService } from '@nestjs/config'

@Injectable()
class ProducerService implements IProducerService {
    private readonly kafka: Kafka
    private readonly logger = new Logger()
    private readonly serviceName = ProducerService.name
    private readonly producers = new Map<string, Producer>()

    constructor(private readonly config: ConfigService) {
        this.kafka = new Kafka({
            clientId: this.config.get<string>('CLIENT_ID'),
            brokers: parseArrayFromConfig(this.config.get<string>('BROKERS')),
            connectionTimeout: 10000,
            logCreator: level =>
                initKafkaLogger(level, this.logger, this.serviceName)
        })
    }

    private async sendMessage<T extends object>(
        producer: Producer,
        topic: string,
        data: T
    ) {
        await producer.send({
            topic: topic,
            messages: [
                {
                    value: JSON.stringify(data)
                }
            ]
        })
    }

    async produce<T extends object>(topic: string, data: T): Promise<void> {
        const foundedProducer = this.producers.get(topic)
        if (foundedProducer) {
            await this.sendMessage(foundedProducer, topic, data)
            return this.logger.log('Success sent message from found producer')
        }

        const createdProducer = this.kafka.producer()
        await createdProducer.connect()
        this.logger.log('Success created producer')
        await this.sendMessage(createdProducer, topic, data)
        this.producers.set(topic, createdProducer)
        this.logger.log('Success sent message from created producer')
    }

    async disconnect(): Promise<void> {
        for (const producer of this.producers.values()) {
            await producer.disconnect()
        }
        this.logger.log('Success disconnected producers')
    }
}

const ProducerProvider: Provider = {
    provide: InjectServices.ProducerService,
    useClass: ProducerService
}

export { ProducerProvider }

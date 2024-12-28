import { Consumer, EachMessagePayload, Kafka } from 'kafkajs'
import { Injectable, Logger, Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
    InjectServices,
    parseArrayFromConfig,
    initKafkaLogger
} from '../../utils/utils'
import { IConsumerService } from './consumer.interface'

@Injectable()
class ConsumerService implements IConsumerService {
    private readonly serviceName = ConsumerService.name
    private readonly consumers = new Map<string, Consumer>()
    private readonly kafka: Kafka
    private readonly logger = new Logger()
    private readonly topics: string[] = []

    constructor(private readonly config: ConfigService) {
        this.kafka = new Kafka({
            clientId: this.config.get<string>('CLIENT_ID'),
            brokers: parseArrayFromConfig(this.config.get<string>('BROKERS')),
            connectionTimeout: 10000,
            logCreator: level =>
                initKafkaLogger(level, this.logger, this.serviceName)
        })
        this.topics = parseArrayFromConfig(this.config.get<string>('TOPICS'))
    }

    async connect(): Promise<void> {
        const numPartitions = this.config.get<number>('COUNT_PARTITIONS')
        const replicationFactor = this.config.get<number>('REPLICATION_FACTOR')
        const admin = this.kafka.admin()

        await admin.createTopics({
            topics: this.topics.map(topic => ({
                topic,
                numPartitions,
                replicationFactor
            }))
        })

        this.logger.log('Success created topic', this.serviceName)
    }

    async emit(
        topic: string,
        callback: (message: EachMessagePayload) => Promise<void>
    ): Promise<void> {
        const foundedConsumer = this.consumers.get(topic)
        const consumer = this.kafka.consumer({
            groupId: this.config.get<string>('CONSUMER_GROUP_ID')
        })

        await consumer.subscribe({ topic, fromBeginning: true })

        await consumer.run({
            eachMessage: callback
        })

        if (!foundedConsumer) {
            this.logger.log('Success created consumer', this.serviceName)
            this.consumers.set(topic, consumer)
        }
        this.logger.log('Success subscribing', this.serviceName)
    }

    async send(
        topic: string,
        callback: (message: EachMessagePayload) => Promise<unknown>
    ): Promise<void> {
        const foundedConsumer = this.consumers.get(topic)
        const consumer = this.kafka.consumer({
            groupId: this.config.get<string>('CONSUMER_GROUP_ID')
        })
        await consumer.subscribe({ topic, fromBeginning: true })

        await consumer.run({
            eachMessage: async payload => {
                const replyData = await callback(payload)
                const replyProducer = this.kafka.producer()
                const replyTopic = `${topic}.reply`

                await replyProducer.connect()
                await replyProducer.send({
                    topic: replyTopic,
                    messages: [
                        {
                            value: JSON.stringify(replyData)
                        }
                    ]
                })
                await replyProducer.disconnect()
            }
        })

        if (!foundedConsumer) {
            this.logger.log('Success created consumer', this.serviceName)
            this.consumers.set(topic, consumer)
        }
        this.logger.log('Success subscribing', this.serviceName)
    }

    async disconnect(): Promise<void> {
        for (const consumer of this.consumers.values()) {
            await consumer.disconnect()
        }
    }
}

const ConsumerServiceProvider: Provider = {
    provide: InjectServices.ConsumerService,
    useClass: ConsumerService
}

export { ConsumerServiceProvider }

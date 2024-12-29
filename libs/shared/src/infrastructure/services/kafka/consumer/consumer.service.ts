import { Consumer, Kafka } from 'kafkajs'
import {
    forwardRef,
    Inject,
    Injectable,
    Logger,
    Provider
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
    InjectServices,
    parseArrayFromConfig,
    initKafkaLogger,
    safelyParseBuffer,
    buildReplyTopic
} from '../../../utils/utils'
import { IConsumerService } from '../../../../application/services/consumer.interface'
import { IProducerService } from '../../../../application/services/producer.inteface'
import { NotParsedBuffer } from '../../../common/exceptions/producer.exception'
import { Topic } from '../topics/topic'

@Injectable()
class ConsumerService implements IConsumerService {
    private readonly consumers = new Map<string, Consumer>()
    private readonly kafka: Kafka
    private readonly logger = new Logger(ConsumerService.name)
    private readonly topics: string[] = Object.values(Topic)
    private readonly consumerGroupId: string

    constructor(
        @Inject(forwardRef(() => InjectServices.ProducerService))
        private readonly producerService: IProducerService,
        private readonly config: ConfigService
    ) {
        this.kafka = new Kafka({
            clientId: this.config.get<string>('CLIENT_ID'),
            brokers: parseArrayFromConfig(this.config.get<string>('BROKERS')),
            logCreator: level => initKafkaLogger(level, this.logger)
        })
        this.consumerGroupId = this.config.get('CONSUMER_GROUP_ID')
    }

    private buildUniqueConsumerGroup(topic: string) {
        return `${topic}.consumer.group`
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

        this.logger.log('Success created topic')
    }

    async subscribe<Req>(
        topic: Topic,
        callback: (message: Req) => Promise<unknown>
    ): Promise<void> {
        const foundedConsumer = this.consumers.get(topic)
        if (foundedConsumer) {
            return this.logger.log(
                'Consumer already exist and subscribe to topic'
            )
        }
        const consumer = this.kafka.consumer({
            groupId: this.buildUniqueConsumerGroup(topic)
        })

        await consumer.subscribe({ topic, fromBeginning: true })

        await consumer.run({
            eachMessage: async payload => {
                const data = safelyParseBuffer<Req>(payload.message.value)
                if (!data) {
                    throw new NotParsedBuffer('Not parsed message')
                }

                await callback(data)
            }
        })

        this.logger.log(
            `Success created consumer with topic: ${topic} and consumerGroupId: ${this.consumerGroupId}`
        )
        this.consumers.set(topic, consumer)

        this.logger.log('Success subscribing')
    }

    async subscribeWithReply<Req, Res>(
        topic: Topic,
        callback: (message: Req) => Promise<Res>
    ): Promise<void> {
        const foundedConsumer = this.consumers.get(topic)
        if (foundedConsumer) {
            return this.logger.log(
                'Consumer already exist and subscribe to topic'
            )
        }

        const consumer = this.kafka.consumer({
            groupId: this.buildUniqueConsumerGroup(topic)
        })
        await consumer.subscribe({ topic, fromBeginning: true })

        await consumer.run({
            eachMessage: async payload => {
                const data = safelyParseBuffer<Req>(payload.message.value)
                if (!data) {
                    throw new NotParsedBuffer('Not parsed message')
                }

                const replyTopic = buildReplyTopic(topic) as Topic
                const replyData = await callback(data)
                await this.producerService.produce(replyTopic, replyData)
            }
        })

        this.logger.log(
            `Success created consumer with topic: ${topic} and consumerGroupId: ${this.consumerGroupId}`
        )
        this.consumers.set(topic, consumer)

        this.logger.log('Success subscribing')
    }

    async disconnect(): Promise<void> {
        for (const consumer of this.consumers.values()) {
            await consumer.disconnect()
        }
        this.logger.log('Success disconnected consumer')
    }
}

const ConsumerServiceProvider: Provider = {
    provide: InjectServices.ConsumerService,
    useClass: ConsumerService
}

export { ConsumerServiceProvider }

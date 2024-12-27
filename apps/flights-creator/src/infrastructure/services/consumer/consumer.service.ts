import { IConsumerService } from '../../../application/services/consumer/consumer.inteface'
import {
    Consumer,
    EachMessagePayload,
    Kafka,
    LogEntry,
    logLevel
} from 'kafkajs'
import { Injectable, Logger, Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectServices } from '@flights.system/shared'
import { ConsumerException } from '../../common/exceptions/consumer.exception'

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
            brokers: this.parseArrayFromConfig('BROKERS'),
            connectionTimeout: 10000,
            logCreator: level => this.initLogger(level, this.logger)
        })
        this.topics = this.parseArrayFromConfig('TOPICS')
    }

    private parseArrayFromConfig(key: string) {
        return this.config
            .get<string>(key)
            .split(';')
            .map(t => t.trim())
    }

    private buildKafkaLog(entry: LogEntry) {
        return JSON.stringify({
            level: entry.level,
            label: entry.label,
            message: entry.log.message
        })
    }

    private initLogger(
        level: logLevel,
        logger: Logger
    ): (entry: LogEntry) => void {
        return entry => {
            switch (level) {
                case logLevel.ERROR:
                    logger.error(this.buildKafkaLog(entry), this.serviceName)
                    break
                case logLevel.NOTHING:
                    logger.log(this.buildKafkaLog(entry), this.serviceName)
                    break
                case logLevel.WARN:
                    logger.warn(this.buildKafkaLog(entry), this.serviceName)
                    break
                case logLevel.INFO:
                    logger.log(this.buildKafkaLog(entry), this.serviceName)
                    break
                case logLevel.DEBUG:
                    logger.debug(this.buildKafkaLog(entry), this.serviceName)
                    break
            }
        }
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

    private async buildReplyProducer(topic: string) {
        const replyTopic = `${topic}.reply`
        const producer = this.kafka.producer()
        return producer
    }

    async subscribe(
        topic: string,
        callback: (message: EachMessagePayload) => Promise<void>
    ): Promise<void> {
        const foundedConsumer = this.consumers.get(topic)
        if (foundedConsumer) {
            throw new ConsumerException(
                `Consumer with topic name - ${topic} already exist}`
            )
        }

        const consumer = this.kafka.consumer({
            groupId: this.config.get<string>('CONSUMER_GROUP_ID')
        })
        await consumer.subscribe({ topic, fromBeginning: true })

        await consumer.run({
            eachMessage: callback
        })
        this.consumers.set(topic, consumer)
        this.logger.log('Success created consumer', this.serviceName)
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

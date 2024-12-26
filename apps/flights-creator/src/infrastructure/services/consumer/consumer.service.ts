import { IConsumerService } from '../../../application/services/consumer/consumer.inteface'
import { Consumer, Kafka, LogEntry, logLevel } from 'kafkajs'
import { Injectable, Logger, Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectServices } from '../../utils/constants'

@Injectable()
class ConsumerService implements IConsumerService {
    private readonly consumer: Consumer
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

        this.consumer = this.kafka.consumer({
            groupId: this.config.get<string>('CONSUMER_GROUP_ID')
        })
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
            const serviceName = ConsumerService.name
            switch (level) {
                case logLevel.ERROR:
                    logger.error(this.buildKafkaLog(entry), serviceName)
                    break
                case logLevel.NOTHING:
                    logger.log(this.buildKafkaLog(entry), serviceName)
                    break
                case logLevel.WARN:
                    logger.warn(this.buildKafkaLog(entry), serviceName)
                    break
                case logLevel.INFO:
                    logger.log(this.buildKafkaLog(entry), serviceName)
                    break
                case logLevel.DEBUG:
                    logger.debug(this.buildKafkaLog(entry), serviceName)
                    break
            }
        }
    }

    private async createTopics() {
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
    }

    async connect(): Promise<void> {
        await this.createTopics()
        await this.consumer.connect()

        await this.consumer.subscribe({
            topics: this.topics,
            fromBeginning: true
        })
    }

    async subscribe<T>(
        topic: string,
        callback: (message: T) => void
    ): Promise<void> {
        await this.consumer.run({
            eachMessage: async data => {}
        })
    }

    async disconnect(): Promise<void> {
        await this.consumer.disconnect()
    }
}

const ConsumerServiceProvider: Provider = {
    provide: InjectServices.IConsumerService,
    useClass: ConsumerService
}

export { ConsumerServiceProvider }

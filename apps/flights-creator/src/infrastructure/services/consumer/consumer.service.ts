import { IConsumerService } from '../../../common/services/consumer/consumer.inteface'
import { Consumer, Kafka, LogEntry, logLevel } from 'kafkajs'
import { Injectable, Logger, Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectServices } from '../../utils/constants'

@Injectable()
class ConsumerService implements IConsumerService {
    private readonly consumer: Consumer
    private readonly kafka: Kafka
    private readonly logger = new Logger()

    constructor(private readonly config: ConfigService) {
        this.kafka = new Kafka({
            clientId: this.config.get<string>('CLIENT_ID'),
            brokers: [this.config.get<string>('BROKER')],
            connectionTimeout: 10000,
            logCreator: this.initLogger
        })
        this.consumer = this.kafka.consumer({
            groupId: this.config.get<string>('CONSUMER_GROUP_ID')
        })
    }

    private initLogger(level: logLevel): (entry: LogEntry) => void {
        return entry => {
            switch (level) {
                case logLevel.ERROR:
                    this.logger.error(entry)
                    break
                case logLevel.NOTHING:
                    this.logger.log(entry)
                    break
                case logLevel.WARN:
                    this.logger.warn(entry)
                    break
                case logLevel.INFO:
                    this.logger.log(entry)
                    break
                case logLevel.DEBUG:
                    this.logger.debug(entry)
                    break
            }
        }
    }

    private async createTopics() {
        const admin = this.kafka.admin()

        const topics = await admin.listTopics()

        console.log(topics)
    }

    async connect(): Promise<void> {
        await this.createTopics()
        await this.consumer.connect()
        await this.consumer.subscribe({ topics: ['hello'] })
    }

    async subscribe<T>(
        topic: string,
        callback: (message: T) => void
    ): Promise<void> {
        await this.consumer.run({
            eachMessage: async data => {
                this.logger.log('Topic', data.topic)
                this.logger.log('Message', data.message)
            }
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

import { ConfigService } from '@nestjs/config'
import { Kafka } from 'kafkajs'
import { LoggerService } from '@nestjs/common'

class ConnectorService {
  constructor(
    protected readonly config: ConfigService,
    protected readonly kafka: Kafka,
    protected readonly topics: string[],
    protected readonly logger: LoggerService
  ) {
  }

  async connect() {
    const numPartitions = this.config.get<number>('COUNT_PARTITIONS')
    const replicationFactor = this.config.get<number>('REPLICATION_FACTOR')

    const admin = this.kafka.admin()
    const { topics } = await admin.fetchTopicMetadata()
    const existTopicNames = topics.map(t => t.name)

    await admin.createTopics({
      topics: this.topics.filter(t => !existTopicNames.includes(t)).map(topic => ({
        topic,
        numPartitions,
        replicationFactor
      }))
    })

    this.logger.log('Success created topics')
  }
}

export { ConnectorService }

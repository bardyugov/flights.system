import { ConfigService } from '@nestjs/config'
import { Kafka } from 'kafkajs'
import { Inject, Injectable } from '@nestjs/common'
import { Topic } from '../topics/topic'
import { initKafkaLogger, parseArrayFromConfig } from '../../../utils/utils'
import { MyLoggerService } from '../../logger/logger.service'

@Injectable()
class ConnectorService {
   private isConnected = false
   private readonly topics = Object.values(Topic)
   private readonly kafka: Kafka

   constructor(
      private readonly config: ConfigService,
      @Inject(ConnectorService.name)
      protected readonly logger: MyLoggerService
   ) {
      this.kafka = new Kafka({
         clientId: this.config.get<string>('CLIENT_ID'),
         brokers: parseArrayFromConfig(this.config.get<string>('BROKERS')),
         logCreator: level => initKafkaLogger(level, logger)
      })
   }

   async connect() {
      if (this.isConnected) return
      const numPartitions = this.config.get<number>('COUNT_PARTITIONS')
      const replicationFactor = this.config.get<number>('REPLICATION_FACTOR')

      const admin = this.kafka.admin()
      await admin.connect()

      const { topics } = await admin.fetchTopicMetadata()
      const existTopicNames = topics.map(t => t.name)
      const notCreatedTopics = this.topics.filter(
         t => !existTopicNames.includes(t)
      )
      if (!notCreatedTopics.length) {
         this.isConnected = true
         return this.logger.log('All topics created')
      }

      await admin.createTopics({
         topics: notCreatedTopics.map(topic => ({
            topic: topic,
            numPartitions: numPartitions,
            replicationFactor: replicationFactor
         }))
      })
      await admin.disconnect()

      this.isConnected = true
      this.logger.log('Success created topics')
   }
}

export { ConnectorService }

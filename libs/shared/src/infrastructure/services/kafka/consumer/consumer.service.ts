import { Consumer, EachMessageHandler, Kafka } from 'kafkajs'
import { forwardRef, Inject, Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
   buildReplyTopic,
   initKafkaLogger,
   InjectServices,
   parseArrayFromConfig,
   safelyParseBuffer
} from '../../../utils/utils'
import { IConsumerService } from '../../../../application/services/consumer.interface'
import { IProducerService } from '../../../../application/services/producer.inteface'
import { NotParsedBuffer } from '../../../common/exceptions/producer.exception'
import { Topic } from '../topics/topic'
import { MyLoggerService } from '../../logger/logger.service'
import { ConnectorService } from '../connector/connector.service'

class ConsumerService implements IConsumerService {
   private readonly consumers = new Map<string, Consumer>()
   private readonly consumerGroupId: string
   private readonly kafka: Kafka

   constructor(
      @Inject(forwardRef(() => InjectServices.ProducerService))
      private readonly producerService: IProducerService,
      private readonly config: ConfigService,
      @Inject(ConsumerService.name)
      private readonly logger: MyLoggerService,
      private readonly connector: ConnectorService
   ) {
      this.kafka = new Kafka({
         clientId: this.config.get<string>('CLIENT_ID'),
         brokers: parseArrayFromConfig(this.config.get<string>('BROKERS')),
         logCreator: level => initKafkaLogger(level, logger)
      })

      this.consumerGroupId = config.get('CONSUMER_GROUP_ID')
   }

   private buildUniqueConsumerGroup(topic: string) {
      return `${topic}.consumer.group`
   }

   private async buildSubscribeWithReplyHandler(
      topic: Topic,
      handler: EachMessageHandler
   ) {
      const foundedConsumer = this.consumers.get(topic)
      if (foundedConsumer) {
         return this.logger.log('Consumer already exist and subscribe to topic')
      }

      const consumer = this.kafka.consumer({
         groupId: this.buildUniqueConsumerGroup(topic)
      })
      await consumer.subscribe({ topic, fromBeginning: true })

      await consumer.run({
         eachMessage: handler
      })

      this.logger.log(
         `Success created consumer with topic: ${topic} and consumerGroupId: ${this.consumerGroupId}`
      )
      this.consumers.set(topic, consumer)

      this.logger.log('Success subscribing')
   }

   async subscribe<Req>(
      topic: Topic,
      callback: (message: Req) => Promise<unknown>
   ): Promise<void> {
      const foundedConsumer = this.consumers.get(topic)
      if (foundedConsumer) {
         return this.logger.log('Consumer already exist and subscribe to topic')
      }
      const consumer = this.kafka.consumer({
         groupId: this.buildUniqueConsumerGroup(topic)
      })

      await consumer.subscribe({ topic, fromBeginning: true })

      await consumer.run({
         eachMessage: async payload => {
            try {
               const data = safelyParseBuffer<Req>(payload.message.value)
               if (!data) {
                  throw new NotParsedBuffer('Not parsed message')
               }

               await callback(data)
            } catch (error) {
               this.logger.error(error)
            }
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
      await this.buildSubscribeWithReplyHandler(topic, async payload => {
         try {
            const data = safelyParseBuffer<Req>(payload.message.value)
            if (!data) {
               throw new NotParsedBuffer('Not parsed message')
            }

            const replyTopic = buildReplyTopic(topic) as Topic
            const replyData = await callback(data)
            await this.producerService.produce(replyTopic, replyData)
         } catch (error) {
            this.logger.error(error)
         }
      })
   }

   async subscribeEmptyMsgWithReply<Res>(
      topic: Topic,
      callback: () => Promise<Res>
   ): Promise<void> {
      await this.buildSubscribeWithReplyHandler(topic, async () => {
         try {
            const replyTopic = buildReplyTopic(topic) as Topic
            const replyData = await callback()
            await this.producerService.produce(replyTopic, replyData)
         } catch (error) {
            this.logger.error(error)
         }
      })
   }

   async connect() {
      await this.connector.connect()
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

export { ConsumerServiceProvider, ConsumerService }

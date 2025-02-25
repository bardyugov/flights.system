import { forwardRef, Inject, Provider } from '@nestjs/common'
import { Kafka, Producer, Partitioners } from 'kafkajs'
import {
   initKafkaLogger,
   parseArrayFromConfig,
   InjectServices,
   buildReplyTopic,
   KafkaResult,
   error,
   KafkaRequest
} from '../../../utils/utils'
import { IProducerService } from '../../../../application/services/producer.inteface'
import { ConfigService } from '@nestjs/config'
import { IConsumerService } from '../../../../application/services/consumer.interface'
import { Subject } from 'rxjs'
import { NotFoundReplyTopicException } from '../../../common/exceptions/producer.exception'
import { Topic } from '../topics/topic'
import { MyLoggerService } from '../../logger/logger.service'
import { ConnectorService } from '../connector/connector.service'

class ProducerService implements IProducerService {
   private readonly producers = new Map<string, Producer>()
   private readonly subjects = new Map<string, Subject<unknown>>()
   private readonly kafka: Kafka
   private readonly resolveTime = 10000

   constructor(
      @Inject(forwardRef(() => InjectServices.ConsumerService))
      private readonly consumerService: IConsumerService,
      @Inject(ProducerService.name)
      private readonly logger: MyLoggerService,
      private readonly config: ConfigService,
      private readonly connector: ConnectorService
   ) {
      this.kafka = new Kafka({
         clientId: this.config.get<string>('CLIENT_ID'),
         brokers: parseArrayFromConfig(this.config.get<string>('BROKERS')),
         connectionTimeout: 10000,
         logCreator: level => initKafkaLogger(level, this.logger)
      })
   }

   private async sendMessage<T>(producer: Producer, topic: string, data: T) {
      await producer.send({
         topic: topic,
         messages: [
            {
               value: JSON.stringify(data)
            }
         ]
      })
   }

   private buildProducer(): Producer {
      return this.kafka.producer({
         createPartitioner: Partitioners.LegacyPartitioner
      })
   }

   private tryResolve<Res>(
      foundSubject: Subject<KafkaResult<Res>>,
      traceId: string
   ): Promise<KafkaResult<Res>> {
      return new Promise<KafkaResult<Res>>(resolve => {
         const timeout = setTimeout(() => {
            resolve(error('Unresolved message by timeout', traceId))
            clearTimeout(timeout)
         }, this.resolveTime)

         foundSubject.subscribe(data => {
            clearTimeout(timeout)
            resolve(data)
         })
      })
   }

   async produce<Req>(topic: Topic, data: Req): Promise<void> {
      const foundedProducer = this.producers.get(topic)
      if (foundedProducer) {
         await this.sendMessage(foundedProducer, topic, data)
         return this.logger.log('Success sent message from found producer')
      }

      const createdProducer = this.buildProducer()
      await createdProducer.connect()
      this.logger.log('Success created producer')

      await this.sendMessage(createdProducer, topic, data)
      this.producers.set(topic, createdProducer)
      this.logger.log('Success sent message from created producer')
   }

   async produceWithReply<Req, Res>(
      topic: Topic,
      data: KafkaRequest<Req>
   ): Promise<KafkaResult<Res>> {
      const foundedProducer = this.producers.get(topic)
      const replyTopic = buildReplyTopic(topic.toString())
      const foundSubject = this.subjects.get(replyTopic) as Subject<
         KafkaResult<Res>
      >
      if (!foundSubject) {
         throw new NotFoundReplyTopicException('Not found reply topic')
      }

      if (foundedProducer) {
         await this.sendMessage(foundedProducer, topic, data)
         this.logger.log('Success sent message from found producer')
         return this.tryResolve(foundSubject, data.traceId)
      }

      const createdProducer = this.buildProducer()
      await createdProducer.connect()
      this.logger.log('Success created producer')

      await this.sendMessage(createdProducer, topic, data)
      this.producers.set(topic, createdProducer)
      this.logger.log('Success sent message from created producer')

      return this.tryResolve(foundSubject, data.traceId)
   }

   async subscribeOfReply(topic: Topic): Promise<void> {
      const foundedSubject = this.subjects.get(topic)
      if (foundedSubject) {
         await this.consumerService.subscribe(topic, async data => {
            foundedSubject.next(data)
         })
         return
      }

      const newSubject = new Subject<unknown>()
      await this.consumerService.subscribe(topic, async data => {
         newSubject.next(data)
      })

      this.subjects.set(topic, newSubject)
   }

   async connect() {
      await this.connector.connect()
   }

   async disconnect(): Promise<void> {
      await this.consumerService.disconnect()
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

export { ProducerProvider, ProducerService }

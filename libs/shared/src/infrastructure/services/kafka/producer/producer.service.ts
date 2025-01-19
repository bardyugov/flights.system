import { forwardRef, Inject, Injectable, Provider } from '@nestjs/common'
import { Kafka, Producer, Partitioners } from 'kafkajs'
import {
  initKafkaLogger,
  parseArrayFromConfig,
  InjectServices,
  buildReplyTopic
} from '../../../utils/utils'
import { IProducerService } from '../../../../application/services/producer.inteface'
import { ConfigService } from '@nestjs/config'
import { IConsumerService } from '../../../../application/services/consumer.interface'
import { Subject } from 'rxjs'
import { NotFoundReplyTopicException } from '../../../common/exceptions/producer.exception'
import { Topic } from '../topics/topic'
import { MyLoggerService } from '../../logger/logger.service'
import { ConnectorService } from '../connector/connector.service'

@Injectable()
class ProducerService extends ConnectorService implements IProducerService {
  private readonly producers = new Map<string, Producer>()
  private readonly subjects = new Map<string, Subject<unknown>>()

  constructor(
    @Inject(forwardRef(() => InjectServices.ConsumerService))
    private readonly consumerService: IConsumerService,
    @Inject(ProducerService.name)
    logger: MyLoggerService,
    config: ConfigService
  ) {
    const kafka = new Kafka({
      clientId: config.get<string>('CLIENT_ID'),
      brokers: parseArrayFromConfig(config.get<string>('BROKERS')),
      connectionTimeout: 10000,
      logCreator: level => initKafkaLogger(level, logger)
    })

    super(config, kafka, Object.values(Topic), logger)
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

  private async buildProduceWithReplyHandler<Req, Res>(
    topic: Topic,
    data?: Req
  ): Promise<Res> {
    const foundedProducer = this.producers.get(topic)
    const replyTopic = buildReplyTopic(topic.toString())
    const foundSubject = this.subjects.get(replyTopic) as Subject<Res>
    if (!foundSubject) {
      throw new NotFoundReplyTopicException('Not found reply topic')
    }

    if (foundedProducer) {
      await this.sendMessage(foundedProducer, topic, data || null)
      this.logger.log('Success sent message from found producer')
      return new Promise<Res>(res => foundSubject.subscribe(res))
    }

    const createdProducer = this.buildProducer()
    await createdProducer.connect()
    this.logger.log('Success created producer')

    await this.sendMessage(createdProducer, topic, data || null)
    this.producers.set(topic, createdProducer)
    this.logger.log('Success sent message from created producer')

    return new Promise<Res>(res => foundSubject.subscribe(res))
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

  async produceEmptyMsgWithReply<Res>(topic: Topic): Promise<Res> {
    return this.buildProduceWithReplyHandler<unknown, Res>(topic)
  }

  async produceWithReply<Req, Res>(
    topic: Topic,
    data: Req
  ): Promise<Res> {
    return this.buildProduceWithReplyHandler<Req, Res>(topic, data)
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

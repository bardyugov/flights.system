## Stack
- Typescript
- Nx
- Nestjs
- Typeorm
- Postgres
- Redis
- Postgres
- Kafka 
- Docker
- ElasticSearch
- Kibana 
- Logstash
- Zod

## Cool example code 

```typescript
// Implementing Kafka Consumer
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
    callback: (message: KafkaRequest<Req>) => Promise<unknown>
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
          const data = safelyParseBuffer<KafkaRequest<Req>>(
            payload.message.value
          )

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
    callback: (message: KafkaRequest<Req>) => Promise<KafkaResult<Res>>
  ): Promise<void> {
    await this.buildSubscribeWithReplyHandler(topic, async payload => {
      try {
        const req = safelyParseBuffer<KafkaRequest<Req>>(
          payload.message.value
        )
        const replyTopic = buildReplyTopic(topic) as Topic
        const reply = await callback(req)

        await this.producerService.produce(replyTopic, reply)
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

```

```typescript
// Implementing Kafka Producer
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

```

```typescript
// Saga step 
abstract class SagaStep<T = unknown, R = unknown> {
   protected constructor(readonly name: string) {}

   abstract compensationArg: T
   abstract invoke(arg: T): Promise<R>
   abstract withCompensation(): Promise<void>
}
```

```typescript
// Implementing SagaStep
@Injectable()
class FlightJournalStep
  extends SagaStep<KafkaRequest<AddFlightJournalReq>, string>
  implements OnModuleInit, OnModuleDestroy
{
  compensationArg: KafkaRequest<AddFlightJournalReq>

  constructor(
    @Inject(InjectServices.ProducerService)
    private readonly producer: IProducerService,
    @Inject(FlightJournalStep.name)
    private readonly logger: MyLoggerService
  ) {
    super('flight-journal-step')
  }

  async invoke(arg: KafkaRequest<AddFlightJournalReq>): Promise<string> {
    this.compensationArg = arg
    this.logger.log(`${this.name} invoke`, { trace: arg.traceId })

    const result = await this.producer.produceWithReply<
      AddFlightJournalReq,
      string
    >(Topic.FLIGHT_JOURNAL, arg)

    if (result.data.state === 'error') {
      throw new SagaException(result.data.message)
    }

    return result.data.value
  }

  async withCompensation(): Promise<void> {
    this.logger.log(`${this.name} withCompensation`, {
      trace: this.compensationArg.traceId
    })

    await this.producer.produce<AddFlightJournalReq>(
      Topic.FLIGHT_JOURNAL_COMPENSATION,
      this.compensationArg
    )
  }

  async onModuleInit() {
    await this.producer.connect()

    await this.producer.subscribeOfReply(Topic.FLIGHT_JOURNAL_REPLY)
  }

  async onModuleDestroy() {
    await this.producer.disconnect()
  }
}

```

```typescript
// Implementing SagaStep

@Injectable()
class PaymentStep
  extends SagaStep<KafkaRequest<PaymentReq>, PaymentRes>
  implements OnModuleInit, OnModuleDestroy
{
  compensationArg: KafkaRequest<AddFlightJournalReq>
  constructor(
    @Inject(InjectServices.ProducerService)
    private readonly producer: IProducerService,
    @Inject(PaymentStep.name)
    private readonly logger: MyLoggerService
  ) {
    super('payment-step')
  }

  async invoke(arg: KafkaRequest<PaymentReq>): Promise<PaymentRes> {
    this.compensationArg = arg
    this.logger.log(`${this.name} invoke`, { trace: arg.traceId })

    const result = await this.producer.produceWithReply<
      PaymentReq,
      PaymentRes
    >(Topic.PAYMENT, arg)

    if (result.data.state === 'error') {
      throw new SagaException(result.data.message)
    }

    return result.data.value
  }

  async withCompensation(): Promise<void> {
    this.logger.log(`${this.name} withCompensation`, {
      trace: this.compensationArg.traceId
    })

    await this.producer.produce<PaymentReq>(
      Topic.PAYMENT_COMPENSATION,
      this.compensationArg
    )
  }

  async onModuleInit() {
    await this.producer.connect()

    await this.producer.subscribeOfReply(Topic.PAYMENT_REPLY)
  }

  async onModuleDestroy() {
    await this.producer.disconnect()
  }
}

```

```typescript
@Injectable()
class PlaceReservationStep
  extends SagaStep<KafkaRequest<ReservationPlaceReq>, ReservationPlaceRes>
  implements OnModuleInit, OnModuleDestroy
{
  compensationArg: KafkaRequest<ReservationPlaceReq>

  constructor(
    @Inject(InjectServices.ProducerService)
    private readonly producer: IProducerService,
    @Inject(PlaceReservationStep.name)
    private readonly logger: MyLoggerService
  ) {
    super('place-reservation-step')
  }

  async invoke(
    arg: KafkaRequest<ReservationPlaceReq>
  ): Promise<ReservationPlaceRes> {
    this.compensationArg = arg
    this.logger.log(`${this.name} invoke`, { trace: arg.traceId })

    const result = await this.producer.produceWithReply<
      ReservationPlaceReq,
      ReservationPlaceRes
    >(Topic.FLIGHT_RESERVATION_PLACE, arg)

    if (result.data.state === 'error') {
      throw new SagaException(result.data.message)
    }

    return result.data.value
  }

  async withCompensation(): Promise<void> {
    this.logger.warn(`${this.name} withCompensation`, {
      trace: this.compensationArg.traceId
    })

    await this.producer.produce<ReservationPlaceReq>(
      Topic.FLIGHT_RESERVATION_PLACE_COMPENSATION,
      this.compensationArg
    )
  }

  async onModuleInit() {
    await this.producer.connect()

    await this.producer.subscribeOfReply(Topic.FLIGHT_RESERVATION_PLACE_REPLY)
  }

  async onModuleDestroy() {
    await this.producer.disconnect()
  }
}
```

```typescript
// Saga Pattern implementation
@Injectable()
class RegistrationProcessService implements IRegistrationProcessService {
  private successfulStep: SagaStep[] = []

  constructor(
    private readonly flightJournalStep: FlightJournalStep,
    private readonly paymentStep: PaymentStep,
    private readonly placeReservationStep: PlaceReservationStep,
    @Inject(RegistrationProcessService.name)
    private readonly logger: MyLoggerService
  ) {}

  async register(req: RegisterOnFlightCmd): Promise<PaymentRes> {
    try {
      const { flightId } = await this.placeReservationStep.invoke({
        traceId: req.traceId,
        data: {
          from: req.from,
          to: req.to
        }
      })
      this.successfulStep.push(this.placeReservationStep)

      await this.flightJournalStep.invoke({
        traceId: req.traceId,
        data: {
          flightId: flightId,
          clientId: req.clientId
        }
      })

      this.successfulStep.push(this.paymentStep)

      const paymentResult = await this.paymentStep.invoke({
        traceId: req.traceId,
        data: {
          clientId: req.clientId,
          flightId: flightId
        }
      })

      this.successfulStep.push(this.paymentStep)

      return paymentResult
    } catch (e) {
      this.logger.error(e, { trace: req.traceId })
      for (const step of this.successfulStep) {
        await step.withCompensation()
      }
    }
  }
}

const RegistrationProcessServiceProvider: Provider = {
  provide: InjectServices.RegistrationProcessService,
  useClass: RegistrationProcessService
}
```

## Create docker network

```sh
docker network create shared-network         
```

## Run kafka-cluster

```sh
cd docker/kafka-cluster
docker-compose up --build -d
```

## Run elk-cluster

```sh
cd docker/elk-cluster
docker-compose up --build -d
```

## Run flights.creator.service

 ```sh
cd docker/flights-creator-cluster
docker-compose up --build -d
```

## Run gateway

```sh
cd docker/gateway-cluster
docker-compose up --build -d
```

## Run payment.service

```sh
cd docker/payment-cluster
docker-compose up --build -d
```

## Run employees.service
```sh
cd docker/employees-cluster
docker-compose up --build -d
```

## Gateway

```sh
http://localhost:5001/api
```

## Kafka UI URL

 ```sh
http://localhost:8080
```

## Kibana URL

 ```sh
http://0.0.0.0:5601
```

## ElasticSearch URL

```sh
http://localhost:9200
```


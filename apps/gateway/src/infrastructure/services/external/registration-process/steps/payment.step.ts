import {
   AddFlightJournalReq,
   InjectServices,
   IProducerService,
   KafkaRequest,
   MyLoggerService,
   PaymentReq,
   PaymentRes,
   SagaException,
   SagaStep,
   Topic
} from '@flights.system/shared'
import {
   Inject,
   Injectable,
   OnModuleDestroy,
   OnModuleInit
} from '@nestjs/common'

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

export { PaymentStep }

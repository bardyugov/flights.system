import {
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
import { RegistrationProcessService } from '../registration.process.service'

@Injectable()
class PaymentStep
   extends SagaStep<KafkaRequest<PaymentReq>, PaymentRes>
   implements OnModuleInit, OnModuleDestroy
{
   constructor(
      @Inject(InjectServices.ProducerService)
      private readonly producer: IProducerService,
      @Inject(RegistrationProcessService.name)
      private readonly logger: MyLoggerService
   ) {
      super('payment-step')
   }

   async invoke(arg: KafkaRequest<PaymentReq>): Promise<PaymentRes> {
      this.setCompensationArgs(arg)
      this.logger.log(`${this.name} invoke`, { trace: arg.traceId })

      const result = await this.producer.produceWithReply<
         PaymentReq,
         PaymentRes
      >(Topic.PAYMENT, arg)

      if (result.data.state === 'error') {
         this.logger.warn(result.data.message)
         throw new SagaException(result.data.message)
      }

      return result.data.value
   }

   async withCompensation(): Promise<void> {
      const arg = this.getCompensationArgs()
      this.logger.log(`${this.name} withCompensation`, { trace: arg.traceId })

      await this.producer.produce<PaymentReq>(Topic.PAYMENT_COMPENSATION, arg)
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

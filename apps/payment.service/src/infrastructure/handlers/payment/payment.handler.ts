import {
   Inject,
   Injectable,
   OnModuleDestroy,
   OnModuleInit
} from '@nestjs/common'
import {
   ConsumerService,
   InjectServices,
   MyLoggerService,
   PaymentReq,
   PaymentRes,
   Topic
} from '@flights.system/shared'
import { IPaymentService } from '../../../application/services/payment.service'

@Injectable()
class PaymentHandler implements OnModuleInit, OnModuleDestroy {
   constructor(
      @Inject(PaymentHandler.name) private readonly logger: MyLoggerService,
      @Inject(InjectServices.ConsumerService)
      private readonly consumer: ConsumerService,
      @Inject(InjectServices.PaymentService)
      private readonly paymentService: IPaymentService
   ) {}

   async onModuleInit() {
      await this.consumer.connect()

      await this.consumer.subscribeWithReply<PaymentReq, PaymentRes>(
         Topic.PAYMENT,
         async req => await this.paymentService.pay(req)
      )
      await this.consumer.subscribe<number>(
         Topic.PAYMENT_COMPENSATION,
         async req => await this.paymentService.compensate(req)
      )
   }

   async onModuleDestroy() {
      await this.consumer.disconnect()
   }
}

export { PaymentHandler }

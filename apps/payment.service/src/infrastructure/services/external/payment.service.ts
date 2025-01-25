import {
   error,
   InjectServices,
   KafkaRequest,
   KafkaResult,
   MyLoggerService,
   ok,
   PaymentReq,
   PaymentRes
} from '@flights.system/shared'
import { IPaymentService } from '../../../application/services/payment.service'
import { Inject, Provider } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaymentEntity } from '../../entities/payment.entity'
import { es, Faker } from '@faker-js/faker'

class PaymentService implements IPaymentService {
   private readonly faker = new Faker({ locale: [es] })

   constructor(
      @Inject(PaymentService.name)
      private readonly logger: MyLoggerService,
      @InjectRepository(PaymentEntity)
      private readonly paymentRepo: Repository<PaymentEntity>
   ) {}

   async pay(req: KafkaRequest<PaymentReq>): Promise<KafkaResult<PaymentRes>> {
      const { flightId, clientId } = req.data
      const isPayed = this.paymentRepo.findOne({
         where: {
            flightId,
            clientId
         }
      })
      if (isPayed) {
         this.logger.warn('Flight already payed', { trace: req.traceId })
         return error('Flight already payed', req.traceId)
      }

      const amount = this.faker.number.int({
         min: 1000,
         max: 10000
      })

      const payment = await this.paymentRepo.save(
         new PaymentEntity(flightId, clientId, amount)
      )

      this.logger.log('Success created payment', { trace: req.traceId })
      return ok(
         new PaymentRes(payment.id, payment.createAt, payment.amount),
         req.traceId
      )
   }

   async compensatePayment(req: KafkaRequest<number>): Promise<void> {
      await this.paymentRepo
         .createQueryBuilder()
         .delete()
         .from(PaymentEntity)
         .where('id = :id', { id: req.data })
         .execute()

      this.logger.log('Success remove payment', { trace: req.traceId })
   }
}

const PaymentServiceProvider: Provider = {
   provide: InjectServices.PaymentService,
   useClass: PaymentService
}

export { PaymentServiceProvider, PaymentService }

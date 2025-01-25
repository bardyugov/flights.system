import {
   KafkaRequest,
   KafkaResult,
   PaymentReq,
   PaymentRes
} from '@flights.system/shared'

interface IPaymentService {
   pay(req: KafkaRequest<PaymentReq>): Promise<KafkaResult<PaymentRes>>
   compensatePayment(req: KafkaRequest<number>): Promise<void>
}

export { IPaymentService }

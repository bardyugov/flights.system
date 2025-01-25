import { KafkaRequest, PaymentRes } from '@flights.system/shared'
import { RegisterOnFlightCmd } from '@flights.system/shared'

interface IRegistrationProcessService {
   register(req: KafkaRequest<RegisterOnFlightCmd>): Promise<PaymentRes>
}

export { IRegistrationProcessService }

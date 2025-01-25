import { PaymentRes } from '@flights.system/shared'
import { RegisterOnFlightCmd } from '@flights.system/shared'

interface IRegistrationProcessService {
   register(req: RegisterOnFlightCmd): Promise<PaymentRes>
}

export { IRegistrationProcessService }

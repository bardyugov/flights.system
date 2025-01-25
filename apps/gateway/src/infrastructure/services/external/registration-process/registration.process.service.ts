import { Injectable, Provider } from '@nestjs/common'
import { IRegistrationProcessService } from '../../../../application/services/registration.process.service'
import { FlightJournalStep } from './steps/flight.journal.step'
import { PaymentStep } from './steps/payment.step'
import { PlaceReservationStep } from './steps/place.reservation.step'
import {
   InjectServices,
   KafkaRequest,
   PaymentRes,
   SagaStep
} from '@flights.system/shared'
import { RegisterOnFlightCmd } from '@flights.system/shared'

@Injectable()
class RegistrationProcessService implements IRegistrationProcessService {
   private successfulStep: SagaStep[]

   constructor(
      private readonly flightJournalStep: FlightJournalStep,
      private readonly paymentStep: PaymentStep,
      private readonly placeReservationStep: PlaceReservationStep
   ) {}

   async register(req: KafkaRequest<RegisterOnFlightCmd>): Promise<PaymentRes> {
      try {
         const { flightId } = await this.placeReservationStep.invoke({
            traceId: req.traceId,
            data: {
               from: req.data.from,
               to: req.data.to
            }
         })
         this.successfulStep.push(this.placeReservationStep)

         await this.flightJournalStep.invoke({
            traceId: req.traceId,
            data: {
               flightId: flightId,
               clientId: req.data.clientId
            }
         })

         this.successfulStep.push(this.paymentStep)

         const paymentResult = await this.paymentStep.invoke({
            traceId: req.traceId,
            data: {
               clientId: req.data.clientId,
               flightId: flightId
            }
         })

         this.successfulStep.push(this.paymentStep)

         return paymentResult
      } catch (e) {
         for (const step of this.successfulStep) {
            await step.withCompensation()
         }

         throw e
      }
   }
}

const RegistrationProcessServiceProvider: Provider = {
   provide: InjectServices.RegistrationProcessService,
   useClass: RegistrationProcessService
}

export { RegistrationProcessService, RegistrationProcessServiceProvider }

import { Module } from '@nestjs/common'
import {
   RegistrationProcessService,
   RegistrationProcessServiceProvider
} from './external/registration-process/registration.process.service'
import { FlightJournalStep } from './external/registration-process/steps/flight.journal.step'
import { PaymentStep } from './external/registration-process/steps/payment.step'
import { PlaceReservationStep } from './external/registration-process/steps/place.reservation.step'
import { MyLoggerModule, ProducerModule } from '@flights.system/shared'

@Module({
   imports: [
      MyLoggerModule.register(RegistrationProcessService.name),
      MyLoggerModule.register(FlightJournalStep.name),
      MyLoggerModule.register(PaymentStep.name),
      MyLoggerModule.register(PlaceReservationStep.name),
      ProducerModule
   ],
   providers: [
      RegistrationProcessServiceProvider,
      FlightJournalStep,
      PaymentStep,
      PlaceReservationStep,
      RegistrationProcessService
   ],
   exports: [RegistrationProcessServiceProvider]
})
class ServicesModule {}

export { ServicesModule }

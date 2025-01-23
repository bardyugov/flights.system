import { Module } from '@nestjs/common'
import { ConsumerModule, MyLoggerModule } from '@flights.system/shared'
import { PaymentHandler } from './payment.handler'
import { ServicesModule } from '../../services/services.module'

@Module({
   imports: [
      MyLoggerModule.register(PaymentHandler.name),
      ConsumerModule,
      ServicesModule
   ],
   providers: [PaymentHandler]
})
class PaymentHandlerModule {}

export { PaymentHandlerModule }

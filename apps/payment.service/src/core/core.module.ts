import { Module } from '@nestjs/common'
import { PaymentHandlerModule } from '../infrastructure/handlers/payment/payment.module'
import { ConfigModule } from '@nestjs/config'
import { initConfigPath } from '@flights.system/shared'

@Module({
   imports: [
      PaymentHandlerModule,
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: initConfigPath()
      })
   ]
})
class CoreModule {}

export { CoreModule }

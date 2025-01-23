import { Module } from '@nestjs/common'
import {
   PaymentService,
   PaymentServiceProvider
} from './external/payment.service'
import { DatabaseModule, MyLoggerModule } from '@flights.system/shared'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentEntity } from '../entities/payment.entity'

@Module({
   imports: [
      MyLoggerModule.register(PaymentService.name),
      DatabaseModule,
      TypeOrmModule.forFeature([PaymentEntity])
   ],
   providers: [PaymentServiceProvider],
   exports: [PaymentServiceProvider]
})
class ServicesModule {}

export { ServicesModule }

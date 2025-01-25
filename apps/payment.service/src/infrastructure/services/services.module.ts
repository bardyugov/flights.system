import { Module } from '@nestjs/common'
import {
   PaymentService,
   PaymentServiceProvider
} from './external/payment.service'
import { DatabaseModule, MyLoggerModule } from '@flights.system/shared'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentEntity } from '../entities/payment.entity'

const entities = [PaymentEntity]

@Module({
   imports: [
      MyLoggerModule.register(PaymentService.name),
      DatabaseModule.register(entities),
      TypeOrmModule.forFeature(entities)
   ],
   providers: [PaymentServiceProvider],
   exports: [PaymentServiceProvider]
})
class ServicesModule {}

export { ServicesModule }

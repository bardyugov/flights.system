import { forwardRef, Module } from '@nestjs/common'
import { ProducerProvider, ProducerService } from './producer.service'
import { ConsumerModule } from '../consumer/consumer.module'
import { MyLoggerModule } from '../../logger/logger.module'

@Module({
  imports: [forwardRef(() => ConsumerModule), MyLoggerModule.register(ProducerService.name)],
  providers: [ProducerProvider],
  exports: [ProducerProvider]
})
class ProducerModule {
}

export { ProducerModule }

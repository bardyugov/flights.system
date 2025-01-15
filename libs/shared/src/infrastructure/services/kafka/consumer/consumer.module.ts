import { forwardRef, Module } from '@nestjs/common'
import { ConsumerService, ConsumerServiceProvider } from './consumer.service'
import { ProducerModule } from '../producer/producer.module'
import { MyLoggerModule } from '../../logger/logger.module'

@Module({
  imports: [forwardRef(() => ProducerModule), MyLoggerModule.register(ConsumerService.name)],
  providers: [ConsumerServiceProvider],
  exports: [ConsumerServiceProvider]
})
class ConsumerModule {
}

export { ConsumerModule }

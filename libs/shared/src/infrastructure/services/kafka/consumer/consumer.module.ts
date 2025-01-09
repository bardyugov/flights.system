import { forwardRef, Module } from '@nestjs/common'
import { ConsumerServiceProvider } from './consumer.service'
import { ProducerModule } from '../producer/producer.module'

@Module({
   imports: [forwardRef(() => ProducerModule)],
   providers: [ConsumerServiceProvider],
   exports: [ConsumerServiceProvider]
})
class ConsumerModule {}

export { ConsumerModule }

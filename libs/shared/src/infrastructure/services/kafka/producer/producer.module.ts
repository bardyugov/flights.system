import { forwardRef, Module } from '@nestjs/common'
import { ProducerProvider } from './producer.service'
import { ConsumerModule } from '../consumer/consumer.module'

@Module({
   imports: [forwardRef(() => ConsumerModule)],
   providers: [ProducerProvider],
   exports: [ProducerProvider]
})
class ProducerModule {}

export { ProducerModule }

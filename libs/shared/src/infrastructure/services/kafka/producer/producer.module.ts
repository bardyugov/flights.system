import { forwardRef, Module } from '@nestjs/common'
import { ProducerProvider, ProducerService } from './producer.service'
import { ConsumerModule } from '../consumer/consumer.module'
import { MyLoggerModule } from '../../logger/logger.module'
import { ConnectorModule } from '../connector/connector.module'

@Module({
   imports: [
      forwardRef(() => ConsumerModule),
      MyLoggerModule.register(ProducerService.name),
      ConnectorModule
   ],
   providers: [ProducerProvider],
   exports: [ProducerProvider]
})
class ProducerModule {}

export { ProducerModule }

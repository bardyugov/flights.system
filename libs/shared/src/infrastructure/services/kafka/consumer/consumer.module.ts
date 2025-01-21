import { forwardRef, Module } from '@nestjs/common'
import { ConsumerService, ConsumerServiceProvider } from './consumer.service'
import { ProducerModule } from '../producer/producer.module'
import { MyLoggerModule } from '../../logger/logger.module'
import { ConnectorModule } from '../connector/connector.module'

@Module({
   imports: [
      forwardRef(() => ProducerModule),
      MyLoggerModule.register(ConsumerService.name),
      ConnectorModule
   ],
   providers: [ConsumerServiceProvider],
   exports: [ConsumerServiceProvider]
})
class ConsumerModule {}

export { ConsumerModule }

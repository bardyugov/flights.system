import { Module } from '@nestjs/common'
import { ConnectorService } from './connector.service'
import { MyLoggerModule } from '../../logger/logger.module'

@Module({
   imports: [MyLoggerModule.register(ConnectorService.name)],
   providers: [ConnectorService],
   exports: [ConnectorService]
})
class ConnectorModule {}

export { ConnectorModule }

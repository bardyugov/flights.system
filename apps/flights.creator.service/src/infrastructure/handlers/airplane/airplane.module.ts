import { Module } from '@nestjs/common'
import { AirplaneHandler } from './airplane.handler'
import { ConsumerModule } from '@flights.system/shared'
import { ServicesModule } from '../../services/services.module'

@Module({
   imports: [ConsumerModule, ServicesModule],
   providers: [AirplaneHandler]
})
class AirplaneHandlerModule {}

export { AirplaneHandlerModule }

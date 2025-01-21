import { Module } from '@nestjs/common'
import { AirplaneHandler } from './airplane.handler'
import { ConsumerModule, MyLoggerModule } from '@flights.system/shared'
import { ServicesModule } from '../../services/services.module'

@Module({
   imports: [
      ConsumerModule,
      ServicesModule,
      MyLoggerModule.register(AirplaneHandler.name)
   ],
   providers: [AirplaneHandler]
})
class AirplaneHandlerModule {}

export { AirplaneHandlerModule }

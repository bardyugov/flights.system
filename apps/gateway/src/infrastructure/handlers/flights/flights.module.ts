import { Module } from '@nestjs/common'
import { FlightsHandler } from './flights.handler'
import { MyJwtModule, MyLoggerModule } from '@flights.system/shared'
import { ServicesModule } from '../../services/services.module'

@Module({
   imports: [
      MyLoggerModule.register(FlightsHandler.name),
      ServicesModule,
      MyJwtModule
   ],
   controllers: [FlightsHandler]
})
class FlightsHandlerModule {}

export { FlightsHandlerModule }

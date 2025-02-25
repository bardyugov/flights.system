import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CityModuleHandler } from '../infrastructure/handlers/city/city.module'
import { initConfigPath } from '@flights.system/shared'
import { AirplaneHandlerModule } from '../infrastructure/handlers/airplane/airplane.module'
import { FlightHandlerModule } from '../infrastructure/handlers/flights/flights.module'

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: initConfigPath()
      }),
      CityModuleHandler,
      AirplaneHandlerModule,
      FlightHandlerModule
   ]
})
class CoreModule {}

export { CoreModule }

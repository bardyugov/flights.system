import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CityModuleHandler } from '../infrastructure/handlers/city/city.module'
import { ServicesModule } from '../infrastructure/services/services.module'
import { initConfigPath } from '@flights.system/shared'
import { AirplaneHandlerModule } from '../infrastructure/handlers/airplane/airplane.module'

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: initConfigPath()
      }),
      CityModuleHandler,
      ServicesModule,
      AirplaneHandlerModule
   ]
})
class CoreModule {}

export { CoreModule }

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HelloModule } from '../infrastructure/handlers/city/city.module'
import { ServicesModule } from '../infrastructure/services/services.module'
import { initConfigPath } from '@flights.system/shared'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: initConfigPath()
    }),
    HelloModule,
    ServicesModule
  ]
})
class CoreModule {
}

export { CoreModule }

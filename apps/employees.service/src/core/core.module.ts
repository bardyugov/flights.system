import { Module } from '@nestjs/common'
import { AuthModuleHandler } from '../infrastructure/handlers/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { initConfigPath } from '@flights.system/shared'

@Module({
  imports: [
    AuthModuleHandler,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: initConfigPath()
    })]
})
class CoreModule {
}

export { CoreModule }

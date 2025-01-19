import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CityModuleHandler } from '../infrastructure/handlers/city/city.module'
import { TraceIdMiddleware } from '../infrastructure/common/middlewares/traceId.middleware'
import { initConfigPath } from '@flights.system/shared'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: initConfigPath()
    }),
    CityModuleHandler
  ]
})
class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TraceIdMiddleware)
      .forRoutes('*')
  }
}

export { CoreModule }

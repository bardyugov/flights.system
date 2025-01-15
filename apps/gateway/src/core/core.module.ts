import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CityModule } from '../infrastructure/handlers/city/city.module'
import { TraceIdMiddleware } from '../infrastructure/common/middlewares/traceId.middleware'
import { initConfigPath } from '@flights.system/shared'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: initConfigPath()
    }),
    CityModule
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

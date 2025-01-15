import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import path from 'path'
import { CityModule } from '../infrastructure/handlers/city/city.module'
import { TraceIdMiddleware } from '../infrastructure/common/middlewares/traceId.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(
        __dirname,
        `./assets/.${process.env.NODE_ENV}.env`
      )
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

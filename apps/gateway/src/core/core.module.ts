import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import path from 'path'
import { CityModule } from '../infrastructure/handlers/city/city.module'
import { TraceIdMiddleware } from '../infrastructure/common/middlewares/traceId.middleware'
import { MyLoggerModule } from '@flights.system/shared'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(
        __dirname,
        `./assets/.${process.env.NODE_ENV}.env`
      )
    }),
    CityModule,
    MyLoggerModule.register('Bootstrap')
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

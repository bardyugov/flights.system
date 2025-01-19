import { DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MyLoggerService } from './logger.service'

@Module({})
class MyLoggerModule {
   static register(context: string): DynamicModule {
      return {
         module: MyLoggerModule,
         providers: [
            {
               provide: context,
               useFactory: (config: ConfigService) =>
                  new MyLoggerService(context, config),
               inject: [ConfigService]
            }
         ],
         exports: [context]
      }
   }
}

export { MyLoggerModule }

import { DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MyLoggerService } from './logger.service'

@Module({})
class MyLoggerModule {
  static register(context: string, provide?: string): DynamicModule {
    return {
      module: MyLoggerModule,
      providers: [
        {
          provide: provide ?? MyLoggerService,
          useFactory: (config: ConfigService) => new MyLoggerService(context, config),
          inject: [ConfigService]
        }
      ],
      exports: [provide ?? MyLoggerService]
    }
  }
}

export { MyLoggerModule }

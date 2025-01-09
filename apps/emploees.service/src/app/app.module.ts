import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoggerModule } from '@flights.system/shared'

@Module({
   imports: [LoggerModule.register('emploees.service')],
   controllers: [AppController],
   providers: [AppService]
})
export class AppModule {}

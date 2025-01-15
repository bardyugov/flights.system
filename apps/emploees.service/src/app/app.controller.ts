import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { MyLoggerService } from '@flights.system/shared'

@Controller()
export class AppController {
   constructor(
      private readonly appService: AppService,
      private readonly logger: MyLoggerService
   ) {}

   @Get()
   getData() {
      this.logger.log(JSON.stringify({ message: 'New log' }))
      return this.appService.getData()
   }
}

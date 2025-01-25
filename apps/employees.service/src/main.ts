import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core/core.module'
import { MyLoggerService } from '@flights.system/shared'

async function bootstrap() {
   const logger = MyLoggerService.createBootstrapLogger()
   const app = await NestFactory.create(CoreModule, {
      logger
   })

   const port = process.env.PORT
   if (!port) {
      throw new Error('PORT is required')
   }

   await app.listen(port)
   logger.log(`🚀 Emploees service is started...`)
}

bootstrap()

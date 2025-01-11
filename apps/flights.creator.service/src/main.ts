import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core/core.module'

async function bootstrap() {
   const app = await NestFactory.create(CoreModule)

   const PORT = process.env.PORT
   if (!PORT) {
      throw new Error('PORT is required')
   }

   app.listen(PORT).then(() => Logger.log(`🚀 Flights-Creator is started...`))
}

bootstrap()

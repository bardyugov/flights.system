import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core/core.module'

async function bootstrap() {
   const app = await NestFactory.create(CoreModule)
   const PORT = process.env.PORT || 5555

   app.listen(PORT).then(() => Logger.log(`🚀 Flights-Creator is started...`))
}

bootstrap()

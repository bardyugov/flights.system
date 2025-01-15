import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core/core.module'
import { MyLoggerService } from '@flights.system/shared'

async function bootstrap() {
  const logger = MyLoggerService.createBootstrapLogger()
  const app = await NestFactory.create(CoreModule, {
    logger
  })

  const PORT = process.env.PORT
  if (!PORT) {
    throw new Error('PORT is required')
  }

  app.listen(PORT).then(() => logger.log(`🚀 Flights-Creator is started...`))
}

bootstrap()

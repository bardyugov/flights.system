import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { CoreModule } from './core/core.module'
import { MyLoggerService } from '@flights.system/shared'

function configureSwagger() {
  return new DocumentBuilder()
    .setTitle('Flights api gateway')
    .setDescription('Flights gateway description')
    .setVersion('1.0')
    .addTag('api')
    .build()
}

async function bootstrap() {
  const logger = MyLoggerService.createBootstrapLogger()
  const app = await NestFactory.create(CoreModule, {
    logger
  })

  const globalPrefix = 'api'

  app.setGlobalPrefix(globalPrefix)

  const port = process.env.PORT

  if (!port) {
    throw new Error('PORT is required')
  }

  const swagger = configureSwagger()
  const documentFactory = () => SwaggerModule.createDocument(app, swagger)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(port)
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  )
}

bootstrap()

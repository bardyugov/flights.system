import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { CoreModule } from './core/core.module'
import { MyLoggerService } from '@flights.system/shared'
import { ConfigService } from '@nestjs/config'
import path from 'path'

function configureSwagger() {
  return new DocumentBuilder()
    .setTitle('Flights api gateway')
    .setDescription('Flights gateway description')
    .setVersion('1.0')
    .addTag('api')
    .build()
}

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, {
    logger: new MyLoggerService('Bootstrap', new ConfigService({
      envFilePath: path.join(
        __dirname,
        `./assets/.${process.env.NODE_ENV}.env`
      )
    }))
  })

  const logger = app.get(MyLoggerService)
  const globalPrefix = 'api'

  app.setGlobalPrefix(globalPrefix)
  app.useLogger(logger)

  const port = process.env.PORT

  if (!port) {
    throw new Error('PORT is required')
  }

  const swagger = configureSwagger()
  const documentFactory = () => SwaggerModule.createDocument(app, swagger)
  SwaggerModule.setup('api', app, documentFactory)

  await app.listen(port)
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  )
}

bootstrap()

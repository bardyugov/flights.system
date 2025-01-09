import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { CoreModule } from './core/core.module'
import { ConfigService } from '@nestjs/config'

function configureSwagger() {
   return new DocumentBuilder()
      .setTitle('Flights api gateway')
      .setDescription('Flights gateway description')
      .setVersion('1.0')
      .addTag('api')
      .build()
}

async function bootstrap() {
   const app = await NestFactory.create(CoreModule)
   const config = app.get<ConfigService>(ConfigService)
   const globalPrefix = 'api'
   app.setGlobalPrefix(globalPrefix)
   const port = config.get<number>('PORT') || 3000
   const swagger = configureSwagger()
   const documentFactory = () => SwaggerModule.createDocument(app, swagger)
   SwaggerModule.setup('api', app, documentFactory)
   await app.listen(port)
   Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
   )
}

bootstrap()

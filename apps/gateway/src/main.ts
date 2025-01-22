import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { CoreModule } from './core/core.module'
import { JWT_AUTH, MyLoggerService } from '@flights.system/shared'
import { ZodFilter } from './infrastructure/common/filters/zod.filter'
import { ZodValidationPipe } from 'nestjs-zod'
import cookieParser from 'cookie-parser'

function configureSwagger() {
   return new DocumentBuilder()
      .setTitle('Flights api gateway')
      .setDescription('Flights gateway description')
      .setVersion('1.0')
      .addTag('api')
      .addBearerAuth(
         {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header'
         },
         JWT_AUTH
      )
      .build()
}

async function bootstrap() {
   const logger = MyLoggerService.createBootstrapLogger()
   const app = await NestFactory.create(CoreModule, {
      logger
   })

   const globalPrefix = 'api'

   app.setGlobalPrefix(globalPrefix)
   app.useGlobalPipes(new ZodValidationPipe())
   app.useGlobalFilters(new ZodFilter())
   app.use(cookieParser())

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

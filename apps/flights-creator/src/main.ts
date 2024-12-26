import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core/core.module'

async function bootstrap() {
    const app = await NestFactory.create(CoreModule)
    const port = process.env.PORT
    if (!port) {
        throw new Error('Port is required')
    }
    app.listen(process.env.PORT).then(() =>
        Logger.log(`🚀 Flights-Creator is started...`)
    )
}

bootstrap()

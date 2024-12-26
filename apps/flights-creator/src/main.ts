import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core/core.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { v4 } from 'uuid'

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        CoreModule,
        {
            transport: Transport.KAFKA,
            options: {
                client: {
                    clientId: `flights-creator-client-${v4()}`,
                    brokers: ['localhost:29092']
                },
                consumer: {
                    groupId: 'flights-creator-consumer-group'
                }
            }
        }
    )
    app.listen().then(() => Logger.log(`🚀 Flights-Creator is started...`))
}

bootstrap()

import { Module } from '@nestjs/common'
import { CityHandler } from './city.handler'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { InjectServices } from '@flights.system/shared'

@Module({
    imports: [
        ClientsModule.register([
            {
                name: InjectServices.ClientKafka,
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'kafka-gateway-producer',
                        brokers: ['localhost:29092', 'localhost:29093']
                    }
                }
            }
        ])
    ],
    controllers: [CityHandler]
})
class CityModule {}

export { CityModule }

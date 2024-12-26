import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ClientKafka } from '@nestjs/microservices'

@Module({
    imports: [ClientKafka({})],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}

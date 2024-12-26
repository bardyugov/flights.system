import { Module } from '@nestjs/common'
import { HelloHandler } from './hello.handler'
import { ConsumerModule } from '../../services/consumer/consumer.module'

@Module({
    controllers: [HelloHandler],
    imports: [ConsumerModule]
})
class HelloModule {}

export { HelloModule }

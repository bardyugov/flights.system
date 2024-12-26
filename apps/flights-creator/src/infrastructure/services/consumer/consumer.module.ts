import { Module } from '@nestjs/common'
import { ConsumerServiceProvider } from './consumer.service'

@Module({
    providers: [ConsumerServiceProvider],
    exports: [ConsumerServiceProvider]
})
class ConsumerModule {}

export { ConsumerModule }

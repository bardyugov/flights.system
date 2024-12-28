import { Module } from '@nestjs/common'
import { ProducerProvider } from './producer.service'

@Module({
    providers: [ProducerProvider],
    exports: [ProducerProvider]
})
class ProducerModule {}

export { ProducerModule }

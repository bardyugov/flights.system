import { Module } from '@nestjs/common'
import { HelloHandler } from './hello.handler'
import { ConsumerModule } from '@flights.system/shared'

@Module({
    controllers: [HelloHandler],
    imports: [ConsumerModule]
})
class HelloModule {}

export { HelloModule }

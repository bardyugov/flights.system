import { Module } from '@nestjs/common'
import { CityHandler } from './city.handler'
import { ConsumerModule } from '@flights.system/shared'

@Module({
    controllers: [CityHandler],
    imports: [ConsumerModule]
})
class HelloModule {}

export { HelloModule }

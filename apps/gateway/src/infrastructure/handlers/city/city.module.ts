import { Module } from '@nestjs/common'
import { CityHandler } from './city.handler'
import { ConsumerModule, ProducerModule } from '@flights.system/shared'

@Module({
   imports: [ProducerModule, ConsumerModule],
   controllers: [CityHandler]
})
class CityModule {}

export { CityModule }

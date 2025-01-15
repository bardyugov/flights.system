import { Module } from '@nestjs/common'
import { CityHandler } from './city.handler'
import { ConsumerModule, ProducerModule, MyLoggerModule } from '@flights.system/shared'

@Module({
  imports: [ProducerModule, ConsumerModule, MyLoggerModule.register(CityHandler.name)],
  controllers: [CityHandler]
})
class CityModule {
}

export { CityModule }

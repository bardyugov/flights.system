import { Module } from '@nestjs/common'
import { CityHandler } from './city.handler'
import { ConsumerModule } from '@flights.system/shared'
import { ServicesModule } from '../../services/services.module'

@Module({
   imports: [ConsumerModule, ServicesModule],
   providers: [CityHandler]
})
class CityModuleHandler {}

export { CityModuleHandler }

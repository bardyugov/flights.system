import { Module } from '@nestjs/common'
import { AuthHandler } from './auth.handler'
import { ConsumerModule } from '@flights.system/shared'
import { ServicesModule } from '../../services/services.module'

@Module({
   imports: [ConsumerModule, ServicesModule],
   providers: [AuthHandler]
})
export class AuthModuleHandler {}

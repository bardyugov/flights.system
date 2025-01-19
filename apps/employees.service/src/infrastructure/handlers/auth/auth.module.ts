import { Module } from '@nestjs/common'
import { AuthHandler } from './auth.handler'
import { ConsumerModule } from '@flights.system/shared'

@Module({
  imports: [ConsumerModule],
  providers: [AuthHandler]
})
export class AuthModuleHandler {
}

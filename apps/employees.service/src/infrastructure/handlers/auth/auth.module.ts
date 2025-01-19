import { Module } from '@nestjs/common'
import { AuthHandler } from './auth.handler'

@Module({
  providers: [AuthHandler]
})
export class AuthModuleHandler {
}

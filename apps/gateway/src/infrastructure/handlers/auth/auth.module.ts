import { Module } from '@nestjs/common'
import { AuthHandler } from './auth.handler'
import { MyLoggerModule, ProducerModule } from '@flights.system/shared'

@Module({
  imports: [MyLoggerModule.register(AuthHandler.name), ProducerModule],
  controllers: [AuthHandler]
})
class AuthModuleHandler {
}

export { AuthModuleHandler }

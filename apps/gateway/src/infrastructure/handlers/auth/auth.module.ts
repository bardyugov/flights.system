import { Module } from '@nestjs/common'
import { AuthHandler } from './auth.handler'
import {
   MyJwtModule,
   MyLoggerModule,
   ProducerModule
} from '@flights.system/shared'
import { AuthGuard } from '../../common/guards/auth/auth.guard'

@Module({
   imports: [
      MyLoggerModule.register(AuthHandler.name),
      ProducerModule,
      MyJwtModule
   ],
   controllers: [AuthHandler],
   providers: [AuthGuard]
})
class AuthModuleHandler {}

export { AuthModuleHandler }

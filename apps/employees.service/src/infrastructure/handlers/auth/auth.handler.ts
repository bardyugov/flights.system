import {
   Controller,
   Inject,
   OnModuleDestroy,
   OnModuleInit
} from '@nestjs/common'
import {
   IConsumerService,
   InjectServices,
   RegisterEmployeeReq,
   AuthTokenRes,
   Topic,
   JwtPayload
} from '@flights.system/shared'
import { IAuthService } from '../../../application/services/auth.service'

@Controller()
class AuthHandler implements OnModuleInit, OnModuleDestroy {
   constructor(
      @Inject(InjectServices.ConsumerService)
      private readonly consumer: IConsumerService,
      @Inject(InjectServices.AuthService)
      private readonly authService: IAuthService
   ) {}

   async onModuleInit() {
      await this.consumer.connect()

      await this.consumer.subscribeWithReply<RegisterEmployeeReq, AuthTokenRes>(
         Topic.AUTH_REGISTER_EMPLOYEE,
         async req => await this.authService.register(req)
      )

      await this.consumer.subscribeWithReply<string, AuthTokenRes>(
         Topic.AUTH_REFRESH_TOKEN,
         async req => await this.authService.refresh(req)
      )

      await this.consumer.subscribeWithReply<JwtPayload, string>(
         Topic.AUTH_LOGOUT,
         async req => await this.authService.logout(req)
      )
   }

   async onModuleDestroy() {
      await this.consumer.disconnect()
   }
}

export { AuthHandler }

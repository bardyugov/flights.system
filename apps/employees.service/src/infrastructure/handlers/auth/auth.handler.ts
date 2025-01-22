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
   RegisterClientReq
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
         async req => await this.authService.registerEmployee(req)
      )

      await this.consumer.subscribeWithReply<RegisterClientReq, AuthTokenRes>(
         Topic.AUTH_REGISTER_CLIENT,
         async req => await this.authService.registerClient(req)
      )
   }

   async onModuleDestroy() {
      await this.consumer.disconnect()
   }
}

export { AuthHandler }

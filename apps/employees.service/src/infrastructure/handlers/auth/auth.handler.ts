import {
   Controller,
   Inject,
   OnModuleDestroy,
   OnModuleInit
} from '@nestjs/common'
import {
   IConsumerService,
   InjectServices,
   KafkaResult,
   KafkaRequest,
   RegisterEmployeeReq,
   AuthTokenRes,
   Topic
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

      await this.consumer.subscribeWithReply<
         KafkaRequest<RegisterEmployeeReq>,
         KafkaResult<AuthTokenRes>
      >(
         Topic.AUTH_REGISTER_EMPLOYEE,
         async req => await this.authService.registerEmployee(req)
      )
   }

   async onModuleDestroy() {
      await this.consumer.disconnect()
   }
}

export { AuthHandler }

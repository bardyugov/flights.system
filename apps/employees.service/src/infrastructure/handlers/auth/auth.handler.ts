import { Controller, Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import {
  IConsumerService,
  InjectServices,
  KafkaResult,
  KafkaRequest,
  RegisterEmployeeReq
} from '@flights.system/shared'

@Controller()
class AuthHandler implements OnModuleInit, OnModuleDestroy {

  constructor(
    @Inject(InjectServices.ConsumerService)
    private readonly consumer: IConsumerService
  ) {
  }

  async onModuleInit() {
    await this.consumer.connect()

    await this.consumer.subscribeWithReply<KafkaRequest<RegisterEmployeeReq>, KafkaResult<AuthTokenResponse>>()

  }

  async onModuleDestroy() {
    await this.consumer.disconnect()
  }
}


export { AuthHandler }

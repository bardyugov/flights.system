import {
   Body,
   Controller,
   Inject,
   OnModuleDestroy,
   OnModuleInit,
   Post,
   Req
} from '@nestjs/common'
import {
   AuthTokenRes,
   InjectServices,
   IProducerService,
   MyLoggerService,
   RegisterEmployeeReq,
   RequestTrace,
   Topic
} from '@flights.system/shared'
import { ApiBadRequestResponse, ApiBody, ApiOkResponse } from '@nestjs/swagger'

@Controller('/auth')
class AuthHandler implements OnModuleInit, OnModuleDestroy {
   constructor(
      @Inject(AuthHandler.name)
      private readonly logger: MyLoggerService,
      @Inject(InjectServices.ProducerService)
      private readonly producer: IProducerService
   ) {}

   @Post('employee/register')
   @ApiOkResponse({
      description: 'New created employee'
   })
   @ApiBadRequestResponse({
      description: 'Employee already exists'
   })
   @ApiBody({
      description: 'Creating employee dto',
      type: RegisterEmployeeReq
   })
   async registerEmployee(
      @Body() dto: RegisterEmployeeReq,
      @Req() req: RequestTrace
   ) {
      this.logger.log('Handled /employee/register', { trace: req.traceId })

      const result = await this.producer.produceWithReply<
         RegisterEmployeeReq,
         AuthTokenRes
      >(Topic.AUTH_REGISTER_EMPLOYEE, {
         traceId: req.traceId,
         data: dto
      })
      console.log(result)
      return result
   }

   async onModuleInit() {
      await this.producer.connect()
      await this.producer.subscribeOfReply(Topic.AUTH_REGISTER_EMPLOYEE_REPLY)
   }

   async onModuleDestroy() {
      await this.producer.disconnect()
   }
}

export { AuthHandler }

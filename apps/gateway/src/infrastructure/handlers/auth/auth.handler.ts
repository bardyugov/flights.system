import {
   BadRequestException,
   Body,
   Controller,
   Get,
   Inject,
   OnModuleDestroy,
   OnModuleInit,
   Post,
   Req,
   Res,
   UseGuards
} from '@nestjs/common'
import {
   AuthTokenRes,
   InjectServices,
   IProducerService,
   JWT_AUTH,
   MyLoggerService,
   RegisterClientReq,
   RegisterEmployeeReq,
   RequestTrace,
   Topic
} from '@flights.system/shared'
import { Response } from 'express'
import {
   ApiBadRequestResponse,
   ApiBearerAuth,
   ApiBody,
   ApiOkResponse
} from '@nestjs/swagger'
import { AuthGuard } from '../../common/guards/auth/auth.guard'
import { Roles } from '../../common/guards/roles/roles.decorator'
import { ConfigService } from '@nestjs/config'

@Controller('/auth')
class AuthHandler implements OnModuleInit, OnModuleDestroy {
   private readonly refreshTTL: number

   constructor(
      @Inject(AuthHandler.name)
      private readonly logger: MyLoggerService,
      @Inject(InjectServices.ProducerService)
      private readonly producer: IProducerService,
      private readonly config: ConfigService
   ) {
      this.refreshTTL = this.config.get<number>('REFRESH_TTL')
   }

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
      @Req() req: RequestTrace,
      @Res({ passthrough: true }) res: Response
   ) {
      this.logger.log('Handled /employee/register', { trace: req.traceId })

      const { data } = await this.producer.produceWithReply<
         RegisterEmployeeReq,
         AuthTokenRes
      >(Topic.AUTH_REGISTER_EMPLOYEE, {
         traceId: req.traceId,
         data: dto
      })

      if (data.state === 'error') {
         this.logger.warn('Register employee failed ', { trace: req.traceId })
         throw new BadRequestException('Register employee failed ')
      }

      const { refresh, access } = data.value
      res.cookie('refresh', refresh, {
         httpOnly: true,
         maxAge: this.refreshTTL
      })

      return { access }
   }

   @Post('client/register')
   @ApiOkResponse({
      description: 'New created client'
   })
   @ApiBadRequestResponse({
      description: 'Client already exists'
   })
   @ApiBody({
      description: 'Creating client dto',
      type: RegisterClientReq
   })
   async registerClient(
      @Body() dto: RegisterClientReq,
      @Req() req: RequestTrace,
      @Res({ passthrough: true }) res: Response
   ) {
      this.logger.log('Handled /client/register', { trace: req.traceId })

      const { data } = await this.producer.produceWithReply<
         RegisterClientReq,
         AuthTokenRes
      >(Topic.AUTH_REGISTER_CLIENT, {
         traceId: req.traceId,
         data: dto
      })
      if (data.state === 'error') {
         this.logger.warn('Register client failed ', { trace: req.traceId })
         throw new BadRequestException('Register client failed ')
      }

      const { refresh, access } = data.value
      res.cookie('refresh', refresh, {
         httpOnly: true,
         maxAge: this.refreshTTL
      })

      return { access }
   }

   @Get('/public')
   @UseGuards(AuthGuard)
   @Roles(['client'])
   @ApiBearerAuth(JWT_AUTH)
   async public(@Req() req: RequestTrace) {
      return req.user
   }

   async onModuleInit() {
      await this.producer.connect()

      await this.producer.subscribeOfReply(Topic.AUTH_REGISTER_EMPLOYEE_REPLY)
      await this.producer.subscribeOfReply(Topic.AUTH_REGISTER_CLIENT_REPLY)
   }

   async onModuleDestroy() {
      await this.producer.disconnect()
   }
}

export { AuthHandler }

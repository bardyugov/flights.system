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
   UnauthorizedException,
   UseGuards
} from '@nestjs/common'
import {
   AuthTokenRes,
   InjectServices,
   IProducerService,
   JWT_AUTH,
   JwtPayload,
   MyLoggerService,
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
import { ConfigService } from '@nestjs/config'
import { RolesGuard } from '../../common/guards/roles/roles.guard'

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

   @Post('/register')
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
   async register(
      @Body() dto: RegisterEmployeeReq,
      @Req() req: RequestTrace,
      @Res({ passthrough: true }) res: Response
   ) {
      this.logger.log('Handled register', { trace: req.traceId })

      const { data } = await this.producer.produceWithReply<
         RegisterEmployeeReq,
         AuthTokenRes
      >(Topic.AUTH_REGISTER_EMPLOYEE, {
         traceId: req.traceId,
         data: dto
      })

      if (data.state === 'error') {
         this.logger.warn(data.message, { trace: req.traceId })
         throw new BadRequestException(data.message)
      }

      const { refresh, access } = data.value
      res.cookie('refresh', refresh, {
         httpOnly: true,
         maxAge: this.refreshTTL
      })

      return { access }
   }

   @Get('/public')
   @UseGuards(RolesGuard)
   @UseGuards(AuthGuard)
   @ApiBearerAuth(JWT_AUTH)
   async public(@Req() req: RequestTrace) {
      return req.user
   }

   @Get('/refresh')
   async refresh(
      @Req() req: RequestTrace,
      @Res({ passthrough: true }) res: Response
   ) {
      const refreshToken = req.cookies['refresh'] as string
      if (!refreshToken) {
         this.logger.warn('Not found refresh')
         throw new UnauthorizedException()
      }

      const { data } = await this.producer.produceWithReply<
         string,
         AuthTokenRes
      >(Topic.AUTH_REFRESH_TOKEN, {
         traceId: req.traceId,
         data: refreshToken
      })

      if (data.state === 'error') {
         this.logger.warn(data.message, { trace: req.traceId })
         throw new BadRequestException(data.message)
      }

      const { refresh, access } = data.value
      res.cookie('refresh', refresh, {
         httpOnly: true,
         maxAge: this.refreshTTL
      })

      return { access }
   }

   @Post('/logout')
   @UseGuards(AuthGuard)
   @ApiBearerAuth(JWT_AUTH)
   async logout(
      @Req() req: RequestTrace,
      @Res({ passthrough: true }) res: Response
   ) {
      const { data } = await this.producer.produceWithReply<JwtPayload, string>(
         Topic.AUTH_LOGOUT,
         {
            traceId: req.traceId,
            data: req.user
         }
      )
      if (data.state === 'error') {
         this.logger.warn(data.message, { trace: req.traceId })
         throw new BadRequestException(data.message)
      }
      res.cookie('refresh', null)

      return { message: data.value }
   }

   async onModuleInit() {
      await this.producer.connect()

      await this.producer.subscribeOfReply(Topic.AUTH_REGISTER_EMPLOYEE_REPLY)
      await this.producer.subscribeOfReply(Topic.AUTH_REFRESH_TOKEN_REPLY)
      await this.producer.subscribeOfReply(Topic.AUTH_LOGOUT_REPLY)
   }

   async onModuleDestroy() {
      await this.producer.disconnect()
   }
}

export { AuthHandler }

import {
   BadRequestException,
   Body,
   Controller,
   Inject,
   Post,
   Req,
   UseGuards
} from '@nestjs/common'
import {
   ApiBadRequestResponse,
   ApiBearerAuth,
   ApiBody,
   ApiOkResponse
} from '@nestjs/swagger'
import {
   InjectServices,
   JWT_AUTH,
   MyLoggerService,
   RegisterOnFlightReq,
   RequestTrace
} from '@flights.system/shared'
import { IRegistrationProcessService } from '../../../application/services/registration.process.service'
import { AuthGuard } from '../../common/guards/auth/auth.guard'

@Controller('/flights')
class FlightsHandler {
   constructor(
      @Inject(InjectServices.RegistrationProcessService)
      private readonly flightsService: IRegistrationProcessService,
      @Inject(FlightsHandler.name)
      private readonly logger: MyLoggerService
   ) {}
   @Post('/register')
   @ApiOkResponse({
      description: 'Successfully registered'
   })
   @ApiBadRequestResponse({
      description: 'Unsuccessfully registered'
   })
   @ApiBody({
      description: 'Created payment',
      type: RegisterOnFlightReq
   })
   @UseGuards(AuthGuard)
   @ApiBearerAuth(JWT_AUTH)
   async register(@Body() dto: RegisterOnFlightReq, @Req() req: RequestTrace) {
      this.logger.log('Handled /flights/register', { trace: req.traceId })

      const result = await this.flightsService.register({
         traceId: req.traceId,
         clientId: req.user.id,
         from: dto.from,
         to: dto.to
      })

      if (!result) {
         throw new BadRequestException('Invalid saga action')
      }

      return result
   }
}

export { FlightsHandler }

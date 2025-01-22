import {
   CanActivate,
   ExecutionContext,
   Inject,
   Injectable,
   Provider,
   Scope,
   UnauthorizedException
} from '@nestjs/common'
import { Observable } from 'rxjs'
import {
   IJwtService,
   InjectServices,
   MyLoggerService,
   RequestTrace
} from '@flights.system/shared'
import { APP_GUARD, Reflector } from '@nestjs/core'

@Injectable()
class AuthGuard implements CanActivate {
   constructor(
      @Inject(InjectServices.JwtService)
      private readonly jwtService: IJwtService,
      @Inject(AuthGuard.name)
      private readonly logger: MyLoggerService,
      private readonly reflector: Reflector
   ) {}

   private extractTokenFromHeader(request: RequestTrace): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? []
      return type === 'Bearer' ? token : undefined
   }

   canActivate(
      context: ExecutionContext
   ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest() as RequestTrace
      const token = this.extractTokenFromHeader(request)
      const payload = this.jwtService.encode(token)

      if (!token || !payload) {
         this.logger.warn('Invalid token', { trace: request.traceId })
         throw new UnauthorizedException()
      }
      request.user = payload

      return true
   }
}

const AuthGuardProvider: Provider = {
   provide: APP_GUARD,
   useClass: AuthGuard,
   scope: Scope.REQUEST
}

export { AuthGuard, AuthGuardProvider }

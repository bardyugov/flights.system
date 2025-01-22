import {
   CanActivate,
   ExecutionContext,
   Inject,
   Injectable,
   UnauthorizedException
} from '@nestjs/common'
import { Observable } from 'rxjs'
import {
   IJwtService,
   InjectServices,
   RequestTrace
} from '@flights.system/shared'

@Injectable()
class AuthGuard implements CanActivate {
   constructor(
      @Inject(InjectServices.JwtService)
      private readonly jwtService: IJwtService
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
         throw new UnauthorizedException()
      }
      request.user = payload

      return true
   }
}

export { AuthGuard }

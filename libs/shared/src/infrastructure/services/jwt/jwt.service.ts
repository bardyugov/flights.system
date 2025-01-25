import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { InjectServices, JwtPayload } from '../../utils/utils'
import { IJwtService } from '../../../application/services/jwt.interface'
import { Injectable, Provider } from '@nestjs/common'

@Injectable()
class MyJwtService implements IJwtService {
   private readonly secret_key: string

   constructor(
      private readonly jwt: JwtService,
      private readonly config: ConfigService
   ) {
      this.secret_key = this.config.get<string>('SECRET_KEY')
   }

   create(data: JwtPayload, expiresIn: number): string {
      return this.jwt.sign(data, {
         expiresIn,
         secret: this.secret_key
      })
   }

   encode(token: string): JwtPayload {
      try {
         return this.jwt.verify<JwtPayload>(token, {
            secret: this.secret_key
         })
      } catch (e) {
         return null
      }
   }
}

const MyJwtServiceProvider: Provider = {
   provide: InjectServices.JwtService,
   useClass: MyJwtService
}

export { MyJwtService, MyJwtServiceProvider }

import { Injectable } from '@nestjs/common'
import { JwtService as jwt } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { JwtPayload } from '@flights.system/shared'

@Injectable()
class JwtService {
   private readonly secret_key: string

   constructor(
      private readonly jwt: jwt,
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

export { JwtService }

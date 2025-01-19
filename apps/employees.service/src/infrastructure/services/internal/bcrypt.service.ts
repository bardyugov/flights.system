import crypto from 'crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
class BcryptService {
   private generateSalt(length: number) {
      return crypto.randomBytes(length).toString('hex')
   }

   private hashPassword(password: string, salt: string) {
      const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512')
      return hash.toString('hex')
   }

   create(password: string) {
      const salt = this.generateSalt(16)
      return this.hashPassword(password, salt)
   }

   verify(password: string, hashedPassword: string) {
      const hash = this.hashPassword(password, this.generateSalt(16))
      return hash === hashedPassword
   }
}

export { BcryptService }

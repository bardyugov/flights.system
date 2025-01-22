import { JwtPayload } from '../../infrastructure/utils/utils'

interface IJwtService {
   create(data: JwtPayload, expiresIn: string): string
   encode(token: string): JwtPayload
}

export { IJwtService }

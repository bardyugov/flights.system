import { JwtPayload } from '../../infrastructure/utils/utils'

interface IJwtService {
   create(data: JwtPayload, expiresIn: number): string
   encode(token: string): JwtPayload
}

export { IJwtService }

import {
   AuthTokenRes,
   KafkaRequest,
   RegisterEmployeeReq,
   KafkaResult,
   JwtPayload
} from '@flights.system/shared'

interface IAuthService {
   register(
      req: KafkaRequest<RegisterEmployeeReq>
   ): Promise<KafkaResult<AuthTokenRes>>

   refresh(req: KafkaRequest<string>): Promise<KafkaResult<AuthTokenRes>>

   logout(req: KafkaRequest<JwtPayload>): Promise<KafkaResult<string>>
}

export { IAuthService }

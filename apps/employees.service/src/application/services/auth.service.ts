import {
   AuthTokenRes,
   KafkaRequest,
   RegisterEmployeeReq,
   KafkaResult,
   RegisterClientReq
} from '@flights.system/shared'

interface IAuthService {
   registerEmployee(
      req: KafkaRequest<RegisterEmployeeReq>
   ): Promise<KafkaResult<AuthTokenRes>>

   registerClient(
      req: KafkaRequest<RegisterClientReq>
   ): Promise<KafkaResult<AuthTokenRes>>
}

export { IAuthService }

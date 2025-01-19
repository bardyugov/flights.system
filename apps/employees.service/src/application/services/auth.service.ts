import { AuthTokenResponse, KafkaRequest, RegisterEmployeeReq, KafkaResult } from '@flights.system/shared'

interface IAuthService {
  registerEmployee(req: KafkaRequest<RegisterEmployeeReq>): Promise<KafkaResult<AuthTokenResponse>>
}

export { IAuthService }

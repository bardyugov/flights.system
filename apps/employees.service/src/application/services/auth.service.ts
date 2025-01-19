import { AuthTokenRes, KafkaRequest, RegisterEmployeeReq, KafkaResult } from '@flights.system/shared'

interface IAuthService {
  registerEmployee(req: KafkaRequest<RegisterEmployeeReq>): Promise<KafkaResult<AuthTokenRes>>
}

export { IAuthService }

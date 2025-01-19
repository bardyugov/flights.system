import {
   GetAirplanesRes,
   KafkaRequest,
   KafkaResult
} from '@flights.system/shared'

interface IAirplaneService {
   get(req: KafkaRequest<number>): Promise<KafkaResult<GetAirplanesRes[]>>
}

export { IAirplaneService }

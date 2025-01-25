import {
   CreateCityReq,
   CreatedCityRes,
   KafkaRequest,
   KafkaResult,
   GetCityReq
} from '@flights.system/shared'

interface ICityService {
   create(
      city: KafkaRequest<CreateCityReq>
   ): Promise<KafkaResult<CreatedCityRes>>

   getMany(
      limit: KafkaRequest<GetCityReq>
   ): Promise<KafkaResult<CreatedCityRes[]>>

   findByName(name: KafkaRequest<string>): Promise<KafkaResult<CreatedCityRes>>
}

export { ICityService }

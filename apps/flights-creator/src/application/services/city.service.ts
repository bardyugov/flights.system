import {
    CreateCityReq,
    CreatedCityRes,
    KafkaResult
} from '@flights.system/shared'

interface ICityService {
    create(city: CreateCityReq): Promise<KafkaResult<CreatedCityRes>>
    getMany(limit: number): Promise<CreatedCityRes[]>
    findByName(name: string): Promise<KafkaResult<CreatedCityRes>>
}

export { ICityService }

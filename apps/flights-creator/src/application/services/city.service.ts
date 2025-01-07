import { CityEntity } from '../../infrastructure/entities/city.entity'
import { CreateCityDto } from '@flights.system/shared'

interface ICityService {
    create(city: CreateCityDto): Promise<CityEntity>
    getMany(): Promise<CityEntity[]>
}

export { ICityService }

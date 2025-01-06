import { CityEntity } from '../../infrastructure/entities/city.entity'

interface ICityService {
    create(): Promise<CityEntity>
    getMany(): Promise<CityEntity[]>
}

export { ICityService }

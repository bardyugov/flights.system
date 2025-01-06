import { ICityService } from '../../../application/services/city.service'
import { Logger } from '@nestjs/common'
import { CityEntity } from '../../entities/city.entity'

class CityService implements ICityService {
    private readonly logger = new Logger(CityService.name)

    constructor(private readonly cityService: CityService) {}

    create(): Promise<CityEntity> {
        throw new Error('Method not implemented.')
    }
    getMany(): Promise<CityEntity[]> {
        throw new Error('Method not implemented.')
    }
}

export { CityService }

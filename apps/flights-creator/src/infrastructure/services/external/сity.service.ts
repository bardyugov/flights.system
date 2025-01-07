import { ICityService } from '../../../application/services/city.service'
import { Logger, Provider } from '@nestjs/common'
import { CityEntity } from '../../entities/city.entity'
import { CreateCityDto, InjectServices } from '@flights.system/shared'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

class CityService implements ICityService {
    private readonly logger = new Logger(CityService.name)

    constructor(
        @InjectRepository(CityEntity)
        private readonly cityRepository: Repository<CityEntity>
    ) {}

    async create(dto: CreateCityDto): Promise<CityEntity> {
        const createdCity = this.cityRepository.create(dto)
        this.logger.debug(`Creating city with id ${createdCity}`)
        return createdCity
    }

    getMany(): Promise<CityEntity[]> {
        throw new Error('Method not implemented.')
    }
}

const CityProvider: Provider = {
    provide: InjectServices.CityService,
    useClass: CityService
}

export { CityProvider }

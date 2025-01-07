import { ICityService } from '../../../application/services/city.service'
import { Injectable, Logger, Provider } from '@nestjs/common'
import { CityEntity } from '../../entities/city.entity'
import {
    CreateCityReq,
    CreatedCityRes,
    error,
    InjectServices,
    KafkaResult,
    ok
} from '@flights.system/shared'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
class CityService implements ICityService {
    private readonly logger = new Logger(CityService.name)

    constructor(
        @InjectRepository(CityEntity)
        private readonly cityRepository: Repository<CityEntity>
    ) {}

    async create(dto: CreateCityReq): Promise<KafkaResult<CreatedCityRes>> {
        const isFounded = await this.cityRepository.findOne({
            where: {
                name: dto.name
            }
        })
        if (isFounded) {
            return error('City already exists')
        }
        const createdCity = await this.cityRepository.save(
            new CityEntity(dto.name, dto.country)
        )

        this.logger.log(`Success created city with id: ${createdCity.id}`)
        return ok<CreatedCityRes>({
            name: createdCity.name,
            country: createdCity.country,
            createAt: createdCity.createAt
        })
    }

    async getMany(limit: number): Promise<CreatedCityRes[]> {
        const cities = await this.cityRepository.find({ take: limit })

        return cities.map<CreatedCityRes>(c => ({
            name: c.name,
            country: c.country,
            createAt: c.createAt
        }))
    }

    async findByName(name: string): Promise<KafkaResult<CreatedCityRes>> {
        const foundCity = await this.cityRepository
            .createQueryBuilder('city')
            .where('city.name like :name', { name })
            .getOne()

        if (!foundCity) {
            return error('Not found city')
        }

        return ok<CreatedCityRes>({
            name: foundCity.name,
            country: foundCity.country,
            createAt: foundCity.createAt
        })
    }
}

const CityProvider: Provider = {
    provide: InjectServices.CityService,
    useClass: CityService
}

export { CityProvider }

import { ICityService } from '../../../application/services/city.service'
import { Inject, Injectable, Provider } from '@nestjs/common'
import { CityEntity } from '../../entities/city.entity'
import {
  CreateCityReq,
  CreatedCityRes,
  error, GetCityReq,
  InjectServices, KafkaRequest,
  KafkaResult,
  MyLoggerService,
  ok
} from '@flights.system/shared'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'

@Injectable()
class CityService implements ICityService {

  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(CityService.name)
    private readonly logger: MyLoggerService
  ) {
  }

  async create(req: KafkaRequest<CreateCityReq>): Promise<KafkaResult<CreatedCityRes>> {
    const founded = await this.cityRepository.findOne({
      where: {
        name: req.data.name
      }
    })
    if (founded) {
      this.logger.warn(`City already exists with name ${founded.name}`, { trace: req.traceId })
      return error('City already exists')
    }

    const createdCity = await this.cityRepository.save(
      new CityEntity(req.data.name, req.data.country)
    )

    this.logger.log(`Success created city with id: ${createdCity.id}`, { trace: req.traceId })
    return ok<CreatedCityRes>({
      name: createdCity.name,
      country: createdCity.country,
      createAt: createdCity.createAt
    })
  }

  async getMany(req: KafkaRequest<GetCityReq>): Promise<KafkaResult<CreatedCityRes[]>> {
    if (req.data.limit > 20) {
      this.logger.warn('Invalid limit', { trace: req.traceId })
      return error('Invlid limit')
    }

    const cache = await this.cacheManager.get<CreatedCityRes[]>('city.many')
    if (cache) {
      this.logger.log('Success find cities in cache')
      return ok<CreatedCityRes[]>(cache)
    }

    const cities = await this.cityRepository.find({ take: req.data.limit, skip: req.data.offset })
    const citiesRes = cities.map<CreatedCityRes>(c => ({
      name: c.name,
      country: c.country,
      createAt: c.createAt
    }))

    await this.cacheManager.set('city.many', citiesRes, 10000)
    this.logger.log('Success get cities from db', { trace: req.traceId })
    return ok<CreatedCityRes[]>(citiesRes)
  }

  async findByName(req: KafkaRequest<string>): Promise<KafkaResult<CreatedCityRes>> {
    const foundedCity = await this.cityRepository
      .createQueryBuilder('city')
      .where('city.name like :name', { name: req.data })
      .getOne()

    if (!foundedCity) {
      this.logger.warn(`Not found city with name: ${req.data}`, { trace: req.traceId })
      return error('Not found city')
    }

    return ok<CreatedCityRes>({
      name: foundedCity.name,
      country: foundedCity.country,
      createAt: foundedCity.createAt
    })
  }
}

const CityProvider: Provider = {
  provide: InjectServices.CityService,
  useClass: CityService
}

export { CityProvider, CityService }

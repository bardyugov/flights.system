import { ICityService } from '../../../application/services/city.service'
import { Inject, Injectable, Provider } from '@nestjs/common'
import { CityEntity } from '../../entities/city.entity'
import {
   CreateCityReq,
   CreatedCityRes,
   error,
   InjectServices,
   KafkaResult,
   LoggerService,
   ok
} from '@flights.system/shared'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'

@Injectable()
class CityService implements ICityService {
   private readonly logger = new LoggerService(CityService.name)

   constructor(
      @InjectRepository(CityEntity)
      private readonly cityRepository: Repository<CityEntity>,
      @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
   ) {}

   async create(dto: CreateCityReq): Promise<KafkaResult<CreatedCityRes>> {
      const founded = await this.cityRepository.findOne({
         where: {
            name: dto.name
         }
      })
      if (founded) {
         this.logger.warn(`City already exists with name ${founded.name}`)
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
      const cache = await this.cacheManager.get<CreatedCityRes[]>('city.many')
      if (cache) {
         this.logger.log('Success find cities in cache')
         return cache
      }

      const cities = await this.cityRepository.find({ take: limit })
      const citiesRes = cities.map<CreatedCityRes>(c => ({
         name: c.name,
         country: c.country,
         createAt: c.createAt
      }))

      await this.cacheManager.set('city.many', citiesRes, 10000)
      this.logger.log('Success get cities from db')
      return citiesRes
   }

   async findByName(name: string): Promise<KafkaResult<CreatedCityRes>> {
      const foundedCity = await this.cityRepository
         .createQueryBuilder('city')
         .where('city.name like :name', { name })
         .getOne()

      if (!foundedCity) {
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

export { CityProvider }

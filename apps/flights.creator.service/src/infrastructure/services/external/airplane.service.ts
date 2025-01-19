import { IAirplaneService } from '../../../application/services/airplane.service'
import { Inject, Injectable, Provider } from '@nestjs/common'
import { Repository } from 'typeorm'
import { AirplaneEntity } from '../../entities/airplane.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { es, Faker } from '@faker-js/faker'
import {
   KafkaRequest,
   GetAirplanesRes,
   error,
   KafkaResult,
   MyLoggerService,
   ok,
   InjectServices
} from '@flights.system/shared'

@Injectable()
class AirplaneService implements IAirplaneService {
   private readonly faker = new Faker({ locale: [es] })

   constructor(
      @InjectRepository(AirplaneService)
      private readonly airplaneRepo: Repository<AirplaneEntity>,
      @Inject(AirplaneService.name)
      private readonly logger: MyLoggerService
   ) {}

   async get(
      req: KafkaRequest<number>
   ): Promise<KafkaResult<GetAirplanesRes[]>> {
      if (req.data > 20) {
         this.logger.log('So many count airplanes', { trace: req.traceId })
         return error('So many count airplanes')
      }

      const airplanesCount = await this.airplaneRepo.count()

      if (airplanesCount === 0 || airplanesCount < req.data) {
         this.logger.log('Small count data', { trace: req.traceId })
         return error('Small count data')
      }

      const randomIds = []
      for (let i = 0; i < airplanesCount; i++) {
         randomIds.push(this.faker.number.int({ min: 1, max: airplanesCount }))
      }

      const airplanes = await this.airplaneRepo
         .createQueryBuilder('airplane')
         .select()
         .where('airplane.id IN :ids', { ids: randomIds })
         .getMany()

      return ok<GetAirplanesRes[]>(
         airplanes.map(v => ({
            ...v
         }))
      )
   }
}

const AirplaneServiceProvider: Provider = {
   provide: InjectServices.AirplaneService,
   useClass: AirplaneService
}

export { AirplaneServiceProvider, AirplaneService }

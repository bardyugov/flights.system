import { IAirplaneService } from '../../../application/services/airplane.service'
import { Inject, Provider } from '@nestjs/common'
import { In, Repository } from 'typeorm'
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

class AirplaneService implements IAirplaneService {
   private readonly faker = new Faker({ locale: [es] })

   constructor(
      @InjectRepository(AirplaneEntity)
      private readonly airplaneRepo: Repository<AirplaneEntity>,
      @Inject(AirplaneService.name)
      private readonly logger: MyLoggerService
   ) {}

   async get(
      req: KafkaRequest<number>
   ): Promise<KafkaResult<GetAirplanesRes[]>> {
      this.logger.debug('Start consuming', { trace: req.traceId })
      if (req.data > 20) {
         this.logger.log('So many count airplanes', { trace: req.traceId })
         return error('So many count airplanes', req.traceId)
      }

      const airplanesCount = await this.airplaneRepo.count()

      if (airplanesCount === 0 || airplanesCount < req.data) {
         this.logger.log('Small count data', { trace: req.traceId })
         return error('Small count data', req.traceId)
      }

      const randomIds = []
      for (let i = 0; i < req.data; i++) {
         randomIds.push(this.faker.number.int({ min: 1, max: airplanesCount }))
      }

      const airplanes = await this.airplaneRepo.find({
         where: {
            id: In(randomIds)
         }
      })

      this.logger.log('Success get airplanes', { trace: req.traceId })

      return ok<GetAirplanesRes[]>(
         airplanes.map(v => ({
            ...v
         })),
         req.traceId
      )
   }
}

const AirplaneServiceProvider: Provider = {
   provide: InjectServices.AirplaneService,
   useClass: AirplaneService
}

export { AirplaneServiceProvider, AirplaneService }

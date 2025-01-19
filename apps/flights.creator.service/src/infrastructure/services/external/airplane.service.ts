import { IAirplaneService } from '../../../application/services/airplane.service'
import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { AirplaneEntity } from '../../entities/airplane.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { es, Faker } from '@faker-js/faker'

@Injectable()
class AirplaneService implements IAirplaneService {
  private readonly faker = new Faker({ locale: [es] })

  constructor(
    @InjectRepository(AirplaneService)
    private readonly airplaneRepo: Repository<AirplaneEntity>
  ) {
  }

  get(count: number): Promise<GetAirplanesRes> {
    const randomAirp
  }
}

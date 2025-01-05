import { Injectable } from '@nestjs/common'
import { IFlightsRepository } from '../../application/repositories/flights.repository'

@Injectable()
class FlightsRepository implements IFlightsRepository {}

export { FlightsRepository }

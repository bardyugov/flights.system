import { FlightEntity } from '../../infrastructure/entities/flight.entity'

interface IFlightsRepository {
    create(): Promise<FlightEntity>
}

export { IFlightsRepository }

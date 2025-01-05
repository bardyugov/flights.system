import { FlightEntity } from '../../infrastructure/entities/flight.entity'

interface IFlightsRepository {
    create(): Promise<FlightEntity>
    update(id: number): Promise<FlightEntity>
}

export { IFlightsRepository }

import { GetAirplanesRes } from '@flights.system/shared'

interface IAirplaneService {
   get(count: number): Promise<GetAirplanesRes>
}

export { IAirplaneService }

import { DataSource } from 'typeorm'
import { Seeder } from 'typeorm-extension'
import {
    AirplaneStatusEntity,
    FlightStatusEnum
} from '../../../entities/airplane.status.entity'

class AirplaneStatusSeeder implements Seeder {
    track?: boolean
    async run(dataSource: DataSource): Promise<void> {
        const statuses: AirplaneStatusEntity[] = [
            new AirplaneStatusEntity(FlightStatusEnum.Broken),
            new AirplaneStatusEntity(FlightStatusEnum.InFlight),
            new AirplaneStatusEntity(FlightStatusEnum.InParking),
            new AirplaneStatusEntity(FlightStatusEnum.Refueling)
        ]

        await dataSource
            .createQueryBuilder()
            .insert()
            .into(AirplaneStatusEntity)
            .values(statuses)
            .execute()
    }
}

export default AirplaneStatusSeeder

import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { CityEntity } from '../../../entities/city.entity'
import { maxCountWritten } from '../../constants'

class CitySeeder implements Seeder {
    track?: boolean
    async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<void> {
        const factory = await factoryManager.get(CityEntity)
        await factory.saveMany(maxCountWritten)
    }
}

export default CitySeeder

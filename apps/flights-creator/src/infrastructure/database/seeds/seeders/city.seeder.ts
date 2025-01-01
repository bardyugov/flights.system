import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { CityEntity } from '../../../entities/city.entity'

class CitySeeder implements Seeder {
    track?: boolean
    async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<void> {
        const factory = await factoryManager.get(CityEntity)
        console.log('Working')
        await factory.saveMany(100)
    }
}

export default CitySeeder

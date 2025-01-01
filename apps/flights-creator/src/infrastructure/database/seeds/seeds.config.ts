import { SeederOptions } from 'typeorm-extension'
import { options } from '../database.context'
import { DataSourceOptions } from 'typeorm'

const dataSourceOptions: DataSourceOptions & SeederOptions = {
    ...options,
    seeds: ['src/infrastructure/database/seeds/seeders/*.seeder{.ts, .js}'],
    factories: [
        'src/infrastructure/database/seeds/factories/*.factory{.ts, .js}'
    ]
}

export default dataSourceOptions

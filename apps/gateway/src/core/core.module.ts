import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import path from 'path'
import { CityModule } from '../infrastructure/handlers/city/city.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: path.join(
                __dirname,
                `./assets/.${process.env.NODE_ENV}.env`
            )
        }),
        CityModule
    ]
})
class CoreModule {}

export { CoreModule }

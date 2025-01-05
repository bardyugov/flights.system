import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import path from 'path'
import { HelloModule } from '../infrastructure/handlers/city-handler/city.module'
import { AccumulatorModule } from '../infrastructure/services/accumulator/accumulator.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: path.join(
                __dirname,
                `./assets/.${process.env.NODE_ENV}.env`
            )
        }),
        HelloModule,
        AccumulatorModule
    ]
})
class CoreModule {}

export { CoreModule }

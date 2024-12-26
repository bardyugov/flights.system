import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import path from 'path'
import { HelloModule } from '../infrastructure/handlers/hello-handler/hello.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: path.join(
                __dirname,
                `./assets/.${process.env.NODE_ENV}.env`
            )
        }),
        HelloModule
    ]
})
class CoreModule {}

export { CoreModule }

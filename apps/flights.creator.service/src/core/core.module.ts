import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import path from 'path'
import { HelloModule } from '../infrastructure/handlers/city/city.module'
import { ServicesModule } from '../infrastructure/services/services.module'

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
      ServicesModule
   ]
})
class CoreModule {}

export { CoreModule }

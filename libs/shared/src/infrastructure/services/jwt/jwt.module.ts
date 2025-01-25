import { Module } from '@nestjs/common'
import { MyJwtServiceProvider } from './jwt.service'
import { JwtModule } from '@nestjs/jwt'

@Module({
   providers: [MyJwtServiceProvider],
   imports: [JwtModule.register({})],
   exports: [MyJwtServiceProvider]
})
class MyJwtModule {}

export { MyJwtModule }

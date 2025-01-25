import { Module } from '@nestjs/common'
import { AuthModuleHandler } from '../infrastructure/handlers/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { initConfigPath } from '@flights.system/shared'
import { FlightJournalModuleHandler } from '../infrastructure/handlers/flight.journal/flight.journal.module'

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         envFilePath: initConfigPath()
      }),
      FlightJournalModuleHandler,
      AuthModuleHandler
   ]
})
class CoreModule {}

export { CoreModule }

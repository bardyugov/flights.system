import { Module } from '@nestjs/common'
import { PrismaContext } from './prisma.context'

@Module({
    providers: [PrismaContext],
    exports: [PrismaContext]
})
class PrismaModule {}

export { PrismaModule }

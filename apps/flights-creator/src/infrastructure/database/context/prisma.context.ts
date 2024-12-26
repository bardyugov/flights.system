import { PrismaClient } from '@prisma/client'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

@Injectable()
class PrismaContext
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    onModuleInit() {
        this.$connect()
    }

    onModuleDestroy() {
        this.$disconnect()
    }
}

export { PrismaContext }

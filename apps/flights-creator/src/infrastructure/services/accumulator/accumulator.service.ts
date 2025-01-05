import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

@Injectable()
class AccumulatorService {
    private readonly logger = new Logger(AccumulatorService.name)

    @Cron('45 * * * * *')
    update() {
        this.logger.log('handler 45s')
    }
}

export { AccumulatorService }

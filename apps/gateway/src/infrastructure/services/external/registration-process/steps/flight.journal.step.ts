import {
   Inject,
   Injectable,
   OnModuleDestroy,
   OnModuleInit
} from '@nestjs/common'
import {
   AddFlightJournalReq,
   InjectServices,
   IProducerService,
   KafkaRequest,
   MyLoggerService,
   SagaException,
   SagaStep,
   Topic
} from '@flights.system/shared'
import { RegistrationProcessService } from '../registration.process.service'

@Injectable()
class FlightJournalStep
   extends SagaStep<KafkaRequest<AddFlightJournalReq>, string>
   implements OnModuleInit, OnModuleDestroy
{
   constructor(
      @Inject(InjectServices.ProducerService)
      private readonly producer: IProducerService,
      @Inject(RegistrationProcessService.name)
      private readonly logger: MyLoggerService
   ) {
      super('flight-journal-step')
   }

   async invoke(arg: KafkaRequest<AddFlightJournalReq>): Promise<string> {
      this.setCompensationArgs(arg)
      this.logger.log(`${this.name} invoke`, { trace: arg.traceId })

      const result = await this.producer.produceWithReply<
         AddFlightJournalReq,
         string
      >(Topic.FLIGHT_JOURNAL, arg)

      if (result.data.state === 'error') {
         this.logger.warn(result.data.message)
         throw new SagaException(result.data.message)
      }

      return result.data.value
   }

   async withCompensation(): Promise<void> {
      const arg = this.getCompensationArgs()
      this.logger.log(`${this.name} withCompensation`, { trace: arg.traceId })

      await this.producer.produce<AddFlightJournalReq>(
         Topic.FLIGHT_JOURNAL_COMPENSATION,
         arg
      )
   }

   async onModuleInit() {
      await this.producer.connect()

      await this.producer.subscribeOfReply(Topic.FLIGHT_JOURNAL_REPLY)
   }

   async onModuleDestroy() {
      await this.producer.disconnect()
   }
}

export { FlightJournalStep }

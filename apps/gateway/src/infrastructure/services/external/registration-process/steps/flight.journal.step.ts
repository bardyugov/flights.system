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

@Injectable()
class FlightJournalStep
   extends SagaStep<KafkaRequest<AddFlightJournalReq>, string>
   implements OnModuleInit, OnModuleDestroy
{
   compensationArg: KafkaRequest<AddFlightJournalReq>

   constructor(
      @Inject(InjectServices.ProducerService)
      private readonly producer: IProducerService,
      @Inject(FlightJournalStep.name)
      private readonly logger: MyLoggerService
   ) {
      super('flight-journal-step')
   }

   async invoke(arg: KafkaRequest<AddFlightJournalReq>): Promise<string> {
      this.compensationArg = arg
      this.logger.log(`${this.name} invoke`, { trace: arg.traceId })

      const result = await this.producer.produceWithReply<
         AddFlightJournalReq,
         string
      >(Topic.FLIGHT_JOURNAL, arg)

      if (result.data.state === 'error') {
         throw new SagaException(result.data.message)
      }

      return result.data.value
   }

   async withCompensation(): Promise<void> {
      this.logger.log(`${this.name} withCompensation`, {
         trace: this.compensationArg.traceId
      })

      await this.producer.produce<AddFlightJournalReq>(
         Topic.FLIGHT_JOURNAL_COMPENSATION,
         this.compensationArg
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

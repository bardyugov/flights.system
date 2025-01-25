import {
   AddFlightJournalReq,
   error,
   InjectServices,
   KafkaRequest,
   KafkaResult,
   MyLoggerService,
   ok
} from '@flights.system/shared'
import { IFlightsJournalService } from '../../../application/services/flights.journal.service'
import { Inject, Provider } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FlightJournalEntity } from '../../entities/flight.journal.entity'
import { Repository } from 'typeorm'
import { ClientEntity } from '../../entities/client.entity'

class FlightsJournalService implements IFlightsJournalService {
   constructor(
      @Inject(FlightsJournalService.name)
      private readonly logger: MyLoggerService,
      @InjectRepository(FlightJournalEntity)
      private readonly flightJournalEntityRepository: Repository<FlightJournalEntity>,
      @InjectRepository(ClientEntity)
      private readonly clientRepository: Repository<ClientEntity>
   ) {}

   async addFlight(
      req: KafkaRequest<AddFlightJournalReq>
   ): Promise<KafkaResult<string>> {
      const { clientId, flightId } = req.data

      const existFlight = await this.flightJournalEntityRepository.findOne({
         where: {
            client: {
               id: clientId
            },
            flightId
         }
      })
      if (!existFlight) {
         this.logger.warn('You already registered', { trace: req.traceId })
         return error('You already registered', req.traceId)
      }

      const client = await this.clientRepository.findOne({
         where: {
            id: clientId
         }
      })
      if (!client) {
         this.logger.warn('Client already exists', { trace: req.traceId })
         return error('Client already exists', req.traceId)
      }

      await this.flightJournalEntityRepository
         .createQueryBuilder()
         .insert()
         .into(FlightJournalEntity)
         .values({
            client: client,
            flightId: flightId
         })
         .execute()

      this.logger.log('Success add in FlightJournal', { trace: req.traceId })
      return ok('Success add in FlightJournal', req.traceId)
   }

   async compensateAddedFlight(
      req: KafkaRequest<AddFlightJournalReq>
   ): Promise<void> {
      const { clientId, flightId } = req.data

      const existFlight = await this.flightJournalEntityRepository.findOne({
         where: {
            client: {
               id: clientId
            },
            flightId
         }
      })
      if (!existFlight) {
         this.logger.warn('Not found FlightJournal', { trace: req.traceId })
         return
      }

      await this.flightJournalEntityRepository
         .createQueryBuilder()
         .delete()
         .from(FlightJournalEntity)
         .where('clientId = :clientId', { clientId })
         .andWhere('flightId = :flightId', { flightId })
         .execute()

      this.logger.log('Success delete in FlightJournal', { trace: req.traceId })
   }
}

const FlightJournalServiceProvider: Provider = {
   provide: InjectServices.FlightJournalService,
   useClass: FlightsJournalService
}

export { FlightJournalServiceProvider, FlightsJournalService }

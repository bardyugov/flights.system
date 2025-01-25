import {
   error,
   InjectServices,
   KafkaRequest,
   KafkaResult,
   MyLoggerService,
   ok,
   ReservationPlaceReq,
   ReservationPlaceRes
} from '@flights.system/shared'
import { Inject, Provider } from '@nestjs/common'
import { DataSource, EntityManager } from 'typeorm'
import { IFlightsService } from '../../../application/services/flights.service'
import { FlightEntity } from '../../entities/flight.entity'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'

class FlightsService implements IFlightsService {
   constructor(
      @Inject(FlightsService.name)
      private readonly logger: MyLoggerService,
      private readonly dataSource: DataSource,
      @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
   ) {}

   private buildFlightCacheKey(from: string, to: string) {
      return `${from}-${to}`
   }

   private async tryFindFlight(
      from: string,
      to: string,
      transactionManager: EntityManager
   ) {
      const key = this.buildFlightCacheKey(from, to)

      const cacheFlight = this.cacheManager.get<FlightEntity>(key)
      if (cacheFlight) {
         return cacheFlight
      }

      const flight = await transactionManager
         .getRepository(FlightEntity)
         .findOne({
            where: {
               from: {
                  name: from
               },
               to: {
                  name: to
               }
            }
         })
      if (flight) {
         await this.cacheManager.set(key, flight, 1000)
         return flight
      }

      return null
   }

   reservePlace(
      req: KafkaRequest<ReservationPlaceReq>
   ): Promise<KafkaResult<ReservationPlaceRes>> {
      return this.dataSource.transaction(async transactionManager => {
         const { from, to } = req.data
         const flight = await this.tryFindFlight(from, to, transactionManager)
         if (!flight) {
            this.logger.warn('Not found flight', { trace: req.traceId })
            return error('Not found flight', req.traceId)
         }

         if (flight.remainingPlaces === 0) {
            this.logger.warn('All places already busy', { trace: req.traceId })
            return error('All places already busy', req.traceId)
         }

         const decrementPlace = flight.remainingPlaces === 300 ? 3 : 1

         await transactionManager
            .createQueryBuilder()
            .update()
            .set({ remainingPlaces: flight.remainingPlaces - decrementPlace })
            .where('id = :id', { id: flight.id })
            .execute()

         this.logger.log('Success registration', { trace: req.traceId })
         return ok<ReservationPlaceRes>({ flightId: flight.id }, req.traceId)
      })
   }

   compensateReservedPlace(
      req: KafkaRequest<ReservationPlaceReq>
   ): Promise<void> {
      return this.dataSource.transaction(async transactionManager => {
         const { from, to } = req.data
         const flight = await this.tryFindFlight(from, to, transactionManager)
         if (!flight) {
            this.logger.warn('Not found flight', { trace: req.traceId })
            return
         }

         const incrementPlaces = flight.remainingPlaces === 297 ? 3 : 1

         await transactionManager
            .createQueryBuilder()
            .update()
            .set({ remainingPlaces: flight.remainingPlaces + incrementPlaces })
            .where('id = :id', { id: flight.id })
            .execute()

         this.logger.log('Success registration', { trace: req.traceId })
      })
   }
}

const FlightServiceProvider: Provider = {
   provide: InjectServices.FlightsService,
   useClass: FlightsService
}

export { FlightServiceProvider, FlightsService }

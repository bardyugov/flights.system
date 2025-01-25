import {
   Column,
   Entity,
   JoinColumn,
   ManyToOne,
   PrimaryGeneratedColumn
} from 'typeorm'
import { ClientEntity } from './client.entity'

@Entity('flight-journal')
class FlightJournalEntity {
   @PrimaryGeneratedColumn()
   id: number

   @Column({
      name: 'flight_id',
      nullable: false
   })
   flightId: number

   @ManyToOne(() => ClientEntity, entity => entity.flightJournalEntity, {
      nullable: false
   })
   @JoinColumn({
      name: 'client_id',
      referencedColumnName: 'id'
   })
   client: ClientEntity

   @Column({
      name: 'create_at',
      nullable: false,
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
   })
   createAt: Date
}

export { FlightJournalEntity }

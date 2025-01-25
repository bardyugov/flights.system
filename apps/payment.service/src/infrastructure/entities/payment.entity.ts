import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('payment')
class PaymentEntity {
   @PrimaryGeneratedColumn()
   id: number

   @Column({
      name: 'flight_id',
      nullable: false
   })
   flightId: number

   @Column({
      name: 'client_id',
      nullable: false
   })
   clientId: number

   @Column({
      name: 'create_at',
      nullable: false,
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
   })
   createAt: Date

   @Column({
      name: 'amount',
      nullable: false
   })
   amount: number

   constructor(flightId: number, clientId: number, amount: number) {
      this.flightId = flightId
      this.clientId = clientId
      this.amount = amount
   }
}

export { PaymentEntity }

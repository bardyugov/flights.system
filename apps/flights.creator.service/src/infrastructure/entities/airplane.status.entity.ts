import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { AirplaneEntity } from './airplane.entity'

enum FlightStatusEnum {
   InFlight = 'in_flight',
   Broken = 'broken',
   Refueling = 'refueling',
   InParking = 'in_parking'
}

@Entity('airplane_status')
class AirplaneStatusEntity {
   @PrimaryGeneratedColumn({ name: 'id' })
   id: number

   @Column({
      name: 'status',
      type: 'enum',
      nullable: false,
      enum: FlightStatusEnum,
      default: FlightStatusEnum.InParking,
      unique: true
   })
   status: FlightStatusEnum

   @Column({
      name: 'create_at',
      nullable: false,
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
   })
   createAt: Date

   @OneToMany(() => AirplaneEntity, airplane => airplane.currentCity)
   airplanes: AirplaneEntity[]

   constructor(status: FlightStatusEnum) {
      this.status = status
   }
}

export { AirplaneStatusEntity, FlightStatusEnum }

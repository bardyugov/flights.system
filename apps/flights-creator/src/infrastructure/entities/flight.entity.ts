import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from 'typeorm'
import { CityEntity } from './city.entity'

@Entity('flight')
class FlightEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @ManyToOne(() => CityEntity, city => city.flightsFrom, {
        nullable: false
    })
    from: CityEntity

    @ManyToOne(() => CityEntity, city => city.flightsTo, {
        nullable: false
    })
    to: CityEntity

    @Column({
        name: 'create_at',
        nullable: false,
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createAt: Date

    @Column({ name: 'landing_time', type: 'timestamp', nullable: false })
    landingTime: Date

    @Column({ name: 'departure_time', type: 'timestamp', nullable: false })
    departureTime: Date
}

export { FlightEntity }

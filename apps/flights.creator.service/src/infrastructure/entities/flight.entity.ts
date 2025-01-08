import {
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Entity,
    JoinColumn
} from 'typeorm'
import { CityEntity } from './city.entity'

@Entity('flight')
class FlightEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @ManyToOne(() => CityEntity, city => city.flightsFrom, {
        nullable: false
    })
    @JoinColumn({
        name: 'from_city_id',
        referencedColumnName: 'id'
    })
    from: CityEntity

    @ManyToOne(() => CityEntity, city => city.flightsFrom, {
        nullable: false
    })
    @JoinColumn({
        name: 'to_city_id',
        referencedColumnName: 'id'
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

    constructor(
        from: CityEntity,
        to: CityEntity,
        landingTime: Date,
        departureTime: Date
    ) {
        this.from = from
        this.to = to
        this.landingTime = landingTime
        this.departureTime = departureTime
    }
}

export { FlightEntity }

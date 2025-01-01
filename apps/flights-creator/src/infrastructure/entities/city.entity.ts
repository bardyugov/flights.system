import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { FlightEntity } from './flight.entity'

@Entity({ name: 'city' })
class CityEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'name', nullable: false })
    name: string

    @Column({ name: 'country', nullable: false })
    country: string

    @Column({
        name: 'create_at',
        nullable: false,
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createAt: Date

    @OneToMany(() => FlightEntity, flight => flight.from)
    flightsFrom: FlightEntity[]

    @OneToMany(() => FlightEntity, flight => flight.to)
    flightsTo: FlightEntity[]

    constructor(name: string, country: string) {
        this.name = name
        this.country = country
    }
}

export { CityEntity }

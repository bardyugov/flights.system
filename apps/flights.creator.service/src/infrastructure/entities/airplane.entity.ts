import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm'
import { AirplaneStatusEntity } from './airplane.status.entity'
import { CityEntity } from './city.entity'

@Entity('airplane')
class AirplaneEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'PID', nullable: false })
    pid: number

    @Column({ name: 'amount_places', nullable: false })
    amountPlaces: number

    @Column({
        name: 'create_at',
        nullable: false,
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createAt: Date

    @ManyToOne(() => AirplaneStatusEntity, status => status.airplanes, {
        nullable: false
    })
    @JoinColumn({
        name: 'status_id',
        referencedColumnName: 'id'
    })
    status: AirplaneStatusEntity

    @ManyToOne(() => CityEntity, city => city.airplanes, {
        nullable: false
    })
    @JoinColumn({
        name: 'current_city_id',
        referencedColumnName: 'id'
    })
    currentCity: CityEntity
}

export { AirplaneEntity }

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('user')
class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    age: number
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('qualification')
class QualificationEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({
    name: 'name',
    nullable: false
  })
  name: string

  @Column({
    name: 'airplane_id',
    nullable: false
  })
  airplaneId: number

  @Column({
    name: 'create_at',
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createAt: Date
}

export { QualificationEntity }

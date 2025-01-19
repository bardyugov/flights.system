import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

enum ClientTypeEnum {
  Basic = 'basic',
  Priority = 'priority',
  VIP = 'vip'
}

@Entity('client')
class ClientEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({ name: 'name', nullable: false })
  name: string

  @Column({ name: 'surname', nullable: false })
  surname: string

  @Column({ name: 'last_name', nullable: false })
  lastName: string

  @Column({
    name: 'birth_date',
    nullable: false,
    type: 'timestamp'
  })
  birthDate: Date

  @Column({
    name: 'create_at',
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createAt: Date

  @Column({
    name: 'type',
    type: 'enum',
    nullable: false,
    enum: ClientTypeEnum,
    default: ClientTypeEnum.Basic
  })
  type: ClientTypeEnum

  @Column({ name: 'password', nullable: false })
  password: string

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string
}

export { ClientEntity }

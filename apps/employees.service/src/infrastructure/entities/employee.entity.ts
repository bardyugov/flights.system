import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, Check } from 'typeorm'
import { EmployeeStatusEntity } from './employee.status.entity'
import { QualificationEntity } from './qulification.entity'

enum EmployeeTypeEnum {
  Pilot = 'pilot',
  Stewardess = 'stewardess'
}

@Entity('employee')
class EmployeeEntity {
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
    name: 'flights_hours',
    nullable: false
  })
  flightsHours: number

  @ManyToOne(() => EmployeeStatusEntity, entity => entity.employees)
  status: EmployeeStatusEntity

  @Column({
    name: 'type',
    type: 'enum',
    nullable: false,
    enum: EmployeeTypeEnum
  })
  type: EmployeeTypeEnum

  @ManyToMany(() => QualificationEntity, {})
  @JoinTable({
    name: 'employee_to_qualification',
    joinColumn: {
      name: 'qualification_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'employee_id',
      referencedColumnName: 'id'
    }
  })
  @Check(`"type" = 'pilot'`)
  qualifications: QualificationEntity[]

  @Column({ name: 'password', nullable: false })
  password: string

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string
}

export { EmployeeEntity, EmployeeTypeEnum }

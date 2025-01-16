import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { EmployeeEntity } from './employee.entity'

enum EmployeeStatusEnum {
  Working = 'working',
  Relaxing = 'relaxing'
}

@Entity('employee_status')
class EmployeeStatusEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number

  @Column({
    name: 'status',
    type: 'enum',
    nullable: false,
    enum: EmployeeStatusEnum,
    default: EmployeeStatusEnum.Working,
    unique: true
  })
  status: EmployeeStatusEnum

  @Column({
    name: 'create_at',
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createAt: Date

  @OneToMany(() => EmployeeEntity, entity => entity.status)
  employees: EmployeeEntity[]
}

export { EmployeeStatusEntity, EmployeeStatusEnum }

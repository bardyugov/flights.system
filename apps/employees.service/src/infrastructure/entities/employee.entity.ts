import {
   Column,
   Entity,
   PrimaryGeneratedColumn,
   ManyToOne,
   JoinColumn,
   OneToMany
} from 'typeorm'
import { EmployeeStatusEntity } from './employee.status.entity'
import { QualificationToEmployeeEntity } from './qualification.to.employee.entity'

enum EmployeeRoleEnum {
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
      nullable: false,
      default: 0
   })
   flightsHours: number

   @ManyToOne(() => EmployeeStatusEntity, entity => entity.employees, {
      nullable: false
   })
   @JoinColumn({
      name: 'status_id',
      referencedColumnName: 'id'
   })
   status: EmployeeStatusEntity

   @Column({
      name: 'role',
      type: 'enum',
      nullable: false,
      enum: EmployeeRoleEnum
   })
   role: EmployeeRoleEnum

   @Column({ name: 'password', nullable: false })
   password: string

   @Column({ name: 'refresh_token', nullable: true })
   refreshToken: string

   @OneToMany(() => QualificationToEmployeeEntity, entity => entity.employee)
   qualificationToEmployees: QualificationToEmployeeEntity[]
}

export { EmployeeEntity, EmployeeRoleEnum }

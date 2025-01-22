import {
   Column,
   Entity,
   PrimaryGeneratedColumn,
   ManyToOne,
   ManyToMany,
   JoinTable,
   Check,
   JoinColumn
} from 'typeorm'
import { EmployeeStatusEntity } from './employee.status.entity'
import { QualificationEntity } from './qulification.entity'

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
   qualifications: QualificationEntity[]

   @Column({ name: 'password', nullable: false })
   password: string

   @Column({ name: 'refresh_token', nullable: false })
   refreshToken: string
}

export { EmployeeEntity, EmployeeRoleEnum }

import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { EmployeeEntity } from './employee.entity'
import { QualificationEntity } from './qulification.entity'

@Entity('qualification_to_employee')
class QualificationToEmployeeEntity {
   @PrimaryGeneratedColumn()
   id: number

   @ManyToOne(() => EmployeeEntity, entity => entity.qualificationToEmployees, {
      nullable: false
   })
   @JoinColumn({
      name: 'employee_id',
      referencedColumnName: 'id'
   })
   employee: EmployeeEntity

   @ManyToOne(
      () => QualificationEntity,
      entity => entity.qualificationToEmployees,
      {
         nullable: false
      }
   )
   @JoinColumn({
      name: 'qualification_id',
      referencedColumnName: 'id'
   })
   qualification: QualificationEntity
}

export { QualificationToEmployeeEntity }

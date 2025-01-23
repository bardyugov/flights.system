import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { QualificationToEmployeeEntity } from './qualification.to.employee.entity'

@Entity('qualification')
class QualificationEntity {
   @PrimaryGeneratedColumn({ name: 'id' })
   id: number

   @Column({
      name: 'name',
      nullable: false,
      unique: true
   })
   name: string

   @Column({
      name: 'airplane_id',
      nullable: false,
      unique: true
   })
   airplaneId: number

   @Column({
      name: 'create_at',
      nullable: false,
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP'
   })
   createAt: Date

   @OneToMany(
      () => QualificationToEmployeeEntity,
      entity => entity.qualification
   )
   qualificationToEmployees: QualificationToEmployeeEntity[]
}

export { QualificationEntity }

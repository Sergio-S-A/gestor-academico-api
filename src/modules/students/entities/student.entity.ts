import { Entity, Column, OneToMany } from 'typeorm';
import { PersonBaseEntity } from '../../../common/entities/person.base.entity';
import { Enrollment } from 'src/modules/enrollments/entities/enrollment.entity';

@Entity('alumnos')
export class Student extends PersonBaseEntity {
    @Column('varchar', { unique: true, length: 20 })
    codigo: string;

    @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
    enrollments: Enrollment[];
}
import { Entity, Column, OneToMany } from 'typeorm';
import { PersonBaseEntity } from '../../../common/entities/person.base.entity';
import { Course } from 'src/modules/courses/entities/course.entity';

@Entity('profesores')
export class Professor extends PersonBaseEntity {
    @Column('varchar', { length: 50, nullable: true })
    especialidad: string;

    @OneToMany(() => Course, (course) => course.professor)
    courses: Course[];
}
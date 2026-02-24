import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';
import { ENROLLMENT_STATE } from 'src/common/enums/enrollment_state';

@Entity('matriculas')
export class Enrollment {

    @PrimaryGeneratedColumn()
    id: number;


    @CreateDateColumn({ 
        name: 'fecha_inscripcion' 
    })
    enrollmentDate: Date;


    @Column('float', {
        nullable: true,
        name: 'nota_final'
    })
    finalGrade: number;


    @Column({
        type: 'enum',
        enum: ENROLLMENT_STATE,
        default: ENROLLMENT_STATE.INSCRITO
    })
    state: ENROLLMENT_STATE;


    @ManyToOne(() => Student, (student) => student.enrollments)
    @JoinColumn({ name: 'alumno_id' })
    student: Student;


    @ManyToOne(() => Course, (course) => course.enrollments)
    @JoinColumn({ name: 'curso_id' })
    course: Course;
}
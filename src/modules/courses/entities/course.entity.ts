import { ApiProperty } from '@nestjs/swagger';
import { Enrollment } from 'src/modules/enrollments/entities/enrollment.entity';
import { Professor } from 'src/modules/professor/entities/professor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';

@Entity('cursos')
export class Course {
    @ApiProperty({
        example: 1,
        description: 'Identificador único autogenerado'
    })
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 100 })
    nombre: string;

    @Column('text', { nullable: true })
    descripcion: string;

    @Column('boolean', { default: true })
    estado: boolean;

    @Column('int', { default: 1 })
    creditos: number;

    @ManyToOne(() => Professor, (professor) => professor.courses)
    @JoinColumn({ name: 'profesor_id' })
    professor: Professor;

    @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
    enrollments: Enrollment[];
}
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class PersonBaseEntity {

    @ApiProperty({
        example: 1,
        description: 'Identificador único autogenerado'
    })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 100 })
    nombres: string;

    @Column('varchar', { length: 100 })
    apellidos: string;

    @Column('varchar', { unique: true, length: 150 })
    email: string;

    @Column('varchar', { unique: true, length: 20 })
    dni: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
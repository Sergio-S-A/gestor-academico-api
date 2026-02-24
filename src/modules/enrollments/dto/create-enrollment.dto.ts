import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive, Max, Min } from 'class-validator';
import { ENROLLMENT_STATE  } from 'src/common/enums/enrollment_state';
import { toFloat, toInt, toLowerCase, trimString } from 'src/common/utils/transformers.util';

export class CreateEnrollmentDto {

    @ApiProperty({
        example: 1,
        description: 'ID del estudiante registrado en el curso'
    })
    @IsNumber()
    @IsPositive()
    @Transform(toInt)
    studentId: number;


    @ApiProperty({
        example: 1,
        description: 'ID del curso llevado por el estudiante'
    })
    @IsNumber()
    @IsPositive()
    @Transform(toInt)
    courseId: number;


    @ApiProperty({
        description: 'Estado de la matricula'
    })
    @Transform(toLowerCase)
    @IsEnum(ENROLLMENT_STATE)    
    state: ENROLLMENT_STATE;


    @ApiProperty({
        example: '18',
        description: 'Nota final del estudiante lograda en el curso (rango de 0 a 20)'
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(20)
    @Transform(toFloat)
    notaFinal?: number; 
}
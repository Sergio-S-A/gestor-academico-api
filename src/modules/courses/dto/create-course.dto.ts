import { IsString, IsInt, IsOptional, IsPositive, MinLength, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer'
import { toBoolean, toInt, trimString } from 'src/common/utils/transformers.util';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {

    @ApiProperty({
        example: 'Analisis y Diseño de Sistemas I',
        description: 'Nombre del curso'
    })
    @IsString()
    @MinLength(3)
    @Transform(trimString)
    nombre: string;

    @ApiProperty({ 
        example: 'Cuso teorico-practico',
        description: 'Descripcion general del curso'
    })
    @IsString()
    @IsOptional()
    @Transform(trimString) 
    descripcion?: string;

    @ApiProperty({ 
        example: 4, 
        description: 'Numero entero de creditos que vale el curso'
    })
    @IsInt()
    @IsPositive()
    @Transform(toInt)
    creditos: number;

    @ApiProperty({ 
        example: true, 
        description: 'Estado de activacion del curso true (activo) o false (inactivo)'
    })
    @IsBoolean()
    @IsOptional()
    @Transform(toBoolean)
    estado?: boolean;

    @ApiProperty({
        example: 1,
        description: 'ID del profesor encargado del curso (debe existir en BD)',
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Transform(toInt)
    professorId?: number;
}
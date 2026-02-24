import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength, IsOptional, MaxLength } from 'class-validator';
import { normalizeEmail, trimString } from '../utils/transformers.util';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {

    @ApiProperty({
        example: 'Juan',
        description: 'Nombre de la persona'
    })
    @IsString()
    @MinLength(2)
    @Transform(trimString)
    nombres: string;

    @ApiProperty({
        example: 'Lopez',
        description: 'Apellido de la persona'
    })
    @IsString()
    @MinLength(2)
    @Transform(trimString)
    apellidos: string;

    @ApiProperty({ 
        example: 'juan@email.com', 
        description: 'Email de la persona, se parsea todo a minusculas'
    })
    @IsEmail()
    @Transform(normalizeEmail)
    email: string;

    @ApiProperty({ 
        example: '62840183',
        description: 'DNI de la persona, solo 8 digitos admitidos'
    })
    @IsString()
    @MinLength(8)
    @MaxLength(8)
    @Transform(trimString)
    dni: string;

    @ApiProperty({ 
        example: '+51 93893500',
        description: 'Numero de telefono de la persona en formato internacional' 
    })
    @IsOptional()
    @IsString()
    @Transform(trimString)
    telefono?: string;
}
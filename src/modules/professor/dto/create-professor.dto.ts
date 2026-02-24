import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { CreatePersonDto } from "src/common/dto/create-person.dto";
import { trimString } from "src/common/utils/transformers.util";

export class CreateProfessorDto extends CreatePersonDto{

    @ApiProperty({
        example: 'Analisis de Sistemas',
        description: 'Especialidad generica opcional que dicta el profesor'
    })
    @IsString()
    @IsOptional()
    @Transform(trimString)
    especialidad?: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, MaxLength, MinLength } from "class-validator";
import { CreatePersonDto } from "src/common/dto/create-person.dto";
import { trimString } from "src/common/utils/transformers.util";

export class CreateStudentDto extends CreatePersonDto {

    @ApiProperty({
        description: 'Código único del estudiante',
        example: 'ST-2024-001'
    })
    @IsString()
    @MinLength(3)
    @Transform(trimString)
    codigo: string;
}

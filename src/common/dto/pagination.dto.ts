import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {

    @ApiProperty({
        description:'Limte de elementos mostrados por pagina'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number) 
    limit?: number;

    @ApiProperty({
        description: 'Pagina actual en la que se encuentra'
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    offset?: number;
}
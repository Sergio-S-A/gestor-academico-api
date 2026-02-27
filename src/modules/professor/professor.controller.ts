import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, MaxFileSizeValidator, ParseFilePipe, ParseIntPipe, Query, FileTypeValidator, BadRequestException } from '@nestjs/common';
import { ProfessorsService } from './professor.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Professors')
@Controller('professors')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorsService) { }

  @Post()
  async create(@Body() createProfessorDto: CreateProfessorDto) {
    return await this.professorService.create(createProfessorDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.professorService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.professorService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfessorDto: UpdateProfessorDto,
  ) {
    return await this.professorService.update(id, updateProfessorDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.professorService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file.originalname.match(/\.(xlsx|csv)$/i)) {
      throw new BadRequestException('Invalid file type');
    }

    return await this.professorService.createMany(file);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, ParseIntPipe, UploadedFile, ParseFilePipe, UseInterceptors, MaxFileSizeValidator, FileTypeValidator, BadRequestException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('estado') estado?: string,
  ) {
    const isActive = estado === 'true' ? true : estado === 'false' ? false : undefined;
    return this.coursesService.findAll(paginationDto, isActive);
  }

  @Put(':courseId/assign-professor/:professorId')
  assignProfessor(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('professorId', ParseIntPipe) professorId: number,
  ) {
    return this.coursesService.assignProfessor(courseId, professorId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
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

    return this.coursesService.createMany(file);
  }
}

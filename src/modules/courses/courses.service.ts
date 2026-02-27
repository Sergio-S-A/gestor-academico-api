import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Professor } from '../professor/entities/professor.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BulkImportService } from 'src/common/services/bulk-import.service';
import { PaginatedResult } from 'src/common/dto/paginated-result.dto';

@Injectable()
export class CoursesService extends BulkImportService<CreateCourseDto> {

  private readonly logger = new Logger('CourseService');

  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {
    super();
  }

  protected getDtoClass() {
    return CreateCourseDto;
  }

  protected async createEntity(dto: CreateCourseDto): Promise<Course> {
    return this.create(dto);
  }


  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const { professorId, ...courseData } = createCourseDto;
      const course = this.courseRepository.create(courseData);

      if (professorId) {
        course.professor = { id: professorId } as Professor;
      }

      return await this.courseRepository.save(course);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  async findAll(paginationDto: PaginationDto, estado?: boolean): Promise<PaginatedResult<Course>> {
    const { limit = 10, offset = 0 } = paginationDto;

    const queryOptions: FindManyOptions<Course> = {
      relations: ['professor'],
      take: limit,
      skip: offset
    };

    if (estado !== undefined) {
      queryOptions.where = { estado };
    }

    const [data, total] = await this.courseRepository.findAndCount(queryOptions);

    return {
      data,
      meta: {
        total,
        limit,
        offset,
      }
    };
  }


  async assignProfessor(courseId: number, professorId: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    course.professor = { id: professorId } as Professor;
    return await this.courseRepository.save(course);
  }


  async findOne(courseId: number): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['professor'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    return course;
  }


  async update(courseId: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseRepository.preload({
      id: courseId,
      ...updateCourseDto,
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    try {
      return await this.courseRepository.save(course);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  async remove(courseId: number): Promise<{ message: string }> {
    const course = await this.findOne(courseId);
    await this.courseRepository.remove(course);
    return { message: `Course with ID ${courseId} deleted successfully` };
  }


  private handleDBExceptions(error: any): never {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException(error.sqlMessage);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

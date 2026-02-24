import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BulkImportService } from 'src/common/services/bulk-import.service';

@Injectable()
export class StudentsService extends BulkImportService<CreateStudentDto> {

  private readonly logger = new Logger('StudentService');

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {
    super();
  }

  protected getDtoClass() {
    return CreateStudentDto;
  }

  protected async createEntity(dto: CreateStudentDto): Promise<Student> {
    return this.create(dto);
  }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const student = this.studentRepository.create(createStudentDto);
      return await this.studentRepository.save(student);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Student[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.studentRepository.find({
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(studentId: number): Promise<Student> {
    const student = await this.studentRepository.findOneBy({ id: studentId });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return student;
  }

  async update(studentId: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.studentRepository.preload({
      id: studentId,
      ...updateStudentDto,
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    try {
      return await this.studentRepository.save(student);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(studentId: number): Promise<{ message: string }> {
    const student = await this.findOne(studentId);
    await this.studentRepository.remove(student);
    return { message: `Student with ID ${studentId} deleted successfully` };
  }

  private handleDBExceptions(error: any): never {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException(error.sqlMessage);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Course } from '../courses/entities/course.entity';
import { ENROLLMENT_STATE } from 'src/common/enums/enrollment_state';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BulkImportService } from 'src/common/services/bulk-import.service';

@Injectable()
export class EnrollmentsService extends BulkImportService<CreateEnrollmentDto> {

  private readonly logger = new Logger('EnrollmentsService');

  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {
    super();
  }

  protected getDtoClass() {
    return CreateEnrollmentDto;
  }

  protected async createEntity(dto: CreateEnrollmentDto): Promise<Enrollment> {
    return this.create(dto);
  }

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const { studentId, courseId, notaFinal, state } = createEnrollmentDto;

    const student = await this.validationStudent(studentId);

    const course = await this.validationCourse(courseId);

    await this.existingEnrollment(studentId, courseId);

    const enrollment = this.enrollmentRepository.create({
      student,
      course,
      finalGrade: notaFinal,
      state: state || ENROLLMENT_STATE.INSCRITO,
    });

    return await this.enrollmentRepository.save(enrollment);
  }


  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.enrollmentRepository.find({
      take: limit,
      skip: offset,
      relations: ['student', 'course'],
      order: {
        enrollmentDate: 'DESC'
      }
    });
  }

  private async validationStudent(studentId: number): Promise<Student> {
    const student = await this.studentRepository.findOneBy({ id: studentId });
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }
    return student;
  }


  private async validationCourse(courseId: number): Promise<Course> {
    const course = await this.courseRepository.findOneBy({ id: courseId });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    return course;
  }


  private async existingEnrollment(studentId: number, courseId: number) {
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        student: { id: studentId },
        course: { id: courseId },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Student is already enrolled in this course');
    }

  }


  async findOne(id: number): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: ['student', 'course'],
    });

    if (!enrollment) throw new NotFoundException(`Enrollment with ID ${id} not found`);
    return enrollment;
  }


  async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto): Promise<Enrollment> {

    const enrollment = await this.enrollmentRepository.preload({
      id,
      ...updateEnrollmentDto,
    });

    if (!enrollment) throw new NotFoundException(`Enrollment with ID ${id} not found`);

    try {
      return await this.enrollmentRepository.save(enrollment);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const enrollment = await this.findOne(id);
    await this.enrollmentRepository.remove(enrollment);
    return { message: `Enrollment with ID ${id} deleted successfully` };
  }


  private handleDBExceptions(error: any): never {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException(error.sqlMessage);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}


import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StudentsService } from '../students/students.service';
import { CoursesService } from '../courses/courses.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { Student } from '../students/entities/student.entity';
import { Course } from '../courses/entities/course.entity';
import { INITIAL_COURSES, INITIAL_PROFESSORS, INITIAL_STUDENTS } from './data/initial-data';
import { ENROLLMENT_STATE } from 'src/common/enums/enrollment_state';
import { ProfessorsService } from '../professor/professor.service';
import { Professor } from '../professor/entities/professor.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly professorsService: ProfessorsService,
    private readonly studentsService: StudentsService,
    private readonly coursesService: CoursesService,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly configService: ConfigService,
  ) { }


  async runSeed(): Promise<string> {
    const mode = this.configService.get('NODE_ENV');

    if (mode === 'prod') {
      throw new UnauthorizedException('Seed can only be executed in development mode');
    }

    const professors = await this.seedProfessors();
    const courses = await this.seedCourses(professors);
    const students = await this.seedStudents();

    await this.seedEnrollments(students, courses);

    return 'SEED EXECUTED SUCCESSFULLY';
  }


  private async seedProfessors(): Promise<Professor[]> {
    const createdProfessors: Professor[] = [];

    for (const professorData of INITIAL_PROFESSORS) {
      const professor = await this.professorsService.create(professorData);
      createdProfessors.push(professor);
    }

    return createdProfessors;
  }


  private async seedStudents(): Promise<Student[]> {
    const createdStudents: Student[] = [];

    for (const studentData of INITIAL_STUDENTS) {
      const student = await this.studentsService.create(studentData);
      createdStudents.push(student);
    }

    return createdStudents;
  }


  private async seedCourses(professors: Professor[]): Promise<Course[]> {
    if (!professors.length) {
      throw new Error('No professors available to assign courses');
    }

    const createdCourses: Course[] = [];

    for (const [index, courseData] of INITIAL_COURSES.entries()) {

      const assignedProfessor = professors[index % professors.length];

      const course = await this.coursesService.create({
        ...courseData,
        professorId: assignedProfessor.id,
      });

      createdCourses.push(course);
    }

    return createdCourses;
  }


  private async seedEnrollments(students: Student[], courses: Course[]) {
    if (this.shouldSkipEnrollment(students, courses)) return;

    await this.seedActiveEnrollment(students, courses);
    
    await this.seedCompletedEnrollment(students, courses);
    
    await this.seedWithdrawnEnrollment(students, courses);
  }

  private shouldSkipEnrollment(students: Student[], courses: Course[]): boolean {
    return students.length < 2 || courses.length < 2;
  }

  private async seedActiveEnrollment(students: Student[], courses: Course[]) {
    const firstStudent = students[0];
    const firstCourse = courses[0];

    await this.enrollmentsService.create({
      studentId: firstStudent.id,
      courseId: firstCourse.id,
      state: ENROLLMENT_STATE.INSCRITO,
    });
  }

  private async seedCompletedEnrollment(students: Student[], courses: Course[]) {
    const firstStudent = students[0];
    const secondCourse = courses[1];

    await this.enrollmentsService.create({
      studentId: firstStudent.id,
      courseId: secondCourse.id,
      state: ENROLLMENT_STATE.COMPLETADO,
      notaFinal: 18,
    });
  }

  private async seedWithdrawnEnrollment(students: Student[], courses: Course[]) {
    const secondStudent = students[1];
    const secondCourse = courses[1];

    await this.enrollmentsService.create({
      studentId: secondStudent.id,
      courseId: secondCourse.id,
      state: ENROLLMENT_STATE.RETIRADO,
      notaFinal: 10,
    });
  }
}
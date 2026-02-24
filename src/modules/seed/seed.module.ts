import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ConfigModule } from '@nestjs/config';
import { ProfessorModule } from '../professor/professor.module';
import { StudentsModule } from '../students/students.module';
import { CoursesModule } from '../courses/courses.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports:[
    ConfigModule,
    ProfessorModule,
    StudentsModule,
    CoursesModule,
    EnrollmentsModule
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}

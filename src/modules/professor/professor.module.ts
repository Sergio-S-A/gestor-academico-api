import { Module } from '@nestjs/common';
import { ProfessorsService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Professor])
  ],
  controllers: [ProfessorController],
  providers: [ProfessorsService],
  exports: [ProfessorsService] 
})
export class ProfessorModule {}

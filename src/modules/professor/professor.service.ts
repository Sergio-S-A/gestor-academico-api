import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Professor } from "./entities/professor.entity";
import { CreateProfessorDto } from "./dto/create-professor.dto";
import { UpdateProfessorDto } from "./dto/update-professor.dto";
import { Repository } from 'typeorm';
import { PaginationDto } from "src/common/dto/pagination.dto";
import { BulkImportService } from "src/common/services/bulk-import.service";

@Injectable()
export class ProfessorsService extends BulkImportService<CreateProfessorDto> {

  private readonly logger = new Logger('ProfessorService');

  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
  ) {
    super();
  }

  protected getDtoClass() {
    return CreateProfessorDto;
  }

  protected async createEntity(dto: CreateProfessorDto): Promise<Professor> {
    return this.create(dto);
  }


  async create(createProfessorDto: CreateProfessorDto): Promise<Professor> {
    try {
      const professor = this.professorRepository.create(createProfessorDto);
      return await this.professorRepository.save(professor);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  async findAll(paginationDto: PaginationDto): Promise<Professor[]> {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.professorRepository.find({
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });
  }


  async findOne(professorId: number): Promise<Professor> {
    const professor = await this.professorRepository.findOneBy({ id: professorId });

    if (!professor) {
      throw new NotFoundException(`Professor with ID ${professorId} not found`);
    }

    return professor;
  }


  async update(professorId: number, updateProfessorDto: UpdateProfessorDto): Promise<Professor> {
    const professor = await this.professorRepository.preload({
      id: professorId,
      ...updateProfessorDto,
    });

    if (!professor) {
      throw new NotFoundException(`Professor with ID ${professorId} not found`);
    }

    try {
      return await this.professorRepository.save(professor);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  async remove(professorId: number): Promise<{ message: string }> {
    const professor = await this.findOne(professorId);
    await this.professorRepository.remove(professor);
    return { message: `Professor with ID ${professorId} deleted successfully` };
  }


  private handleDBExceptions(error: any): never {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BadRequestException(error.sqlMessage);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}

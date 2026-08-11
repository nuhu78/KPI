import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from '../entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
  ) {}

  async create(dto: CreateSectionDto): Promise<Section> {
    await this.assertNameAvailable(dto.name);
    return this.sectionRepository.save(this.sectionRepository.create(dto));
  }

  findAll(): Promise<Section[]> {
    return this.sectionRepository.find({ order: { name: 'ASC' } });
  }

  async update(id: number, dto: UpdateSectionDto): Promise<Section> {
    const section = await this.findOneOrThrow(id);
    if (dto.name && dto.name !== section.name) {
      await this.assertNameAvailable(dto.name);
    }
    section.name = dto.name ?? section.name;
    return this.sectionRepository.save(section);
  }

  async remove(id: number): Promise<void> {
    await this.findOneOrThrow(id);
    await this.sectionRepository.delete(id);
  }

  private async assertNameAvailable(name: string): Promise<void> {
    const existing = await this.sectionRepository.findOneBy({ name });
    if (existing) {
      throw new ConflictException({
        error: 'DUPLICATE_SECTION',
        message: 'A section with this name already exists',
      });
    }
  }

  private async findOneOrThrow(id: number): Promise<Section> {
    const section = await this.sectionRepository.findOneBy({ id });
    if (!section) {
      throw new NotFoundException({
        error: 'SECTION_NOT_FOUND',
        message: 'Section not found',
      });
    }
    return section;
  }
}

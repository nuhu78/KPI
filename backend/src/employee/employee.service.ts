import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { Section } from '../entities/section.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
  ) {}

  async create(
    dto: CreateEmployeeDto,
    uploadedFile?: Express.Multer.File,
  ): Promise<Employee> {
    const existing = await this.employeeRepository.findOneBy({
      employee_code: dto.employee_code,
    });
    if (existing) {
      throw new ConflictException({
        error: 'DUPLICATE_EMPLOYEE_CODE',
        message: 'An employee with this code already exists',
      });
    }

    const section = await this.sectionRepository.findOneBy({
      id: dto.section_id,
    });
    if (!section) {
      throw new NotFoundException({
        error: 'SECTION_NOT_FOUND',
        message: 'Section not found',
      });
    }

    const image_url = uploadedFile
      ? `/uploads/${uploadedFile.filename}`
      : dto.image_url;

    return this.employeeRepository.save(
      this.employeeRepository.create({
        employee_code: dto.employee_code,
        name: dto.name,
        section_id: dto.section_id,
        image_url,
        is_registered: false,
      }),
    );
  }
}

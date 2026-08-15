import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'fs/promises';
import { basename, join } from 'path';
import { Repository } from 'typeorm';
import { Cycle } from '../entities/cycle.entity';
import { Employee } from '../entities/employee.entity';
import { Section } from '../entities/section.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { getUploadsDir } from './multer.config';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Cycle)
    private readonly cycleRepository: Repository<Cycle>,
  ) {}

  findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      relations: { section: true },
      order: { name: 'ASC' },
    });
  }

  async findMe(employeeId: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
      relations: { section: true },
    });
    if (!employee) {
      throw new NotFoundException({
        error: 'EMPLOYEE_NOT_FOUND',
        message: 'Employee not found',
      });
    }
    return employee;
  }

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

  findMyActiveCycle(employeeId: number): Promise<Cycle | null> {
    return this.cycleRepository.findOneBy({
      employee_id: employeeId,
      status: 'active',
    });
  }

  async update(
    id: number,
    dto: UpdateEmployeeDto,
    uploadedFile?: Express.Multer.File,
  ): Promise<Employee> {
    const employee = await this.findOneOrThrow(id);

    if (dto.employee_code && dto.employee_code !== employee.employee_code) {
      const existing = await this.employeeRepository.findOneBy({
        employee_code: dto.employee_code,
      });
      if (existing) {
        throw new ConflictException({
          error: 'DUPLICATE_EMPLOYEE_CODE',
          message: 'An employee with this code already exists',
        });
      }
    }

    let sectionId = employee.section_id;
    if (dto.section_id && dto.section_id !== employee.section_id) {
      const section = await this.sectionRepository.findOneBy({
        id: dto.section_id,
      });
      if (!section) {
        throw new NotFoundException({
          error: 'SECTION_NOT_FOUND',
          message: 'Section not found',
        });
      }
      sectionId = dto.section_id;
    }

    let imageUrl = employee.image_url;
    if (uploadedFile) {
      imageUrl = `/uploads/${uploadedFile.filename}`;
      await this.removeImageFile(employee.image_url);
    } else if (dto.image_url !== undefined) {
      imageUrl = dto.image_url;
    }

    employee.employee_code = dto.employee_code ?? employee.employee_code;
    employee.name = dto.name ?? employee.name;
    employee.section_id = sectionId;
    employee.image_url = imageUrl;

    return this.employeeRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const employee = await this.findOneOrThrow(id);
    await this.cycleRepository.delete({ employee_id: id });
    await this.removeImageFile(employee.image_url);
    await this.employeeRepository.delete(id);
  }

  private async findOneOrThrow(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException({
        error: 'EMPLOYEE_NOT_FOUND',
        message: 'Employee not found',
      });
    }
    return employee;
  }

  private async removeImageFile(imageUrl: string | null): Promise<void> {
    if (!imageUrl?.startsWith('/uploads/')) {
      return;
    }
    const filePath = join(getUploadsDir(), basename(imageUrl));
    try {
      await unlink(filePath);
    } catch {
      // Best-effort: missing/invalid image is not fatal.
    }
  }
}

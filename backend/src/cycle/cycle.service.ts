import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cycle } from '../entities/cycle.entity';
import { Employee } from '../entities/employee.entity';
import { Section } from '../entities/section.entity';
import { CreateBulkCycleDto } from './dto/create-bulk-cycle.dto';
import { CreateCycleDto } from './dto/create-cycle.dto';

@Injectable()
export class CycleService {
  constructor(
    @InjectRepository(Cycle)
    private readonly cycleRepository: Repository<Cycle>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
  ) {}

  async create(dto: CreateCycleDto): Promise<Cycle> {
    await this.assertEmployeeExists(dto.employee_id);
    await this.assertNoActiveCycle(dto.employee_id);
    this.assertValidDates(dto.start_date, dto.end_date);

    return this.cycleRepository.save(
      this.cycleRepository.create({
        employee_id: dto.employee_id,
        target_files: dto.target_files,
        start_date: dto.start_date,
        end_date: dto.end_date,
        status: 'active',
        completed_files: 0,
      }),
    );
  }

  async createBulk(
    dto: CreateBulkCycleDto,
  ): Promise<{ message: string; assigned: number; skipped: number }> {
    const section = await this.sectionRepository.findOneBy({
      id: dto.section_id,
    });
    if (!section) {
      throw new NotFoundException({
        error: 'SECTION_NOT_FOUND',
        message: 'Section not found',
      });
    }

    this.assertValidDates(dto.start_date, dto.end_date);

    const employees = await this.employeeRepository.find({
      where: { section_id: dto.section_id },
    });

    let assigned = 0;
    let skipped = 0;

    for (const employee of employees) {
      if (await this.hasActiveCycle(employee.id)) {
        skipped += 1;
        continue;
      }
      await this.cycleRepository.save(
        this.cycleRepository.create({
          employee_id: employee.id,
          target_files: dto.target_files,
          start_date: dto.start_date,
          end_date: dto.end_date,
          status: 'active',
          completed_files: 0,
        }),
      );
      assigned += 1;
    }

    return {
      message: `Assigned ${assigned} cycle(s); skipped ${skipped} employee(s) with an active cycle`,
      assigned,
      skipped,
    };
  }

  async updateProgress(cycleId: number, employeeId: number): Promise<Cycle> {
    const cycle = await this.cycleRepository.findOneBy({ id: cycleId });
    if (!cycle) {
      throw new NotFoundException('Cycle not found');
    }

    if (cycle.employee_id !== employeeId) {
      throw new ForbiddenException({
        error: 'FORBIDDEN',
        message: 'You can only update your own cycle',
      });
    }

    if (cycle.status !== 'active') {
      throw new BadRequestException({
        error: 'CYCLE_NOT_ACTIVE',
        message: 'This cycle is not active',
      });
    }

    if (cycle.completed_files >= cycle.target_files) {
      throw new BadRequestException({
        error: 'TARGET_EXCEEDED',
        message: 'Target already reached for this cycle',
      });
    }

    cycle.completed_files += 1;
    return this.cycleRepository.save(cycle);
  }

  private async assertEmployeeExists(employeeId: number): Promise<void> {
    const employee = await this.employeeRepository.findOneBy({
      id: employeeId,
    });
    if (!employee) {
      throw new NotFoundException({
        error: 'EMPLOYEE_NOT_FOUND',
        message: 'Employee not found',
      });
    }
  }

  private async assertNoActiveCycle(employeeId: number): Promise<void> {
    if (await this.hasActiveCycle(employeeId)) {
      throw new ConflictException({
        error: 'CYCLE_ALREADY_ACTIVE',
        message: 'This employee already has an active cycle',
      });
    }
  }

  private async hasActiveCycle(employeeId: number): Promise<boolean> {
    const active = await this.cycleRepository.findOneBy({
      employee_id: employeeId,
      status: 'active',
    });
    return !!active;
  }

  private assertValidDates(startDate: string, endDate: string): void {
    if (new Date(endDate) < new Date(startDate)) {
      throw new BadRequestException({
        error: 'VALIDATION_ERROR',
        message: 'end_date must be on or after start_date',
      });
    }
  }
}

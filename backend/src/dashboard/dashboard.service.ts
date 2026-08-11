import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cycle } from '../entities/cycle.entity';
import { Employee } from '../entities/employee.entity';
import { Section } from '../entities/section.entity';

const SCORE_SQL =
  '(c.completed_files::numeric / NULLIF(c.target_files, 0)) * 100';

export interface EmployeeRanking {
  id: number;
  name: string;
  image_url: string | null;
  section_id: number;
  section_name: string;
  completed_files: number;
  target_files: number;
  score: number;
}

export interface SectionRanking {
  id: number;
  name: string;
  average_score: number;
  employee_count: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
  ) {}

  async getEmployeeRankings(): Promise<EmployeeRanking[]> {
    return this.getRankings();
  }

  async getSectionRankings(): Promise<SectionRanking[]> {
    const rows = await this.sectionRepository
      .createQueryBuilder('s')
      .innerJoin(Employee, 'e', 'e.section_id = s.id')
      .innerJoin(
        Cycle,
        'c',
        'c.employee_id = e.id AND c.status = :status',
        { status: 'active' },
      )
      .select([
        's.id AS id',
        's.name AS name',
        `ROUND(AVG(${SCORE_SQL}), 2) AS average_score`,
        'COUNT(DISTINCT e.id) AS employee_count',
      ])
      .groupBy('s.id')
      .addGroupBy('s.name')
      .orderBy('average_score', 'DESC')
      .addOrderBy('s.name', 'ASC')
      .getRawMany();

    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      average_score: Number(row.average_score),
      employee_count: Number(row.employee_count),
    }));
  }

  async getSectionEmployeeRankings(sectionId: number): Promise<EmployeeRanking[]> {
    const section = await this.sectionRepository.findOneBy({ id: sectionId });
    if (!section) {
      throw new NotFoundException({
        error: 'SECTION_NOT_FOUND',
        message: 'Section not found',
      });
    }

    return this.getRankings(sectionId);
  }

  private async getRankings(sectionId?: number): Promise<EmployeeRanking[]> {
    const query = this.employeeRepository
      .createQueryBuilder('e')
      .innerJoin(
        Cycle,
        'c',
        'c.employee_id = e.id AND c.status = :status',
        { status: 'active' },
      )
      .innerJoin(Section, 's', 's.id = e.section_id')
      .select([
        'e.id AS id',
        'e.name AS name',
        'e.image_url AS image_url',
        'e.section_id AS section_id',
        's.name AS section_name',
        'c.completed_files AS completed_files',
        'c.target_files AS target_files',
        `ROUND(${SCORE_SQL}, 2) AS score`,
      ])
      .orderBy('score', 'DESC')
      .addOrderBy('e.name', 'ASC');

    if (sectionId !== undefined) {
      query.where('e.section_id = :sectionId', { sectionId });
    }

    const rows = await query.getRawMany();

    return rows.map((row) => ({
      id: Number(row.id),
      name: row.name,
      image_url: row.image_url ?? null,
      section_id: Number(row.section_id),
      section_name: row.section_name,
      completed_files: Number(row.completed_files),
      target_files: Number(row.target_files),
      score: Number(row.score),
    }));
  }
}

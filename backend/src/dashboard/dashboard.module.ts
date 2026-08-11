import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cycle } from '../entities/cycle.entity';
import { Employee } from '../entities/employee.entity';
import { Section } from '../entities/section.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Section, Cycle])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

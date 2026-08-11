import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Cycle } from '../entities/cycle.entity';
import { Employee } from '../entities/employee.entity';
import { Section } from '../entities/section.entity';
import { CycleController } from './cycle.controller';
import { CycleService } from './cycle.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cycle, Employee, Section]), AuthModule],
  controllers: [CycleController],
  providers: [CycleService],
})
export class CycleModule {}

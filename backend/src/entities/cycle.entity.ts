import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity('cycles')
export class Cycle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  employee_id: number;

  @Column({ type: 'int', default: 0 })
  completed_files: number;

  @Column({ type: 'int' })
  target_files: number;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  final_score: number;

  @CreateDateColumn()
  created_at: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Section } from './section.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  employee_code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ nullable: true, length: 255 })
  image_url: string;

  @ManyToOne(() => Section)
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @Column()
  section_id: number;

  @Column({ nullable: true })
  password_hash: string;

  @Column({ default: false })
  is_registered: boolean;

  @CreateDateColumn()
  created_at: Date;
}

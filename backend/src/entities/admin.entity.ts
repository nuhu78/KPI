import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  admin_id: string;

  @Column()
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;
}

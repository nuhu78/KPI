import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const adminId = this.config.get<string>('ADMIN_SEED_ID')!;
    const password = this.config.get<string>('ADMIN_SEED_PASSWORD')!;

    const existing = await this.adminRepository.findOneBy({
      admin_id: adminId,
    });
    if (existing) {
      this.logger.log(`Admin '${adminId}' already exists, skipping seed`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await this.adminRepository.save(
      this.adminRepository.create({
        admin_id: adminId,
        password_hash: passwordHash,
      }),
    );
    this.logger.log(`Seeded admin account '${adminId}'`);
  }
}

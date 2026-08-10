import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { AdminLoginDto } from './dto/admin-login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface AuthToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async loginAdmin(dto: AdminLoginDto): Promise<AuthToken> {
    const admin = await this.adminRepository.findOneBy({
      admin_id: dto.admin_id,
    });

    if (!admin || !(await bcrypt.compare(dto.password, admin.password_hash))) {
      throw new UnauthorizedException({
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid admin id or password',
      });
    }

    return {
      access_token: this.jwtService.sign({
        sub: admin.id,
        role: 'admin',
      } satisfies JwtPayload),
    };
  }
}

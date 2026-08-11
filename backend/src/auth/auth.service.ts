import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';
import { Employee } from '../entities/employee.entity';
import { AdminLoginDto } from './dto/admin-login.dto';
import { EmployeeLoginDto } from './dto/employee-login.dto';
import { EmployeeRegisterDto } from './dto/employee-register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export interface AuthToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
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

  async registerEmployee(dto: EmployeeRegisterDto): Promise<{
    message: string;
  }> {
    const employee = await this.employeeRepository.findOneBy({
      employee_code: dto.employee_code,
    });

    if (!employee) {
      throw new NotFoundException({
        error: 'EMPLOYEE_NOT_FOUND',
        message: 'No employee matches this code. Ask an admin to add you first',
      });
    }

    if (employee.is_registered) {
      throw new ConflictException({
        error: 'ALREADY_REGISTERED',
        message: 'This employee code is already registered',
      });
    }

    const password_hash = await bcrypt.hash(dto.password, 12);

    await this.employeeRepository.update(employee.id, {
      password_hash,
      is_registered: true,
    });

    return { message: 'Registration successful' };
  }

  async loginEmployee(dto: EmployeeLoginDto): Promise<AuthToken> {
    const employee = await this.employeeRepository.findOneBy({
      employee_code: dto.employee_code,
    });

    if (
      !employee ||
      !employee.is_registered ||
      !employee.password_hash ||
      !(await bcrypt.compare(dto.password, employee.password_hash))
    ) {
      throw new UnauthorizedException({
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid employee code or password',
      });
    }

    return {
      access_token: this.jwtService.sign({
        sub: employee.id,
        role: 'employee',
      } satisfies JwtPayload),
    };
  }
}

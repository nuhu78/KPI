import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService, AuthToken } from './auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { EmployeeLoginDto } from './dto/employee-login.dto';
import { EmployeeRegisterDto } from './dto/employee-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @HttpCode(200)
  loginAdmin(@Body() dto: AdminLoginDto): Promise<AuthToken> {
    return this.authService.loginAdmin(dto);
  }

  @Post('employee/register')
  @HttpCode(201)
  registerEmployee(@Body() dto: EmployeeRegisterDto) {
    return this.authService.registerEmployee(dto);
  }

  @Post('employee/login')
  @HttpCode(200)
  loginEmployee(@Body() dto: EmployeeLoginDto): Promise<AuthToken> {
    return this.authService.loginEmployee(dto);
  }
}

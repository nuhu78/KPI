import { IsNotEmpty, IsString } from 'class-validator';

export class EmployeeLoginDto {
  @IsString()
  @IsNotEmpty()
  employee_code: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

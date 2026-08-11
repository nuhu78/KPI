import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class EmployeeRegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  employee_code: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

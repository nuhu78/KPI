import { IsNotEmpty, IsString } from 'class-validator';

export class AdminLoginDto {
  @IsString()
  @IsNotEmpty()
  admin_id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

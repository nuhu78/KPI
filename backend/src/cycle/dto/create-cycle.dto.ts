import { Type } from 'class-transformer';
import { IsDateString, IsInt, Max, Min } from 'class-validator';

export class CreateCycleDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  employee_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  target_files: number;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;
}

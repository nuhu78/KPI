import { Type } from 'class-transformer';
import { IsDateString, IsInt, Max, Min } from 'class-validator';

export class CreateBulkCycleDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  section_id: number;

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

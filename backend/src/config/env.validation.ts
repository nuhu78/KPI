import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsOptional()
  @IsString()
  DATABASE_URL?: string;

  @IsOptional()
  @IsString()
  DB_HOST?: string;

  @IsOptional()
  @IsString()
  DB_PORT?: string;

  @IsOptional()
  @IsString()
  DB_USERNAME?: string;

  @IsOptional()
  @IsString()
  DB_PASSWORD?: string;

  @IsOptional()
  @IsString()
  DB_DATABASE?: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN: string;

  @IsString()
  @IsNotEmpty()
  ADMIN_SEED_ID: string;

  @IsString()
  @IsNotEmpty()
  ADMIN_SEED_PASSWORD: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: true,
    whitelist: true,
  });

  if (errors.length > 0) {
    const details = errors.map(
      (e) => `${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`,
    );
    throw new Error(`Environment validation failed: ${details.join(' | ')}`);
  }

  if (!config.DATABASE_URL) {
    const dbVars = [
      'DB_HOST',
      'DB_PORT',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_DATABASE',
    ];
    const missing = dbVars.filter((v) => !config[v]);
    if (missing.length > 0) {
      throw new Error(
        `Missing database env vars (DATABASE_URL not set): ${missing.join(', ')}`,
      );
    }
  }

  return validatedConfig;
}

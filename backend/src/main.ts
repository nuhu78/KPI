import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

const uploadsDir = join(process.cwd(), 'src', 'uploads');

async function bootstrap() {
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const message = errors.map((e) =>
          Object.values(e.constraints ?? {}).join(', '),
        );
        return new BadRequestException({
          error: 'VALIDATION_ERROR',
          message,
        });
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validate } from './config/env.validation';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { Admin } from './entities/admin.entity';
import { Cycle } from './entities/cycle.entity';
import { Employee } from './entities/employee.entity';
import { Section } from './entities/section.entity';
import { SectionModule } from './section/section.module';
import { AdminSeeder } from './seeds/admin.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        const synchronize = config.get<string>('NODE_ENV') !== 'production';

        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [Admin, Section, Employee, Cycle],
            synchronize,
          };
        }

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: parseInt(config.get<string>('DB_PORT')!, 10),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),
          entities: [Admin, Section, Employee, Cycle],
          synchronize,
        };
      },
    }),
    TypeOrmModule.forFeature([Admin]),
    AuthModule,
    SectionModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService, AdminSeeder],
})
export class AppModule {}

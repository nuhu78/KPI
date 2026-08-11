import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Section } from '../entities/section.entity';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';

@Module({
  imports: [TypeOrmModule.forFeature([Section]), AuthModule],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule {}

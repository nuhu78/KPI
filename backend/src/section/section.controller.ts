import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionService } from './section.service';

const sectionIdPipe = new ParseIntPipe({
  exceptionFactory: () =>
    new BadRequestException({
      error: 'VALIDATION_ERROR',
      message: 'Section id must be an integer',
    }),
});

@UseGuards(AdminGuard)
@Controller('sections')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  create(@Body() dto: CreateSectionDto) {
    return this.sectionService.create(dto);
  }

  @Get()
  findAll() {
    return this.sectionService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id', sectionIdPipe) id: number,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.sectionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', sectionIdPipe) id: number) {
    return this.sectionService.remove(id);
  }
}

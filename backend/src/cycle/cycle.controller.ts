import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';
import { EmployeeGuard } from '../auth/guards/employee.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CycleService } from './cycle.service';
import { CreateBulkCycleDto } from './dto/create-bulk-cycle.dto';
import { CreateCycleDto } from './dto/create-cycle.dto';

const cycleIdPipe = new ParseIntPipe({
  exceptionFactory: () =>
    new BadRequestException({
      error: 'VALIDATION_ERROR',
      message: 'Cycle id must be an integer',
    }),
});

@Controller('cycles')
export class CycleController {
  constructor(private readonly cycleService: CycleService) {}

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.cycleService.findAll();
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() dto: CreateCycleDto) {
    return this.cycleService.create(dto);
  }

  @UseGuards(AdminGuard)
  @Post('bulk')
  createBulk(@Body() dto: CreateBulkCycleDto) {
    return this.cycleService.createBulk(dto);
  }

  @UseGuards(EmployeeGuard)
  @Patch(':id/progress')
  updateProgress(
    @Param('id', cycleIdPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.cycleService.updateProgress(id, user.sub);
  }

  @UseGuards(EmployeeGuard)
  @Patch(':id/progress/undo')
  undoProgress(
    @Param('id', cycleIdPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.cycleService.undoProgress(id, user.sub);
  }
}

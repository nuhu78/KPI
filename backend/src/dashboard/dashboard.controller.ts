import { BadRequestException, Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

const sectionIdPipe = new ParseIntPipe({
  exceptionFactory: () =>
    new BadRequestException({
      error: 'VALIDATION_ERROR',
      message: 'Section id must be an integer',
    }),
});

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('employees')
  getEmployeeRankings() {
    return this.dashboardService.getEmployeeRankings();
  }

  @Get('sections')
  getSectionRankings() {
    return this.dashboardService.getSectionRankings();
  }

  @Get('sections/:id/employees')
  getSectionEmployeeRankings(@Param('id', sectionIdPipe) id: number) {
    return this.dashboardService.getSectionEmployeeRankings(id);
  }
}

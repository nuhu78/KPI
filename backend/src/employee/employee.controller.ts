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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AdminGuard } from '../auth/guards/admin.guard';
import { EmployeeGuard } from '../auth/guards/employee.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeService } from './employee.service';
import { imageUploadOptions } from './multer.config';

const employeeIdPipe = new ParseIntPipe({
  exceptionFactory: () =>
    new BadRequestException({
      error: 'VALIDATION_ERROR',
      message: 'Employee id must be an integer',
    }),
});

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @UseGuards(AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  create(
    @Body() dto: CreateEmployeeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.employeeService.create(dto, file);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(
    @Param('id', employeeIdPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.employeeService.update(id, dto, file);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id', employeeIdPipe) id: number) {
    return this.employeeService.remove(id);
  }

  @UseGuards(EmployeeGuard)
  @Get('me')
  findMe(@CurrentUser() user: JwtPayload) {
    return this.employeeService.findMe(user.sub);
  }

  @UseGuards(EmployeeGuard)
  @Get('me/active-cycle')
  findMyActiveCycle(@CurrentUser() user: JwtPayload) {
    return this.employeeService.findMyActiveCycle(user.sub);
  }
}

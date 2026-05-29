import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'employees', version: '1' })
export class EmployeesController {
  constructor(private readonly svc: EmployeesService) {}

  @Post() create(@Body() dto: CreateEmployeeDto) { return this.svc.create(dto); }

  @Get()
  @ApiQuery({ name: 'orgId', required: true })
  findAll(@Query('orgId') orgId: string) { return this.svc.findAll(orgId); }

  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateEmployeeDto>) { return this.svc.update(id, dto as any); }

  @Get(':id/reports') directReports(@Param('id') id: string) { return this.svc.findDirectReports(id); }
}

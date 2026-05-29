import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'organizations', version: '1' })
export class OrganizationsController {
  constructor(private readonly svc: OrganizationsService) {}

  @Post() @Roles(UserRole.SUPER_ADMIN) create(@Body() dto: CreateOrganizationDto) { return this.svc.create(dto); }
  @Get() @Roles(UserRole.SUPER_ADMIN) findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(id); }
  @Patch(':id') @Roles(UserRole.ORG_ADMIN, UserRole.SUPER_ADMIN) update(@Param('id') id: string, @Body() dto: Partial<CreateOrganizationDto>) { return this.svc.update(id, dto); }
}

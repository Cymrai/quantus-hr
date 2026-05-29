import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(@InjectRepository(Organization) private readonly repo: Repository<Organization>) {}

  async create(dto: CreateOrganizationDto) {
    const exists = await this.repo.findOne({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException('Organization slug already taken');
    return this.repo.save(this.repo.create(dto));
  }

  findAll() { return this.repo.find({ where: { isActive: true } }); }

  async findOne(id: string) {
    const org = await this.repo.findOne({ where: { id } });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(id: string, data: Partial<Organization>) {
    await this.findOne(id);
    await this.repo.update(id, data);
    return this.findOne(id);
  }
}

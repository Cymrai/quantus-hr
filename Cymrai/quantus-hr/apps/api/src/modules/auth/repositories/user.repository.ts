import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createUser(email: string, password: string, tenantInviteCode: string): Promise<User> {
    const user = this.userRepo.create({ email, password, tenantInviteCode });
    return await this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.userRepo.findOne({ where: { email } });
  }
}
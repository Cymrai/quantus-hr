/**
 * @file user.service.ts
 * @description Service for handling user related operations, including CRUD and other business logic.
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { email } });
  }
}
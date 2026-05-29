import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UserRepository } from '../../user/repositories/user.repository';
import { RedisService } from '@nestjs-modules/ioredis';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
    private readonly redis: RedisService,
  ) {}

  async register({ email, password, tenantInviteCode }: RegisterDto) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.userRepo.createUser(email, hashedPassword, tenantInviteCode);
    return user;
  }

  async login({ email, password }: LoginDto) {
    const user = await this.validateUser(email, password);
    const tokens = await this.generateTokens(user.id);
    // Store refresh token in Redis with the user ID as key
    await this.redis.getClient().set(`refresh_${user.id}`, tokens.refreshToken, 'EX', 7 * 24 * 60 * 60);
    return tokens;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async generateTokens(userId: number) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign({ userId }, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async refreshToken(user: any) {
    const tokens = await this.generateTokens(user.id);
    // Update the Redis entry for the user with a new refresh token
    await this.redis.getClient().set(`refresh_${user.id}`, tokens.refreshToken, 'EX', 7 * 24 * 60 * 60);
    return { accessToken: tokens.accessToken };
  }

  async logout(user: any) {
    // Invalidate the refresh token by deleting it from Redis
    await this.redis.getClient().del(`refresh_${user.id}`);
  }
}
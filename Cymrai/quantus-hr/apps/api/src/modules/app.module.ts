/**
 * @file app.module.ts
 * @description Root module for the NestJS application, responsible for organizing and configuring modules.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: ConfigService,
    }),
    UserModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
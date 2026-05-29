/**
 * @file config.service.ts
 * @description Service to provide configuration settings for the TypeORM database connection.
 */
import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class ConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly nestConfigService: NestConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.nestConfigService.get('DB_HOST'),
      port: parseInt(this.nestConfigService.get('DB_PORT')),
      username: this.nestConfigService.get('DB_USERNAME'),
      password: this.nestConfigService.get('DB_PASSWORD'),
      database: this.nestConfigService.get('DB_NAME'),
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
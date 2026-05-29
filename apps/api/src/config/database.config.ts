import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: config.get<string>('DATABASE_URL'),
  autoLoadEntities: true,
  synchronize: config.get<string>('NODE_ENV') === 'development',
  logging: config.get<string>('NODE_ENV') === 'development',
  migrations: [__dirname + '/../database/migrations/**/*.ts'],
  migrationsRun: false,
});

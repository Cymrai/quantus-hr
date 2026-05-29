/**
 * @file main.ts
 * @description Entry point for the NestJS backend application.
 * Initializes the app with necessary configurations and starts the server.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const envFilePath = process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
  dotenv.config({ path: envFilePath });

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
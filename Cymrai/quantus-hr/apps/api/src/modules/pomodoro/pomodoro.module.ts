import { Module } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { PomodoroController } from './pomodoro.controller';
import { TimeLogsModule } from '../time-logs/time-logs.module'; // Assuming this module exists for creating time logs
import { RedisModule } from '@nestjs-modules/ioredis'; // Assuming this is the correct Redis module for NestJS
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocketGateway } from '../socket.gateway'; // Assuming this gateway exists to emit events

@Module({
  imports: [
    TimeLogsModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get('REDIS_HOST'),
          port: parseInt(configService.get('REDIS_PORT')),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PomodoroController],
  providers: [PomodoroService, SocketGateway],
})
export class PomodoroModule {}
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ScoringController } from './scoring.controller';
import { ScoringService } from './scoring.service';
import { ScoringModule } from './scoring.module';

@Module({
  imports: [
    RouterModule.register([{ path: 'performance-engine', module: ScoringModule }]),
    ScoringModule,
  ],
})
export class ScoringRoutes {}
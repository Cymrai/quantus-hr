import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ScoringService } from './scoring.service';

@Controller('scoring')
export class ScoringController {
  private readonly logger = new Logger(ScoringController.name);

  constructor(private scoringService: ScoringService) {}

  @Post('calculate')
  async calculateScore(@Body() body: { employeeId: string, modelType: string, periodStart: Date, periodEnd: Date }) {
    const { employeeId, modelType, periodStart, periodEnd } = body;
    return this.scoringService.calculateScore(employeeId, modelType, periodStart, periodEnd);
  }
}
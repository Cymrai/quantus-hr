import { Process, Processor } from '@nestjs/bullmq';
import { ScoringService } from './scoring.service';

@Processor('score-recalc')
export class ScoreRecalcProcessor {
  constructor(private scoringService: ScoringService) {}

  @Process()
  async recalculateScore(job: any) {
    const { employeeId, modelType, periodStart, periodEnd } = job.data;
    await this.scoringService.calculateScore(employeeId, modelType, periodStart, periodEnd);
  }
}
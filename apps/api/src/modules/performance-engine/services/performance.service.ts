import { Injectable } from '@nestjs/common';
import { PerformanceRepository } from '../repositories/performance.repository';
import { PerformanceScoreDTO, PerformanceScoreHistoryDTO } from '../dto/performance.dto';

@Injectable()
export class PerformanceService {
  constructor(private readonly performanceRepository: PerformanceRepository) {}

  public async getLatestScore(employeeId: string): Promise<PerformanceScoreDTO> {
    const score = await this.performanceRepository.findLatestScoreByEmployeeId(employeeId);
    return plainToInstance(PerformanceScoreDTO, score);
  }

  public async getScoreHistory(employeeId: string, modelType: string, periodStart: Date, periodEnd: Date): Promise<PerformanceScoreHistoryDTO[]> {
    const history = await this.performanceRepository.findScoreHistoryByEmployeeIdAndPeriod(employeeId, modelType, periodStart, periodEnd);
    return plainToInstance(PerformanceScoreHistoryDTO, history);
  }
}
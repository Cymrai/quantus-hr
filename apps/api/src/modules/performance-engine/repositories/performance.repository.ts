import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PerformanceRepository extends PrismaClient {
  public async findLatestScoreByEmployeeId(employeeId: string): Promise<PerformanceScore> {
    return this.performanceScore.findFirst({ where: { employeeId, isLatest: true } });
  }

  public async findScoreHistoryByEmployeeIdAndPeriod(employeeId: string, modelType: string, periodStart: Date, periodEnd: Date): Promise<PerformanceScore[]> {
    return this.performanceScore.findMany({ where: { employeeId, modelType, createdAt: { gte: periodStart, lte: periodEnd } }, orderBy: { createdAt: 'desc' } });
  }
}
import { Request, Response } from 'express';
import { PerformanceService } from '../services/performance.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpException, HttpStatus, NextFunction } from '@nestjs/common';

export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  public async getLatestScore(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.params.employeeId;
      const score = await this.performanceService.getLatestScore(employeeId);
      if (!score) {
        throw new HttpException('Score not found', HttpStatus.NOT_FOUND);
      }
      res.status(HttpStatus.OK).json(plainToInstance(PerformanceScoreDTO, score));
    } catch (error) {
      next(error);
    }
  }

  public async getScoreHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const employeeId = req.params.employeeId;
      const modelType = req.query.model_type as string;
      const periodStart = new Date(req.query.period_start as string);
      const periodEnd = new Date(req.query.period_end as string);
      const history = await this.performanceService.getScoreHistory(employeeId, modelType, periodStart, periodEnd);
      if (!history || history.length === 0) {
        throw new HttpException('No scores found', HttpStatus.NOT_FOUND);
      }
      res.status(HttpStatus.OK).json(plainToInstance(PerformanceScoreHistoryDTO, history));
    } catch (error) {
      next(error);
    }
  }
}
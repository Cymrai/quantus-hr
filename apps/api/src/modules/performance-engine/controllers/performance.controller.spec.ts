import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from '../services/performance.service';
import { HttpException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

describe('PerformanceController', () => {
  let controller: PerformanceController;
  let service: PerformanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformanceController],
      providers: [
        {
          provide: PerformanceService,
          useValue: {
            getLatestScore: jest.fn(),
            getScoreHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PerformanceController>(PerformanceController);
    service = module.get<PerformanceService>(PerformanceService);
  });

  describe('getLatestScore', () => {
    it('should return the latest score for an employee', async () => {
      const mockScore = plainToInstance(PerformanceScoreDTO, { modelType: 'ModelA', period: new Date(), score: 85 });
      jest.spyOn(service, 'getLatestScore').mockResolvedValue(mockScore);

      await controller.getLatestScore({ params: { employeeId: '1' } }, {} as Response, {} as NextFunction);

      expect(service.getLatestScore).toHaveBeenCalledWith('1');
    });
  });
});
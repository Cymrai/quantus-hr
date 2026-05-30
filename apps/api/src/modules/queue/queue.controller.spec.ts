import { Test, TestingModule } from '@nestjs/testing';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

describe('QueueController', () => {
  let controller: QueueController;
  let service: jest.Mocked<Pick<QueueService, 'healthCheck'>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueueController],
      providers: [
        {
          provide: QueueService,
          useValue: { healthCheck: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<QueueController>(QueueController);
    service = module.get(QueueService);
  });

  describe('healthCheck', () => {
    it('should return ok status when queues are healthy', async () => {
      service.healthCheck.mockResolvedValue({ status: 'ok' });
      expect(await controller.healthCheck()).toEqual({ status: 'ok' });
    });

    it('should return error status when a queue is unreachable', async () => {
      service.healthCheck.mockResolvedValue({
        status: 'error',
        detail: 'Health check timed out',
      });
      const result = await controller.healthCheck();
      expect(result.status).toBe('error');
      expect(result.detail).toBeDefined();
    });
  });
});

import { Test, type TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../common/prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check()', () => {
    it('should return ok status when DB is healthy', async () => {
      const result = await controller.check();
      expect(result.status).toBe('ok');
      expect(result.services.database).toBe('ok');
      expect(result.timestamp).toBeDefined();
    });

    it('should return error status when DB is unavailable', async () => {
      prismaService.$queryRaw = jest.fn().mockRejectedValue(new Error('DB down'));
      const result = await controller.check();
      expect(result.status).toBe('error');
      expect(result.services.database).toBe('error');
    });
  });
});

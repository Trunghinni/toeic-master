import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../common/prisma/prisma.service';
import { type HealthCheckDto } from '@toeic-master/shared-types';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check — returns API and dependency status' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is degraded' })
  async check(): Promise<HealthCheckDto> {
    let dbStatus: 'ok' | 'error' = 'ok';
    let redisStatus: 'ok' | 'error' = 'ok';

    // Check DB connectivity
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }

    // Redis check placeholder — will be wired in Phase 1 with RedisModule
    // For now, mark as ok if env var is set
    if (!process.env['REDIS_URL']) {
      redisStatus = 'error';
    }

    const allOk = dbStatus === 'ok' && redisStatus === 'ok';

    return {
      status: allOk ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      version: process.env['npm_package_version'] ?? '0.0.1',
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
    };
  }
}

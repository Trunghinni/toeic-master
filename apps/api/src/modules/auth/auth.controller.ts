import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

/**
 * AuthController — Phase 0 skeleton
 *
 * Full implementation in Phase 1:
 * - POST /auth/register
 * - POST /auth/login
 * - POST /auth/refresh
 * - POST /auth/logout
 * - POST /auth/forgot-password
 * - POST /auth/reset-password
 * - GET  /auth/google
 * - GET  /auth/google/callback
 */
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  @Get('status')
  @ApiOperation({ summary: 'Auth module status check' })
  status() {
    return { module: 'auth', status: 'ready', phase: 0 };
  }
}

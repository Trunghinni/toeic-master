import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

/**
 * UserController — Phase 0 skeleton
 *
 * Full implementation in Phase 1:
 * - GET  /users/me
 * - PUT  /users/me
 * - GET  /users/:id
 */
@ApiTags('users')
@Controller({ path: 'users', version: '1' })
export class UserController {
  @Get('status')
  @ApiOperation({ summary: 'User module status check' })
  status() {
    return { module: 'users', status: 'ready', phase: 0 };
  }
}

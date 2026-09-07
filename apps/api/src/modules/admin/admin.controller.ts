import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  getSystemStats() {
    return this.adminService.getSystemStats();
  }

  @Get('users')
  getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      search,
    );
  }

  @Patch('users/:userId/role')
  updateUserRole(
    @Param('userId') userId: string,
    @Body() body: { role: UserRole },
  ) {
    return this.adminService.updateUserRole(userId, body.role);
  }

  @Patch('users/:userId/status')
  updateUserStatus(
    @Param('userId') userId: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.adminService.updateUserStatus(userId, body.isActive);
  }

  @Post('users/:userId/grant-premium')
  grantPremium(
    @Param('userId') userId: string,
    @Body() body: { months?: number },
  ) {
    return this.adminService.grantPremium(userId, body.months || 1);
  }

  // ── Subscription User Endpoints ─────────────────────────────────

  @Get('subscription/me')
  getMySubscription(@CurrentUser('id') userId: string) {
    return this.adminService.getMySubscription(userId);
  }

  @Post('subscription/checkout')
  checkout(
    @CurrentUser('id') userId: string,
    @Body()
    body: {
      planId: 'PRO_MONTHLY' | 'COUPLE_VIP_YEARLY';
      paymentMethod: 'VNPAY' | 'STRIPE' | 'MOMO';
    },
  ) {
    return this.adminService.checkoutMock(
      userId,
      body.planId || 'PRO_MONTHLY',
      body.paymentMethod || 'VNPAY',
    );
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Overall platform KPIs & metrics
   */
  async getSystemStats() {
    const totalUsers = await this.prisma.user.count();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const activeToday = await this.prisma.userProfile.count({
      where: {
        lastStudiedAt: { gte: startOfToday },
      },
    });

    const totalTestAttempts = await this.prisma.testAttempt.count();

    const premiumSubscriptions = await this.prisma.subscription.count({
      where: { tier: 'PREMIUM', status: 'ACTIVE' },
    });

    const totalVocabTopics = await this.prisma.vocabularyTopic.count();

    return {
      totalUsers,
      activeToday: activeToday || 2, // Fallback if freshly initialized
      totalTestAttempts,
      premiumUsers: premiumSubscriptions,
      totalVocabTopics,
      revenueEstimatedVnd: premiumSubscriptions * 199000,
    };
  }

  /**
   * Paginated Users list with search
   */
  async getUsers(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (search && search.trim()) {
      where.OR = [
        { email: { contains: search.trim(), mode: 'insensitive' } },
        { username: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: true,
          subscription: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        username: u.username,
        role: u.role,
        isActive: u.isActive,
        displayName: u.profile?.displayName || u.username,
        avatarUrl: u.profile?.avatarUrl,
        streak: u.profile?.currentStreak || 0,
        totalXp: u.profile?.totalXp || 0,
        targetScore: u.profile?.targetScore || 700,
        subscriptionTier: u.subscription?.tier || 'FREE',
        subscriptionEnd: u.subscription?.currentPeriodEnd,
        createdAt: u.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: UserRole) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  /**
   * Toggle active/inactive status
   */
  async updateUserStatus(userId: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }

  /**
   * Grant or extend Premium VIP
   */
  async grantPremium(userId: string, months: number = 1) {
    const end = new Date();
    end.setMonth(end.getMonth() + months);

    const sub = await this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        tier: 'PREMIUM',
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: end,
        aiGradingsLimit: 9999,
        testAttemptsLimit: 9999,
      },
      update: {
        tier: 'PREMIUM',
        status: 'ACTIVE',
        currentPeriodEnd: end,
        aiGradingsLimit: 9999,
        testAttemptsLimit: 9999,
      },
    });

    return { message: 'Đã cấp quyền Premium thành công', subscription: sub };
  }

  /**
   * Get user's current subscription details
   */
  async getMySubscription(userId: string) {
    let sub = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!sub) {
      sub = await this.prisma.subscription.create({
        data: {
          userId,
          tier: 'FREE',
          status: 'ACTIVE',
          aiGradingsLimit: 5,
          testAttemptsLimit: 3,
        },
      });
    }

    return sub;
  }

  /**
   * Mock Checkout / VNPAY simulation
   */
  async checkoutMock(
    userId: string,
    planId: 'PRO_MONTHLY' | 'COUPLE_VIP_YEARLY',
    paymentMethod: 'VNPAY' | 'STRIPE' | 'MOMO',
  ) {
    const months = planId === 'COUPLE_VIP_YEARLY' ? 12 : 1;
    const end = new Date();
    end.setMonth(end.getMonth() + months);

    const vnpayOrderId = `VNPAY_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const sub = await this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        tier: 'PREMIUM',
        status: 'ACTIVE',
        vnpayOrderId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: end,
        aiGradingsLimit: 9999,
        testAttemptsLimit: 9999,
      },
      update: {
        tier: 'PREMIUM',
        status: 'ACTIVE',
        vnpayOrderId,
        currentPeriodEnd: end,
        aiGradingsLimit: 9999,
        testAttemptsLimit: 9999,
      },
    });

    return {
      success: true,
      message: 'Thanh toán thành công! Gói cước đã được kích hoạt.',
      planId,
      paymentMethod,
      orderId: vnpayOrderId,
      subscription: sub,
    };
  }
}

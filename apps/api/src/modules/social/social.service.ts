import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get list of friends and pending requests
   */
  async getFriends(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { addresseeId: userId },
        ],
      },
      include: {
        requester: {
          include: { profile: true },
        },
        addressee: {
          include: { profile: true },
        },
      },
    });

    const acceptedFriends = friendships
      .filter((f) => f.status === 'ACCEPTED')
      .map((f) => {
        const friendUser = f.requesterId === userId ? f.addressee : f.requester;
        return {
          friendshipId: f.id,
          userId: friendUser.id,
          username: friendUser.username,
          displayName: friendUser.profile?.displayName || friendUser.username,
          avatarUrl: friendUser.profile?.avatarUrl,
          currentStreak: friendUser.profile?.currentStreak || 0,
          totalXp: friendUser.profile?.totalXp || 0,
          lastStudiedAt: friendUser.profile?.lastStudiedAt,
          targetScore: friendUser.profile?.targetScore || 700,
        };
      });

    const pendingRequests = friendships
      .filter((f) => f.status === 'PENDING' && f.addresseeId === userId)
      .map((f) => ({
        friendshipId: f.id,
        requesterId: f.requester.id,
        username: f.requester.username,
        displayName: f.requester.profile?.displayName || f.requester.username,
        avatarUrl: f.requester.profile?.avatarUrl,
        createdAt: f.createdAt,
      }));

    return {
      friends: acceptedFriends,
      pendingRequests,
    };
  }

  /**
   * Send a friend request by email or username
   */
  async sendFriendRequest(requesterId: string, targetIdentifier: string) {
    const target = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: targetIdentifier.trim().toLowerCase() },
          { username: targetIdentifier.trim() },
        ],
      },
    });

    if (!target) {
      throw new NotFoundException('Không tìm thấy người dùng với email hoặc username này');
    }

    if (target.id === requesterId) {
      throw new BadRequestException('Bạn không thể gửi lời mời kết bạn cho chính mình');
    }

    // Check existing
    const existing = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId: target.id },
          { requesterId: target.id, addresseeId: requesterId },
        ],
      },
    });

    if (existing) {
      if (existing.status === 'ACCEPTED') {
        throw new BadRequestException('Hai bạn đã là bạn bè rồi');
      }
      throw new BadRequestException('Lời mời kết bạn đang chờ phản hồi');
    }

    const friendship = await this.prisma.friendship.create({
      data: {
        requesterId,
        addresseeId: target.id,
        status: 'PENDING',
      },
    });

    return {
      message: 'Đã gửi lời mời kết bạn thành công',
      friendshipId: friendship.id,
    };
  }

  /**
   * Accept friend request
   */
  async acceptFriendRequest(userId: string, friendshipId: string) {
    const friendship = await this.prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship || friendship.addresseeId !== userId) {
      throw new NotFoundException('Không tìm thấy lời mời kết bạn');
    }

    const updated = await this.prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'ACCEPTED' },
    });

    return {
      message: 'Đã đồng ý kết bạn',
      friendship: updated,
    };
  }

  /**
   * Couple Mode / Study Together Mini Dashboard
   */
  async getCoupleDashboard(userId: string) {
    const me = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!me) throw new NotFoundException('User not found');

    // Find first accepted partner
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [{ requesterId: userId }, { addresseeId: userId }],
        status: 'ACCEPTED',
      },
      include: {
        requester: { include: { profile: true } },
        addressee: { include: { profile: true } },
      },
    });

    let partnerUser = null;
    if (friendship) {
      partnerUser = friendship.requesterId === userId ? friendship.addressee : friendship.requester;
    }

    // Check studying today status
    const now = new Date();
    const isToday = (date?: Date | null) => {
      if (!date) return false;
      return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    };

    const meStudiedToday = isToday(me.profile?.lastStudiedAt);
    const partnerStudiedToday = partnerUser ? isToday(partnerUser.profile?.lastStudiedAt) : false;

    // Couple User A (Me) - Rose (#FB7185)
    const userA = {
      id: me.id,
      role: 'User A (You)',
      colorHex: '#FB7185',
      name: me.profile?.displayName || me.username,
      avatarUrl: me.profile?.avatarUrl,
      streak: me.profile?.currentStreak || 1,
      targetScore: me.profile?.targetScore || 750,
      minutesToday: meStudiedToday ? me.profile?.dailyGoalMinutes || 25 : 0,
      isStudyingNow: meStudiedToday,
      lastStudiedAt: me.profile?.lastStudiedAt,
    };

    // Couple User B (Partner) - Indigo (#818CF8)
    const userB = partnerUser
      ? {
          id: partnerUser.id,
          role: 'User B (Partner)',
          colorHex: '#818CF8',
          name: partnerUser.profile?.displayName || partnerUser.username,
          avatarUrl: partnerUser.profile?.avatarUrl,
          streak: partnerUser.profile?.currentStreak || 1,
          targetScore: partnerUser.profile?.targetScore || 800,
          minutesToday: partnerStudiedToday ? partnerUser.profile?.dailyGoalMinutes || 30 : 0,
          isStudyingNow: partnerStudiedToday,
          lastStudiedAt: partnerUser.profile?.lastStudiedAt,
        }
      : {
          id: 'demo_partner',
          role: 'User B (Partner)',
          colorHex: '#818CF8',
          name: 'Bạn Đồng Hành (Demo)',
          avatarUrl: null,
          streak: 3,
          targetScore: 800,
          minutesToday: 30,
          isStudyingNow: true,
          lastStudiedAt: new Date(),
        };

    // Shared Goal calculations
    const sharedStreak = Math.min(userA.streak, userB.streak);
    const weeklyWordsTarget = 100;
    const weeklyWordsLearned = 68; // Shared progress sample

    // 7-Day Tick Habit Challenge (Mon - Sun)
    const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const habitWeek = dayNames.map((day, idx) => ({
      day,
      userACompleted: idx <= (now.getDay() === 0 ? 6 : now.getDay() - 1),
      userBCompleted: idx <= (now.getDay() === 0 ? 5 : Math.max(0, now.getDay() - 2)),
      togetherCompleted: idx < (now.getDay() === 0 ? 6 : now.getDay() - 1),
    }));

    return {
      hasPartner: !!partnerUser,
      userA,
      userB,
      sharedGoal: {
        sharedStreak,
        weeklyWordsLearned,
        weeklyWordsTarget,
        percent: Math.round((weeklyWordsLearned / weeklyWordsTarget) * 100),
      },
      habitWeek,
    };
  }

  /**
   * Log study heartbeat
   */
  async updateStudyPulse(userId: string, minutes: number = 15) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (profile) {
      await this.prisma.userProfile.update({
        where: { userId },
        data: {
          lastStudiedAt: new Date(),
          totalXp: { increment: minutes * 2 },
          currentStreak: profile.currentStreak === 0 ? 1 : profile.currentStreak,
        },
      });
    }

    return { success: true, message: 'Updated study pulse' };
  }

  /**
   * Minimalist Leaderboard
   */
  async getLeaderboard() {
    const topProfiles = await this.prisma.userProfile.findMany({
      take: 10,
      orderBy: { totalXp: 'desc' },
      include: {
        user: { select: { username: true } },
      },
    });

    return topProfiles.map((p, idx) => ({
      rank: idx + 1,
      displayName: p.displayName || p.user.username,
      totalXp: p.totalXp,
      currentStreak: p.currentStreak,
      targetScore: p.targetScore,
    }));
  }
}

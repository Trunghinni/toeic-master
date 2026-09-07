import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { UpdateProfileDto } from '@toeic-master/shared-types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /** Find user by ID — used by JwtStrategy */
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        subscription: true,
      },
    });
  }

  /** Find user by email — used by AuthService during login */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        subscription: true,
      },
    });
  }

  /** Find user by username */
  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  /** Get full profile for /users/me */
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        subscription: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Update profile fields */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Ensure user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');

    // Upsert profile (user might not have one yet if created via seed)
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        displayName: dto.displayName ?? user.username,
        bio: dto.bio,
        targetScore: dto.targetScore ?? 700,
        targetBand: (dto.targetBand as never) ?? 'BAND_4',
        studyDeadline: dto.studyDeadline ? new Date(dto.studyDeadline) : null,
        dailyGoalMinutes: dto.dailyGoalMinutes ?? 30,
        timezone: dto.timezone ?? 'Asia/Ho_Chi_Minh',
      },
      update: {
        ...(dto.displayName !== undefined && { displayName: dto.displayName }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.targetScore !== undefined && { targetScore: dto.targetScore }),
        ...(dto.targetBand !== undefined && { targetBand: dto.targetBand as never }),
        ...(dto.studyDeadline !== undefined && {
          studyDeadline: dto.studyDeadline ? new Date(dto.studyDeadline) : null,
        }),
        ...(dto.dailyGoalMinutes !== undefined && { dailyGoalMinutes: dto.dailyGoalMinutes }),
        ...(dto.timezone !== undefined && { timezone: dto.timezone }),
      },
    });

    return profile;
  }
}

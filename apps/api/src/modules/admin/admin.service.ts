import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Prisma, UserRole, BandLevel, WordType, TestMode, TestPartType } from '@prisma/client';

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

  /**
   * Vocabulary CMS: Get all system topics with cards
   */
  async getAdminVocabularyTopics() {
    return this.prisma.vocabularyTopic.findMany({
      include: {
        cards: {
          orderBy: { orderInTopic: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Vocabulary CMS: Create new system vocabulary topic
   */
  async createVocabularyTopic(data: {
    title: string;
    description?: string;
    targetBand?: BandLevel;
  }) {
    return this.prisma.vocabularyTopic.create({
      data: {
        title: data.title,
        description: data.description,
        targetBand: data.targetBand || 'BAND_2',
        isSystem: true,
        isPublic: true,
      },
      include: {
        cards: true,
      },
    });
  }

  /**
   * Vocabulary CMS: Add a card to a topic
   */
  async createVocabularyCard(
    topicId: string,
    data: {
      word: string;
      phonetic?: string;
      wordType?: WordType;
      definition: string;
      definitionEn?: string;
      example?: string;
      exampleVi?: string;
      tags?: string[];
    },
  ) {
    const card = await this.prisma.vocabularyCard.create({
      data: {
        topicId,
        word: data.word,
        phonetic: data.phonetic,
        wordType: data.wordType || 'NOUN',
        definition: data.definition,
        definitionEn: data.definitionEn,
        example: data.example,
        exampleVi: data.exampleVi,
        tags: data.tags || [],
      },
    });

    // Update topic cardCount
    const count = await this.prisma.vocabularyCard.count({
      where: { topicId },
    });
    await this.prisma.vocabularyTopic.update({
      where: { id: topicId },
      data: { cardCount: count },
    });

    return card;
  }

  /**
   * Vocabulary CMS: Delete a topic and its cards
   */
  async deleteVocabularyTopic(topicId: string) {
    return this.prisma.vocabularyTopic.delete({
      where: { id: topicId },
    });
  }

  // ── Grammar CMS ──────────────────────────────────────────────
  async getAdminGrammarTopics() {
    return this.prisma.grammarTopic.findMany({
      include: {
        exercises: {
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async createGrammarTopic(data: {
    title: string;
    description?: string;
    rule: string;
    formula?: string;
    tips?: string;
    targetBand?: BandLevel;
  }) {
    return this.prisma.grammarTopic.create({
      data: {
        title: data.title,
        description: data.description,
        rule: data.rule,
        formula: data.formula,
        tips: data.tips,
        examples: [],
        targetBand: data.targetBand || 'BAND_3',
        isSystem: true,
      },
      include: {
        exercises: true,
      },
    });
  }

  async createGrammarCard(
    grammarTopicId: string,
    data: {
      question: string;
      options: { id: string; text: string }[];
      correctAnswer: string;
      explanation: string;
      difficulty?: number;
    },
  ) {
    const count = await this.prisma.grammarCard.count({ where: { grammarTopicId } });
    return this.prisma.grammarCard.create({
      data: {
        grammarTopicId,
        type: 'MULTIPLE_CHOICE',
        question: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation || '',
        difficulty: data.difficulty || 2,
        orderIndex: count,
      },
    });
  }

  async deleteGrammarTopic(topicId: string) {
    return this.prisma.grammarTopic.delete({
      where: { id: topicId },
    });
  }

  // ── Tests CMS ────────────────────────────────────────────────
  async getAdminTests() {
    return this.prisma.test.findMany({
      include: {
        questions: {
          orderBy: { questionNumber: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTest(data: {
    title: string;
    description?: string;
    mode?: TestMode;
    durationMins?: number;
    parts?: TestPartType[];
    bandRange?: BandLevel[];
  }) {
    return this.prisma.test.create({
      data: {
        title: data.title,
        description: data.description,
        mode: data.mode || 'PRACTICE',
        durationMins: data.durationMins || 15,
        parts: data.parts && data.parts.length > 0 ? data.parts : ['PART_5'],
        bandRange: data.bandRange && data.bandRange.length > 0 ? data.bandRange : ['BAND_3'],
        totalQuestions: 0,
        isPublished: true,
        isFree: true,
      },
      include: {
        questions: true,
      },
    });
  }

  async createTestQuestion(
    testId: string,
    data: {
      part: TestPartType;
      questionNumber: number;
      questionText: string;
      options: { id: string; text: string }[];
      correctOptionId: string;
      explanation?: string;
      imageUrl?: string;
    },
  ) {
    const question = await this.prisma.testQuestion.create({
      data: {
        testId,
        part: data.part,
        questionNumber: data.questionNumber,
        questionText: data.questionText,
        options: data.options,
        correctOptionId: data.correctOptionId,
        explanation: data.explanation,
        imageUrl: data.imageUrl,
      },
    });

    const count = await this.prisma.testQuestion.count({ where: { testId } });
    await this.prisma.test.update({
      where: { id: testId },
      data: { totalQuestions: count },
    });

    return question;
  }

  async deleteTest(testId: string) {
    return this.prisma.test.delete({
      where: { id: testId },
    });
  }
}

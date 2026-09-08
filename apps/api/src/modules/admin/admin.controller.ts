import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { UserRole, BandLevel, WordType, TestMode, TestPartType } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @Roles(UserRole.ADMIN)
  getSystemStats() {
    return this.adminService.getSystemStats();
  }

  @Get('users')
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
  updateUserRole(
    @Param('userId') userId: string,
    @Body() body: { role: UserRole },
  ) {
    return this.adminService.updateUserRole(userId, body.role);
  }

  @Patch('users/:userId/status')
  @Roles(UserRole.ADMIN)
  updateUserStatus(
    @Param('userId') userId: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.adminService.updateUserStatus(userId, body.isActive);
  }

  @Post('users/:userId/grant-premium')
  @Roles(UserRole.ADMIN)
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

  // ── Vocabulary CMS Endpoints ─────────────────────────────────

  @Get('vocabulary/topics')
  @Roles(UserRole.ADMIN)
  getAdminVocabularyTopics() {
    return this.adminService.getAdminVocabularyTopics();
  }

  @Post('vocabulary/topics')
  @Roles(UserRole.ADMIN)
  createVocabularyTopic(
    @Body()
    body: {
      title: string;
      description?: string;
      targetBand?: BandLevel;
    },
  ) {
    return this.adminService.createVocabularyTopic(body);
  }

  @Post('vocabulary/topics/:id/cards')
  @Roles(UserRole.ADMIN)
  createVocabularyCard(
    @Param('id') topicId: string,
    @Body()
    body: {
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
    return this.adminService.createVocabularyCard(topicId, body);
  }

  @Delete('vocabulary/topics/:id')
  @Roles(UserRole.ADMIN)
  deleteVocabularyTopic(@Param('id') topicId: string) {
    return this.adminService.deleteVocabularyTopic(topicId);
  }

  // ── Grammar CMS Endpoints ────────────────────────────────────

  @Get('grammar/topics')
  @Roles(UserRole.ADMIN)
  getAdminGrammarTopics() {
    return this.adminService.getAdminGrammarTopics();
  }

  @Post('grammar/topics')
  @Roles(UserRole.ADMIN)
  createGrammarTopic(
    @Body()
    body: {
      title: string;
      description?: string;
      rule: string;
      formula?: string;
      tips?: string;
      targetBand?: BandLevel;
    },
  ) {
    return this.adminService.createGrammarTopic(body);
  }

  @Post('grammar/topics/:id/cards')
  @Roles(UserRole.ADMIN)
  createGrammarCard(
    @Param('id') topicId: string,
    @Body()
    body: {
      question: string;
      options: { id: string; text: string }[];
      correctAnswer: string;
      explanation: string;
      difficulty?: number;
    },
  ) {
    return this.adminService.createGrammarCard(topicId, body);
  }

  @Delete('grammar/topics/:id')
  @Roles(UserRole.ADMIN)
  deleteGrammarTopic(@Param('id') topicId: string) {
    return this.adminService.deleteGrammarTopic(topicId);
  }

  // ── Tests CMS Endpoints ──────────────────────────────────────

  @Get('tests')
  @Roles(UserRole.ADMIN)
  getAdminTests() {
    return this.adminService.getAdminTests();
  }

  @Post('tests')
  @Roles(UserRole.ADMIN)
  createTest(
    @Body()
    body: {
      title: string;
      description?: string;
      mode?: TestMode;
      durationMins?: number;
      parts?: TestPartType[];
      bandRange?: BandLevel[];
    },
  ) {
    return this.adminService.createTest(body);
  }

  @Post('tests/:id/questions')
  @Roles(UserRole.ADMIN)
  createTestQuestion(
    @Param('id') testId: string,
    @Body()
    body: {
      part: TestPartType;
      questionNumber: number;
      questionText: string;
      options: { id: string; text: string }[];
      correctOptionId: string;
      explanation?: string;
      imageUrl?: string;
    },
  ) {
    return this.adminService.createTestQuestion(testId, body);
  }

  @Delete('tests/:id')
  @Roles(UserRole.ADMIN)
  deleteTest(@Param('id') testId: string) {
    return this.adminService.deleteTest(testId);
  }
}

import { Controller, Get, Post, Patch, Param, Body, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString, IsEnum, Min, Max, IsIn } from 'class-validator';
import { BandLevel } from '@toeic-master/shared-types';

import { RoadmapService } from './roadmap.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

export class GenerateRoadmapDto {
  @IsEnum(BandLevel)
  targetBand!: string;

  @IsNumber()
  @Min(10) @Max(990)
  targetScore!: number;

  @IsOptional()
  @IsDateString()
  studyDeadline?: string;

  @IsNumber()
  @Min(10) @Max(180)
  dailyGoalMinutes!: number;

  @IsOptional()
  @IsString()
  placementTestResultId?: string;

  @IsOptional()
  @IsEnum(BandLevel)
  currentBand?: string;
}

export class MilestoneCheckinDto {
  @IsNumber()
  @Min(1)
  weekNumber!: number;

  @IsIn(['too_easy', 'just_right', 'too_hard'])
  feedback!: 'too_easy' | 'just_right' | 'too_hard';
}

export class UpdateNodeStatusDto {
  @IsIn(['LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED'])
  status!: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
}

@ApiTags('roadmap')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'roadmap', version: '1' })
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  /** POST /api/v1/roadmap/generate — Generate a new personalized roadmap */
  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Generate personalized learning roadmap' })
  async generate(
    @CurrentUser() user: User,
    @Body() dto: GenerateRoadmapDto,
  ) {
    const roadmap = await this.roadmapService.generateRoadmap(user.id, {
      targetBand:            dto.targetBand,
      targetScore:           dto.targetScore,
      studyDeadline:         dto.studyDeadline,
      dailyGoalMinutes:      dto.dailyGoalMinutes,
      placementTestResultId: dto.placementTestResultId,
      currentBand:           dto.currentBand,
    });
    return { success: true, data: roadmap };
  }

  /** GET /api/v1/roadmap/me — Get active roadmap with all nodes */
  @Get('me')
  @ApiOperation({ summary: 'Get current user active roadmap' })
  async getMyRoadmap(@CurrentUser() user: User) {
    const roadmap = await this.roadmapService.getActiveRoadmap(user.id);
    return { success: true, data: roadmap };
  }

  /** GET /api/v1/roadmap/me/nodes?week=N — Get roadmap nodes (optional week filter) */
  @Get('me/nodes')
  @ApiQuery({ name: 'week', required: false, type: Number })
  @ApiOperation({ summary: 'Get roadmap nodes, optionally filtered by week' })
  async getNodes(
    @CurrentUser() user: User,
    @Query('week') week?: number,
  ) {
    const nodes = await this.roadmapService.getRoadmapNodes(user.id, week ? Number(week) : undefined);
    return { success: true, data: nodes };
  }

  /** POST /api/v1/roadmap/check-in — Milestone check-in every 4 weeks */
  @Post('check-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit milestone check-in feedback' })
  async checkIn(
    @CurrentUser() user: User,
    @Body() dto: MilestoneCheckinDto,
  ) {
    const result = await this.roadmapService.milestoneCheckin(
      user.id,
      dto.weekNumber,
      dto.feedback,
    );
    return { success: true, data: result };
  }

  /** PATCH /api/v1/roadmap/nodes/:id/status — Update a roadmap node's status */
  @Patch('nodes/:id/status')
  @ApiOperation({ summary: 'Update roadmap node status (LOCKED -> AVAILABLE -> IN_PROGRESS -> COMPLETED)' })
  async updateNodeStatus(
    @CurrentUser() user: User,
    @Param('id') nodeId: string,
    @Body() dto: UpdateNodeStatusDto,
  ) {
    const result = await this.roadmapService.updateNodeStatus(user.id, nodeId, dto.status);
    return { success: true, data: result };
  }
}

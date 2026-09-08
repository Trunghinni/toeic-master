import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

import { PlacementService } from './placement.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

export class SubmitPlacementDto {
  @IsObject()
  answers!: Record<string, string>;
}

@ApiTags('placement')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'placement', version: '1' })
export class PlacementController {
  constructor(private readonly placementService: PlacementService) {}

  /**
   * GET /api/v1/placement/questions
   * Returns 100 shuffled questions WITHOUT correctOptionId.
   */
  @Get('questions')
  @ApiOperation({ summary: 'Get placement test questions (no answers)' })
  getQuestions() {
    return {
      success: true,
      data: this.placementService.getQuestions(),
    };
  }

  /**
   * POST /api/v1/placement/submit
   * Scores answers, estimates band, saves result, returns breakdown.
   */
  @Post('submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit placement test answers and get result' })
  async submit(
    @CurrentUser() user: User,
    @Body() dto: SubmitPlacementDto,
  ) {
    const result = await this.placementService.submitTest(user.id, dto.answers);
    return { success: true, data: result };
  }

  /**
   * GET /api/v1/placement/result
   * Returns the user's latest placement test result.
   */
  @Get('result')
  @ApiOperation({ summary: 'Get latest placement test result' })
  async getResult(@CurrentUser() user: User) {
    const result = await this.placementService.getLatestResult(user.id);
    return { success: true, data: result };
  }
}

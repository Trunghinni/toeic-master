import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsObject, IsNumber } from 'class-validator';
import { TestService } from './test.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

export class SubmitTestAttemptDto {
  @IsObject()
  answers!: Record<string, string>;

  @IsNumber()
  timeSpentSeconds!: number;
}

@ApiTags('tests')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'tests', version: '1' })
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tests (Full mock test & mini tests)' })
  async getTests(@CurrentUser() user: User, @Query('mode') mode?: string) {
    const data = await this.testService.getTests(user.id, mode);
    return { success: true, data };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get past test attempts for current user' })
  async getHistory(@CurrentUser() user: User) {
    const data = await this.testService.getUserAttempts(user.id);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get test detail for taking (without answers)' })
  async getTestForTaking(@Param('id') testId: string) {
    const data = await this.testService.getTestForTaking(testId);
    return { success: true, data };
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit test attempt and calculate TOEIC scaled score' })
  async submitAttempt(
    @Param('id') testId: string,
    @Body() dto: SubmitTestAttemptDto,
    @CurrentUser() user: User,
  ) {
    const data = await this.testService.submitAttempt(
      user.id,
      testId,
      dto.answers,
      dto.timeSpentSeconds,
    );
    return { success: true, data };
  }
}

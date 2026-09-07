import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { GrammarService } from './grammar.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

export class SubmitGrammarAnswerDto {
  @IsString()
  answer!: string;
}

@ApiTags('grammar')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'grammar', version: '1' })
export class GrammarController {
  constructor(private readonly grammarService: GrammarService) {}

  @Get('topics')
  @ApiOperation({ summary: 'Get all grammar topics with Review Recommendation flag' })
  async getTopics(@CurrentUser() user: User) {
    const data = await this.grammarService.getTopics(user.id);
    return { success: true, data };
  }

  @Get('topics/:id')
  @ApiOperation({ summary: 'Get topic details with rules and exercise cards' })
  async getTopicDetail(@Param('id') topicId: string, @CurrentUser() user: User) {
    const data = await this.grammarService.getTopicDetail(topicId, user.id);
    return { success: true, data };
  }

  @Post('cards/:id/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit answer to grammar exercise (auto-logs mistake if incorrect)' })
  async submitAnswer(
    @Param('id') cardId: string,
    @Body() dto: SubmitGrammarAnswerDto,
    @CurrentUser() user: User,
  ) {
    const data = await this.grammarService.submitAnswer(user.id, cardId, dto.answer);
    return { success: true, data };
  }
}

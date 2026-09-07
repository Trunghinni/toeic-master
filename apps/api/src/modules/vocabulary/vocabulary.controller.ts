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
import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { VocabularyService } from './vocabulary.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

export class ReviewCardDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  quality!: number; // 0..5 SM-2 quality
}

export class CreateNotebookDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AddCardToNotebookDto {
  @IsString()
  cardId!: string;
}

@ApiTags('vocabulary')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'vocabulary', version: '1' })
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get('topics')
  @ApiOperation({ summary: 'Get all vocabulary topics with user progress' })
  async getTopics(@CurrentUser() user: User) {
    const data = await this.vocabularyService.getTopics(user.id);
    return { success: true, data };
  }

  @Get('topics/:id')
  @ApiOperation({ summary: 'Get topic cards with user SM-2 progress' })
  async getTopicCards(@Param('id') topicId: string, @CurrentUser() user: User) {
    const data = await this.vocabularyService.getTopicCards(topicId, user.id);
    return { success: true, data };
  }

  @Post('cards/:id/review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Review card with SM-2 algorithm (auto-saves mistake if quality < 3)' })
  async reviewCard(
    @Param('id') cardId: string,
    @Body() dto: ReviewCardDto,
    @CurrentUser() user: User,
  ) {
    const data = await this.vocabularyService.reviewCard(user.id, cardId, dto.quality);
    return { success: true, data };
  }

  @Get('due')
  @ApiOperation({ summary: 'Get cards due for review today' })
  async getDueCards(@CurrentUser() user: User) {
    const data = await this.vocabularyService.getDueCards(user.id);
    return { success: true, data };
  }

  @Get('notebooks')
  @ApiOperation({ summary: 'Get user notebook lists (including 4 defaults + Mistake Notebook)' })
  async getNotebooks(@CurrentUser() user: User) {
    const data = await this.vocabularyService.getUserNotebooks(user.id);
    return { success: true, data };
  }

  @Post('notebooks')
  @ApiOperation({ summary: 'Create a custom vocabulary notebook' })
  async createNotebook(@Body() dto: CreateNotebookDto, @CurrentUser() user: User) {
    const data = await this.vocabularyService.createCustomNotebook(user.id, dto.title, dto.description);
    return { success: true, data };
  }

  @Post('notebooks/:id/cards')
  @ApiOperation({ summary: 'Add a card to a user notebook' })
  async addCardToNotebook(
    @Param('id') notebookId: string,
    @Body() dto: AddCardToNotebookDto,
    @CurrentUser() user: User,
  ) {
    const data = await this.vocabularyService.addCardToNotebook(user.id, notebookId, dto.cardId);
    return { success: true, data };
  }
}

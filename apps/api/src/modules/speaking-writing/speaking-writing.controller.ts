import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SpeakingWritingService } from './speaking-writing.service';

@Controller('speaking-writing')
@UseGuards(JwtAuthGuard)
export class SpeakingWritingController {
  constructor(private service: SpeakingWritingService) {}

  @Get('speaking/prompts')
  getSpeakingPrompts() {
    return this.service.getSpeakingPrompts();
  }

  @Get('speaking/prompts/:id')
  getSpeakingPromptById(@Param('id') id: string) {
    return this.service.getSpeakingPromptById(id);
  }

  @Post('speaking/evaluate')
  evaluateSpeaking(
    @CurrentUser('id') userId: string,
    @Body() body: { promptId: string; speechText: string; durationSeconds?: number },
  ) {
    return this.service.evaluateSpeaking(
      userId,
      body.promptId,
      body.speechText || '',
      body.durationSeconds || 30,
    );
  }

  @Get('writing/prompts')
  getWritingPrompts() {
    return this.service.getWritingPrompts();
  }

  @Get('writing/prompts/:id')
  getWritingPromptById(@Param('id') id: string) {
    return this.service.getWritingPromptById(id);
  }

  @Post('writing/evaluate')
  evaluateWriting(
    @CurrentUser('id') userId: string,
    @Body() body: { promptId: string; text: string },
  ) {
    return this.service.evaluateWriting(userId, body.promptId, body.text || '');
  }
}

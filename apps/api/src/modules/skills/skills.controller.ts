import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SkillsService } from './skills.service';

@Controller('skills')
@UseGuards(JwtAuthGuard)
export class SkillsController {
  constructor(private skillsService: SkillsService) {}

  @Get('overview')
  getOverview() {
    return this.skillsService.getSkillsOverview();
  }

  @Get('parts/:part')
  getItemsByPart(@Param('part') part: string) {
    return this.skillsService.getItemsByPart(part);
  }

  @Get('items/:itemId')
  getItemDetail(@Param('itemId') itemId: string) {
    return this.skillsService.getItemById(itemId);
  }

  @Post('items/:itemId/submit')
  submitAnswer(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
    @Body() body: { answers: Record<number, string> },
  ) {
    return this.skillsService.submitSkillAnswer(userId, itemId, body.answers || {});
  }
}

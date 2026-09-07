import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SocialService } from './social.service';

@Controller('social')
@UseGuards(JwtAuthGuard)
export class SocialController {
  constructor(private socialService: SocialService) {}

  @Get('friends')
  getFriends(@CurrentUser('id') userId: string) {
    return this.socialService.getFriends(userId);
  }

  @Post('friends/request')
  sendFriendRequest(
    @CurrentUser('id') userId: string,
    @Body() body: { targetIdentifier: string },
  ) {
    return this.socialService.sendFriendRequest(userId, body.targetIdentifier);
  }

  @Post('friends/:friendshipId/accept')
  acceptFriendRequest(
    @CurrentUser('id') userId: string,
    @Param('friendshipId') friendshipId: string,
  ) {
    return this.socialService.acceptFriendRequest(userId, friendshipId);
  }

  @Get('couple-dashboard')
  getCoupleDashboard(@CurrentUser('id') userId: string) {
    return this.socialService.getCoupleDashboard(userId);
  }

  @Post('study-pulse')
  updateStudyPulse(
    @CurrentUser('id') userId: string,
    @Body() body: { minutes?: number },
  ) {
    return this.socialService.updateStudyPulse(userId, body.minutes || 15);
  }

  @Get('leaderboard')
  getLeaderboard() {
    return this.socialService.getLeaderboard();
  }
}

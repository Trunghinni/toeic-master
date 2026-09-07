import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum, Min, Max, MaxLength, IsDateString } from 'class-validator';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BandLevel } from '@toeic-master/shared-types';
import type { User } from '@prisma/client';

export class UpdateProfileRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio?: string;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(990)
  targetScore?: number;

  @IsOptional()
  @IsEnum(BandLevel)
  targetBand?: BandLevel;

  @IsOptional()
  @IsDateString()
  studyDeadline?: string;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(180)
  dailyGoalMinutes?: number;

  @IsOptional()
  @IsString()
  timezone?: string;
}

@ApiTags('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMe(@CurrentUser() user: User) {
    const fullUser = await this.userService.getMe(user.id);
    const { password, ...safe } = fullUser;
    void password;
    return { success: true, data: safe };
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileRequestDto,
  ) {
    const profile = await this.userService.updateProfile(user.id, dto);
    return { success: true, data: profile };
  }
}

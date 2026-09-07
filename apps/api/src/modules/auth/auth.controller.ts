import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

// ── Request DTOs (inline for Phase 1, move to dto/ folder later) ──

export class RegisterRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, _ and -' })
  username!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72) // argon2 limit
  password!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(60)
  displayName!: string;
}

export class LoginRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}

// ── Controller ────────────────────────────────────────────────

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  private readonly nodeEnv: string;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
  }

  // ── Register ────────────────────────────────────────────────

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new account' })
  @ApiResponse({ status: 201, description: 'User created — returns accessToken + sets refresh cookie' })
  @ApiResponse({ status: 409, description: 'Email or username already taken' })
  async register(
    @Body() dto: RegisterRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register({
      email:       dto.email,
      username:    dto.username,
      password:    dto.password,
      displayName: dto.displayName,
    });

    const tokens = await this.authService.issueTokens(user.id, user.email, user.role);
    this.setRefreshCookie(res, tokens.refreshToken, tokens.tokenId);

    return {
      success: true,
      data: {
        accessToken: tokens.accessToken,
        expiresIn:   tokens.expiresIn,
        user:        this.sanitizeUser(user),
      },
    };
  }

  // ── Login ────────────────────────────────────────────────────

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email + password' })
  @ApiResponse({ status: 200, description: 'Returns accessToken + sets refresh cookie' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login({
      email:    dto.email,
      password: dto.password,
    });

    const tokens = await this.authService.issueTokens(user.id, user.email, user.role);
    this.setRefreshCookie(res, tokens.refreshToken, tokens.tokenId);

    return {
      success: true,
      data: {
        accessToken: tokens.accessToken,
        expiresIn:   tokens.expiresIn,
        user:        this.sanitizeUser(user),
      },
    };
  }

  // ── Refresh ──────────────────────────────────────────────────

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)    // reads HttpOnly cookie → JwtRefreshStrategy
  @ApiCookieAuth('refresh_token')
  @ApiOperation({ summary: 'Rotate refresh token, issue new access token' })
  @ApiResponse({ status: 200, description: 'Returns new accessToken + rotates refresh cookie' })
  @ApiResponse({ status: 401, description: 'Refresh token missing, expired or revoked' })
  async refresh(
    @CurrentUser() userWithTokenId: User & { tokenId: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.rotateRefreshToken(
      userWithTokenId.tokenId,
      userWithTokenId.id,
      userWithTokenId.email,
      userWithTokenId.role,
    );

    this.setRefreshCookie(res, tokens.refreshToken, tokens.tokenId);

    return {
      success: true,
      data: {
        accessToken: tokens.accessToken,
        expiresIn:   tokens.expiresIn,
      },
    };
  }

  // ── Logout ───────────────────────────────────────────────────

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)   // ensure valid cookie before revoking
  @ApiCookieAuth('refresh_token')
  @ApiOperation({ summary: 'Logout — revoke refresh token, clear cookie' })
  async logout(
    @CurrentUser() userWithTokenId: User & { tokenId: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userWithTokenId.tokenId);
    this.clearRefreshCookie(res);

    return { success: true, data: { message: 'Logged out successfully' } };
  }

  // ── Me (convenience — redirects to /users/me pattern) ────────

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current authenticated user' })
  async me(@CurrentUser() user: User) {
    return {
      success: true,
      data: this.sanitizeUser(user),
    };
  }

  // ── Forgot Password ───────────────────────────────────────────

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset email (Phase 1: logs token)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(dto.email);
    return { success: true, data: result };
  }

  // ── Reset Password ────────────────────────────────────────────

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token (Phase 2)' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.password);
    return { success: true, data: { message: 'Password updated' } };
  }

  // ── Helpers ───────────────────────────────────────────────────

  /** Set HttpOnly refresh token cookie. tokenId embedded in value for identification. */
  private setRefreshCookie(res: Response, token: string, _tokenId: string) {
    const isProduction = this.nodeEnv === 'production';

    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure:   isProduction,
      // sameSite 'lax' for dev (same-origin cookie in localhost)
      // sameSite 'none' for prod (cross-origin between Vercel FE + Railway BE), requires secure:true
      sameSite: isProduction ? 'none' : 'lax',
      maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
      path:     '/api/v1/auth',           // restrict cookie scope to auth routes
    });
  }

  private clearRefreshCookie(res: Response) {
    const isProduction = this.nodeEnv === 'production';
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure:   isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path:     '/api/v1/auth',
    });
  }

  /** Strip sensitive fields before returning user to client */
  private sanitizeUser(user: User & { profile?: unknown; subscription?: unknown }) {
    const { password, ...safe } = user;
    void password; // suppress unused warning
    return safe;
  }
}

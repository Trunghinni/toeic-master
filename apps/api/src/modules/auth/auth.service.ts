import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
  displayName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  /** Access token lifetime in seconds */
  expiresIn: number;
  /** RefreshToken.id in DB — used for rotation/revocation */
  tokenId: string;
}

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {
    this.accessSecret    = this.configService.get<string>('JWT_ACCESS_SECRET',  'fallback-access-secret-change-in-prod');
    this.refreshSecret   = this.configService.get<string>('JWT_REFRESH_SECRET', 'fallback-refresh-secret-change-in-prod');
    this.accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN',  '15m');
    this.refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
  }

  // ── Registration ──────────────────────────────────────────────

  async register(dto: RegisterDto) {
    // Check uniqueness
    const existingEmail    = await this.userService.findByEmail(dto.email);
    const existingUsername = await this.userService.findByUsername(dto.username);

    if (existingEmail)    throw new ConflictException('Email already registered');
    if (existingUsername) throw new ConflictException('Username already taken');

    const hashedPassword = await argon2.hash(dto.password);

    // Create User + UserProfile + Subscription atomically
    const user = await this.prisma.user.create({
      data: {
        email:    dto.email,
        username: dto.username,
        password: hashedPassword,
        profile: {
          create: {
            displayName:     dto.displayName,
            targetScore:     700,
            dailyGoalMinutes: 30,
            timezone:        'Asia/Ho_Chi_Minh',
          },
        },
        subscription: {
          create: {
            tier:   'FREE',
            status: 'ACTIVE',
          },
        },
      },
      include: {
        profile:      true,
        subscription: true,
      },
    });

    return user;
  }

  // ── Login ─────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      // Constant-time response to prevent email enumeration
      await argon2.hash('dummy-password-to-prevent-timing-attack');
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    if (!user.password) {
      throw new UnauthorizedException('This account uses OAuth — please sign in with Google');
    }

    const passwordValid = await argon2.verify(user.password, dto.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  // ── Token Issuance ────────────────────────────────────────────

  async issueTokens(userId: string, userEmail: string, userRole: string): Promise<TokenPair> {
    const tokenId = randomUUID();

    // Sign access token (short-lived, stored in memory on FE)
    const accessToken = this.jwtService.sign(
      { sub: userId, email: userEmail, role: userRole },
      {
        secret:    this.accessSecret,
        expiresIn: this.accessExpiresIn,
      },
    );

    // Sign refresh token (long-lived, includes tokenId for DB lookup)
    const refreshToken = this.jwtService.sign(
      { sub: userId, tokenId },
      {
        secret:    this.refreshSecret,
        expiresIn: this.refreshExpiresIn,
      },
    );

    // Persist hashed refresh token to DB for revocation support
    const refreshExpiryMs = this.parseExpiryToMs(this.refreshExpiresIn);
    const hashedToken = await argon2.hash(refreshToken);

    await this.prisma.refreshToken.create({
      data: {
        id:        tokenId,
        userId,
        token:     hashedToken,
        expiresAt: new Date(Date.now() + refreshExpiryMs),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.parseExpiryToMs(this.accessExpiresIn) / 1000,
      tokenId,
    };
  }

  // ── Refresh Token Validation ──────────────────────────────────

  async validateRefreshToken(userId: string, tokenId: string, rawToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { id: tokenId },
    });

    if (!stored || stored.userId !== userId || stored.isRevoked) {
      throw new UnauthorizedException('Refresh token is invalid or revoked');
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const isValid = await argon2.verify(stored.token, rawToken);
    if (!isValid) {
      throw new UnauthorizedException('Refresh token signature mismatch');
    }

    const user = await this.userService.findById(userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  // ── Token Rotation (used during refresh) ─────────────────────

  async rotateRefreshToken(oldTokenId: string, userId: string, userEmail: string, userRole: string): Promise<TokenPair> {
    // Revoke old token (rotation — one-time use)
    await this.prisma.refreshToken.update({
      where: { id: oldTokenId },
      data:  { isRevoked: true },
    });

    // Issue fresh pair
    return this.issueTokens(userId, userEmail, userRole);
  }

  // ── Logout ────────────────────────────────────────────────────

  async logout(tokenId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { id: tokenId, isRevoked: false },
      data:  { isRevoked: true },
    });
  }

  /** Revoke ALL refresh tokens for a user (logout from all devices) */
  async logoutAll(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data:  { isRevoked: true },
    });
  }

  // ── Forgot / Reset Password ───────────────────────────────────

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    // Always return success to prevent email enumeration
    if (!user) return { message: 'If that email exists, a reset link has been sent' };

    const resetToken = randomUUID();
    // Phase 1: just log the token — email delivery in Phase 2
    console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);
    // TODO Phase 2: store token with 1h TTL + send email via SMTP

    return { message: 'If that email exists, a reset link has been sent' };
  }

  async resetPassword(_token: string, _newPassword: string) {
    // TODO Phase 2: look up token from DB, verify TTL, hash + update password
    throw new BadRequestException('Password reset via email not yet implemented — Phase 2');
  }

  // ── Helpers ───────────────────────────────────────────────────

  /** Parse '15m', '7d', '1h' → milliseconds */
  private parseExpiryToMs(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1), 10);
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return value * (multipliers[unit] ?? 1000);
  }
}

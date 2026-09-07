import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from '../../modules/auth/auth.service';

export interface JwtRefreshPayload {
  sub: string;      // userId
  tokenId: string;  // RefreshToken.id for rotation/revocation
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      // Read refresh token from HttpOnly cookie, not Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return (req?.cookies as Record<string, string>)?.['refresh_token'] ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_REFRESH_SECRET',
        'fallback-refresh-secret-change-in-prod',
      ),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtRefreshPayload) {
    const rawToken = (req.cookies as Record<string, string>)?.['refresh_token'];
    if (!rawToken) {
      throw new UnauthorizedException('No refresh token in cookie');
    }

    // Delegates to AuthService to check DB for validity + revocation
    const user = await this.authService.validateRefreshToken(
      payload.sub,
      payload.tokenId,
      rawToken,
    );

    // Return combined: user + tokenId so controller can rotate
    return { ...user, tokenId: payload.tokenId };
  }
}

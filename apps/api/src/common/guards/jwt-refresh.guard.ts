import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * JwtRefreshGuard — applied ONLY to POST /auth/refresh
 *
 * Triggers JwtRefreshStrategy which reads the HttpOnly 'refresh_token' cookie,
 * verifies the JWT signature, then calls AuthService.validateRefreshToken()
 * to check DB-backed revocation. Keeps cookie parsing + validation in the
 * Passport strategy layer rather than manual controller code.
 */
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  override handleRequest<TUser = unknown>(err: Error | null, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException(
        err?.message ?? 'Refresh token is missing, expired, or revoked',
      );
    }
    return user;
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * AuthService — Phase 0 skeleton
 * Full implementation in Phase 1
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Phase 1: implement register, login, refresh, logout, forgotPassword, resetPassword
}

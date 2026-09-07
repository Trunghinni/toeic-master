import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '../../common/prisma/prisma.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '../../common/strategies/jwt-refresh.strategy';

@Module({
  imports: [
    PrismaModule,
    UserModule,  // UserService injected by JwtStrategy + AuthService
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // Default secret for access tokens (refresh uses its own secret in strategy)
        secret: configService.get<string>(
          'JWT_ACCESS_SECRET',
          'fallback-access-secret-change-in-prod',
        ),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,         // handles 'jwt' — reads Bearer token
    JwtRefreshStrategy,  // handles 'jwt-refresh' — reads HttpOnly cookie
    // Guards are applied per-route via @UseGuards() — not globally provided here
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

import path from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { PrismaModule } from './common/prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { appConfig } from './common/config/app.config';

// Resolve .env from the monorepo root regardless of where the process is started
const ROOT_ENV = path.resolve(__dirname, '..', '..', '..', '..', '.env');

@Module({
  imports: [
    // ── Config ────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: [ROOT_ENV, '.env.local', '.env'],
    }),

    // ── Rate Limiting ─────────────────────────────────────────
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,    // 1 second
        limit: 10,    // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 60000,   // 1 minute
        limit: 100,   // 100 requests per minute
      },
    ]),

    // ── Core Modules ──────────────────────────────────────────
    PrismaModule,
    HealthModule,

    // ── Feature Modules ───────────────────────────────────────
    AuthModule,
    UserModule,
  ],
  providers: [
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

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
import { PlacementModule } from './modules/placement/placement.module';
import { RoadmapModule } from './modules/roadmap/roadmap.module';
import { VocabularyModule } from './modules/vocabulary/vocabulary.module';
import { GrammarModule } from './modules/grammar/grammar.module';
import { TestModule } from './modules/test/test.module';
import { SkillsModule } from './modules/skills/skills.module';
import { SpeakingWritingModule } from './modules/speaking-writing/speaking-writing.module';
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
      { name: 'short',  ttl: 1000,  limit: 10  },
      { name: 'medium', ttl: 60000, limit: 100 },
    ]),

    // ── Core Modules ──────────────────────────────────────────
    PrismaModule,
    HealthModule,

    // ── Feature Modules ───────────────────────────────────────
    AuthModule,
    UserModule,
    PlacementModule,
    RoadmapModule,
    VocabularyModule,
    GrammarModule,
    TestModule,
    SkillsModule,
    SpeakingWritingModule,
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

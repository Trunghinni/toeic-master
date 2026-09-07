import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const port        = configService.get<number>('PORT', 3001);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
  const nodeEnv     = configService.get<string>('NODE_ENV', 'development');

  // ── Cookie Parser ────────────────────────────────────────────
  // Must be registered BEFORE CORS so cookie headers are parsed
  app.use(cookieParser());

  // ── CORS ────────────────────────────────────────────────────
  // credentials:true required for HttpOnly cookie exchange.
  // origin must be explicit (no wildcard) when credentials:true.
  // sameSite is set per-cookie in auth.controller — lax for dev, none for prod+HTTPS.
  app.enableCors({
    origin: frontendUrl,          // FRONTEND_URL from env — no wildcard
    credentials: true,            // allow HttpOnly cookie exchange
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // ── Global Prefix ─────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ── API Versioning ────────────────────────────────────────
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ── Global Validation Pipe ────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Swagger / OpenAPI ─────────────────────────────────────
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('TOEIC Master API')
      .setDescription('Comprehensive TOEIC learning platform REST API')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addCookieAuth('refresh_token')
      .addTag('auth',   'Authentication endpoints')
      .addTag('users',  'User management')
      .addTag('health', 'Health check')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    console.info(`📚 Swagger docs: http://localhost:${port}/api/docs`);
  }

  await app.listen(port);

  console.info(`🚀 TOEIC Master API running on http://localhost:${port}/api`);
  console.info(`🌍 Environment: ${nodeEnv}`);
  console.info(`🔒 CORS origin: ${frontendUrl}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});

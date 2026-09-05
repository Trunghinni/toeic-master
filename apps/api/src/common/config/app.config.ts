import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env['PORT'] ?? '3001', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  frontendUrl: process.env['FRONTEND_URL'] ?? 'http://localhost:3000',
  corsOrigin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000',

  database: {
    url: process.env['DATABASE_URL'],
  },

  redis: {
    url: process.env['REDIS_URL'] ?? 'redis://localhost:6379',
  },

  jwt: {
    accessSecret: process.env['JWT_ACCESS_SECRET'] ?? 'fallback-access-secret-change-in-prod',
    refreshSecret: process.env['JWT_REFRESH_SECRET'] ?? 'fallback-refresh-secret-change-in-prod',
    accessExpiresIn: process.env['JWT_ACCESS_EXPIRES_IN'] ?? '15m',
    refreshExpiresIn: process.env['JWT_REFRESH_EXPIRES_IN'] ?? '7d',
  },

  google: {
    clientId: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackUrl: process.env['GOOGLE_CALLBACK_URL'] ?? 'http://localhost:3001/api/auth/google/callback',
  },

  smtp: {
    host: process.env['SMTP_HOST'],
    port: parseInt(process.env['SMTP_PORT'] ?? '587', 10),
    user: process.env['SMTP_USER'],
    pass: process.env['SMTP_PASS'],
    from: process.env['SMTP_FROM'] ?? 'noreply@toeicmaster.vn',
  },

  ai: {
    anthropicApiKey: process.env['ANTHROPIC_API_KEY'],
    openaiApiKey: process.env['OPENAI_API_KEY'],
    azureSpeechKey: process.env['AZURE_SPEECH_KEY'],
    azureSpeechRegion: process.env['AZURE_SPEECH_REGION'] ?? 'southeastasia',
  },

  s3: {
    endpoint: process.env['S3_ENDPOINT'],
    region: process.env['S3_REGION'] ?? 'ap-southeast-1',
    accessKey: process.env['S3_ACCESS_KEY'],
    secretKey: process.env['S3_SECRET_KEY'],
    bucketName: process.env['S3_BUCKET_NAME'] ?? 'toeic-master-media',
    publicUrl: process.env['S3_PUBLIC_URL'],
  },
}));

export type AppConfig = ReturnType<typeof appConfig>;

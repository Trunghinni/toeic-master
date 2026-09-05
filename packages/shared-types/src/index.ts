// ─────────────────────────────────────────────────────────────
// Shared Types — TOEIC Master
// DTOs and interfaces shared between frontend and backend
// ─────────────────────────────────────────────────────────────

// ─── Enums (mirror Prisma enums for FE use) ──────────────────

export enum UserRole {
  ADMIN = 'ADMIN',
  CONTENT_EDITOR = 'CONTENT_EDITOR',
  USER = 'USER',
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
}

export enum BandLevel {
  BAND_1 = 'BAND_1',
  BAND_2 = 'BAND_2',
  BAND_3 = 'BAND_3',
  BAND_4 = 'BAND_4',
  BAND_5 = 'BAND_5',
  BAND_6 = 'BAND_6',
}

export enum SkillType {
  LISTENING = 'LISTENING',
  READING = 'READING',
  SPEAKING = 'SPEAKING',
  WRITING = 'WRITING',
  VOCABULARY = 'VOCABULARY',
  GRAMMAR = 'GRAMMAR',
}

export enum TestPartType {
  PART_1 = 'PART_1',
  PART_2 = 'PART_2',
  PART_3 = 'PART_3',
  PART_4 = 'PART_4',
  PART_5 = 'PART_5',
  PART_6 = 'PART_6',
  PART_7 = 'PART_7',
}

export const BAND_SCORE_RANGES: Record<BandLevel, { min: number; max: number; label: string }> = {
  [BandLevel.BAND_1]: { min: 10, max: 250, label: 'Mất gốc (10–250)' },
  [BandLevel.BAND_2]: { min: 255, max: 400, label: 'Cơ bản (255–400)' },
  [BandLevel.BAND_3]: { min: 405, max: 600, label: 'Trung cấp (405–600)' },
  [BandLevel.BAND_4]: { min: 605, max: 750, label: 'Khá (605–750)' },
  [BandLevel.BAND_5]: { min: 755, max: 900, label: 'Giỏi (755–900)' },
  [BandLevel.BAND_6]: { min: 905, max: 990, label: 'Xuất sắc (905–990)' },
};

// ─── Auth DTOs ────────────────────────────────────────────────

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

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponseDto {
  user: UserDto;
  tokens: AuthTokensDto;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

// ─── User DTOs ────────────────────────────────────────────────

export interface UserDto {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  profile: UserProfileDto | null;
  subscription: SubscriptionDto | null;
  createdAt: string;
}

export interface UserProfileDto {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  targetScore: number;
  currentBand: BandLevel;
  targetBand: BandLevel;
  studyDeadline: string | null;
  dailyGoalMinutes: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastStudiedAt: string | null;
  timezone: string;
}

export interface SubscriptionDto {
  tier: SubscriptionTier;
  status: string;
  aiGradingsUsed: number;
  aiGradingsLimit: number;
  testAttemptsUsed: number;
  testAttemptsLimit: number;
  currentPeriodEnd: string | null;
}

export interface UpdateProfileDto {
  displayName?: string;
  bio?: string;
  targetScore?: number;
  targetBand?: BandLevel;
  studyDeadline?: string;
  dailyGoalMinutes?: number;
  timezone?: string;
}

// ─── Placement Test DTOs ──────────────────────────────────────

export interface PlacementQuestion {
  id: string;
  type: 'grammar' | 'vocabulary' | 'reading';
  questionText: string;
  options: { id: string; text: string }[];
  imageUrl?: string;
}

export interface SubmitPlacementTestDto {
  answers: Record<string, string>; // { questionId: selectedOptionId }
}

export interface PlacementTestResultDto {
  estimatedBand: BandLevel;
  estimatedScore: number;
  listeningScore: number;
  readingScore: number;
  grammarScore: number;
  vocabularyScore: number;
  breakdown: {
    correct: number;
    total: number;
    percentage: number;
  };
}

// ─── Roadmap DTOs ────────────────────────────────────────────

export interface GenerateRoadmapDto {
  targetBand: BandLevel;
  targetScore: number;
  studyDeadline?: string;
  dailyGoalMinutes: number;
}

export interface RoadmapNodeDto {
  id: string;
  type: string;
  status: string;
  title: string;
  description: string | null;
  weekNumber: number;
  dayNumber: number;
  orderInDay: number;
  xpReward: number;
}

export interface RoadmapDto {
  id: string;
  targetBand: BandLevel;
  targetScore: number;
  studyDeadline: string | null;
  totalWeeks: number;
  currentWeek: number;
  nodes: RoadmapNodeDto[];
}

// ─── Vocabulary DTOs ─────────────────────────────────────────

export interface VocabularyCardDto {
  id: string;
  word: string;
  phonetic: string | null;
  wordType: string;
  definition: string;
  definitionEn: string | null;
  example: string | null;
  exampleVi: string | null;
  imageUrl: string | null;
  audioUsUrl: string | null;
  audioUkUrl: string | null;
  tags: string[];
  progress?: UserCardProgressDto;
}

export interface UserCardProgressDto {
  repetitions: number;
  easinessFactor: number;
  interval: number;
  nextReviewAt: string;
  lastReviewedAt: string | null;
  isLearned: boolean;
  totalReviews: number;
  correctCount: number;
  incorrectCount: number;
}

export interface SM2ReviewDto {
  cardId: string;
  quality: 0 | 1 | 2 | 3 | 4 | 5; // SM-2 quality rating
}

export interface SM2ReviewResultDto {
  nextReviewAt: string;
  interval: number;
  easinessFactor: number;
  isLearned: boolean;
}

// ─── Dashboard / Stats DTOs ───────────────────────────────────

export interface DashboardStatsDto {
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  wordsLearned: number;
  wordsDueToday: number;
  testsTaken: number;
  bestTestScore: number | null;
  skillRadar: {
    skill: SkillType;
    score: number; // 0-100
  }[];
  recentActivity: {
    date: string;
    xpEarned: number;
    activitiesCompleted: number;
  }[];
}

// ─── API Response Wrappers ────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationQueryDto {
  page?: number;
  limit?: number;
  search?: string;
}

// ─── Health Check ─────────────────────────────────────────────

export interface HealthCheckDto {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
  services: {
    database: 'ok' | 'error';
    redis: 'ok' | 'error';
  };
}

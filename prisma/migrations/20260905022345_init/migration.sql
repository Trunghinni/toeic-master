-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CONTENT_EDITOR', 'USER');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED', 'PAST_DUE');

-- CreateEnum
CREATE TYPE "BandLevel" AS ENUM ('BAND_1', 'BAND_2', 'BAND_3', 'BAND_4', 'BAND_5', 'BAND_6');

-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('LISTENING', 'READING', 'SPEAKING', 'WRITING', 'VOCABULARY', 'GRAMMAR');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('MULTIPLE_CHOICE', 'FILL_IN_THE_BLANK', 'ERROR_CORRECTION', 'MATCHING', 'ORDERING', 'SHORT_ANSWER');

-- CreateEnum
CREATE TYPE "StudyMode" AS ENUM ('FLIP_CARD', 'MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'LISTEN_CHOOSE', 'MATCH_IMAGE');

-- CreateEnum
CREATE TYPE "TestPartType" AS ENUM ('PART_1', 'PART_2', 'PART_3', 'PART_4', 'PART_5', 'PART_6', 'PART_7');

-- CreateEnum
CREATE TYPE "TestMode" AS ENUM ('PRACTICE', 'FULL_TEST', 'MINI_TEST');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('STREAK_REMINDER', 'REVIEW_DUE', 'FRIEND_REQUEST', 'CHALLENGE_INVITE', 'GROUP_ACTIVITY', 'ACHIEVEMENT_UNLOCKED', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AchievementCategory" AS ENUM ('STREAK', 'VOCABULARY', 'GRAMMAR', 'LISTENING', 'READING', 'SPEAKING', 'WRITING', 'TEST_SCORE', 'SOCIAL', 'MILESTONE');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WordType" AS ENUM ('NOUN', 'VERB', 'ADJECTIVE', 'ADVERB', 'PREPOSITION', 'CONJUNCTION', 'PRONOUN', 'INTERJECTION', 'PHRASE', 'OTHER');

-- CreateEnum
CREATE TYPE "RoadmapNodeType" AS ENUM ('VOCABULARY_TOPIC', 'GRAMMAR_TOPIC', 'LISTENING_SKILL', 'READING_SKILL', 'SPEAKING_SKILL', 'WRITING_SKILL', 'MINI_TEST', 'FULL_TEST');

-- CreateEnum
CREATE TYPE "RoadmapNodeStatus" AS ENUM ('LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "targetScore" INTEGER NOT NULL DEFAULT 700,
    "currentBand" "BandLevel" NOT NULL DEFAULT 'BAND_1',
    "targetBand" "BandLevel" NOT NULL DEFAULT 'BAND_4',
    "studyDeadline" TIMESTAMP(3),
    "dailyGoalMinutes" INTEGER NOT NULL DEFAULT 30,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastStudiedAt" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    "language" TEXT NOT NULL DEFAULT 'vi',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oauth_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oauth_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeCustomerId" TEXT,
    "stripeSubId" TEXT,
    "vnpayOrderId" TEXT,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "aiGradingsUsed" INTEGER NOT NULL DEFAULT 0,
    "aiGradingsLimit" INTEGER NOT NULL DEFAULT 5,
    "testAttemptsUsed" INTEGER NOT NULL DEFAULT 0,
    "testAttemptsLimit" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placement_test_results" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "estimatedBand" "BandLevel" NOT NULL,
    "listeningScore" INTEGER NOT NULL,
    "readingScore" INTEGER NOT NULL,
    "grammarScore" INTEGER NOT NULL,
    "vocabularyScore" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "placement_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmaps" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "placementTestResultId" TEXT,
    "targetBand" "BandLevel" NOT NULL,
    "targetScore" INTEGER NOT NULL,
    "studyDeadline" TIMESTAMP(3),
    "totalWeeks" INTEGER NOT NULL,
    "currentWeek" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_nodes" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "type" "RoadmapNodeType" NOT NULL,
    "status" "RoadmapNodeStatus" NOT NULL DEFAULT 'LOCKED',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "weekNumber" INTEGER NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "orderInDay" INTEGER NOT NULL DEFAULT 1,
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "vocabTopicId" TEXT,
    "grammarTopicId" TEXT,
    "testId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmap_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_topics" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "targetBand" "BandLevel",
    "cardCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vocabulary_cards" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "phonetic" TEXT,
    "wordType" "WordType" NOT NULL DEFAULT 'OTHER',
    "definition" TEXT NOT NULL,
    "definitionEn" TEXT,
    "example" TEXT,
    "exampleVi" TEXT,
    "imageUrl" TEXT,
    "audioUsUrl" TEXT,
    "audioUkUrl" TEXT,
    "tags" TEXT[],
    "orderInTopic" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vocabulary_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_card_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "easinessFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "nextReviewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewedAt" TIMESTAMP(3),
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "incorrectCount" INTEGER NOT NULL DEFAULT 0,
    "isLearned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_card_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grammar_topics" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "rule" TEXT NOT NULL,
    "formula" TEXT,
    "examples" JSONB NOT NULL,
    "tips" TEXT,
    "commonErrors" JSONB,
    "targetBand" "BandLevel",
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grammar_topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grammar_cards" (
    "id" TEXT NOT NULL,
    "grammarTopicId" TEXT NOT NULL,
    "type" "ExerciseType" NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB,
    "correctAnswer" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grammar_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "grammarCardId" TEXT NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "timeSpentMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listening_items" (
    "id" TEXT NOT NULL,
    "part" "TestPartType" NOT NULL,
    "title" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "transcriptUrl" TEXT,
    "transcript" TEXT,
    "duration" INTEGER NOT NULL,
    "targetBand" "BandLevel",
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "listening_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reading_items" (
    "id" TEXT NOT NULL,
    "part" "TestPartType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "targetBand" "BandLevel",
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reading_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaking_tasks" (
    "id" TEXT NOT NULL,
    "taskNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "sampleImageUrl" TEXT,
    "sampleAudioUrl" TEXT,
    "sampleScript" TEXT,
    "targetBand" "BandLevel",
    "prepTimeSeconds" INTEGER NOT NULL DEFAULT 30,
    "speakTimeSeconds" INTEGER NOT NULL DEFAULT 45,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "speaking_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaking_submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "speakingTaskId" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "transcript" TEXT,
    "waveformData" JSONB,
    "pronunciationScore" DOUBLE PRECISION,
    "fluencyScore" DOUBLE PRECISION,
    "grammarScore" DOUBLE PRECISION,
    "vocabularyScore" DOUBLE PRECISION,
    "estimatedScore" DOUBLE PRECISION,
    "aiFeedback" TEXT,
    "aiRawResponse" JSONB,
    "gradingStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "speaking_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "writing_tasks" (
    "id" TEXT NOT NULL,
    "taskNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "imageUrl" TEXT,
    "wordLimit" INTEGER,
    "timeLimit" INTEGER,
    "sampleAnswer" TEXT,
    "rubric" JSONB NOT NULL,
    "targetBand" "BandLevel",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "writing_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "writing_submissions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "writingTaskId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "wordCount" INTEGER,
    "scores" JSONB,
    "totalScore" DOUBLE PRECISION,
    "feedback" TEXT,
    "corrections" JSONB,
    "aiFeedback" TEXT,
    "aiRawResponse" JSONB,
    "gradingStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "writing_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mode" "TestMode" NOT NULL DEFAULT 'PRACTICE',
    "parts" "TestPartType"[],
    "bandRange" "BandLevel"[],
    "durationMins" INTEGER NOT NULL DEFAULT 120,
    "totalQuestions" INTEGER NOT NULL DEFAULT 200,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_questions" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "part" "TestPartType" NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "questionText" TEXT,
    "options" JSONB NOT NULL,
    "correctOptionId" TEXT NOT NULL,
    "explanation" TEXT,
    "imageUrl" TEXT,
    "listeningItemId" TEXT,
    "readingItemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "mode" "TestMode" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "timeSpentSeconds" INTEGER,
    "listeningScaled" INTEGER,
    "readingScaled" INTEGER,
    "totalScaled" INTEGER,
    "partBreakdown" JSONB,
    "totalCorrect" INTEGER,
    "totalQuestions" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_answers" (
    "id" TEXT NOT NULL,
    "testAttemptId" TEXT NOT NULL,
    "testQuestionId" TEXT NOT NULL,
    "selectedOptionId" TEXT,
    "isCorrect" BOOLEAN,
    "timeSpentMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendships" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "addresseeId" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_groups" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "avatarUrl" TEXT,
    "targetBand" "BandLevel",
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "maxMembers" INTEGER NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_group_members" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "testId" TEXT,
    "status" "ChallengeStatus" NOT NULL DEFAULT 'PENDING',
    "durationMs" INTEGER NOT NULL DEFAULT 600000,
    "startedAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_results" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenge_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT,
    "category" "AchievementCategory" NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "requirement" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xp_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "xp" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "user_profiles"("userId");

-- CreateIndex
CREATE INDEX "user_profiles_userId_idx" ON "user_profiles"("userId");

-- CreateIndex
CREATE INDEX "oauth_accounts_userId_idx" ON "oauth_accounts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "oauth_accounts_provider_providerUserId_key" ON "oauth_accounts"("provider", "providerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "placement_test_results_userId_idx" ON "placement_test_results"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "roadmaps_userId_key" ON "roadmaps"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "roadmaps_placementTestResultId_key" ON "roadmaps"("placementTestResultId");

-- CreateIndex
CREATE INDEX "roadmaps_userId_idx" ON "roadmaps"("userId");

-- CreateIndex
CREATE INDEX "roadmap_nodes_roadmapId_idx" ON "roadmap_nodes"("roadmapId");

-- CreateIndex
CREATE INDEX "roadmap_nodes_roadmapId_weekNumber_idx" ON "roadmap_nodes"("roadmapId", "weekNumber");

-- CreateIndex
CREATE INDEX "vocabulary_topics_ownerId_idx" ON "vocabulary_topics"("ownerId");

-- CreateIndex
CREATE INDEX "vocabulary_topics_isSystem_idx" ON "vocabulary_topics"("isSystem");

-- CreateIndex
CREATE INDEX "vocabulary_cards_topicId_idx" ON "vocabulary_cards"("topicId");

-- CreateIndex
CREATE INDEX "user_card_progress_userId_idx" ON "user_card_progress"("userId");

-- CreateIndex
CREATE INDEX "user_card_progress_userId_nextReviewAt_idx" ON "user_card_progress"("userId", "nextReviewAt");

-- CreateIndex
CREATE INDEX "user_card_progress_nextReviewAt_idx" ON "user_card_progress"("nextReviewAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_card_progress_userId_cardId_key" ON "user_card_progress"("userId", "cardId");

-- CreateIndex
CREATE INDEX "grammar_topics_isSystem_idx" ON "grammar_topics"("isSystem");

-- CreateIndex
CREATE INDEX "grammar_cards_grammarTopicId_idx" ON "grammar_cards"("grammarTopicId");

-- CreateIndex
CREATE INDEX "exercise_attempts_userId_idx" ON "exercise_attempts"("userId");

-- CreateIndex
CREATE INDEX "exercise_attempts_userId_grammarCardId_idx" ON "exercise_attempts"("userId", "grammarCardId");

-- CreateIndex
CREATE INDEX "listening_items_part_idx" ON "listening_items"("part");

-- CreateIndex
CREATE INDEX "reading_items_part_idx" ON "reading_items"("part");

-- CreateIndex
CREATE INDEX "speaking_tasks_taskNumber_idx" ON "speaking_tasks"("taskNumber");

-- CreateIndex
CREATE INDEX "speaking_submissions_userId_idx" ON "speaking_submissions"("userId");

-- CreateIndex
CREATE INDEX "speaking_submissions_userId_speakingTaskId_idx" ON "speaking_submissions"("userId", "speakingTaskId");

-- CreateIndex
CREATE INDEX "writing_tasks_taskNumber_idx" ON "writing_tasks"("taskNumber");

-- CreateIndex
CREATE INDEX "writing_submissions_userId_idx" ON "writing_submissions"("userId");

-- CreateIndex
CREATE INDEX "writing_submissions_userId_writingTaskId_idx" ON "writing_submissions"("userId", "writingTaskId");

-- CreateIndex
CREATE INDEX "tests_mode_idx" ON "tests"("mode");

-- CreateIndex
CREATE INDEX "tests_isPublished_idx" ON "tests"("isPublished");

-- CreateIndex
CREATE INDEX "test_questions_testId_idx" ON "test_questions"("testId");

-- CreateIndex
CREATE INDEX "test_questions_testId_part_idx" ON "test_questions"("testId", "part");

-- CreateIndex
CREATE INDEX "test_attempts_userId_idx" ON "test_attempts"("userId");

-- CreateIndex
CREATE INDEX "test_attempts_userId_testId_idx" ON "test_attempts"("userId", "testId");

-- CreateIndex
CREATE INDEX "test_attempts_userId_completedAt_idx" ON "test_attempts"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "test_answers_testAttemptId_idx" ON "test_answers"("testAttemptId");

-- CreateIndex
CREATE UNIQUE INDEX "test_answers_testAttemptId_testQuestionId_key" ON "test_answers"("testAttemptId", "testQuestionId");

-- CreateIndex
CREATE INDEX "friendships_requesterId_idx" ON "friendships"("requesterId");

-- CreateIndex
CREATE INDEX "friendships_addresseeId_idx" ON "friendships"("addresseeId");

-- CreateIndex
CREATE UNIQUE INDEX "friendships_requesterId_addresseeId_key" ON "friendships"("requesterId", "addresseeId");

-- CreateIndex
CREATE INDEX "study_groups_ownerId_idx" ON "study_groups"("ownerId");

-- CreateIndex
CREATE INDEX "study_group_members_groupId_idx" ON "study_group_members"("groupId");

-- CreateIndex
CREATE INDEX "study_group_members_userId_idx" ON "study_group_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "study_group_members_groupId_userId_key" ON "study_group_members"("groupId", "userId");

-- CreateIndex
CREATE INDEX "challenges_senderId_idx" ON "challenges"("senderId");

-- CreateIndex
CREATE INDEX "challenges_receiverId_idx" ON "challenges"("receiverId");

-- CreateIndex
CREATE INDEX "challenge_results_challengeId_idx" ON "challenge_results"("challengeId");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_results_challengeId_userId_key" ON "challenge_results"("challengeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "achievements_key_key" ON "achievements"("key");

-- CreateIndex
CREATE INDEX "user_achievements_userId_idx" ON "user_achievements"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_userId_achievementId_key" ON "user_achievements"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "xp_logs_userId_idx" ON "xp_logs"("userId");

-- CreateIndex
CREATE INDEX "xp_logs_userId_createdAt_idx" ON "xp_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_userId_createdAt_idx" ON "notifications"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placement_test_results" ADD CONSTRAINT "placement_test_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_placementTestResultId_fkey" FOREIGN KEY ("placementTestResultId") REFERENCES "placement_test_results"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_nodes" ADD CONSTRAINT "roadmap_nodes_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_topics" ADD CONSTRAINT "vocabulary_topics_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_cards" ADD CONSTRAINT "vocabulary_cards_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "vocabulary_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_card_progress" ADD CONSTRAINT "user_card_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_card_progress" ADD CONSTRAINT "user_card_progress_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "vocabulary_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grammar_cards" ADD CONSTRAINT "grammar_cards_grammarTopicId_fkey" FOREIGN KEY ("grammarTopicId") REFERENCES "grammar_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_attempts" ADD CONSTRAINT "exercise_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_attempts" ADD CONSTRAINT "exercise_attempts_grammarCardId_fkey" FOREIGN KEY ("grammarCardId") REFERENCES "grammar_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_submissions" ADD CONSTRAINT "speaking_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_submissions" ADD CONSTRAINT "speaking_submissions_speakingTaskId_fkey" FOREIGN KEY ("speakingTaskId") REFERENCES "speaking_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_submissions" ADD CONSTRAINT "writing_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_submissions" ADD CONSTRAINT "writing_submissions_writingTaskId_fkey" FOREIGN KEY ("writingTaskId") REFERENCES "writing_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_questions" ADD CONSTRAINT "test_questions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_questions" ADD CONSTRAINT "test_questions_listeningItemId_fkey" FOREIGN KEY ("listeningItemId") REFERENCES "listening_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_questions" ADD CONSTRAINT "test_questions_readingItemId_fkey" FOREIGN KEY ("readingItemId") REFERENCES "reading_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_attempts" ADD CONSTRAINT "test_attempts_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_answers" ADD CONSTRAINT "test_answers_testAttemptId_fkey" FOREIGN KEY ("testAttemptId") REFERENCES "test_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_answers" ADD CONSTRAINT "test_answers_testQuestionId_fkey" FOREIGN KEY ("testQuestionId") REFERENCES "test_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_groups" ADD CONSTRAINT "study_groups_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_members" ADD CONSTRAINT "study_group_members_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "study_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_group_members" ADD CONSTRAINT "study_group_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_results" ADD CONSTRAINT "challenge_results_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_results" ADD CONSTRAINT "challenge_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_logs" ADD CONSTRAINT "xp_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

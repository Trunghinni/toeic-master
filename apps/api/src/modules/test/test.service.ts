import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SEED_TESTS } from './test.data';

export interface SubmitTestResult {
  attemptId: string;
  totalCorrect: number;
  totalQuestions: number;
  percentage: number;
  listeningScaled: number;
  readingScaled: number;
  totalScaled: number;
  timeSpentSeconds: number;
  partBreakdown: Record<string, { correct: number; total: number }>;
  xpEarned: number;
}

@Injectable()
export class TestService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Seed / Ensure test bank items exist
   */
  async seedInitialTests(): Promise<void> {
    for (const item of SEED_TESTS) {
      const test = await this.prisma.test.upsert({
        where: { id: item.id },
        create: {
          id: item.id,
          title: item.title,
          description: item.description,
          mode: item.mode as never,
          durationMins: item.durationMins,
          totalQuestions: item.questions.length > 0 ? item.questions.length : item.totalQuestions,
          parts: item.parts as never,
          isPublished: true,
          isFree: true,
        },
        update: {
          title: item.title,
          description: item.description,
          durationMins: item.durationMins,
        },
      });

      for (const q of item.questions) {
        const existing = await this.prisma.testQuestion.findFirst({
          where: { testId: test.id, questionNumber: q.questionNumber },
        });

        if (!existing) {
          await this.prisma.testQuestion.create({
            data: {
              testId: test.id,
              part: q.part as never,
              questionNumber: q.questionNumber,
              questionText: q.questionText,
              options: q.options as never,
              correctOptionId: q.correctOptionId,
              explanation: q.explanation,
            },
          });
        }
      }
    }
  }

  /**
   * Get all tests with optional filter by mode (PRACTICE / MOCK_TEST)
   */
  async getTests(userId?: string, mode?: string) {
    await this.seedInitialTests();

    const tests = await this.prisma.test.findMany({
      where: {
        isPublished: true,
        ...(mode ? { mode: mode as never } : {}),
      },
      include: {
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!userId) {
      return tests.map((t) => ({ ...t, bestScore: null, attemptCount: 0 }));
    }

    const attempts = await this.prisma.testAttempt.findMany({
      where: { userId },
      select: { testId: true, totalScaled: true },
    });

    const attemptMap = new Map<string, { count: number; maxScore: number }>();
    for (const a of attempts) {
      const curr = attemptMap.get(a.testId) ?? { count: 0, maxScore: 0 };
      attemptMap.set(a.testId, {
        count: curr.count + 1,
        maxScore: Math.max(curr.maxScore, a.totalScaled ?? 0),
      });
    }

    return tests.map((t) => {
      const info = attemptMap.get(t.id);
      return {
        ...t,
        bestScore: info?.maxScore ?? null,
        attemptCount: info?.count ?? 0,
        questionCount: t._count.questions || t.totalQuestions,
      };
    });
  }

  /**
   * Get test detail for taking test (WITHOUT correctOptionId)
   */
  async getTestForTaking(testId: string) {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          orderBy: { questionNumber: 'asc' },
          select: {
            id: true,
            part: true,
            questionNumber: true,
            questionText: true,
            options: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  /**
   * Submit test attempt, calculate TOEIC scaled score and auto-log mistakes
   */
  async submitAttempt(
    userId: string,
    testId: string,
    answers: Record<string, string>, // questionId: selectedOptionId
    timeSpentSeconds: number,
  ): Promise<SubmitTestResult> {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: { questions: true },
    });
    if (!test) throw new NotFoundException('Test not found');

    const partBreakdown: Record<string, { correct: number; total: number }> = {};
    let totalCorrect = 0;
    const totalQuestions = test.questions.length;

    let listeningCorrect = 0;
    let listeningTotal = 0;
    let readingCorrect = 0;
    let readingTotal = 0;

    const answerRecords = [];

    for (const q of test.questions) {
      const partKey = q.part;
      if (!partBreakdown[partKey]) {
        partBreakdown[partKey] = { correct: 0, total: 0 };
      }
      partBreakdown[partKey].total += 1;

      const isListening = ['PART_1', 'PART_2', 'PART_3', 'PART_4'].includes(q.part);
      if (isListening) listeningTotal += 1;
      else readingTotal += 1;

      const userAns = answers[q.id] ?? '';
      const isCorrect = userAns.trim().toUpperCase() === q.correctOptionId.trim().toUpperCase();

      if (isCorrect) {
        totalCorrect += 1;
        partBreakdown[partKey].correct += 1;
        if (isListening) listeningCorrect += 1;
        else readingCorrect += 1;
      } else {
        // AUTOMATIC MISTAKE NOTEBOOK LOGGING
        if (q.questionText) {
          await this.logTestMistake(userId, q.questionText, q.explanation ?? 'Xem lại câu hỏi');
        }
      }

      answerRecords.push({
        questionId: q.id,
        selectedOptionId: userAns,
        isCorrect,
      });
    }

    // TOEIC Scaled Score conversion (5-495 per section)
    // Real ETS TOEIC scores are rounded to multiples of 5 ending in 0 or 5
    const roundTo5 = (score: number) => Math.min(495, Math.max(5, Math.round(score / 5) * 5));

    const listeningPct = listeningTotal > 0 ? listeningCorrect / listeningTotal : 0;
    const readingPct = readingTotal > 0 ? readingCorrect / readingTotal : 0;

    const listeningScaled = listeningTotal > 0 ? roundTo5(5 + listeningPct * 490) : 0;
    const readingScaled = readingTotal > 0 ? roundTo5(5 + readingPct * 490) : 0;

    let totalScaled: number;
    if (listeningTotal > 0 && readingTotal > 0) {
      totalScaled = listeningScaled + readingScaled; // 10..990
    } else if (listeningTotal > 0) {
      // Single-section listening test: scale to full 10-990 equivalent
      totalScaled = listeningScaled * 2;
    } else {
      // Single-section reading test: scale to full 10-990 equivalent
      totalScaled = readingScaled * 2;
    }

    const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const xpEarned = 30 + Math.round(percentage / 3);

    // Save TestAttempt
    const attempt = await this.prisma.testAttempt.create({
      data: {
        userId,
        testId: test.id,
        status: 'COMPLETED',
        mode: test.mode,
        completedAt: new Date(),
        timeSpentSeconds,
        listeningScaled,
        readingScaled,
        totalScaled,
        partBreakdown: partBreakdown as never,
        totalCorrect,
        totalQuestions,
      },
    });

    // Save answers
    await this.prisma.testAnswer.createMany({
      data: answerRecords.map((a) => ({
        testAttemptId: attempt.id,
        testQuestionId: a.questionId,
        selectedOptionId: a.selectedOptionId,
        isCorrect: a.isCorrect,
      })),
    });

    // Award XP
    await this.prisma.userProfile.updateMany({
      where: { userId },
      data: { totalXp: { increment: xpEarned } },
    });

    return {
      attemptId: attempt.id,
      totalCorrect,
      totalQuestions,
      percentage,
      listeningScaled,
      readingScaled,
      totalScaled,
      timeSpentSeconds,
      partBreakdown,
      xpEarned,
    };
  }

  /**
   * Get user's test attempt history
   */
  async getUserAttempts(userId: string) {
    return this.prisma.testAttempt.findMany({
      where: { userId, status: 'COMPLETED' },
      include: {
        test: { select: { title: true, mode: true } },
      },
      orderBy: { completedAt: 'desc' },
      take: 20,
    });
  }

  /**
   * Helper: Log incorrect test question to Mistake Notebook
   */
  private async logTestMistake(userId: string, question: string, explanation: string) {
    let mistakeTopic = await this.prisma.vocabularyTopic.findFirst({
      where: { ownerId: userId, title: 'Mistake Notebook' },
    });

    if (!mistakeTopic) {
      mistakeTopic = await this.prisma.vocabularyTopic.create({
        data: {
          ownerId: userId,
          title: 'Mistake Notebook',
          description: 'Tự động lưu các câu làm sai',
          isSystem: false,
          isPublic: false,
        },
      });
    }

    // Anti-duplication check: avoid duplicate cards if already recorded
    const alreadyLogged = await this.prisma.vocabularyCard.findFirst({
      where: { topicId: mistakeTopic.id, example: question },
    });
    if (alreadyLogged) return;

    const shortWord = question.slice(0, 32) + '...';
    await this.prisma.vocabularyCard.create({
      data: {
        topicId: mistakeTopic.id,
        word: shortWord,
        phonetic: 'Test Question',
        wordType: 'OTHER',
        definition: explanation,
        example: question,
        tags: ['test-mistake'],
      },
    });

    await this.prisma.vocabularyTopic.update({
      where: { id: mistakeTopic.id },
      data: { cardCount: { increment: 1 } },
    });
  }
}

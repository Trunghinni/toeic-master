import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PLACEMENT_QUESTIONS, type PlacementQuestion } from './placement.questions';

// Band level score boundaries (TOEIC 10-990)
const BAND_THRESHOLDS = [
  { band: 'BAND_6', minScore: 905 },
  { band: 'BAND_5', minScore: 755 },
  { band: 'BAND_4', minScore: 605 },
  { band: 'BAND_3', minScore: 405 },
  { band: 'BAND_2', minScore: 255 },
  { band: 'BAND_1', minScore: 10 },
] as const;

// Score midpoints per band level (used for estimation)
const BAND_MIDPOINTS: Record<number, number> = {
  1: 130,  // Band 1 midpoint
  2: 330,  // Band 2 midpoint
  3: 500,  // Band 3 midpoint
  4: 675,  // Band 4 midpoint
  5: 825,  // Band 5 midpoint
  6: 950,  // Band 6 midpoint
};

export interface SubmitAnswers {
  answers: Record<string, string>; // { questionId: selectedOptionId }
}

export interface PlacementResult {
  estimatedBand: string;
  estimatedScore: number;
  totalCorrect: number;
  totalQuestions: number;
  grammarScore: number;
  vocabularyScore: number;
  readingScore: number;
  listeningScore: number; // proxy for Phase 1
  breakdown: { correct: number; total: number; percentage: number };
}

@Injectable()
export class PlacementService {
  constructor(private readonly prisma: PrismaService) {}

  /** Return all questions in shuffled order, WITHOUT correctOptionId */
  getQuestions(): Omit<PlacementQuestion, 'correctOptionId'>[] {
    return [...PLACEMENT_QUESTIONS]
      .sort(() => Math.random() - 0.5)
      .map(({ correctOptionId: _omit, ...q }) => q);
  }

  /** Score submission, estimate band, persist result */
  async submitTest(
    userId: string,
    answers: Record<string, string>,
  ): Promise<PlacementResult> {
    const questionMap = new Map(PLACEMENT_QUESTIONS.map((q) => [q.id, q]));

    let grammarCorrect = 0; let grammarTotal = 0;
    let vocabCorrect = 0;   let vocabTotal = 0;
    let readingCorrect = 0; let readingTotal = 0;

    for (const [questionId, selectedOptionId] of Object.entries(answers)) {
      const q = questionMap.get(questionId);
      if (!q) continue;

      const isCorrect = q.correctOptionId === selectedOptionId;
      if (q.type === 'grammar')    { grammarTotal++;  if (isCorrect) grammarCorrect++; }
      if (q.type === 'vocabulary') { vocabTotal++;    if (isCorrect) vocabCorrect++; }
      if (q.type === 'reading')    { readingTotal++;  if (isCorrect) readingCorrect++; }
    }

    const totalCorrect = grammarCorrect + vocabCorrect + readingCorrect;
    const totalQuestions = grammarTotal + vocabTotal + readingTotal;
    const percentage = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

    // Estimate overall TOEIC score using weighted band calculation
    const estimatedScore = this.estimateScore(answers, questionMap);
    const estimatedBand = this.scoreToBand(estimatedScore);

    // Sub-scores (scaled to 0-100 for Phase 1)
    const grammarScore    = grammarTotal    ? Math.round((grammarCorrect / grammarTotal) * 100)    : 0;
    const vocabularyScore = vocabTotal      ? Math.round((vocabCorrect / vocabTotal) * 100)         : 0;
    const readingScore    = readingTotal    ? Math.round((readingCorrect / readingTotal) * 100)     : 0;
    const listeningScore  = grammarScore;  // proxy — no listening in placement Phase 1

    // Persist to DB
    await this.prisma.placementTestResult.create({
      data: {
        userId,
        totalScore:     Math.round(percentage * 100),
        estimatedBand:  estimatedBand as never,
        listeningScore,
        readingScore,
        grammarScore,
        vocabularyScore,
        answers:        answers as never,
      },
    });

    return {
      estimatedBand,
      estimatedScore,
      totalCorrect,
      totalQuestions,
      grammarScore,
      vocabularyScore,
      readingScore,
      listeningScore,
      breakdown: {
        correct:    totalCorrect,
        total:      totalQuestions,
        percentage: Math.round(percentage * 100),
      },
    };
  }

  /** Get latest placement result for a user */
  async getLatestResult(userId: string) {
    return this.prisma.placementTestResult.findFirst({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });
  }

  // ── Private helpers ─────────────────────────────────────────────

  /**
   * Estimate TOEIC score using weighted average of correctly answered band levels.
   * Each question's band level contributes to a weighted score midpoint.
   */
  private estimateScore(
    answers: Record<string, string>,
    questionMap: Map<string, PlacementQuestion>,
  ): number {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [questionId, selectedOptionId] of Object.entries(answers)) {
      const q = questionMap.get(questionId);
      if (!q) continue;

      const isCorrect = q.correctOptionId === selectedOptionId;
      const bandWeight = q.bandLevel; // higher band questions = higher weight
      totalWeight += bandWeight;

      if (isCorrect) {
        weightedSum += (BAND_MIDPOINTS[q.bandLevel] ?? 130) * bandWeight;
      } else {
        // Partial credit: getting a hard question wrong doesn't tank the score
        weightedSum += (BAND_MIDPOINTS[Math.max(1, q.bandLevel - 1)] ?? 130) * bandWeight * 0.3;
      }
    }

    if (totalWeight === 0) return 10;
    const raw = weightedSum / totalWeight;
    // Clamp to TOEIC range 10-990
    return Math.min(990, Math.max(10, Math.round(raw / 10) * 10));
  }

  private scoreToBand(score: number): string {
    for (const { band, minScore } of BAND_THRESHOLDS) {
      if (score >= minScore) return band;
    }
    return 'BAND_1';
  }
}

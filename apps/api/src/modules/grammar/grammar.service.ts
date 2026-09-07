import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { GRAMMAR_SEED_TOPICS } from './grammar.data';

export interface SubmitGrammarAnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  xpEarned: number;
  isMistakeLogged: boolean;
}

@Injectable()
export class GrammarService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Seed / Ensure grammar topics and exercise cards exist
   */
  async seedInitialGrammar(): Promise<void> {
    for (const [index, item] of GRAMMAR_SEED_TOPICS.entries()) {
      const topic = await this.prisma.grammarTopic.upsert({
        where: { id: item.id },
        create: {
          id: item.id,
          title: item.title,
          description: item.description,
          rule: item.rule,
          formula: item.formula,
          tips: item.tips,
          examples: item.examples as never,
          targetBand: item.targetBand,
          orderIndex: index,
          isSystem: true,
        },
        update: {
          title: item.title,
          description: item.description,
          rule: item.rule,
          formula: item.formula,
          tips: item.tips,
          examples: item.examples as never,
        },
      });

      for (const [cardIndex, ex] of item.exercises.entries()) {
        const existing = await this.prisma.grammarCard.findFirst({
          where: { grammarTopicId: topic.id, question: ex.question },
        });

        if (!existing) {
          await this.prisma.grammarCard.create({
            data: {
              grammarTopicId: topic.id,
              type: 'MULTIPLE_CHOICE',
              question: ex.question,
              options: ex.options as never,
              correctAnswer: ex.correctAnswer,
              explanation: ex.explanation,
              difficulty: 3,
              orderIndex: cardIndex,
            },
          });
        }
      }
    }
  }

  /**
   * Get all grammar topics with Review Recommendation algorithm
   * Algorithm: if error rate > 40% in the last 5 attempts of a topic -> needsReview = true
   */
  async getTopics(userId?: string) {
    await this.seedInitialGrammar();

    const topics = await this.prisma.grammarTopic.findMany({
      where: { isSystem: true },
      include: {
        exercises: { select: { id: true } },
      },
      orderBy: { orderIndex: 'asc' },
    });

    if (!userId) {
      return topics.map((t) => ({
        ...t,
        exerciseCount: t.exercises.length,
        needsReview: false,
        accuracyPercent: 100,
        attemptsCount: 0,
      }));
    }

    const result = [];

    for (const topic of topics) {
      const cardIds = topic.exercises.map((e) => e.id);

      // Get last 5 attempts for this topic
      const recentAttempts = await this.prisma.exerciseAttempt.findMany({
        where: {
          userId,
          grammarCardId: { in: cardIds },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      let needsReview = false;
      let accuracyPercent = 100;

      if (recentAttempts.length >= 2) {
        const incorrectCount = recentAttempts.filter((a) => !a.isCorrect).length;
        const errorRate = incorrectCount / recentAttempts.length;
        // > 40% error rate triggers review flag
        needsReview = errorRate > 0.4;
        accuracyPercent = Math.round(((recentAttempts.length - incorrectCount) / recentAttempts.length) * 100);
      }

      result.push({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        formula: topic.formula,
        targetBand: topic.targetBand,
        exerciseCount: topic.exercises.length,
        needsReview,
        accuracyPercent,
        attemptsCount: recentAttempts.length,
      });
    }

    return result;
  }

  /**
   * Get single topic with full rules, examples and exercises
   */
  async getTopicDetail(topicId: string, userId?: string) {
    const topic = await this.prisma.grammarTopic.findUnique({
      where: { id: topicId },
      include: {
        exercises: {
          orderBy: { orderIndex: 'asc' },
          include: {
            attempts: userId
              ? {
                  where: { userId },
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                }
              : false,
          },
        },
      },
    });

    if (!topic) throw new NotFoundException('Grammar topic not found');

    return topic;
  }

  /**
   * Submit an answer to a grammar card
   * Automatically logs mistakes to Mistake Notebook if answered incorrectly!
   */
  async submitAnswer(
    userId: string,
    cardId: string,
    userAnswer: string,
  ): Promise<SubmitGrammarAnswerResult> {
    const card = await this.prisma.grammarCard.findUnique({
      where: { id: cardId },
      include: { grammarTopic: true },
    });
    if (!card) throw new NotFoundException('Card not found');

    const isCorrect = card.correctAnswer.trim().toUpperCase() === userAnswer.trim().toUpperCase();
    const xpEarned = isCorrect ? 5 : 1;

    // Save attempt
    await this.prisma.exerciseAttempt.create({
      data: {
        userId,
        grammarCardId: card.id,
        userAnswer,
        isCorrect,
      },
    });

    let isMistakeLogged = false;

    // Automatic mistake logging if incorrect
    if (!isCorrect) {
      await this.logGrammarMistake(userId, card.question, card.explanation);
      isMistakeLogged = true;
    }

    // Award XP
    await this.prisma.userProfile.updateMany({
      where: { userId },
      data: { totalXp: { increment: xpEarned } },
    });

    return {
      isCorrect,
      correctAnswer: card.correctAnswer,
      explanation: card.explanation,
      xpEarned,
      isMistakeLogged,
    };
  }

  /**
   * Helper: Log grammar mistake into user's Mistake Notebook topic
   */
  private async logGrammarMistake(userId: string, question: string, explanation: string) {
    let mistakeTopic = await this.prisma.vocabularyTopic.findFirst({
      where: { ownerId: userId, title: 'Mistake Notebook' },
    });

    if (!mistakeTopic) {
      mistakeTopic = await this.prisma.vocabularyTopic.create({
        data: {
          ownerId: userId,
          title: 'Mistake Notebook',
          description: 'Tự động lưu các từ hoặc câu bài tập làm sai',
          isSystem: false,
          isPublic: false,
        },
      });
    }

    const shortWord = question.slice(0, 30) + '...';
    await this.prisma.vocabularyCard.create({
      data: {
        topicId: mistakeTopic.id,
        word: shortWord,
        phonetic: 'Grammar Exercise',
        wordType: 'OTHER',
        definition: explanation,
        example: question,
        tags: ['grammar-mistake'],
      },
    });

    await this.prisma.vocabularyTopic.update({
      where: { id: mistakeTopic.id },
      data: { cardCount: { increment: 1 } },
    });
  }
}

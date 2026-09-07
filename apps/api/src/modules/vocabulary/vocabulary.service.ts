import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { VOCAB_TOPICS, VOCAB_CARDS_SAMPLE } from './vocabulary.data';

export interface SM2ReviewResult {
  cardId: string;
  repetitions: number;
  interval: number;
  easinessFactor: number;
  nextReviewAt: Date;
  isLearned: boolean;
  isMistakeAdded: boolean;
  xpEarned: number;
}

const DEFAULT_NOTEBOOK_TITLES = [
  'Important Words',
  'Difficult Words',
  'Words I Forgot',
  'Favorite Words',
  'Mistake Notebook',
];

@Injectable()
export class VocabularyService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Seed / Ensure all 21 core topics and sample cards exist in the DB
   */
  async seedInitialVocabulary(): Promise<void> {
    for (const t of VOCAB_TOPICS) {
      await this.prisma.vocabularyTopic.upsert({
        where: { id: t.id },
        create: {
          id: t.id,
          title: t.title,
          description: t.description,
          targetBand: t.targetBand,
          isSystem: true,
          isPublic: true,
          cardCount: 0,
        },
        update: {
          title: t.title,
          description: t.description,
          targetBand: t.targetBand,
        },
      });
    }

    for (const card of VOCAB_CARDS_SAMPLE) {
      const existing = await this.prisma.vocabularyCard.findFirst({
        where: { topicId: card.topicId, word: card.word },
      });

      if (!existing) {
        await this.prisma.vocabularyCard.create({
          data: {
            topicId: card.topicId,
            word: card.word,
            phonetic: card.phonetic,
            wordType: card.partOfSpeech as never,
            definition: card.definition,
            definitionEn: card.definitionEn,
            example: card.example,
            exampleVi: card.exampleVi,
            audioUsUrl: card.audioUsUrl,
            audioUkUrl: card.audioUkUrl,
            tags: card.tags,
          },
        });
      }
    }

    // Update card counts
    const topics = await this.prisma.vocabularyTopic.findMany();
    for (const topic of topics) {
      const count = await this.prisma.vocabularyCard.count({ where: { topicId: topic.id } });
      await this.prisma.vocabularyTopic.update({
        where: { id: topic.id },
        data: { cardCount: count },
      });
    }
  }

  /**
   * Get all vocabulary topics, optionally decorated with user learning progress
   */
  async getTopics(userId?: string) {
    await this.seedInitialVocabulary();

    const topics = await this.prisma.vocabularyTopic.findMany({
      where: { isSystem: true },
      orderBy: { createdAt: 'asc' },
    });

    if (!userId) {
      return topics.map((t) => ({ ...t, learnedCount: 0, progressPercent: 0 }));
    }

    const userProgress = await this.prisma.userCardProgress.findMany({
      where: { userId, isLearned: true },
      select: { card: { select: { topicId: true } } },
    });

    const learnedMap = new Map<string, number>();
    for (const p of userProgress) {
      if (p.card?.topicId) {
        learnedMap.set(p.card.topicId, (learnedMap.get(p.card.topicId) ?? 0) + 1);
      }
    }

    return topics.map((t) => {
      const learned = learnedMap.get(t.id) ?? 0;
      const pct = t.cardCount > 0 ? Math.round((learned / t.cardCount) * 100) : 0;
      return {
        ...t,
        learnedCount: learned,
        progressPercent: pct,
      };
    });
  }

  /**
   * Get cards of a topic along with the user's progress
   */
  async getTopicCards(topicId: string, userId?: string) {
    const topic = await this.prisma.vocabularyTopic.findUnique({
      where: { id: topicId },
      include: {
        cards: {
          orderBy: { orderInTopic: 'asc' },
        },
      },
    });

    if (!topic) throw new NotFoundException('Topic not found');

    if (!userId) {
      return { topic, cards: topic.cards.map((c) => ({ ...c, progress: null })) };
    }

    const progressList = await this.prisma.userCardProgress.findMany({
      where: { userId, cardId: { in: topic.cards.map((c) => c.id) } },
    });

    const progressMap = new Map(progressList.map((p) => [p.cardId, p]));

    return {
      topic,
      cards: topic.cards.map((card) => ({
        ...card,
        progress: progressMap.get(card.id) ?? null,
      })),
    };
  }

  /**
   * SM-2 Algorithm card review
   * If quality < 3: Card is automatically recorded in the Mistake Notebook!
   */
  async reviewCard(userId: string, cardId: string, quality: number): Promise<SM2ReviewResult> {
    const card = await this.prisma.vocabularyCard.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');

    let progress = await this.prisma.userCardProgress.findUnique({
      where: { userId_cardId: { userId, cardId } },
    });

    let repetitions = progress ? progress.repetitions : 0;
    let easinessFactor = progress ? progress.easinessFactor : 2.5;
    let interval = progress ? progress.interval : 1;
    let isMistakeAdded = false;

    // SM-2 Calculation
    if (quality >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easinessFactor);
      }
      repetitions += 1;
    } else {
      // Failed recall: reset repetitions, interval = 1
      repetitions = 0;
      interval = 1;

      // AUTOMATIC MISTAKE NOTEBOOK LOGGING
      await this.logToMistakeNotebook(userId, cardId);
      isMistakeAdded = true;
    }

    // Update Easiness Factor
    easinessFactor = Math.max(
      1.3,
      easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
    );

    const isLearned = repetitions >= 3 && easinessFactor >= 2.3;
    const nextReviewAt = new Date(Date.now() + interval * 86400000);
    const xpEarned = quality >= 3 ? 5 : 1;

    // Upsert progress
    progress = await this.prisma.userCardProgress.upsert({
      where: { userId_cardId: { userId, cardId } },
      create: {
        userId,
        cardId,
        repetitions,
        easinessFactor,
        interval,
        nextReviewAt,
        lastReviewedAt: new Date(),
        totalReviews: 1,
        correctCount: quality >= 3 ? 1 : 0,
        incorrectCount: quality < 3 ? 1 : 0,
        isLearned,
      },
      update: {
        repetitions,
        easinessFactor,
        interval,
        nextReviewAt,
        lastReviewedAt: new Date(),
        totalReviews: { increment: 1 },
        correctCount: quality >= 3 ? { increment: 1 } : undefined,
        incorrectCount: quality < 3 ? { increment: 1 } : undefined,
        isLearned,
      },
    });

    // Increment user XP
    await this.prisma.userProfile.updateMany({
      where: { userId },
      data: { totalXp: { increment: xpEarned } },
    });

    return {
      cardId,
      repetitions,
      interval,
      easinessFactor,
      nextReviewAt,
      isLearned,
      isMistakeAdded,
      xpEarned,
    };
  }

  /**
   * Get cards due for review today (nextReviewAt <= now)
   */
  async getDueCards(userId: string) {
    const dueProgress = await this.prisma.userCardProgress.findMany({
      where: {
        userId,
        nextReviewAt: { lte: new Date() },
      },
      include: { card: true },
      take: 50,
      orderBy: { nextReviewAt: 'asc' },
    });

    return dueProgress.map((p) => ({
      ...p.card,
      progress: {
        repetitions: p.repetitions,
        easinessFactor: p.easinessFactor,
        interval: p.interval,
        nextReviewAt: p.nextReviewAt,
      },
    }));
  }

  /**
   * Get or create user notebook lists
   */
  async getUserNotebooks(userId: string) {
    // Ensure default notebooks exist for user
    for (const title of DEFAULT_NOTEBOOK_TITLES) {
      const exists = await this.prisma.vocabularyTopic.findFirst({
        where: { ownerId: userId, title },
      });
      if (!exists) {
        await this.prisma.vocabularyTopic.create({
          data: {
            ownerId: userId,
            title,
            description: title === 'Mistake Notebook' ? 'Tự động lưu các từ hoặc câu trả lời sai' : `Sổ tay: ${title}`,
            isSystem: false,
            isPublic: false,
            cardCount: 0,
          },
        });
      }
    }

    const userTopics = await this.prisma.vocabularyTopic.findMany({
      where: { ownerId: userId },
      include: {
        _count: { select: { cards: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    return userTopics.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      cardCount: t._count.cards,
      isMistakeNotebook: t.title === 'Mistake Notebook',
    }));
  }

  /**
   * Add a card to a user notebook
   */
  async addCardToNotebook(userId: string, topicId: string, cardId: string) {
    const topic = await this.prisma.vocabularyTopic.findFirst({
      where: { id: topicId, ownerId: userId },
    });
    if (!topic) throw new NotFoundException('Notebook not found');

    const card = await this.prisma.vocabularyCard.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Card not found');

    // Duplicate card into notebook
    const notebookCard = await this.prisma.vocabularyCard.create({
      data: {
        topicId: topic.id,
        word: card.word,
        phonetic: card.phonetic,
        wordType: card.wordType,
        definition: card.definition,
        definitionEn: card.definitionEn,
        example: card.example,
        exampleVi: card.exampleVi,
        audioUsUrl: card.audioUsUrl,
        audioUkUrl: card.audioUkUrl,
        tags: card.tags,
      },
    });

    // Update count
    await this.prisma.vocabularyTopic.update({
      where: { id: topic.id },
      data: { cardCount: { increment: 1 } },
    });

    return notebookCard;
  }

  /**
   * Log card automatically into Mistake Notebook
   */
  async logToMistakeNotebook(userId: string, cardId: string) {
    let mistakeTopic = await this.prisma.vocabularyTopic.findFirst({
      where: { ownerId: userId, title: 'Mistake Notebook' },
    });

    if (!mistakeTopic) {
      mistakeTopic = await this.prisma.vocabularyTopic.create({
        data: {
          ownerId: userId,
          title: 'Mistake Notebook',
          description: 'Tự động lưu các từ hoặc câu trả lời sai',
          isSystem: false,
          isPublic: false,
        },
      });
    }

    const originalCard = await this.prisma.vocabularyCard.findUnique({ where: { id: cardId } });
    if (!originalCard) return;

    // Check if already in mistake notebook to avoid endless duplicates
    const alreadyLogged = await this.prisma.vocabularyCard.findFirst({
      where: { topicId: mistakeTopic.id, word: originalCard.word },
    });

    if (!alreadyLogged) {
      await this.prisma.vocabularyCard.create({
        data: {
          topicId: mistakeTopic.id,
          word: originalCard.word,
          phonetic: originalCard.phonetic,
          wordType: originalCard.wordType,
          definition: originalCard.definition,
          definitionEn: originalCard.definitionEn,
          example: originalCard.example,
          exampleVi: originalCard.exampleVi,
          audioUsUrl: originalCard.audioUsUrl,
          audioUkUrl: originalCard.audioUkUrl,
          tags: ['mistake', ...originalCard.tags],
        },
      });

      await this.prisma.vocabularyTopic.update({
        where: { id: mistakeTopic.id },
        data: { cardCount: { increment: 1 } },
      });
    }
  }

  /**
   * Create custom user notebook
   */
  async createCustomNotebook(userId: string, title: string, description?: string) {
    return this.prisma.vocabularyTopic.create({
      data: {
        ownerId: userId,
        title,
        description,
        isSystem: false,
        isPublic: false,
      },
    });
  }
}

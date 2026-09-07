import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SKILL_PRACTICE_ITEMS, SkillPracticeItem } from './skills.data';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  getSkillsOverview() {
    const parts = [
      {
        part: 'PART_1',
        name: 'Part 1: Photographs',
        category: 'Listening',
        description: 'Mô tả hình ảnh bằng tiếng Anh. Rèn luyện phản xạ nghe nhanh và đoán bối cảnh.',
        itemCount: SKILL_PRACTICE_ITEMS.filter((i) => i.part === 'PART_1').length,
        icon: 'Headphones',
      },
      {
        part: 'PART_2',
        name: 'Part 2: Question & Response',
        category: 'Listening',
        description: 'Hỏi & Đáp trực tiếp ngắn. Phân biệt Wh-questions, Yes/No, câu hỏi gián tiếp.',
        itemCount: SKILL_PRACTICE_ITEMS.filter((i) => i.part === 'PART_2').length,
        icon: 'MessageSquare',
      },
      {
        part: 'PART_3',
        name: 'Part 3: Short Conversations',
        category: 'Listening',
        description: 'Hội thoại ngắn giữa 2-3 người về bối cảnh văn phòng, mua sắm, du lịch.',
        itemCount: SKILL_PRACTICE_ITEMS.filter((i) => i.part === 'PART_3').length,
        icon: 'Users',
      },
      {
        part: 'PART_4',
        name: 'Part 4: Short Talks',
        category: 'Listening',
        description: 'Bài nói độc thoại: thông báo sân bay, tin nhắn thoại, bản tin thời tiết.',
        itemCount: SKILL_PRACTICE_ITEMS.filter((i) => i.part === 'PART_4').length,
        icon: 'Mic',
      },
      {
        part: 'PART_5',
        name: 'Part 5: Incomplete Sentences',
        category: 'Reading',
        description: 'Điền vào chỗ trống ngữ pháp & từ vựng TOEIC thực chiến.',
        itemCount: SKILL_PRACTICE_ITEMS.filter((i) => i.part === 'PART_5').length,
        icon: 'FileText',
      },
      {
        part: 'PART_6',
        name: 'Part 6: Text Completion',
        category: 'Reading',
        description: 'Hoàn thành đoạn văn bản: thư từ, thông báo nội bộ, bài báo ngắn.',
        itemCount: SKILL_PRACTICE_ITEMS.filter((i) => i.part === 'PART_6').length,
        icon: 'FileSpreadsheet',
      },
      {
        part: 'PART_7',
        name: 'Part 7: Reading Comprehension',
        category: 'Reading',
        description: 'Đọc hiểu văn bản đơn & đa văn bản (Email, Schedule, Review...).',
        itemCount: SKILL_PRACTICE_ITEMS.filter((i) => i.part === 'PART_7').length,
        icon: 'BookOpen',
      },
    ];

    return { parts };
  }

  getItemsByPart(partKey: string) {
    const normalized = partKey.toUpperCase();
    const items = SKILL_PRACTICE_ITEMS.filter((i) => i.part === normalized);
    return {
      part: normalized,
      count: items.length,
      items,
    };
  }

  getItemById(itemId: string): SkillPracticeItem {
    const item = SKILL_PRACTICE_ITEMS.find((i) => i.id === itemId);
    if (!item) throw new NotFoundException('Skill practice item not found');
    return item;
  }

  async submitSkillAnswer(
    userId: string,
    itemId: string,
    answers: Record<number, string>,
  ) {
    const item = this.getItemById(itemId);
    let correctCount = 0;
    const wrongQuestions: { question: string; chosen: string; correct: string; explanation: string }[] = [];

    const feedback = item.questions.map((q) => {
      const chosen = answers[q.questionNumber];
      const isCorrect = chosen?.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase();
      if (isCorrect) {
        correctCount++;
      } else {
        wrongQuestions.push({
          question: q.questionText,
          chosen: chosen || 'Chưa chọn',
          correct: q.correctAnswer,
          explanation: q.explanation,
        });
      }

      return {
        questionNumber: q.questionNumber,
        chosenAnswer: chosen,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    // Auto-save wrong answers to Mistake Notebook
    if (wrongQuestions.length > 0) {
      await this.saveToMistakeNotebook(userId, item.title, wrongQuestions);
    }

    return {
      itemId: item.id,
      part: item.part,
      totalQuestions: item.questions.length,
      correctCount,
      accuracy: Math.round((correctCount / item.questions.length) * 100),
      autoSavedToMistakeNotebook: wrongQuestions.length > 0,
      feedback,
    };
  }

  private async saveToMistakeNotebook(
    userId: string,
    itemTitle: string,
    wrongList: { question: string; chosen: string; correct: string; explanation: string }[],
  ) {
    try {
      let mistakeTopic = await this.prisma.vocabularyTopic.findFirst({
        where: { ownerId: userId, title: 'Mistake Notebook' },
      });

      if (!mistakeTopic) {
        mistakeTopic = await this.prisma.vocabularyTopic.create({
          data: {
            title: 'Mistake Notebook',
            description: 'Sổ tay tự động lưu các câu và từ làm sai trong luyện tập kỹ năng & đề thi',
            ownerId: userId,
            isSystem: false,
          },
        });
      }

      for (const w of wrongList) {
        const shortWord = w.question.length > 40 ? w.question.substring(0, 40) + '...' : w.question;
        const existing = await this.prisma.vocabularyCard.findFirst({
          where: {
            topicId: mistakeTopic.id,
            word: shortWord,
          },
        });

        if (!existing) {
          await this.prisma.vocabularyCard.create({
            data: {
              topicId: mistakeTopic.id,
              word: shortWord,
              phonetic: itemTitle,
              wordType: 'OTHER',
              definition: `[${itemTitle}] Đáp án: (${w.correct}). Chọn: (${w.chosen}) - ${w.explanation}`,
              example: w.question,
              tags: ['skill-mistake'],
            },
          });

          await this.prisma.vocabularyTopic.update({
            where: { id: mistakeTopic.id },
            data: { cardCount: { increment: 1 } },
          });
        }
      }
    } catch (err) {
      console.error('Failed to auto-save skill mistakes:', err);
    }
  }
}

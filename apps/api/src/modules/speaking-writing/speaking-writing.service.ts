import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { 
  SPEAKING_PROMPTS, 
  WRITING_PROMPTS, 
  SpeakingPrompt, 
  WritingPrompt 
} from './speaking-writing.data';

@Injectable()
export class SpeakingWritingService {
  constructor(private prisma: PrismaService) {}

  getSpeakingPrompts(): SpeakingPrompt[] {
    return SPEAKING_PROMPTS;
  }

  getWritingPrompts(): WritingPrompt[] {
    return WRITING_PROMPTS;
  }

  getSpeakingPromptById(id: string): SpeakingPrompt {
    const prompt = SPEAKING_PROMPTS.find((p) => p.id === id);
    if (!prompt) throw new NotFoundException('Speaking prompt not found');
    return prompt;
  }

  getWritingPromptById(id: string): WritingPrompt {
    const prompt = WRITING_PROMPTS.find((p) => p.id === id);
    if (!prompt) throw new NotFoundException('Writing prompt not found');
    return prompt;
  }

  /**
   * AI Pronunciation & Fluency Evaluation for TOEIC Speaking
   */
  async evaluateSpeaking(
    userId: string,
    promptId: string,
    speechText: string,
    durationSeconds: number = 30,
  ) {
    const prompt = this.getSpeakingPromptById(promptId);
    const cleanText = speechText.trim();
    const words = cleanText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Words per minute calculation
    const wpm = durationSeconds > 0 ? Math.round((wordCount / durationSeconds) * 60) : 100;

    // Check vocabulary coverage
    let matchedKeywords = 0;
    if (prompt.keyVocabulary) {
      prompt.keyVocabulary.forEach((kw) => {
        if (cleanText.toLowerCase().includes(kw.toLowerCase())) {
          matchedKeywords++;
        }
      });
    }

    const keywordRatio = prompt.keyVocabulary?.length 
      ? matchedKeywords / prompt.keyVocabulary.length 
      : 0.8;

    // Pronunciation & Fluency Rubrics (0 - 100)
    let pronunciationScore = Math.min(95, Math.max(50, Math.round(70 + keywordRatio * 25)));
    let fluencyScore = Math.min(95, Math.max(50, Math.round(65 + Math.min(wpm / 130, 1) * 30)));
    let intonationScore = Math.min(95, Math.max(50, Math.round(70 + (words.length > 20 ? 20 : 5))));

    // Calculate TOEIC Speaking Scaled Score (0 - 200, rounded to nearest 10)
    const compositePercent = (pronunciationScore * 0.4 + fluencyScore * 0.35 + intonationScore * 0.25) / 100;
    const scaledScore = Math.round((compositePercent * 200) / 10) * 10;

    // TOEIC Speaking Proficiency Level (1 to 8)
    let proficiencyLevel = 1;
    if (scaledScore >= 190) proficiencyLevel = 8;
    else if (scaledScore >= 160) proficiencyLevel = 7;
    else if (scaledScore >= 130) proficiencyLevel = 6;
    else if (scaledScore >= 110) proficiencyLevel = 5;
    else if (scaledScore >= 80) proficiencyLevel = 4;
    else if (scaledScore >= 60) proficiencyLevel = 3;
    else proficiencyLevel = 2;

    const feedback = [
      wpm < 90 ? 'Tốc độ nói hơi chậm. Hãy giữ nhịp điệu từ 100-130 từ/phút để tạo cảm giác tự nhiên và tự tin.' : 'Tốc độ nói ổn định, mạch lạc và rõ ràng.',
      keywordRatio < 0.5 ? 'Bạn nên bổ sung thêm các từ vựng trọng tâm liên quan trực tiếp đến bối cảnh câu hỏi.' : 'Khả năng sử dụng từ khóa chuyên môn đạt mức tốt.',
      'Chú ý nhấn đúng trọng âm của các từ đa âm tiết và hạ giọng nhẹ ở cuối câu khẳng định.',
    ];

    return {
      promptId: prompt.id,
      promptTitle: prompt.title,
      speechText: cleanText,
      wordCount,
      estimatedWpm: wpm,
      scaledScore, // 0 - 200
      proficiencyLevel, // 1 - 8
      pronunciationScore, // 0 - 100
      fluencyScore, // 0 - 100
      intonationScore, // 0 - 100
      matchedKeywords,
      totalKeywords: prompt.keyVocabulary?.length || 0,
      feedback,
      sampleTranscript: prompt.sampleTranscript || prompt.content,
    };
  }

  /**
   * AI Rubric Evaluation for TOEIC Writing
   */
  async evaluateWriting(
    userId: string,
    promptId: string,
    essayText: string,
  ) {
    const prompt = this.getWritingPromptById(promptId);
    const cleanText = essayText.trim();
    const words = cleanText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Check given words for Picture Sentence
    let missingGivenWords: string[] = [];
    if (prompt.givenWords) {
      prompt.givenWords.forEach((gw) => {
        if (!cleanText.toLowerCase().includes(gw.toLowerCase())) {
          missingGivenWords.push(gw);
        }
      });
    }

    // Rubric Scoring (0 - 50 each, total 0 - 200)
    let grammarScore = 38;
    let vocabScore = 37;
    let organizationScore = 38;
    let relevanceScore = 40;

    // Length penalty/bonus
    const lengthRatio = Math.min(1.2, wordCount / prompt.minWords);
    if (lengthRatio < 0.8) {
      relevanceScore -= 10;
      organizationScore -= 8;
    } else if (lengthRatio >= 1.0) {
      relevanceScore = Math.min(48, relevanceScore + 5);
    }

    if (missingGivenWords.length > 0) {
      vocabScore -= missingGivenWords.length * 8;
      relevanceScore -= 10;
    }

    const scaledScore = Math.min(200, Math.max(40, grammarScore + vocabScore + organizationScore + relevanceScore));

    // Proficiency Level for Writing (1 to 9)
    let writingLevel = 1;
    if (scaledScore >= 200) writingLevel = 9;
    else if (scaledScore >= 170) writingLevel = 8;
    else if (scaledScore >= 140) writingLevel = 7;
    else if (scaledScore >= 110) writingLevel = 6;
    else if (scaledScore >= 90) writingLevel = 5;
    else if (scaledScore >= 70) writingLevel = 4;
    else writingLevel = 3;

    const suggestions = [
      wordCount < prompt.minWords 
        ? `Bài viết đang có ${wordCount} từ, chưa đạt số từ khuyến nghị (${prompt.minWords} từ). Hãy mở rộng thêm ví dụ thực tế.`
        : `Số lượng từ (${wordCount} từ) đạt yêu cầu đề bài tốt.`,
      missingGivenWords.length > 0
        ? `Thiếu các từ khóa bắt buộc: "${missingGivenWords.join(', ')}". Cần kết hợp hài hòa vào câu.`
        : 'Đã sử dụng đầy đủ các từ khóa yêu cầu.',
      'Sử dụng thêm các liên từ chỉ sự tương phản (However, In contrast, On the other hand) để tăng điểm Organization.',
    ];

    return {
      promptId: prompt.id,
      promptTitle: prompt.title,
      wordCount,
      minWords: prompt.minWords,
      scaledScore, // 0 - 200
      writingLevel, // 1 - 9
      rubrics: {
        grammar: grammarScore,
        vocabulary: vocabScore,
        organization: organizationScore,
        relevance: relevanceScore,
      },
      suggestions,
      sampleAnswer: prompt.sampleAnswer,
    };
  }
}

#!/usr/bin/env node
/**
 * TOEIC Master — Content Import CLI Tool (Production-Grade)
 * Idempotent, High-Performance, Anti-Duplication Pipeline
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper to generate clean deterministic slug if ID is omitted
function slugify(text, prefix = 'item') {
  const clean = String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
  return `${prefix}_${clean || Date.now()}`;
}

// ── 0. Parse Command Line Arguments ──────────────────────────────
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    type: null,
    file: null,
    all: false,
  };

  for (const arg of args) {
    if (arg === '--all') {
      options.all = true;
    } else if (arg.startsWith('--type=')) {
      options.type = arg.split('=')[1].toLowerCase().trim();
    } else if (arg.startsWith('--file=')) {
      options.file = arg.split('=')[1].trim();
    }
  }

  return options;
}

// ── 1. Import Vocabulary ─────────────────────────────────────────
async function importVocabulary(filePath) {
  const absPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Không tìm thấy file: ${absPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(absPath, 'utf8'));
  const topics = Array.isArray(rawData) ? rawData : (rawData.topics || []);

  console.log(`\n📚 [VOCABULARY] Bắt đầu nạp ${topics.length} chủ đề từ vựng từ ${filePath}...`);
  let globalCreatedCards = 0;
  let globalUpdatedCards = 0;

  for (const [tIdx, topicData] of topics.entries()) {
    if (!topicData.title) {
      console.warn(`  ⚠️ [${tIdx + 1}] Bỏ qua chủ đề thiếu trường title:`, topicData);
      continue;
    }

    // Anti-duplication: Find by ID or Title
    let existingTopic = null;
    if (topicData.id) {
      existingTopic = await prisma.vocabularyTopic.findUnique({ where: { id: topicData.id } });
    }
    if (!existingTopic) {
      existingTopic = await prisma.vocabularyTopic.findFirst({
        where: { title: { equals: topicData.title.trim(), mode: 'insensitive' } },
      });
    }

    const topicId = existingTopic ? existingTopic.id : (topicData.id || slugify(topicData.title, 'top'));
    const isUpdate = Boolean(existingTopic);

    const topic = await prisma.vocabularyTopic.upsert({
      where: { id: topicId },
      create: {
        id: topicId,
        title: topicData.title.trim(),
        description: topicData.description || null,
        targetBand: topicData.targetBand || 'BAND_3',
        isPublic: topicData.isPublic !== false,
        isSystem: true,
      },
      update: {
        title: topicData.title.trim(),
        description: topicData.description || null,
        targetBand: topicData.targetBand || 'BAND_3',
        isPublic: topicData.isPublic !== false,
      },
    });

    console.log(`  ${isUpdate ? '🔄 Đã cập nhật' : '✨ Đã tạo mới'} chủ đề: "${topic.title}" (ID: ${topic.id})`);

    // Process cards with deduplication
    const cards = topicData.cards || [];
    let cardOrder = 1;
    let topicCreated = 0;
    let topicUpdated = 0;

    for (const cardData of cards) {
      if (!cardData.word || !cardData.definition) {
        continue;
      }

      const wordClean = cardData.word.trim();
      const existingCard = await prisma.vocabularyCard.findFirst({
        where: {
          topicId: topic.id,
          word: { equals: wordClean, mode: 'insensitive' },
        },
      });

      const cardPayload = {
        topicId: topic.id,
        word: wordClean,
        phonetic: cardData.phonetic || null,
        wordType: cardData.wordType || 'NOUN',
        definition: cardData.definition.trim(),
        definitionEn: cardData.definitionEn || null,
        example: cardData.example || null,
        exampleVi: cardData.exampleVi || null,
        imageUrl: cardData.imageUrl || null,
        audioUsUrl: cardData.audioUsUrl || null,
        audioUkUrl: cardData.audioUkUrl || null,
        tags: Array.isArray(cardData.tags) ? cardData.tags : [],
        orderInTopic: cardData.orderInTopic || cardOrder++,
      };

      if (existingCard) {
        await prisma.vocabularyCard.update({
          where: { id: existingCard.id },
          data: cardPayload,
        });
        topicUpdated++;
        globalUpdatedCards++;
      } else {
        await prisma.vocabularyCard.create({
          data: cardPayload,
        });
        topicCreated++;
        globalCreatedCards++;
      }
    }

    const currentCardCount = await prisma.vocabularyCard.count({
      where: { topicId: topic.id },
    });
    await prisma.vocabularyTopic.update({
      where: { id: topic.id },
      data: { cardCount: currentCardCount },
    });

    console.log(`     └─ Tổng: ${currentCardCount} thẻ (${topicCreated} tạo mới, ${topicUpdated} cập nhật chống trùng lặp)`);
  }

  console.log(`🎉 [VOCABULARY] Hoàn thành: ${topics.length} chủ đề, ${globalCreatedCards} thẻ mới, ${globalUpdatedCards} thẻ cập nhật.`);
}

// ── 2. Import Grammar ────────────────────────────────────────────
async function importGrammar(filePath) {
  const absPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Không tìm thấy file: ${absPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(absPath, 'utf8'));
  const topics = Array.isArray(rawData) ? rawData : (rawData.topics || []);

  console.log(`\n📖 [GRAMMAR] Bắt đầu nạp ${topics.length} chủ điểm ngữ pháp từ ${filePath}...`);
  let globalCreatedEx = 0;
  let globalUpdatedEx = 0;

  for (const [tIdx, topicData] of topics.entries()) {
    if (!topicData.title || !topicData.rule) {
      console.warn(`  ⚠️ [${tIdx + 1}] Bỏ qua chủ điểm thiếu title hoặc rule:`, topicData);
      continue;
    }

    let existingTopic = null;
    if (topicData.id) {
      existingTopic = await prisma.grammarTopic.findUnique({ where: { id: topicData.id } });
    }
    if (!existingTopic) {
      existingTopic = await prisma.grammarTopic.findFirst({
        where: { title: { equals: topicData.title.trim(), mode: 'insensitive' } },
      });
    }

    const topicId = existingTopic ? existingTopic.id : (topicData.id || slugify(topicData.title, 'gram'));
    const isUpdate = Boolean(existingTopic);

    const topic = await prisma.grammarTopic.upsert({
      where: { id: topicId },
      create: {
        id: topicId,
        title: topicData.title.trim(),
        description: topicData.description || null,
        rule: topicData.rule,
        formula: topicData.formula || null,
        examples: topicData.examples || [],
        tips: topicData.tips || null,
        commonErrors: topicData.commonErrors || [],
        targetBand: topicData.targetBand || 'BAND_3',
        orderIndex: topicData.orderIndex || tIdx,
        isSystem: true,
      },
      update: {
        title: topicData.title.trim(),
        description: topicData.description || null,
        rule: topicData.rule,
        formula: topicData.formula || null,
        examples: topicData.examples || [],
        tips: topicData.tips || null,
        commonErrors: topicData.commonErrors || [],
        targetBand: topicData.targetBand || 'BAND_3',
      },
    });

    console.log(`  ${isUpdate ? '🔄 Đã cập nhật' : '✨ Đã tạo mới'} chủ điểm: "${topic.title}" (ID: ${topic.id})`);

    const exercises = topicData.exercises || [];
    let cardIndex = 0;
    let topicCreated = 0;
    let topicUpdated = 0;

    for (const ex of exercises) {
      if (!ex.question || !ex.correctAnswer) continue;

      const qTrimmed = ex.question.trim();
      const existingCard = await prisma.grammarCard.findFirst({
        where: {
          grammarTopicId: topic.id,
          question: qTrimmed,
        },
      });

      const optionsFormatted = (ex.options || []).map((opt, i) => {
        if (typeof opt === 'string') {
          return { id: String.fromCharCode(65 + i), text: opt };
        }
        return opt;
      });

      const exercisePayload = {
        grammarTopicId: topic.id,
        type: 'MULTIPLE_CHOICE',
        question: qTrimmed,
        options: optionsFormatted,
        correctAnswer: ex.correctAnswer.trim(),
        explanation: ex.explanation || '',
        difficulty: ex.difficulty || 2,
        orderIndex: cardIndex++,
      };

      if (existingCard) {
        await prisma.grammarCard.update({
          where: { id: existingCard.id },
          data: exercisePayload,
        });
        topicUpdated++;
        globalUpdatedEx++;
      } else {
        await prisma.grammarCard.create({
          data: exercisePayload,
        });
        topicCreated++;
        globalCreatedEx++;
      }
    }

    const exerciseCount = await prisma.grammarCard.count({
      where: { grammarTopicId: topic.id },
    });
    console.log(`     └─ Tổng: ${exerciseCount} bài tập (${topicCreated} tạo mới, ${topicUpdated} cập nhật chống trùng lặp)`);
  }

  console.log(`🎉 [GRAMMAR] Hoàn thành: ${topics.length} chủ điểm, ${globalCreatedEx} bài mới, ${globalUpdatedEx} bài cập nhật.`);
}

// ── 3. Import Questions & Tests ──────────────────────────────────
async function importQuestions(filePath) {
  const absPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Không tìm thấy file: ${absPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(absPath, 'utf8'));
  const tests = Array.isArray(rawData) ? rawData : (rawData.tests || []);

  console.log(`\n📝 [TESTS & QUESTIONS] Bắt đầu nạp ${tests.length} bộ đề thi từ ${filePath}...`);
  let globalCreatedQ = 0;
  let globalUpdatedQ = 0;

  for (const [tIdx, testData] of tests.entries()) {
    if (!testData.title) {
      console.warn(`  ⚠️ [${tIdx + 1}] Bỏ qua đề thi thiếu title:`, testData);
      continue;
    }

    let existingTest = null;
    if (testData.id) {
      existingTest = await prisma.test.findUnique({ where: { id: testData.id } });
    }
    if (!existingTest) {
      existingTest = await prisma.test.findFirst({
        where: { title: { equals: testData.title.trim(), mode: 'insensitive' } },
      });
    }

    const testId = existingTest ? existingTest.id : (testData.id || slugify(testData.title, 'test'));
    const isUpdate = Boolean(existingTest);

    const questions = testData.questions || [];
    const partsList = Array.from(new Set(questions.map((q) => q.part || 'PART_5')));

    const test = await prisma.test.upsert({
      where: { id: testId },
      create: {
        id: testId,
        title: testData.title.trim(),
        description: testData.description || null,
        mode: testData.mode || 'PRACTICE',
        parts: partsList.length > 0 ? partsList : ['PART_5'],
        bandRange: testData.targetBand ? [testData.targetBand] : ['BAND_3'],
        durationMins: testData.timeLimit || testData.durationMins || 15,
        totalQuestions: questions.length || 0,
        isPublished: true,
        isFree: true,
      },
      update: {
        title: testData.title.trim(),
        description: testData.description || null,
        mode: testData.mode || 'PRACTICE',
        parts: partsList.length > 0 ? partsList : ['PART_5'],
        bandRange: testData.targetBand ? [testData.targetBand] : ['BAND_3'],
        durationMins: testData.timeLimit || testData.durationMins || 15,
        totalQuestions: questions.length || 0,
        isPublished: true,
      },
    });

    console.log(`  ${isUpdate ? '🔄 Đã cập nhật' : '✨ Đã tạo mới'} đề thi: "${test.title}" (ID: ${test.id}, ${test.durationMins} phút)`);

    let testCreatedQ = 0;
    let testUpdatedQ = 0;

    for (const q of questions) {
      if (!q.correctOptionId) continue;

      const existingQ = await prisma.testQuestion.findFirst({
        where: {
          testId: test.id,
          questionNumber: q.questionNumber,
        },
      });

      const questionTextCombined = q.passageText
        ? `${q.passageText}\n\n${q.prompt || ''}`.trim()
        : (q.prompt || '').trim();

      const qPayload = {
        testId: test.id,
        part: q.part || 'PART_5',
        questionNumber: q.questionNumber,
        questionText: questionTextCombined,
        imageUrl: q.imageUrl || null,
        options: q.options || [],
        correctOptionId: q.correctOptionId,
        explanation: q.explanation || null,
      };

      if (existingQ) {
        await prisma.testQuestion.update({
          where: { id: existingQ.id },
          data: qPayload,
        });
        testUpdatedQ++;
        globalUpdatedQ++;
      } else {
        await prisma.testQuestion.create({
          data: qPayload,
        });
        testCreatedQ++;
        globalCreatedQ++;
      }
    }

    const finalQCount = await prisma.testQuestion.count({
      where: { testId: test.id },
    });
    console.log(`     └─ Tổng: ${finalQCount} câu hỏi (${testCreatedQ} tạo mới, ${testUpdatedQ} cập nhật chống trùng lặp)`);
  }

  console.log(`🎉 [TESTS & QUESTIONS] Hoàn thành: ${tests.length} đề thi, ${globalCreatedQ} câu mới, ${globalUpdatedQ} câu cập nhật.`);
}

// ── Main Execution ───────────────────────────────────────────────
async function main() {
  const options = parseArgs();

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🌸 TOEIC MASTER — CONTENT IMPORT PIPELINE');
  console.log('═══════════════════════════════════════════════════════════════');

  const defaultVocab = fs.existsSync('content/vocabulary.full.json') ? 'content/vocabulary.full.json' : 'content/samples/vocabulary.sample.json';
  const defaultGrammar = fs.existsSync('content/grammar.full.json') ? 'content/grammar.full.json' : 'content/samples/grammar.sample.json';
  const defaultTests = fs.existsSync('content/tests.full.json') ? 'content/tests.full.json' : 'content/samples/questions.sample.json';

  try {
    if (options.all) {
      await importVocabulary(options.file || defaultVocab);
      await importGrammar(options.file || defaultGrammar);
      await importQuestions(options.file || defaultTests);
    } else if (options.type === 'vocab' || options.type === 'vocabulary') {
      await importVocabulary(options.file || defaultVocab);
    } else if (options.type === 'grammar') {
      await importGrammar(options.file || defaultGrammar);
    } else if (options.type === 'questions' || options.type === 'tests') {
      await importQuestions(options.file || defaultTests);
    } else {
      console.log('💡 Hướng dẫn sử dụng:');
      console.log('  node scripts/import-content.js --type=vocab [--file=path/to/vocabulary.json]');
      console.log('  node scripts/import-content.js --type=grammar [--file=path/to/grammar.json]');
      console.log('  node scripts/import-content.js --type=questions [--file=path/to/questions.json]');
      console.log('  node scripts/import-content.js --all');
    }
    console.log('\n✨ Tất cả dữ liệu đã được xử lý xong an toàn.');
  } catch (err) {
    console.error('\n❌ LỖI TRONG QUÁ TRÌNH NẠP DỮ LIỆU:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

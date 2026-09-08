/**
 * TOEIC Master — Content Import Script
 * 
 * Nạp dữ liệu học tập thủ công từ file JSON vào cơ sở dữ liệu PostgreSQL qua Prisma.
 * Không phụ thuộc AI, đảm bảo dữ liệu chuẩn xác 100% theo nội dung do bạn biên soạn.
 * 
 * Cách sử dụng:
 *   npm run content:import -- --type=vocab --file=content/samples/vocabulary.sample.json
 *   npm run content:import -- --type=grammar --file=content/samples/grammar.sample.json
 *   npm run content:import -- --type=questions --file=content/samples/questions.sample.json
 *   npm run content:import -- --all
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Parse command line arguments
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
      options.type = arg.split('=')[1].toLowerCase();
    } else if (arg.startsWith('--file=')) {
      options.file = arg.split('=')[1];
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
  const topics = rawData.topics || [];

  console.log(`\n📚 [VOCABULARY] Bắt đầu nạp ${topics.length} chủ đề từ vựng từ ${filePath}...`);
  let totalCards = 0;

  for (const topicData of topics) {
    if (!topicData.title) {
      console.warn(`  ⚠️ Bỏ qua chủ đề thiếu trường title:`, topicData);
      continue;
    }

    // Upsert topic
    const topicId = topicData.id || `topic_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const topic = await prisma.vocabularyTopic.upsert({
      where: { id: topicId },
      create: {
        id: topicId,
        title: topicData.title,
        description: topicData.description || null,
        targetBand: topicData.targetBand || 'BAND_2',
        isPublic: topicData.isPublic !== false,
        isSystem: true,
      },
      update: {
        title: topicData.title,
        description: topicData.description || null,
        targetBand: topicData.targetBand || 'BAND_2',
        isPublic: topicData.isPublic !== false,
      },
    });

    console.log(`  ✅ Đã đồng bộ chủ đề: "${topic.title}" (Band: ${topic.targetBand})`);

    // Process cards
    const cards = topicData.cards || [];
    let cardOrder = 1;

    for (const cardData of cards) {
      if (!cardData.word || !cardData.definition) {
        console.warn(`    ⚠️ Bỏ qua từ thiếu word hoặc definition:`, cardData);
        continue;
      }

      // Check if card exists in this topic by word
      const existingCard = await prisma.vocabularyCard.findFirst({
        where: {
          topicId: topic.id,
          word: { equals: cardData.word, mode: 'insensitive' },
        },
      });

      const cardPayload = {
        topicId: topic.id,
        word: cardData.word.trim(),
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
      } else {
        await prisma.vocabularyCard.create({
          data: cardPayload,
        });
      }
      totalCards++;
    }

    // Update count on topic
    const currentCardCount = await prisma.vocabularyCard.count({
      where: { topicId: topic.id },
    });
    await prisma.vocabularyTopic.update({
      where: { id: topic.id },
      data: { cardCount: currentCardCount },
    });

    console.log(`     └─ Tổng cộng: ${currentCardCount} thẻ từ trong chủ đề này.`);
  }

  console.log(`🎉 [VOCABULARY] Hoàn thành: ${topics.length} chủ đề, ${totalCards} thẻ từ được nạp thành công!`);
}

// ── 2. Import Grammar ────────────────────────────────────────────
async function importGrammar(filePath) {
  const absPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Không tìm thấy file: ${absPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(absPath, 'utf8'));
  const topics = rawData.topics || [];

  console.log(`\n📖 [GRAMMAR] Bắt đầu nạp ${topics.length} chủ điểm ngữ pháp từ ${filePath}...`);
  let totalExercises = 0;

  for (const topicData of topics) {
    if (!topicData.title || !topicData.rule) {
      console.warn(`  ⚠️ Bỏ qua chủ điểm ngữ pháp thiếu title hoặc rule:`, topicData);
      continue;
    }

    const topicId = topicData.id || `grammar_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const topic = await prisma.grammarTopic.upsert({
      where: { id: topicId },
      create: {
        id: topicId,
        title: topicData.title,
        description: topicData.description || null,
        rule: topicData.rule,
        formula: topicData.formula || null,
        examples: topicData.examples || [],
        tips: topicData.tips || null,
        commonErrors: topicData.commonErrors || [],
        targetBand: topicData.targetBand || 'BAND_3',
        orderIndex: topicData.orderIndex || 0,
        isSystem: true,
      },
      update: {
        title: topicData.title,
        description: topicData.description || null,
        rule: topicData.rule,
        formula: topicData.formula || null,
        examples: topicData.examples || [],
        tips: topicData.tips || null,
        commonErrors: topicData.commonErrors || [],
        targetBand: topicData.targetBand || 'BAND_3',
        orderIndex: topicData.orderIndex || 0,
      },
    });

    console.log(`  ✅ Đã đồng bộ chủ điểm: "${topic.title}"`);

    // Process exercises
    const exercises = topicData.exercises || [];
    let cardIndex = 0;
    for (const ex of exercises) {
      if (!ex.question || !ex.correctAnswer) continue;

      const existingCard = await prisma.grammarCard.findFirst({
        where: {
          grammarTopicId: topic.id,
          question: ex.question.trim(),
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
        question: ex.question.trim(),
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
      } else {
        await prisma.grammarCard.create({
          data: exercisePayload,
        });
      }
      totalExercises++;
    }

    const exerciseCount = await prisma.grammarCard.count({
      where: { grammarTopicId: topic.id },
    });
    console.log(`     └─ Tổng cộng: ${exerciseCount} bài tập trắc nghiệm.`);
  }

  console.log(`🎉 [GRAMMAR] Hoàn thành: ${topics.length} chủ điểm, ${totalExercises} bài tập trắc nghiệm!`);
}

// ── 3. Import Questions & Tests ──────────────────────────────────
async function importQuestions(filePath) {
  const absPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Không tìm thấy file: ${absPath}`);
  }

  const rawData = JSON.parse(fs.readFileSync(absPath, 'utf8'));
  const tests = rawData.tests || [];

  console.log(`\n📝 [TESTS & QUESTIONS] Bắt đầu nạp ${tests.length} bộ đề thi từ ${filePath}...`);
  let totalQuestions = 0;

  for (const testData of tests) {
    if (!testData.title) {
      console.warn(`  ⚠️ Bỏ qua đề thi thiếu title:`, testData);
      continue;
    }

    const testId = testData.id || `test_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const questions = testData.questions || [];
    const partsList = Array.from(new Set(questions.map((q) => q.part || 'PART_5')));

    const test = await prisma.test.upsert({
      where: { id: testId },
      create: {
        id: testId,
        title: testData.title,
        description: testData.description || null,
        mode: testData.mode || 'PRACTICE',
        parts: partsList,
        bandRange: testData.targetBand ? [testData.targetBand] : ['BAND_3'],
        durationMins: testData.timeLimit || 15,
        totalQuestions: questions.length || 0,
        isPublished: true,
        isFree: true,
      },
      update: {
        title: testData.title,
        description: testData.description || null,
        mode: testData.mode || 'PRACTICE',
        parts: partsList,
        bandRange: testData.targetBand ? [testData.targetBand] : ['BAND_3'],
        durationMins: testData.timeLimit || 15,
        totalQuestions: questions.length || 0,
        isPublished: true,
      },
    });

    console.log(`  ✅ Đã đồng bộ đề thi: "${test.title}" (${test.mode}, ${test.durationMins} phút)`);

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
      } else {
        await prisma.testQuestion.create({
          data: qPayload,
        });
      }
      totalQuestions++;
    }

    const finalQCount = await prisma.testQuestion.count({
      where: { testId: test.id },
    });
    console.log(`     └─ Tổng cộng: ${finalQCount} câu hỏi trong đề thi.`);
  }

  console.log(`🎉 [TESTS & QUESTIONS] Hoàn thành: ${tests.length} đề thi, ${totalQuestions} câu hỏi!`);
}

// ── Main Execution ───────────────────────────────────────────────
async function main() {
  const options = parseArgs();

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🌸 TOEIC MASTER — CONTENT IMPORT PIPELINE');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    if (options.all) {
      await importVocabulary('content/samples/vocabulary.sample.json');
      await importGrammar('content/samples/grammar.sample.json');
      await importQuestions('content/samples/questions.sample.json');
    } else if (options.type === 'vocab' || options.type === 'vocabulary') {
      await importVocabulary(options.file || 'content/samples/vocabulary.sample.json');
    } else if (options.type === 'grammar') {
      await importGrammar(options.file || 'content/samples/grammar.sample.json');
    } else if (options.type === 'questions' || options.type === 'tests') {
      await importQuestions(options.file || 'content/samples/questions.sample.json');
    } else {
      console.log('💡 Hướng dẫn sử dụng:');
      console.log('  node scripts/import-content.js --type=vocab --file=path/to/vocabulary.json');
      console.log('  node scripts/import-content.js --type=grammar --file=path/to/grammar.json');
      console.log('  node scripts/import-content.js --type=questions --file=path/to/questions.json');
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

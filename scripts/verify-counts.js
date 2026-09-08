const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const [vt, vc, gt, gc, t, tq] = await Promise.all([
    prisma.vocabularyTopic.count(),
    prisma.vocabularyCard.count(),
    prisma.grammarTopic.count(),
    prisma.grammarCard.count(),
    prisma.test.count(),
    prisma.testQuestion.count(),
  ]);

  console.log('--- DATABASE REAL STATS ---');
  console.log(`Vocabulary Topics:    ${vt}`);
  console.log(`Vocabulary Cards:     ${vc}`);
  console.log(`Grammar Topics:       ${gt}`);
  console.log(`Grammar Cards (Ex):   ${gc}`);
  console.log(`Tests:                ${t}`);
  console.log(`Test Questions:       ${tq}`);
  console.log('---------------------------');
}

check().catch(console.error).finally(() => prisma.$disconnect());

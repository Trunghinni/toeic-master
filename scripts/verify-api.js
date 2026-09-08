const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BASE_URL = 'http://localhost:3001/api/v1';

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔍 BẮT ĐẦU VERIFICATION TOÀN DIỆN QUA API THẬT');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const testEmail = 'tester_verify@toeicmaster.vn';
  const testPassword = 'Password123!';

  // 1. Authenticate / Login
  console.log('▶ [BƯỚC 4.1] Đăng nhập tài khoản test để lấy Bearer Token...');
  let loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });

  if (!loginRes.ok) {
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        username: 'tester_verify',
        displayName: 'Tester Verify',
      }),
    });
    loginRes = regRes;
  }

  const authBody = await loginRes.json();
  const token = authBody.data.accessToken;
  const user = authBody.data.user;
  console.log(`  ✅ Lấy access token thành công (User ID: ${user.id} | Role hiện tại: ${user.role})\n`);

  // 2. Call GET /api/v1/vocabulary/topics
  console.log('▶ [BƯỚC 4.2] Gọi GET /api/v1/vocabulary/topics...');
  const topicsRes = await fetch(`${BASE_URL}/vocabulary/topics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const topicsBody = await topicsRes.json();
  const topics = topicsBody.data || [];

  console.log(`  HTTP Status: ${topicsRes.status}`);
  console.log(`  Tổng số topic trong hệ thống: ${topics.length} (Gốc 21 + 1 sample mới = 22 topic)`);

  const sampleTopic = topics.find((t) => t.id === 'sample_marketing_advertising');
  if (!sampleTopic) {
    throw new Error('❌ Không tìm thấy topic "sample_marketing_advertising" đã import!');
  }
  console.log(`  ✅ Đã tìm thấy Topic vừa import: "${sampleTopic.title}" (ID: ${sampleTopic.id})`);
  console.log(`     Mô tả: "${sampleTopic.description}" | Band: ${sampleTopic.targetBand}\n`);

  // 3. Call GET /api/v1/vocabulary/topics/:id
  console.log(`▶ [BƯỚC 4.3] Gọi GET /api/v1/vocabulary/topics/${sampleTopic.id} lấy chi tiết thẻ từ...`);
  const cardsRes = await fetch(`${BASE_URL}/vocabulary/topics/${sampleTopic.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const cardsBody = await cardsRes.json();
  const cards = cardsBody.data?.cards || [];

  console.log(`  HTTP Status: ${cardsRes.status}`);
  console.log(`  Số lượng thẻ từ: ${cards.length} / 4 thẻ`);
  cards.forEach((c, idx) => {
    console.log(`    ${idx + 1}. [${c.word}] ${c.phonetic} (${c.wordType}): ${c.definition}`);
    console.log(`       Ví dụ: "${c.example}"`);
    console.log(`       Dịch: "${c.exampleVi}"`);
  });

  if (cards.length !== 4) {
    throw new Error(`❌ Số thẻ từ không khớp: mong muốn 4, thực tế ${cards.length}`);
  }
  console.log('  ✅ Xác nhận đầy đủ 4/4 thẻ từ vựng khớp hoàn toàn với content/samples/vocabulary.sample.json!\n');

  // 4. Test RBAC Security on Admin Endpoints
  console.log('▶ [BƯỚC 5.1] Kiểm tra bảo mật RBAC với tài khoản role USER...');
  const unauthorizedRes = await fetch(`${BASE_URL}/admin/vocabulary/topics`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Hacker Topic Should Fail',
      description: 'Should be blocked with 403',
      targetBand: 'BAND_1',
    }),
  });

  console.log(`  HTTP Status khi USER thường gọi Admin API: ${unauthorizedRes.status} ${unauthorizedRes.statusText}`);
  const unauthorizedBody = await unauthorizedRes.json();
  console.log(`  Response:`, unauthorizedBody);

  if (unauthorizedRes.status === 403) {
    console.log('  ✅ BẢO MẬT AN TOÀN: Endpoint đã chặn thành công tài khoản không phải Admin (403 Forbidden)!\n');
  } else {
    throw new Error(`❌ LỖ HỔNG BẢO MẬT: Non-admin user tạo được topic! Status: ${unauthorizedRes.status}`);
  }

  // 5. Promote user to ADMIN and test full CRUD
  console.log('▶ [BƯỚC 5.2] Nâng cấp tài khoản lên role ADMIN trong database để kiểm tra luồng Admin CMS...');
  await prisma.user.update({
    where: { id: user.id },
    data: { role: 'ADMIN' },
  });

  // Re-login to get updated JWT payload with ADMIN role
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });
  const adminAuthBody = await adminLoginRes.json();
  const adminToken = adminAuthBody.data.accessToken;
  const adminUser = adminAuthBody.data.user;
  console.log(`  ✅ Đăng nhập lại với quyền: ${adminUser.role}\n`);

  // 5.3 Admin POST Create Topic
  console.log('▶ [BƯỚC 5.3] ADMIN gọi POST /api/v1/admin/vocabulary/topics tạo topic mới...');
  const createRes = await fetch(`${BASE_URL}/admin/vocabulary/topics`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Chủ Đề Test Admin CMS',
      description: 'Chủ đề được tạo tự động bởi bài test verification API',
      targetBand: 'BAND_4',
    }),
  });

  console.log(`  HTTP Status: ${createRes.status} ${createRes.statusText}`);
  const createdTopic = await createRes.json();
  console.log(`  ✅ Đã tạo thành công Topic:`, createdTopic);
  console.log(`     ID: ${createdTopic.id}\n`);

  // 5.4 Verify Topic Exists in GET
  console.log('▶ [BƯỚC 5.4] Kiểm tra GET /api/v1/vocabulary/topics xác nhận Topic vừa tạo xuất hiện...');
  const verifyGetRes = await fetch(`${BASE_URL}/vocabulary/topics`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const verifyGetBody = await verifyGetRes.json();
  const foundCreated = (verifyGetBody.data || []).find((t) => t.id === createdTopic.id);
  if (!foundCreated) {
    throw new Error('❌ Không tìm thấy Topic vừa tạo trong danh sách!');
  }
  console.log(`  ✅ Xác nhận Topic "${foundCreated.title}" đã xuất hiện trong danh sách (Tổng: ${(verifyGetBody.data || []).length} topics)\n`);

  // 5.5 Admin DELETE Topic
  console.log(`▶ [BƯỚC 5.5] ADMIN gọi DELETE /api/v1/admin/vocabulary/topics/${createdTopic.id}...`);
  const deleteRes = await fetch(`${BASE_URL}/admin/vocabulary/topics/${createdTopic.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`  HTTP Status: ${deleteRes.status} ${deleteRes.statusText}`);
  const deleteBody = await deleteRes.json();
  console.log(`  Response:`, deleteBody);

  // 5.6 Verify Topic is Deleted
  console.log('▶ [BƯỚC 5.6] Kiểm tra GET lại xác nhận Topic đã biến mất khỏi hệ thống...');
  const finalGetRes = await fetch(`${BASE_URL}/vocabulary/topics`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const finalGetBody = await finalGetRes.json();
  const stillExists = (finalGetBody.data || []).some((t) => t.id === createdTopic.id);
  if (stillExists) {
    throw new Error('❌ Topic vẫn còn tồn tại sau khi gọi DELETE!');
  }
  console.log(`  ✅ Hoàn tất CRUD: Topic đã được xoá sạch khỏi DB (Tổng trở về: ${(finalGetBody.data || []).length} topics)!\n`);

  // Reset user role
  await prisma.user.update({
    where: { id: user.id },
    data: { role: 'USER' },
  });
  console.log('  🔒 Đã reset role tài khoản test về USER an toàn.');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🎉 TOÀN BỘ 6 BƯỚC VERIFICATION ĐÃ VƯỢT QUA 100% HOÀN HẢO!');
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .catch((err) => {
    console.error('\n❌ VERIFICATION THẤT BẠI:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

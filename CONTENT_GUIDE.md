# Hướng Dẫn Quản Trị & Nạp Nội Dung (Content Management Guide)

Tài liệu này hướng dẫn chi tiết cách chuẩn bị dữ liệu, cấu trúc file JSON và các phương thức nạp nội dung (qua giao diện Admin CMS và qua CLI Script) vào hệ thống **TOEIC Master**.

---

## 1. Tổng Quan Các Loại Nội Dung

Hệ thống TOEIC Master hỗ trợ 3 nhóm nội dung chính trong database:
1. **Từ Vựng (Vocabulary)**: Chủ đề từ vựng (`Topic`) và danh sách thẻ từ (`VocabularyCard`) kèm phiên âm IPA, từ loại, định nghĩa, ví dụ và phát âm.
2. **Ngữ Pháp (Grammar)**: Chủ đề ngữ pháp (`GrammarTopic`) và các quy tắc ngữ pháp chi tiết (`GrammarRule`) kèm giải thích, bài tập trắc nghiệm nhanh.
3. **Ngân Hàng Câu Hỏi & Đề Thi (Questions)**: Câu hỏi TOEIC từ Part 1 đến Part 7 (`Question`) với file nghe, ảnh, transcript, các lựa chọn đáp án (`Option`) và lời giải thích chi tiết.

---

## 2. Nạp Nội Dung Qua CLI Script (`scripts/import-content.js`)

Hệ thống cung cấp sẵn script CLI an toàn, tự động kiểm tra trùng lặp (`upsert`) để không bị lỗi khoá ngoại hay ghi đè mất dữ liệu.

### 2.1. Vị trí file mẫu (Samples)
- Từ vựng: `content/samples/vocabulary.sample.json`
- Ngữ pháp: `content/samples/grammar.sample.json`
- Câu hỏi / Đề thi: `content/samples/questions.sample.json`

### 2.2. Các câu lệnh thực thi

```bash
# Nạp toàn bộ dữ liệu mẫu (Vocabulary + Grammar + Questions)
npm run content:import -- --all

# Nạp riêng từng phần từ file mẫu mặc định
npm run content:import -- --type=vocab
npm run content:import -- --type=grammar
npm run content:import -- --type=questions

# Nạp từ một file JSON tùy chỉnh ở đường dẫn bất kỳ
npm run content:import -- --type=vocab --file="./path/to/my-vocabulary.json"
npm run content:import -- --type=questions --file="./content/ets-2024-test-01.json"
```

---

## 3. Quy Cách Cấu Trúc File JSON (JSON Schemas)

### 3.1. Từ Vựng (`vocabulary`)

File JSON là một mảng (`Array`) các Topics, mỗi Topic chứa danh sách `cards`:

```json
[
  {
    "title": "Tên chủ đề (ví dụ: Office Equipment & Tech)",
    "description": "Mô tả ngắn về chủ đề từ vựng",
    "icon": "Tên Lucide icon hoặc emoji (vd: 'Laptop', 'Building', 'Briefcase')",
    "bandLevel": "A1_A2 | B1_B2 | C1_C2",
    "order": 1,
    "cards": [
      {
        "word": "photocopier",
        "ipa": "/ˈfoʊtoʊkɑːpiər/",
        "meaning": "máy photocopy",
        "wordType": "NOUN | VERB | ADJECTIVE | ADVERB | PREPOSITION | CONJUNCTION | IDIOM | PHRASAL_VERB",
        "exampleSentence": "The photocopier on the third floor is currently out of order.",
        "exampleMeaning": "Máy photocopy ở tầng ba hiện đang bị hỏng.",
        "audioUrl": "https://assets.toeicmaster.vn/audio/vocab/photocopier.mp3",
        "order": 1
      }
    ]
  }
]
```

**Các giá trị Enum hợp lệ:**
- `bandLevel`: `"A1_A2"`, `"B1_B2"`, `"C1_C2"`
- `wordType`: `"NOUN"`, `"VERB"`, `"ADJECTIVE"`, `"ADVERB"`, `"PREPOSITION"`, `"CONJUNCTION"`, `"IDIOM"`, `"PHRASAL_VERB"`

---

### 3.2. Ngữ Pháp (`grammar`)

File JSON là một mảng các chủ đề ngữ pháp, mỗi chủ đề gồm danh sách quy tắc (`rules`):

```json
[
  {
    "title": "Hiện Tại Hoàn Thành vs Quá Khứ Đơn",
    "description": "Phân biệt thì Present Perfect và Past Simple trong các bẫy Part 5 & 6",
    "bandLevel": "A1_A2 | B1_B2 | C1_C2",
    "order": 1,
    "rules": [
      {
        "title": "Dấu hiệu nhận biết thì Hiện tại hoàn thành",
        "explanation": "Hiện tại hoàn thành diễn tả hành động bắt đầu ở quá khứ và còn tiếp diễn hoặc để lại kết quả ở hiện tại. Thường đi với: since, for, already, yet, recently, so far...",
        "formula": "S + have/has + V3/ed + O",
        "examples": [
          "Ms. Patel has worked at this firm since 2018.",
          "We have already reviewed the quarterly financial report."
        ],
        "order": 1
      }
    ]
  }
]
```

---

### 3.3. Câu Hỏi & Đề Thi (`questions`)

File JSON là một mảng các câu hỏi TOEIC:

```json
[
  {
    "part": "PART_1 | PART_2 | PART_3 | PART_4 | PART_5 | PART_6 | PART_7",
    "difficulty": 1,
    "passage": "Đoạn văn đọc hiểu (dành cho Part 6 và Part 7), để trống nếu là Part 1-5",
    "audioUrl": "Đường dẫn file audio nghe (Part 1-4)",
    "imageUrl": "Đường dẫn ảnh mô tả (Part 1 hoặc biểu đồ Part 3, 4, 7)",
    "transcript": "Lời thoại âm thanh (Part 1-4)",
    "order": 1,
    "options": [
      {
        "label": "A",
        "content": "The conference has been rescheduled for next Tuesday.",
        "isCorrect": true,
        "explanation": "Câu A đúng về ngữ pháp và phù hợp ngữ cảnh..."
      },
      {
        "label": "B",
        "content": "The conference rescheduling for next Tuesday.",
        "isCorrect": false,
        "explanation": "Thiếu trợ động từ chia thì."
      },
      {
        "label": "C",
        "content": "The conference will reschedule next Tuesday.",
        "isCorrect": false,
        "explanation": "Cần thể bị động."
      },
      {
        "label": "D",
        "content": "The conference was reschedule next Tuesday.",
        "isCorrect": false,
        "explanation": "Sai thì tương lai và dạng động từ."
      }
    ]
  }
]
```

**Các giá trị Enum hợp lệ:**
- `part`: `"PART_1"`, `"PART_2"`, `"PART_3"`, `"PART_4"`, `"PART_5"`, `"PART_6"`, `"PART_7"`
- `difficulty`: Số nguyên từ `1` (Dễ / Band 250-500) đến `5` (Rất khó / Band 850+)

---

## 4. Quản Trị Qua Giao Diện Web (Admin Vocabulary CMS)

Dành cho người quản trị muốn thêm/sửa/xoá trực tiếp mà không cần thao tác với file JSON hay Terminal:

1. Đăng nhập với tài khoản có quyền `ADMIN` (hoặc nâng cấp vai trò trong bảng `User`).
2. Điều hướng đến trang Quản Trị: `http://localhost:3000/admin`.
3. Chuyển sang tab **"Quản Lý Từ Vựng (Vocabulary CMS)"**.
4. Tại đây bạn có thể:
   - **Tạo chủ đề mới**: Nhập tên chủ đề, mô tả, chọn Band level (`A1_A2`, `B1_B2`, `C1_C2`), chọn icon hiển thị.
   - **Xem danh sách thẻ từ**: Click vào chủ đề để bung danh sách từ vựng hiện có.
   - **Thêm từ mới vào chủ đề**: Nhập từ gốc (`word`), phiên âm (`ipa`), từ loại (`NOUN`, `VERB`...), nghĩa tiếng Việt, câu ví dụ tiếng Anh và dịch nghĩa tiếng Việt.
   - **Xoá chủ đề**: Nhấp nút xoá để loại bỏ chủ đề không còn sử dụng.

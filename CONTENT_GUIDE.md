# Cẩm Nang Quản Trị & Nạp Nội Dung TOEIC Master (Content Guide)

Tài liệu này là đặc tả kỹ thuật và hướng dẫn vận hành toàn diện giúp bạn tự biên soạn, nạp hàng loạt nội dung qua CLI Script hoặc quản trị trực quan qua Admin Web CMS của **TOEIC Master**.

---

## 1. Hệ Thống Enums Chuẩn Trong Database

Mọi trường dữ liệu enum trong file JSON **bắt buộc** phải sử dụng đúng các giá trị dưới đây:

| Enum | Các giá trị hợp lệ | Ghi chú |
| :--- | :--- | :--- |
| **`BandLevel`** | `BAND_1`, `BAND_2`, `BAND_3`, `BAND_4`, `BAND_5`, `BAND_6` | `BAND_1` (~10-250), `BAND_2` (~255-400), `BAND_3` (~405-600), `BAND_4` (~605-750), `BAND_5` (~755-900), `BAND_6` (~905-990). |
| **`WordType`** | `NOUN`, `VERB`, `ADJECTIVE`, `ADVERB`, `PREPOSITION`, `CONJUNCTION`, `PRONOUN`, `INTERJECTION`, `PHRASE`, `OTHER` | Từ loại của thẻ từ vựng. |
| **`TestPartType`** | `PART_1`, `PART_2`, `PART_3`, `PART_4`, `PART_5`, `PART_6`, `PART_7` | 7 phần của đề thi TOEIC chuẩn ETS. |
| **`TestMode`** | `PRACTICE`, `MINI_TEST`, `FULL_TEST` | `PRACTICE` (luyện tập không giới hạn), `MINI_TEST` (đề thu nhỏ 15-30 phút), `FULL_TEST` (đề chuẩn 200 câu 120 phút). |
| **`ExerciseType`**| `MULTIPLE_CHOICE`, `FILL_IN_THE_BLANK`, `ERROR_CORRECTION`, `MATCHING`, `SHORT_ANSWER` | Dạng bài tập ngữ pháp (mặc định trắc nghiệm `MULTIPLE_CHOICE`). |

---

## 2. Đặc Tả Chi Tiết Từng Loại File JSON

File JSON luôn có cấu trúc bọc ngoài:
- Từ vựng: `{ "topics": [ ... ] }`
- Ngữ pháp: `{ "topics": [ ... ] }`
- Đề thi & Câu hỏi: `{ "tests": [ ... ] }`

---

### 2.1. Từ Vựng (`vocabulary`)

File: `content/vocabulary.full.json` (hoặc bất kỳ file JSON nào nạp qua `--type=vocab`).

```json
{
  "topics": [
    {
      "id": "top_office_01",
      "title": "Office Equipment & Technology",
      "description": "Các thiết bị văn phòng, máy in, mạng nội bộ và hỗ trợ kỹ thuật",
      "targetBand": "BAND_3",
      "isPublic": true,
      "cards": [
        {
          "word": "photocopier",
          "phonetic": "/ˈfoʊtoʊkɑːpiər/",
          "wordType": "NOUN",
          "definition": "Máy photocopy, máy sao chụp tài liệu",
          "definitionEn": "A machine that makes paper copies of documents",
          "example": "The technician repaired the photocopier before the morning meeting.",
          "exampleVi": "Kỹ thuật viên đã sửa xong máy photocopy trước cuộc họp sáng.",
          "audioUsUrl": "https://assets.toeicmaster.vn/audio/photocopier_us.mp3",
          "audioUkUrl": null,
          "tags": ["office", "equipment", "admin"],
          "orderInTopic": 1
        }
      ]
    }
  ]
}
```

* **Quy tắc Idempotency (Chống trùng lặp)**:
  * Topic được tìm kiếm theo `id`. Nếu không có `id`, tìm theo `title`.
  * Card được tìm kiếm theo `[topicId, word]`. Nếu đã có, hệ thống cập nhật nghĩa, ví dụ, phiên âm mới nhất mà không tạo thêm dòng mới.

---

### 2.2. Ngữ Pháp (`grammar`)

File: `content/grammar.full.json` (hoặc nạp qua `--type=grammar`).

```json
{
  "topics": [
    {
      "id": "gram_relative_clauses",
      "title": "Mệnh Đề Quan Hệ & Mệnh Đề Rút Gọn",
      "description": "Cách dùng who, whom, which, that, whose và kỹ năng nhận biết mệnh đề quan hệ rút gọn trong Part 5 & 6",
      "targetBand": "BAND_3",
      "orderIndex": 1,
      "rule": "Mệnh đề quan hệ dùng để bổ nghĩa cho danh từ đứng trước. Khi rút gọn thể chủ động dùng **V-ing**, thể bị động dùng **V-ed/V3**.",
      "formula": "S + [Relative Pronoun + V/S-V] + Main Verb + O",
      "examples": [
        {
          "sentence": "The applicant who scored highest was offered the position.",
          "translation": "Ứng viên đạt điểm cao nhất đã được mời nhận vị trí làm việc.",
          "highlight": "who scored highest"
        }
      ],
      "tips": "Nếu chỗ trống đứng ngay trước động từ và danh từ phía trước chỉ người, chọn 'who'. Nếu sau chỗ trống là một mệnh đề S+V hoàn chỉnh, cân nhắc 'whom' hoặc 'which'.",
      "commonErrors": [
        {
          "wrong": "The person which called yesterday.",
          "correct": "The person who called yesterday.",
          "explanation": "'Which' chỉ dùng cho đồ vật hoặc sự việc, không dùng cho người."
        }
      ],
      "exercises": [
        {
          "question": "The engineer _______ designed the manufacturing plant received an industry award.",
          "options": [
            { "id": "A", "text": "who" },
            { "id": "B", "text": "whom" },
            { "id": "C", "text": "which" },
            { "id": "D", "text": "whose" }
          ],
          "correctAnswer": "who",
          "explanation": "Danh từ 'engineer' là người, đứng trước động từ 'designed' làm chủ ngữ, đáp án chính xác là 'who'.",
          "difficulty": 2
        }
      ]
    }
  ]
}
```

---

### 2.3. Đề Thi & Ngân Hàng Câu Hỏi (`tests`)

File: `content/tests.full.json` (hoặc nạp qua `--type=questions`).

Mỗi đề thi chứa danh sách các câu hỏi. Dưới đây là quy chuẩn định dạng cho **toàn bộ 7 Parts TOEIC**:

#### A. Part 1: Mô Tả Tranh (Photographs)
```json
{
  "part": "PART_1",
  "questionNumber": 1,
  "imageUrl": "https://assets.toeicmaster.vn/images/part1/test01_q01.jpg",
  "audioUrl": "https://assets.toeicmaster.vn/audio/part1/test01_q01.mp3",
  "prompt": "Look at the photograph and choose the statement that best describes what you see.",
  "options": [
    { "id": "A", "text": "(A) A man is reviewing documents on his desk." },
    { "id": "B", "text": "(B) A man is repairing a computer monitor." },
    { "id": "C", "text": "(C) A woman is standing next to a whiteboard." },
    { "id": "D", "text": "(D) Some chairs are being stacked in the hallway." }
  ],
  "correctOptionId": "A",
  "explanation": "Trong bức tranh, người đàn ông đang ngồi tại bàn làm việc và chăm chú đọc các tập tài liệu. Đáp án (A) phản ánh chính xác hành động."
}
```

#### B. Part 2: Hỏi & Đáp (Question-Response)
```json
{
  "part": "PART_2",
  "questionNumber": 7,
  "audioUrl": "https://assets.toeicmaster.vn/audio/part2/test01_q07.mp3",
  "prompt": "Where did you leave the conference room key?",
  "options": [
    { "id": "A", "text": "(A) On the receptionist's desk." },
    { "id": "B", "text": "(B) Yes, the meeting starts at two." },
    { "id": "C", "text": "(C) For about forty-five minutes." }
  ],
  "correctOptionId": "A",
  "explanation": "Câu hỏi 'Where' hỏi về nơi chốn. Câu trả lời (A) 'On the receptionist's desk' chỉ vị trí phù hợp nhất. Câu (B) trả lời Yes/No cho câu hỏi Wh- là bẫy phổ biến."
}
```

#### C. Part 3 & 4: Hội Thoại (Conversations) & Bài Nói Ngắn (Talks)
Part 3 và Part 4 thường có **1 đoạn băng nghe đi kèm chùm 3 câu hỏi**:
```json
{
  "part": "PART_3",
  "questionNumber": 32,
  "audioUrl": "https://assets.toeicmaster.vn/audio/part3/test01_q32_34.mp3",
  "passageText": "[Transcript - M-Cn]: Hi Sarah, have you finished reviewing the financial report for the third quarter?\n[W-Br]: Almost, David. I found a discrepancy in the marketing expenditure column that we need to clarify with Mr. Henderson.\n[M-Cn]: Good catch. Let's schedule a brief call with him before the executive board gathers at three o'clock.",
  "prompt": "What department does Sarah mention in the conversation?",
  "options": [
    { "id": "A", "text": "Human Resources" },
    { "id": "B", "text": "Marketing" },
    { "id": "C", "text": "Logistics" },
    { "id": "D", "text": "Customer Support" }
  ],
  "correctOptionId": "B",
  "explanation": "Người phụ nữ nói: 'I found a discrepancy in the marketing expenditure column', do đó phòng ban được nhắc đến là Marketing."
}
```

#### D. Part 5: Điền Vào Chỗ Trống (Incomplete Sentences)
```json
{
  "part": "PART_5",
  "questionNumber": 101,
  "prompt": "The board of directors _______ approved the proposed merger after a thorough financial review.",
  "options": [
    { "id": "A", "text": "unanimous" },
    { "id": "B", "text": "unanimously" },
    { "id": "C", "text": "unanimity" },
    { "id": "D", "text": "unanimities" }
  ],
  "correctOptionId": "B",
  "explanation": "Chỗ trống đứng trước động từ chính 'approved', do đó cần một trạng từ (adverb) 'unanimously' (nhất trí, đồng lòng) để bổ nghĩa cho động từ."
}
```

#### E. Part 6: Điền Đoạn Văn (Text Completion)
Sử dụng `passageText` chứa toàn bộ đoạn văn và các ký hiệu đánh số `[131]`, `[132]`...:
```json
{
  "part": "PART_6",
  "questionNumber": 131,
  "passageText": "To: All Employees\nFrom: Executive Committee\nSubject: Office Relocation\nDate: October 15\n\nWe are pleased to announce that our regional headquarters will move to the newly constructed Landmark Tower on November 1st. The new facility offers expanded workspaces and high-speed fiber connectivity. We expect this move will _______ [131] collaboration among multidisciplinary teams.\n\nPlease pack your personal desk items by Friday afternoon. Boxes and color-coded labels _______ [132] by the facilities department tomorrow morning.",
  "prompt": "Select the best answer for blank [131]:",
  "options": [
    { "id": "A", "text": "enhance" },
    { "id": "B", "text": "enhanced" },
    { "id": "C", "text": "enhancing" },
    { "id": "D", "text": "enhancement" }
  ],
  "correctOptionId": "A",
  "explanation": "Sau trợ động từ khuyết thiếu 'will' cần động từ nguyên mẫu không 'to' (bare infinitive) 'enhance'."
}
```

#### F. Part 7: Đọc Hiểu Đơn & Đa Đoạn (Reading Comprehension)
Hỗ trợ cả đoạn đơn, đoạn kép (Double Passages) hoặc ba đoạn (Triple Passages):
```json
{
  "part": "PART_7",
  "questionNumber": 147,
  "passageText": "--- NOTICE ---\nWestside Business Park\nAnnual Fire Alarm Maintenance\n\nPlease be advised that technicians from Apex Safety Systems will conduct comprehensive testing of the building's emergency alarms this Thursday, October 12, between 9:00 AM and 11:30 AM.\n\nDuring this interval, acoustic sirens and strobe lights will activate intermittently for durations of 15 to 30 seconds. Building occupants are NOT required to evacuate during these tests unless an announcement explicitly instructs otherwise.\n\nWe apologize for any temporary disruption to your work schedule.\nBuilding Management Office",
  "prompt": "Why is the notice being posted?",
  "options": [
    { "id": "A", "text": "To announce an evacuation drill" },
    { "id": "B", "text": "To notify tenants of routine safety testing" },
    { "id": "C", "text": "To introduce a new security company" },
    { "id": "D", "text": "To request feedback on building amenities" }
  ],
  "correctOptionId": "B",
  "explanation": "Thông báo nhằm mục đích báo trước về việc kiểm tra định kỳ hệ thống báo cháy ('conduct comprehensive testing of the building's emergency alarms')."
}
```

---

## 3. Lệnh Nạp Nội Dung Qua Dòng Lệnh (CLI Pipeline)

Script [`scripts/import-content.js`](file:///c:/Users/USER/toeic-master/scripts/import-content.js) xử lý an toàn với cơ chế **Idempotent Upsert** (chạy lại nhiều lần không tạo rác, không crash, tự động cập nhật dữ liệu mới nhất).

```bash
# Nạp toàn bộ dữ liệu mẫu mặc định
npm run content:import -- --all

# Nạp file từ vựng lớn tùy chỉnh (vd: 200 từ)
npm run content:import -- --type=vocab --file="./content/vocabulary.full.json"

# Nạp file ngữ pháp lớn tùy chỉnh
npm run content:import -- --type=grammar --file="./content/grammar.full.json"

# Nạp file đề thi & ngân hàng câu hỏi
npm run content:import -- --type=questions --file="./content/tests.full.json"
```

---

## 4. Quản Trị Trực Quan Qua Giao Diện Admin Web CMS

Bạn có thể quản lý và biên tập nội dung trực tiếp tại:
👉 `http://localhost:3000/admin` (yêu cầu tài khoản có quyền `ADMIN`).

Giao diện bao gồm 4 tab quản trị toàn diện:
1. **Quản Lý Người Dùng**: Xem danh sách học viên, phân quyền `USER` / `ADMIN`, cấp gói VIP Premium.
2. **Quản Lý Từ Vựng (Vocabulary CMS)**: Tạo chủ đề, xem danh sách từ, thêm thẻ từ vựng với đầy đủ phiên âm IPA, câu ví dụ, dịch nghĩa tiếng Việt, xoá chủ đề.
3. **Quản Lý Ngữ Pháp (Grammar CMS)**: Tạo chủ điểm ngữ pháp, định nghĩa công thức, ghi chú mẹo làm bài, tạo các câu hỏi trắc nghiệm kèm lời giải thích.
4. **Quản Lý Đề Thi (Tests CMS)**: Tạo đề thi mới (Mini Test / Full Test / Practice), thêm câu hỏi trực tiếp theo Part (Part 1-7), định nghĩa 4 phương án lựa chọn và đáp án đúng.

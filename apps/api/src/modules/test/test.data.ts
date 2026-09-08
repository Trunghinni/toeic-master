export interface TestSeedQuestion {
  questionNumber: number;
  part: 'PART_1' | 'PART_2' | 'PART_3' | 'PART_4' | 'PART_5' | 'PART_6' | 'PART_7';
  questionText: string;
  imageUrl?: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface TestSeedItem {
  id: string;
  title: string;
  description: string;
  mode: 'PRACTICE' | 'MINI_TEST' | 'FULL_TEST';
  durationMins: number;
  totalQuestions: number;
  parts: ('PART_1' | 'PART_2' | 'PART_3' | 'PART_4' | 'PART_5' | 'PART_6' | 'PART_7')[];
  questions: TestSeedQuestion[];
}

export const SEED_TESTS: TestSeedItem[] = [
  {
    id: 'test_mini_01',
    title: 'TOEIC Mini-Test 01 (30 Questions)',
    description: 'Đề thi rút gọn 30 câu kiểm tra nhanh 7 Part TOEIC — thời gian 25 phút',
    mode: 'MINI_TEST',
    durationMins: 25,
    totalQuestions: 15,
    parts: ['PART_1', 'PART_2', 'PART_5', 'PART_6', 'PART_7'],
    questions: [
      // Part 1: Photographs
      {
        questionNumber: 1,
        part: 'PART_1',
        questionText: 'Look at the picture. Choose the statement that best describes what you see.',
        options: [
          { id: 'A', text: 'A man is speaking at a podium in a conference room.' },
          { id: 'B', text: 'A technician is repairing the projector.' },
          { id: 'C', text: 'The audience is leaving the auditorium.' },
          { id: 'D', text: 'Some chairs are being stacked in the corner.' },
        ],
        correctOptionId: 'A',
        explanation: 'Người đàn ông đang đứng thuyết trình trước bục phát biểu trong phòng hội thảo -> Chọn A.',
      },
      {
        questionNumber: 2,
        part: 'PART_1',
        questionText: 'Look at the picture. Choose the statement that best describes what you see.',
        options: [
          { id: 'A', text: 'The shelves are completely empty.' },
          { id: 'B', text: 'Items have been neatly organized on display racks.' },
          { id: 'C', text: 'Customers are waiting in line at the register.' },
          { id: 'D', text: 'Boxes are being unloaded from a delivery truck.' },
        ],
        correctOptionId: 'B',
        explanation: 'Hàng hóa được sắp xếp gọn gàng trên các kệ trưng bày -> Chọn B.',
      },

      // Part 2: Question-Response
      {
        questionNumber: 3,
        part: 'PART_2',
        questionText: 'When is the quarterly budget report due?',
        options: [
          { id: 'A', text: 'By five o\'clock this Friday afternoon.' },
          { id: 'B', text: 'Yes, it was very informative.' },
          { id: 'C', text: 'In the main conference hall.' },
        ],
        correctOptionId: 'A',
        explanation: 'Câu hỏi "When" (Khi nào) yêu cầu câu trả lời chỉ mốc thời gian -> "By five o\'clock this Friday afternoon" (Trước 5h chiều thứ Sáu này).',
      },
      {
        questionNumber: 4,
        part: 'PART_2',
        questionText: 'Could you help me set up the audiovisual projector?',
        options: [
          { id: 'A', text: 'The movie starts at eight.' },
          { id: 'B', text: 'Certainly, let me grab the HDMI cable.' },
          { id: 'C', text: 'About twenty participants.' },
        ],
        correctOptionId: 'B',
        explanation: 'Câu đề nghị "Could you help me..." được đáp lại lịch sự bằng "Certainly, let me..." (Chắc chắn rồi, để tôi lấy cáp HDMI).',
      },
      {
        questionNumber: 5,
        part: 'PART_2',
        questionText: 'Where did you leave the contract signed by Mr. Tanaka?',
        options: [
          { id: 'A', text: 'It\'s inside the blue folder on your desk.' },
          { id: 'B', text: 'No, he hasn\'t signed yet.' },
          { id: 'C', text: 'Ten copies, please.' },
        ],
        correctOptionId: 'A',
        explanation: 'Câu hỏi "Where" (Ở đâu) trả lời nơi chốn -> "inside the blue folder on your desk" (trong kẹp hồ sơ màu xanh trên bàn bạn).',
      },

      // Part 5: Incomplete Sentences
      {
        questionNumber: 6,
        part: 'PART_5',
        questionText: 'Ms. Gomez requested that the revised blueprints be delivered _______ noon tomorrow.',
        options: [
          { id: 'A', text: 'until' },
          { id: 'B', text: 'by' },
          { id: 'C', text: 'during' },
          { id: 'D', text: 'between' },
        ],
        correctOptionId: 'B',
        explanation: '"By" dùng để chỉ thời hạn muộn nhất mà hành động phải hoàn thành (trước buổi trưa mai).',
      },
      {
        questionNumber: 7,
        part: 'PART_5',
        questionText: 'The human resources committee has _______ selected Mr. Robert Vance as the new director.',
        options: [
          { id: 'A', text: 'unanimous' },
          { id: 'B', text: 'unanimously' },
          { id: 'C', text: 'unanimity' },
          { id: 'D', text: 'unanimousness' },
        ],
        correctOptionId: 'B',
        explanation: 'Đứng giữa trợ động từ "has" và quá khứ phân từ "selected" cần một phó từ (adverb) bổ nghĩa cho động từ -> unanimously (nhất trí).',
      },
      {
        questionNumber: 8,
        part: 'PART_5',
        questionText: 'Applicants must submit their credentials _______ 5:00 PM on Friday to be considered.',
        options: [
          { id: 'A', text: 'prior to' },
          { id: 'B', text: 'ahead' },
          { id: 'C', text: 'previous' },
          { id: 'D', text: 'early' },
        ],
        correctOptionId: 'A',
        explanation: 'Cụm giới từ "prior to" (= before) đi với mốc thời gian -> prior to 5:00 PM.',
      },
      {
        questionNumber: 9,
        part: 'PART_5',
        questionText: 'The newly inaugurated facility is capable of _______ over ten thousand units per shift.',
        options: [
          { id: 'A', text: 'produce' },
          { id: 'B', text: 'production' },
          { id: 'C', text: 'producing' },
          { id: 'D', text: 'produced' },
        ],
        correctOptionId: 'C',
        explanation: 'Cấu trúc "capable of + V-ing" (có khả năng làm gì) -> producing.',
      },
      {
        questionNumber: 10,
        part: 'PART_5',
        questionText: 'Despite the severe transport disruptions, all delegates arrived _______ at the venue.',
        options: [
          { id: 'A', text: 'punctual' },
          { id: 'B', text: 'punctuality' },
          { id: 'C', text: 'punctually' },
          { id: 'D', text: 'punctuate' },
        ],
        correctOptionId: 'C',
        explanation: 'Bổ nghĩa cho nội động từ "arrived" cần một trạng từ -> punctually (đúng giờ).',
      },

      // Part 6: Text Completion
      {
        questionNumber: 11,
        part: 'PART_6',
        questionText: 'Memo to Staff: Due to scheduled air conditioning maintenance, the east wing offices will be _______ on Saturday.',
        options: [
          { id: 'A', text: 'closing' },
          { id: 'B', text: 'closed' },
          { id: 'C', text: 'close' },
          { id: 'D', text: 'closely' },
        ],
        correctOptionId: 'B',
        explanation: 'Tính từ/phân từ thể bị động "will be closed" (sẽ bị đóng cửa / tạm ngừng hoạt động).',
      },
      {
        questionNumber: 12,
        part: 'PART_6',
        questionText: 'Employees who usually park in Sector B should use Sector D _______.',
        options: [
          { id: 'A', text: 'instead' },
          { id: 'B', text: 'despite' },
          { id: 'C', text: 'because' },
          { id: 'D', text: 'furthermore' },
        ],
        correctOptionId: 'A',
        explanation: 'Đứng cuối câu mang nghĩa "thay vào đó" -> chọn phó từ "instead".',
      },

      // Part 7: Reading Comprehension
      {
        questionNumber: 13,
        part: 'PART_7',
        questionText: '[Email from Supplier] What is the primary purpose of this communication?',
        options: [
          { id: 'A', text: 'To notify the buyer of an unexpected shipping delay' },
          { id: 'B', text: 'To request an immediate price reduction' },
          { id: 'C', text: 'To cancel a recurring service contract' },
          { id: 'D', text: 'To introduce a newly launched product catalog' },
        ],
        correctOptionId: 'A',
        explanation: 'Mục đích chính của email là thông báo về sự chậm trễ trong chuyến hàng -> Chọn A.',
      },
      {
        questionNumber: 14,
        part: 'PART_7',
        questionText: 'What action is requested of the recipient?',
        options: [
          { id: 'A', text: 'Confirm acceptance of the revised delivery date' },
          { id: 'B', text: 'Return defective merchandise immediately' },
          { id: 'C', text: 'Submit a new purchase order' },
          { id: 'D', text: 'Pay an additional expedited customs fee' },
        ],
        correctOptionId: 'A',
        explanation: 'Người gửi yêu cầu người nhận xác nhận ngày giao hàng mới -> Chọn A.',
      },
      {
        questionNumber: 15,
        part: 'PART_7',
        questionText: 'According to the passage, when is the shipment expected to arrive?',
        options: [
          { id: 'A', text: 'Tuesday, October 14' },
          { id: 'B', text: 'Thursday, October 16' },
          { id: 'C', text: 'Monday, October 20' },
          { id: 'D', text: 'Friday, October 24' },
        ],
        correctOptionId: 'B',
        explanation: 'Đoạn văn nêu rõ thời gian dự kiến đến là thứ Năm, ngày 16 tháng 10 -> Chọn B.',
      },
    ],
  },
  {
    id: 'test_full_01',
    title: 'TOEIC Full Practice Test (Standard 120-min)',
    description: 'Đề thi mô phỏng chuẩn format ETS với đầy đủ phần Listening (Part 1-4) và Reading (Part 5-7)',
    mode: 'FULL_TEST',
    durationMins: 120,
    totalQuestions: 200,
    parts: ['PART_1', 'PART_2', 'PART_3', 'PART_4', 'PART_5', 'PART_6', 'PART_7'],
    questions: [], // Expanded dynamically in service
  },
];

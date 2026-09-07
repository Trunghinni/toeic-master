export interface SkillPracticeItem {
  id: string;
  part: 'PART_1' | 'PART_2' | 'PART_3' | 'PART_4' | 'PART_5' | 'PART_6' | 'PART_7';
  title: string;
  audioUrl?: string;
  imageUrl?: string;
  passageText?: string;
  transcript?: string;
  questions: {
    questionNumber: number;
    questionText: string;
    options: { id: string; text: string }[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export const SKILL_PRACTICE_ITEMS: SkillPracticeItem[] = [
  // Part 1: Photographs
  {
    id: 'skill_p1_01',
    part: 'PART_1',
    title: 'Part 1: Office Presentation',
    audioUrl: 'https://dict.youdao.com/dictvoice?audio=A+woman+is+presenting+slides+to+her+colleagues&type=2',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80',
    transcript: '(A) She is adjusting the blinds. (B) She is presenting financial slides to colleagues. (C) She is exiting the conference room. (D) She is pouring coffee for the team.',
    questions: [
      {
        questionNumber: 1,
        questionText: 'Look at the picture. Which statement best describes the scene?',
        options: [
          { id: 'A', text: 'She is adjusting the window blinds.' },
          { id: 'B', text: 'She is presenting financial slides to colleagues.' },
          { id: 'C', text: 'She is exiting the conference room.' },
          { id: 'D', text: 'She is pouring coffee for the team.' },
        ],
        correctAnswer: 'B',
        explanation: 'Người phụ nữ đang đứng thuyết trình các slide biểu đồ cho các đồng nghiệp xung quanh bàn họp -> Chọn B.',
      },
    ],
  },

  // Part 2: Question-Response
  {
    id: 'skill_p2_01',
    part: 'PART_2',
    title: 'Part 2: Flight Schedule Inquiry',
    audioUrl: 'https://dict.youdao.com/dictvoice?audio=When+does+the+flight+to+Singapore+depart&type=2',
    transcript: 'Question: When does the flight to Singapore depart? (A) Terminal 3. (B) At quarter past six. (C) Yes, with Singapore Airlines.',
    questions: [
      {
        questionNumber: 1,
        questionText: 'When does the flight to Singapore depart?',
        options: [
          { id: 'A', text: 'Terminal 3, gate 12.' },
          { id: 'B', text: 'At quarter past six.' },
          { id: 'C', text: 'Yes, with Singapore Airlines.' },
        ],
        correctAnswer: 'B',
        explanation: 'Câu hỏi "When" (Khi nào) yêu cầu đáp án thời gian: "At quarter past six" (Lúc 6 giờ 15 phút) -> Chọn B.',
      },
    ],
  },

  // Part 3: Short Conversations
  {
    id: 'skill_p3_01',
    part: 'PART_3',
    title: 'Part 3: Office Supply Reorder',
    audioUrl: 'https://dict.youdao.com/dictvoice?audio=We+are+running+low+on+printer+paper+again&type=2',
    transcript: 'Man: We are running low on printer paper again. Did anyone submit the monthly order? Woman: I checked with accounting this morning, but the requisition hasn\'t been approved yet. Man: I\'ll call Mr. Harrison right away so we don\'t run out before the board meeting.',
    questions: [
      {
        questionNumber: 1,
        questionText: 'What problem are the speakers discussing?',
        options: [
          { id: 'A', text: 'A broken photocopier' },
          { id: 'B', text: 'A shortage of printer paper' },
          { id: 'C', text: 'A cancelled board meeting' },
          { id: 'D', text: 'An overdue client invoice' },
        ],
        correctAnswer: 'B',
        explanation: 'Người nam mở đầu: "We are running low on printer paper again" (Chúng ta lại sắp hết giấy in rồi) -> Chọn B.',
      },
      {
        questionNumber: 2,
        questionText: 'What does the man promise to do?',
        options: [
          { id: 'A', text: 'Contact Mr. Harrison immediately' },
          { id: 'B', text: 'Drive to the stationery store' },
          { id: 'C', text: 'Reschedule the meeting' },
          { id: 'D', text: 'Print the documents tomorrow' },
        ],
        correctAnswer: 'A',
        explanation: 'Người nam nói: "I\'ll call Mr. Harrison right away" -> Chọn A.',
      },
    ],
  },

  // Part 4: Short Talks
  {
    id: 'skill_p4_01',
    part: 'PART_4',
    title: 'Part 4: Public Announcement at Airport',
    audioUrl: 'https://dict.youdao.com/dictvoice?audio=Attention+passengers+on+Flight+seven+zero+two&type=2',
    transcript: 'Attention passengers on Flight 702 to Chicago. Due to dense fog at our destination, boarding has been delayed by approximately 45 minutes. Please remain in the gate area for further announcements.',
    questions: [
      {
        questionNumber: 1,
        questionText: 'What is the reason for the flight delay?',
        options: [
          { id: 'A', text: 'Mechanical problems' },
          { id: 'B', text: 'Adverse weather conditions' },
          { id: 'C', text: 'Air traffic congestion' },
          { id: 'D', text: 'Security inspection' },
        ],
        correctAnswer: 'B',
        explanation: 'Thông báo nêu: "Due to dense fog at our destination" (Do sương mù dày đặc tại điểm đến) -> Thời tiết xấu -> Chọn B.',
      },
      {
        questionNumber: 2,
        questionText: 'What are passengers instructed to do?',
        options: [
          { id: 'A', text: 'Collect their checked baggage' },
          { id: 'B', text: 'Proceed to customer service for a meal voucher' },
          { id: 'C', text: 'Stay near the gate area' },
          { id: 'D', text: 'Board the aircraft immediately' },
        ],
        correctAnswer: 'C',
        explanation: '"Please remain in the gate area for further announcements" -> Ở lại khu vực cửa khởi hành -> Chọn C.',
      },
    ],
  },

  // Part 5: Incomplete Sentences
  {
    id: 'skill_p5_01',
    part: 'PART_5',
    title: 'Part 5: Core Grammar & Vocab (Set 1)',
    questions: [
      {
        questionNumber: 1,
        questionText: 'The quarterly review revealed that productivity had increased _______ after adopting the workflow automation software.',
        options: [
          { id: 'A', text: 'considerable' },
          { id: 'B', text: 'considerably' },
          { id: 'C', text: 'consideration' },
          { id: 'D', text: 'considered' },
        ],
        correctAnswer: 'B',
        explanation: 'Bổ nghĩa cho động từ "had increased" cần một phó từ (adverb) -> considerably (đáng kể).',
      },
      {
        questionNumber: 2,
        questionText: 'Customers can track the location of their parcel by entering the tracking number _______ on their receipt.',
        options: [
          { id: 'A', text: 'provided' },
          { id: 'B', text: 'provides' },
          { id: 'C', text: 'providing' },
          { id: 'D', text: 'provision' },
        ],
        correctAnswer: 'A',
        explanation: 'Mệnh đề quan hệ rút gọn ở thể bị động: "the tracking number (which is) provided on their receipt" -> provided.',
      },
    ],
  },

  // Part 6: Text Completion
  {
    id: 'skill_p6_01',
    part: 'PART_6',
    title: 'Part 6: Internal Corporate Policy Email',
    passageText: 'Dear Colleagues, As part of our sustainability initiative, the company will _______ (1) digital expense reporting starting next month. Employees will no longer need to submit physical paper receipts. _______ (2), you can simply take a photo using our mobile app. We appreciate your cooperation as we transition to this eco-friendly process.',
    questions: [
      {
        questionNumber: 1,
        questionText: 'Choose the best word for blank (1):',
        options: [
          { id: 'A', text: 'implement' },
          { id: 'B', text: 'implementation' },
          { id: 'C', text: 'implementing' },
          { id: 'D', text: 'implemented' },
        ],
        correctAnswer: 'A',
        explanation: 'Sau trợ động từ "will" cần một động từ nguyên thể không "to" -> implement (áp dụng, triển khai).',
      },
      {
        questionNumber: 2,
        questionText: 'Choose the best word for blank (2):',
        options: [
          { id: 'A', text: 'Instead' },
          { id: 'B', text: 'Therefore' },
          { id: 'C', text: 'Although' },
          { id: 'D', text: 'Nevertheless' },
        ],
        correctAnswer: 'A',
        explanation: 'Câu trước nêu không cần nộp hóa đơn giấy, câu sau đưa ra phương án thay thế: chụp ảnh qua ứng dụng -> "Instead" (Thay vào đó).',
      },
    ],
  },

  // Part 7: Reading Comprehension
  {
    id: 'skill_p7_01',
    part: 'PART_7',
    title: 'Part 7: Hotel Conference Booking Confirmation',
    passageText: 'GRAND PLAZA HOTEL & SUITES\nBooking Reference: GP-88421\nGuest: Ms. Eleanor Vance, Apex Consulting Group\nCheck-in: November 12 | Check-out: November 15\nRoom Type: Executive Suite with complimentary breakfast and high-speed fiber internet.\nConference Facilities: Main Auditorium reserved for November 13 (8:00 AM - 5:00 PM).\nCatering Service: Continental lunch buffet confirmed for 45 participants at 12:30 PM.\nCancellation Policy: Free cancellation up to 48 hours before check-in. Cancellations within 48 hours are subject to a 50% deposit forfeiture.',
    questions: [
      {
        questionNumber: 1,
        questionText: 'What service has been arranged for November 13?',
        options: [
          { id: 'A', text: 'An airport shuttle transfer' },
          { id: 'B', text: 'A catered lunch buffet for 45 people' },
          { id: 'C', text: 'A formal evening banquet' },
          { id: 'D', text: 'An executive golf tournament' },
        ],
        correctAnswer: 'B',
        explanation: 'Đoạn văn nêu: "Continental lunch buffet confirmed for 45 participants at 12:30 PM" vào ngày 13 tháng 11 -> Chọn B.',
      },
      {
        questionNumber: 2,
        questionText: 'What happens if the reservation is cancelled 24 hours prior to arrival?',
        options: [
          { id: 'A', text: 'The full payment is refunded' },
          { id: 'B', text: 'A 50% deposit penalty is applied' },
          { id: 'C', text: 'A future stay voucher is issued' },
          { id: 'D', text: 'No cancellation fee is charged' },
        ],
        correctAnswer: 'B',
        explanation: '"Cancellations within 48 hours are subject to a 50% deposit forfeiture" (Hủy trong vòng 48 giờ sẽ bị mất 50% tiền cọc) -> Chọn B.',
      },
    ],
  },
];

export interface GrammarSeedTopic {
  id: string;
  title: string;
  description: string;
  rule: string;
  formula: string;
  tips: string;
  targetBand: 'BAND_2' | 'BAND_3' | 'BAND_4' | 'BAND_5';
  examples: { sentence: string; translation: string; highlight: string }[];
  exercises: {
    question: string;
    options: { id: string; text: string }[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export const GRAMMAR_SEED_TOPICS: GrammarSeedTopic[] = [
  {
    id: 'gram_present_perf_past_simple',
    title: 'Present Perfect vs. Past Simple',
    description: 'Phân biệt thì Hiện tại hoàn thành và Quá khứ đơn qua các mốc thời gian',
    formula: 'Past Simple: S + V-ed / V2 (ago, yesterday, in 2020) | Present Perfect: S + have/has + V3/ed (since, for, already, recently)',
    rule: 'Dùng Quá khứ đơn khi hành động đã chấm dứt hoàn toàn tại một thời điểm xác định trong quá khứ. Dùng Hiện tại hoàn thành khi hành động bắt đầu trong quá khứ kéo dài đến hiện tại, hoặc kết quả của nó còn liên quan đến hiện tại mà không nêu rõ thời gian cụ thể.',
    tips: 'Để ý các dấu hiệu: "since + mốc thời gian" đi với Present Perfect; "in + năm quá khứ" hoặc "... ago" đi với Past Simple.',
    targetBand: 'BAND_2',
    examples: [
      {
        sentence: 'Ms. Taylor joined our marketing division three years ago.',
        translation: 'Bà Taylor đã gia nhập bộ phận tiếp thị cách đây ba năm.',
        highlight: 'three years ago -> joined',
      },
      {
        sentence: 'We have experienced significant revenue growth since January.',
        translation: 'Chúng tôi đã chứng kiến mức tăng trưởng doanh thu đáng kể kể từ tháng Một.',
        highlight: 'since January -> have experienced',
      },
    ],
    exercises: [
      {
        question: 'The CEO _______ the annual financial report to the board yesterday afternoon.',
        options: [
          { id: 'A', text: 'presents' },
          { id: 'B', text: 'presented' },
          { id: 'C', text: 'has presented' },
          { id: 'D', text: 'presenting' },
        ],
        correctAnswer: 'B',
        explanation: 'Dấu hiệu "yesterday afternoon" xác định thời điểm chấm dứt trong quá khứ -> chọn thì Quá khứ đơn (presented).',
      },
      {
        question: 'Our engineering department _______ several software updates since last quarter.',
        options: [
          { id: 'A', text: 'released' },
          { id: 'B', text: 'has released' },
          { id: 'C', text: 'releases' },
          { id: 'D', text: 'will release' },
        ],
        correctAnswer: 'B',
        explanation: 'Dấu hiệu "since last quarter" chỉ hành động bắt đầu trong quá khứ kéo dài đến nay -> chọn Hiện tại hoàn thành (has released).',
      },
      {
        question: 'Mr. Henderson _______ at this firm for ten years and is still our senior consultant.',
        options: [
          { id: 'A', text: 'worked' },
          { id: 'B', text: 'has worked' },
          { id: 'C', text: 'works' },
          { id: 'D', text: 'is working' },
        ],
        correctAnswer: 'B',
        explanation: 'Kéo dài 10 năm và hiện vẫn đang làm việc (still our senior consultant) -> Hiện tại hoàn thành (has worked).',
      },
    ],
  },
  {
    id: 'gram_passive_voice',
    title: 'Passive Voice in Business Contexts',
    description: 'Thể bị động trong thông báo, thư từ và biên bản họp công sở',
    formula: 'S + be (am/is/are/was/were/been) + V3/ed (+ by O)',
    rule: 'Câu bị động được dùng khi tân ngữ chịu tác động quan trọng hơn người thực hiện, hoặc khi người thực hiện hành động là hiển nhiên hay không xác định. Thường dùng trong văn phong công sở trang trọng.',
    tips: 'Khi sau chỗ trống KHÔNG có tân ngữ trực tiếp (danh từ) và chủ ngữ là vật, hãy ưu tiên thể bị động.',
    targetBand: 'BAND_3',
    examples: [
      {
        sentence: 'The contract was signed by both executive directors.',
        translation: 'Hợp đồng đã được ký bởi cả hai giám đốc điều hành.',
        highlight: 'was signed by',
      },
      {
        sentence: 'All purchase requests must be approved in writing.',
        translation: 'Mọi yêu cầu mua sắm phải được phê duyệt bằng văn bản.',
        highlight: 'must be approved',
      },
    ],
    exercises: [
      {
        question: 'The new employee handbook will be _______ to all staff members by Friday.',
        options: [
          { id: 'A', text: 'distribute' },
          { id: 'B', text: 'distributed' },
          { id: 'C', text: 'distributing' },
          { id: 'D', text: 'distribution' },
        ],
        correctAnswer: 'B',
        explanation: 'Cấu trúc bị động tương lai: will be + V3/ed -> distributed.',
      },
      {
        question: 'All invoices should be carefully _______ prior to payment authorization.',
        options: [
          { id: 'A', text: 'review' },
          { id: 'B', text: 'reviewed' },
          { id: 'C', text: 'reviewing' },
          { id: 'D', text: 'reviews' },
        ],
        correctAnswer: 'B',
        explanation: 'Sau modal verb bị động "should be" cần dạng quá khứ phân từ V3/ed -> reviewed.',
      },
      {
        question: 'The conference room is currently being _______ for the shareholder meeting.',
        options: [
          { id: 'A', text: 'prepared' },
          { id: 'B', text: 'preparing' },
          { id: 'C', text: 'prepare' },
          { id: 'D', text: 'preparation' },
        ],
        correctAnswer: 'A',
        explanation: 'Bị động tiếp diễn: is being + V3/ed -> prepared.',
      },
    ],
  },
  {
    id: 'gram_conditionals',
    title: 'Conditionals (If / Unless / Provided that)',
    description: 'Câu điều kiện loại 1, 2 và các liên từ thay thế trong đề thi TOEIC',
    formula: 'Type 1: If + S + V(hiện tại), S + will/can + V-inf | Unless = If ... not',
    rule: 'Câu điều kiện loại 1 diễn tả sự việc có thật hoặc có thể xảy ra ở hiện tại hoặc tương lai. "Unless" có nghĩa là "trừ khi" (= if not). "Provided that" / "As long as" có nghĩa là "miễn là".',
    tips: 'Trong mệnh đề chứa IF, KHÔNG BAO GIỜ dùng "will". Chỉ dùng "will" ở mệnh đề chính.',
    targetBand: 'BAND_3',
    examples: [
      {
        sentence: 'If you register before Friday, you will receive an early-bird discount.',
        translation: 'Nếu bạn đăng ký trước thứ Sáu, bạn sẽ nhận được mức giảm giá cho người đăng ký sớm.',
        highlight: 'If + register ..., will receive',
      },
      {
        sentence: 'The order will be shipped today provided that payment is confirmed.',
        translation: 'Đơn hàng sẽ được gửi đi hôm nay miễn là thanh toán được xác nhận.',
        highlight: 'provided that + is confirmed',
      },
    ],
    exercises: [
      {
        question: 'If the supplier _______ the shipment on schedule, we will not face warehouse delays.',
        options: [
          { id: 'A', text: 'deliver' },
          { id: 'B', text: 'delivers' },
          { id: 'C', text: 'will deliver' },
          { id: 'D', text: 'delivered' },
        ],
        correctAnswer: 'B',
        explanation: 'Mệnh đề If loại 1 với chủ ngữ số ít "the supplier" -> dùng hiện tại đơn chia ngôi thứ ba số ít (delivers).',
      },
      {
        question: 'The warranty remains valid _______ the equipment has been repaired by an authorized technician.',
        options: [
          { id: 'A', text: 'unless' },
          { id: 'B', text: 'provided that' },
          { id: 'C', text: 'in case of' },
          { id: 'D', text: 'despite' },
        ],
        correctAnswer: 'B',
        explanation: '"Provided that" (miễn là) tạo ý nghĩa hợp lý: bảo hành còn hiệu lực miễn là thiết bị được sửa bởi kỹ thuật viên ủy quyền.',
      },
    ],
  },
  {
    id: 'gram_conjunctions_prepositions',
    title: 'Conjunctions vs. Prepositions (Although vs. Despite)',
    description: 'Phân biệt liên từ (nối mệnh đề) và giới từ (đi với danh từ / V-ing)',
    formula: 'Conjunction + S + V | Preposition + Noun / V-ing',
    rule: 'Mặc dù cùng mang một nét nghĩa, liên từ (Although, Because, While) luôn đi kèm một mệnh đề hoàn chỉnh có chủ ngữ và động từ. Trong khi đó, giới từ (Despite, In spite of, Because of, During) chỉ đi kèm danh từ, cụm danh từ hoặc V-ing.',
    tips: 'Nhìn ngay sau chỗ trống: nếu thấy có Cặp Chủ ngữ + Vị ngữ -> chọn Liên từ. Nếu chỉ thấy Cụm Danh từ mà không có động từ chính -> chọn Giới từ.',
    targetBand: 'BAND_3',
    examples: [
      {
        sentence: 'Although the weather was severe, the flight departed on time.',
        translation: 'Mặc dù thời tiết khắc nghiệt, chuyến bay vẫn cất cánh đúng giờ.',
        highlight: 'Although + [the weather was severe]',
      },
      {
        sentence: 'Despite the severe weather, the flight departed on time.',
        translation: 'Bất chấp thời tiết khắc nghiệt, chuyến bay vẫn cất cánh đúng giờ.',
        highlight: 'Despite + [the severe weather]',
      },
    ],
    exercises: [
      {
        question: '_______ the unexpected surge in production costs, the company maintained its profit margin.',
        options: [
          { id: 'A', text: 'Although' },
          { id: 'B', text: 'Even though' },
          { id: 'C', text: 'Despite' },
          { id: 'D', text: 'However' },
        ],
        correctAnswer: 'C',
        explanation: 'Phía sau là cụm danh từ "the unexpected surge in production costs" (không có động từ chia thì) -> chọn giới từ "Despite".',
      },
      {
        question: 'The seminar was postponed _______ the keynote speaker fell ill.',
        options: [
          { id: 'A', text: 'because of' },
          { id: 'B', text: 'due to' },
          { id: 'C', text: 'because' },
          { id: 'D', text: 'owing to' },
        ],
        correctAnswer: 'C',
        explanation: 'Phía sau là mệnh đề đầy đủ "the keynote speaker fell ill" (S + V) -> chọn liên từ "because".',
      },
    ],
  },
  {
    id: 'gram_gerunds_infinitives',
    title: 'Gerunds vs. Infinitives (V-ing vs. To V)',
    description: 'Các động từ thường gặp theo sau bởi V-ing hoặc To V trong văn phòng',
    formula: 'V + to V: decide, plan, promise, expect, agree | V + V-ing: consider, suggest, postpone, avoid, enjoy',
    rule: 'Một số động từ luôn đòi hỏi động từ thứ hai đi kèm ở dạng To V (chỉ kế hoạch, hướng tới tương lai), trong khi một nhóm động từ khác bắt buộc đi với V-ing. Cần ghi nhớ các động từ trọng điểm của TOEIC.',
    tips: 'Các từ cực hay ra đề: "consider + V-ing", "look forward to + V-ing", "be committed to + V-ing", "hesitate to + V".',
    targetBand: 'BAND_4',
    examples: [
      {
        sentence: 'The management is considering opening a new branch in Da Nang.',
        translation: 'Ban quản lý đang cân nhắc việc mở một chi nhánh mới tại Đà Nẵng.',
        highlight: 'considering + opening',
      },
      {
        sentence: 'We look forward to collaborating with your organization.',
        translation: 'Chúng tôi rất mong được hợp tác với tổ chức của bạn.',
        highlight: 'look forward to + collaborating',
      },
    ],
    exercises: [
      {
        question: 'The committee decided _______ the implementation of the new policy until next quarter.',
        options: [
          { id: 'A', text: 'postpone' },
          { id: 'B', text: 'to postpone' },
          { id: 'C', text: 'postponing' },
          { id: 'D', text: 'postponement' },
        ],
        correctAnswer: 'B',
        explanation: 'Động từ "decide" luôn đi với "to V" (decide to do something) -> to postpone.',
      },
      {
        question: 'Please do not hesitate _______ our support hotline if you require further assistance.',
        options: [
          { id: 'A', text: 'contact' },
          { id: 'B', text: 'to contact' },
          { id: 'C', text: 'contacting' },
          { id: 'D', text: 'contacted' },
        ],
        correctAnswer: 'B',
        explanation: 'Cụm từ cố định: "hesitate to + V" (ngần ngại làm gì) -> to contact.',
      },
    ],
  },
];

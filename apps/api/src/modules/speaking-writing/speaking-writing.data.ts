export interface SpeakingPrompt {
  id: string;
  type: 'READ_ALOUD' | 'DESCRIBE_PICTURE' | 'RESPOND_QUESTIONS' | 'EXPRESS_OPINION';
  title: string;
  instructions: string;
  preparationTime: number; // seconds
  responseTime: number; // seconds
  content: string; // text to read or question prompt
  imageUrl?: string;
  sampleAudioUrl?: string;
  sampleTranscript?: string;
  keyVocabulary?: string[];
}

export interface WritingPrompt {
  id: string;
  type: 'PICTURE_SENTENCE' | 'EMAIL_RESPONSE' | 'OPINION_ESSAY';
  title: string;
  instructions: string;
  timeLimitMinutes: number;
  imageUrl?: string;
  givenWords?: string[]; // For picture sentence (e.g., "conference / hold")
  emailContext?: {
    from: string;
    to: string;
    subject: string;
    body: string;
  };
  promptQuestion: string;
  minWords: number;
  sampleAnswer: string;
}

export const SPEAKING_PROMPTS: SpeakingPrompt[] = [
  {
    id: 'spk_01',
    type: 'READ_ALOUD',
    title: 'Question 1: Read a Text Aloud',
    instructions: 'Đọc to đoạn văn sau đây trong vòng 45 giây. Chú ý ngữ điệu, ngắt nghỉ câu và nhấn trọng âm từ khóa.',
    preparationTime: 45,
    responseTime: 45,
    content: `Thank you for calling Sunrise Airways customer service. If you are calling regarding current flight reservations or baggage inquiries, please press one. To speak with a representative about joining our SkyMiles loyalty program, please press two. For all other questions, stay on the line and an agent will be with you shortly.`,
    keyVocabulary: ['reservations', 'baggage', 'representative', 'loyalty program', 'shortly'],
  },
  {
    id: 'spk_02',
    type: 'DESCRIBE_PICTURE',
    title: 'Question 3: Describe a Picture',
    instructions: 'Quan sát bức tranh và mô tả lại chi tiết càng nhiều thông tin càng tốt trong 45 giây (chủ thể, hành động, trang phục, bối cảnh xung quanh).',
    preparationTime: 45,
    responseTime: 45,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    content: 'Mô tả hình ảnh nhóm đồng nghiệp đang thảo luận làm việc nhóm trên máy tính xách tay trong văn phòng sáng sủa.',
    sampleTranscript: 'This picture shows a group of four young professionals having an energetic meeting around a wooden table. On the left, a man in a blue shirt is pointing at a laptop screen, while his colleagues are smiling and taking notes. The room is modern with large windows allowing natural sunlight to pour in.',
    keyVocabulary: ['young professionals', 'pointing at', 'taking notes', 'natural sunlight', 'collaborating'],
  },
  {
    id: 'spk_03',
    type: 'RESPOND_QUESTIONS',
    title: 'Questions 4-6: Respond to Questions',
    instructions: 'Bạn đang tham gia khảo sát ý kiến về thói quen mua sắm trực tuyến. Trả lời câu hỏi trong 15-30 giây.',
    preparationTime: 3,
    responseTime: 30,
    content: 'How often do you shop online for clothes, and what is the most important factor when choosing an online store?',
    sampleTranscript: 'I shop online for clothes about twice a month because of my busy work schedule. The most critical factor for me is reliable customer reviews and a hassle-free return policy in case the sizing does not fit.',
    keyVocabulary: ['twice a month', 'critical factor', 'customer reviews', 'return policy', 'convenience'],
  },
];

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'wrt_01',
    type: 'PICTURE_SENTENCE',
    title: 'Questions 1-5: Write a Sentence Based on a Picture',
    instructions: 'Viết MỘT câu duy nhất miêu tả bức tranh, bắt buộc sử dụng cả 2 từ khóa được cho dưới đây.',
    timeLimitMinutes: 8,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    givenWords: ['meeting', 'conference room'],
    promptQuestion: 'Write one sentence describing the picture using: "meeting" and "conference room".',
    minWords: 8,
    sampleAnswer: 'The marketing team is currently holding a project review meeting in the main conference room.',
  },
  {
    id: 'wrt_02',
    type: 'EMAIL_RESPONSE',
    title: 'Questions 6-7: Respond to an Email Request',
    instructions: 'Đọc email dưới đây và viết thư hồi âm. Thư của bạn phải đưa ra ít nhất 2 câu hỏi làm rõ và 1 đề xuất giải pháp.',
    timeLimitMinutes: 10,
    emailContext: {
      from: 'David Sterling <david.sterling@globaltech.com>',
      to: 'Candidate Team',
      subject: 'Annual Software Conference Attendance',
      body: 'Dear Team, We are finalizing the attendees for the upcoming tech expo in Singapore next month. Could you let me know if your team plans to send any delegates, and what specific workshops you would like us to reserve passes for?',
    },
    promptQuestion: 'Respond to David’s email by confirming attendance, proposing delegates, and asking about workshop schedules and flight allowances.',
    minWords: 40,
    sampleAnswer: `Dear Mr. Sterling,\n\nThank you for reaching out. Our department is pleased to confirm that two senior software engineers will attend the Singapore tech expo.\n\nCould you please let us know the deadline for registering for the AI architecture workshop? Also, could you clarify whether travel expenses and hotel accommodations are covered under the company event budget?\n\nBest regards,\nAlex Nguyen`,
  },
  {
    id: 'wrt_03',
    type: 'OPINION_ESSAY',
    title: 'Question 8: Write an Opinion Essay',
    instructions: 'Viết một bài luận bày tỏ quan điểm và lập luận của bạn về chủ đề dưới đây. Bài viết tối thiểu 150 từ, có luận điểm rõ ràng và ví dụ minh họa.',
    timeLimitMinutes: 30,
    promptQuestion: 'Some people prefer working for a large corporation with stable benefits, while others prefer working for a small startup company with rapid career growth. Which do you prefer and why? Provide specific reasons and examples.',
    minWords: 150,
    sampleAnswer: `In today’s dynamic job market, people often deliberate between working for an established corporation and joining a high-growth startup. In my view, working for a small startup is significantly more advantageous for early-career professionals seeking accelerated development.\n\nFirst and foremost, startups offer unparalleled opportunities for hands-on learning. Because teams are lean, employees wear multiple hats and tackle diverse challenges beyond their official job descriptions. For example, during my tenure at a tech venture, I gained practical exposure to client management, software design, and digital marketing within a single year.\n\nFurthermore, direct collaboration with senior leaders fosters rapid mentorship. Unlike large firms where bureaucratic hierarchies delay feedback, startups encourage direct dialogue and swift decision-making.\n\nIn conclusion, although corporations provide predictable job security, the steep learning curve and cross-functional autonomy in startups make them the superior choice for ambitious individuals.`,
  },
];

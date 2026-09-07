export interface VocabSeedTopic {
  id: string;
  category: 'Office & Work' | 'Business & Finance' | 'Travel & Logistics' | 'Everyday Corporate' | 'General & Misc';
  title: string;
  description: string;
  targetBand: 'BAND_2' | 'BAND_3' | 'BAND_4' | 'BAND_5';
  icon: string;
}

export interface VocabSeedCard {
  topicId: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'NOUN' | 'VERB' | 'ADJECTIVE' | 'ADVERB' | 'PREPOSITION' | 'CONJUNCTION';
  definition: string;
  definitionEn: string;
  example: string;
  exampleVi: string;
  audioUsUrl: string;
  audioUkUrl: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  frequency: 1 | 2 | 3 | 4 | 5;
  tags: string[];
}

export const VOCAB_TOPICS: VocabSeedTopic[] = [
  // 1. Office & Work
  { id: 'top_office_supplies', category: 'Office & Work', title: 'Office Supplies & Equipment', description: 'Trang thiết bị văn phòng, máy photocopy, văn phòng phẩm', targetBand: 'BAND_2', icon: '📎' },
  { id: 'top_meetings_conferences', category: 'Office & Work', title: 'Meetings & Conferences', description: 'Họp nội bộ, hội thảo trực tuyến, biên bản cuộc họp', targetBand: 'BAND_3', icon: '👥' },
  { id: 'top_corporate_management', category: 'Office & Work', title: 'Corporate Management', description: 'Cơ cấu tổ chức doanh nghiệp, phân quyền, điều hành', targetBand: 'BAND_4', icon: '🏢' },
  { id: 'top_hr_recruitment', category: 'Office & Work', title: 'HR & Recruitment', description: 'Tuyển dụng, phỏng vấn, hồ sơ ứng viên, đãi ngộ', targetBand: 'BAND_3', icon: '🤝' },
  { id: 'top_workplace_tech', category: 'Office & Work', title: 'Workplace Technology', description: 'Công nghệ thông tin, bảo mật mạng, phần mềm công việc', targetBand: 'BAND_4', icon: '💻' },

  // 2. Business & Finance
  { id: 'top_contracts_negotiation', category: 'Business & Finance', title: 'Contracts & Negotiations', description: 'Thương lượng hợp đồng, điều khoản cam kết, ký kết', targetBand: 'BAND_4', icon: '📝' },
  { id: 'top_banking_finance', category: 'Business & Finance', title: 'Banking & Financial Services', description: 'Giao dịch ngân hàng, lãi suất, tiền tệ, chuyển khoản', targetBand: 'BAND_3', icon: '💳' },
  { id: 'top_marketing_sales', category: 'Business & Finance', title: 'Marketing & Advertising', description: 'Quảng cáo, chiến dịch tiếp thị, doanh số, khách hàng mục tiêu', targetBand: 'BAND_3', icon: '📢' },
  { id: 'top_accounting_taxes', category: 'Business & Finance', title: 'Accounting, Auditing & Taxes', description: 'Báo cáo tài chính, kiểm toán, hóa đơn, quyết toán thuế', targetBand: 'BAND_4', icon: '📊' },
  { id: 'top_investments', category: 'Business & Finance', title: 'Investments & Stocks', description: 'Đầu tư cổ phiếu, thị trường vốn, danh mục đầu tư', targetBand: 'BAND_5', icon: '📈' },

  // 3. Travel & Logistics
  { id: 'top_air_travel', category: 'Travel & Logistics', title: 'Airlines & Air Travel', description: 'Chuyến bay, thủ tục tại sân bay, hành lý, quá cảnh', targetBand: 'BAND_2', icon: '✈️' },
  { id: 'top_hotels_hospitality', category: 'Travel & Logistics', title: 'Hotels & Hospitality', description: 'Đặt phòng, dịch vụ khách sạn, tiếp tân, tiện nghi', targetBand: 'BAND_2', icon: '🏨' },
  { id: 'top_shipping_freight', category: 'Travel & Logistics', title: 'Shipping & Freight Logistics', description: 'Vận chuyển hàng hóa, kho bãi, xuất nhập khẩu, chuỗi cung ứng', targetBand: 'BAND_4', icon: '🚢' },
  { id: 'top_public_transit', category: 'Travel & Logistics', title: 'Public Transportation & Commuting', description: 'Giao thông công cộng, xe bus, tàu điện ngầm, lộ trình đi làm', targetBand: 'BAND_2', icon: '🚆' },

  // 4. Everyday Corporate
  { id: 'top_dining_entertainment', category: 'Everyday Corporate', title: 'Corporate Dining & Events', description: 'Tiệc chiêu đãi đối tác, ẩm thực công sở, tổ chức sự kiện', targetBand: 'BAND_3', icon: '🍽️' },
  { id: 'top_health_insurance', category: 'Everyday Corporate', title: 'Healthcare & Insurance', description: 'Bảo hiểm y tế công nhân viên, khám sức khỏe định kỳ', targetBand: 'BAND_3', icon: '🏥' },
  { id: 'top_shopping_retail', category: 'Everyday Corporate', title: 'Retail & Consumer Shopping', description: 'Bán lẻ, dịch vụ sau bán hàng, chính sách đổi trả, bảo hành', targetBand: 'BAND_2', icon: '🛍️' },
  { id: 'top_real_estate', category: 'Everyday Corporate', title: 'Real Estate & Facility Lease', description: 'Thuê văn phòng, bất động sản thương mại, hợp đồng thuê', targetBand: 'BAND_4', icon: '🏙️' },

  // 5. General & Misc
  { id: 'top_manufacturing_production', category: 'General & Misc', title: 'Manufacturing & Assembly', description: 'Dây chuyền sản xuất, nhà máy chế tạo, vận hành máy móc', targetBand: 'BAND_4', icon: '⚙️' },
  { id: 'top_quality_control', category: 'General & Misc', title: 'Quality Control & Safety', description: 'Kiểm chuẩn chất lượng, tiêu chuẩn an toàn lao động', targetBand: 'BAND_4', icon: '🛡️' },
  { id: 'top_environment_energy', category: 'General & Misc', title: 'Environmental & Energy Policy', description: 'Năng lượng tái tạo, xử lý rác thải, phát triển bền vững', targetBand: 'BAND_5', icon: '🌱' },
];

export const VOCAB_CARDS_SAMPLE: VocabSeedCard[] = [
  // Office Supplies & Equipment
  {
    topicId: 'top_office_supplies',
    word: 'stapler',
    phonetic: '/ˈsteɪ.plər/',
    partOfSpeech: 'NOUN',
    definition: 'Cái dập ghim',
    definitionEn: 'A small device used for fastening papers together with staples.',
    example: 'Please make sure there is a stapler on every desk.',
    exampleVi: 'Vui lòng đảm bảo có một cái dập ghim trên mỗi bàn làm việc.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=stapler&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=stapler&type=1',
    difficulty: 1,
    frequency: 4,
    tags: ['office', 'equipment'],
  },
  {
    topicId: 'top_office_supplies',
    word: 'cartridge',
    phonetic: '/ˈkɑːr.trɪdʒ/',
    partOfSpeech: 'NOUN',
    definition: 'Hộp mực máy in',
    definitionEn: 'A replaceable container holding ink or toner for a printer.',
    example: 'We need to order a new black toner cartridge for the photocopier.',
    exampleVi: 'Chúng ta cần đặt một hộp mực đen mới cho máy photocopy.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=cartridge&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=cartridge&type=1',
    difficulty: 2,
    frequency: 4,
    tags: ['office', 'printer'],
  },
  {
    topicId: 'top_office_supplies',
    word: 'shredder',
    phonetic: '/ˈʃred.ər/',
    partOfSpeech: 'NOUN',
    definition: 'Máy hủy tài liệu',
    definitionEn: 'A machine that cuts documents into small pieces to destroy confidential information.',
    example: 'Confidential client records must be put through the paper shredder.',
    exampleVi: 'Hồ sơ bảo mật của khách hàng phải được đưa qua máy hủy tài liệu.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=shredder&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=shredder&type=1',
    difficulty: 2,
    frequency: 3,
    tags: ['security', 'office'],
  },
  {
    topicId: 'top_office_supplies',
    word: 'inventory',
    phonetic: '/ˈɪn.vən.tɔːr.i/',
    partOfSpeech: 'NOUN',
    definition: 'Hàng tồn kho, bảng kiểm kê',
    definitionEn: 'A detailed list of goods and materials in stock.',
    example: 'The administrative assistant conducts an office supply inventory monthly.',
    exampleVi: 'Trợ lý hành chính thực hiện việc kiểm kê văn phòng phẩm hàng tháng.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=inventory&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=inventory&type=1',
    difficulty: 3,
    frequency: 5,
    tags: ['office', 'supplies', 'stock'],
  },

  // Meetings & Conferences
  {
    topicId: 'top_meetings_conferences',
    word: 'agenda',
    phonetic: '/əˈdʒen.də/',
    partOfSpeech: 'NOUN',
    definition: 'Chương trình nghị sự, lịch trình cuộc họp',
    definitionEn: 'A list of matters to be discussed or acted upon at a meeting.',
    example: 'The team leader distributed the meeting agenda two days in advance.',
    exampleVi: 'Trưởng nhóm đã gửi lịch trình cuộc họp trước hai ngày.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=agenda&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=agenda&type=1',
    difficulty: 2,
    frequency: 5,
    tags: ['meeting', 'management'],
  },
  {
    topicId: 'top_meetings_conferences',
    word: 'adjourn',
    phonetic: '/əˈdʒɜːrn/',
    partOfSpeech: 'VERB',
    definition: 'Hoãn, kết thúc (phiên họp)',
    definitionEn: 'To break off a meeting or session with the intention of resuming it later.',
    example: 'The chairperson decided to adjourn the session until tomorrow morning.',
    exampleVi: 'Chủ tọa quyết định hoãn phiên họp cho đến sáng mai.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=adjourn&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=adjourn&type=1',
    difficulty: 3,
    frequency: 4,
    tags: ['meeting', 'formal'],
  },
  {
    topicId: 'top_meetings_conferences',
    word: 'quorum',
    phonetic: '/ˈkwɔːr.əm/',
    partOfSpeech: 'NOUN',
    definition: 'Số lượng đại biểu tối thiểu cần thiết để biểu quyết',
    definitionEn: 'The minimum number of members required to be present for valid voting.',
    example: 'The vote could not proceed because the committee lacked a quorum.',
    exampleVi: 'Cuộc bỏ phiếu không thể tiến hành vì ủy ban thiếu số lượng đại biểu tối thiểu.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=quorum&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=quorum&type=1',
    difficulty: 4,
    frequency: 3,
    tags: ['meeting', 'voting'],
  },

  // Contracts & Negotiations
  {
    topicId: 'top_contracts_negotiation',
    word: 'clause',
    phonetic: '/klɔːz/',
    partOfSpeech: 'NOUN',
    definition: 'Điều khoản (trong hợp đồng)',
    definitionEn: 'A particular section, article, or stipulation in a formal contract.',
    example: 'The legal department reviewed the penalty clause before signing.',
    exampleVi: 'Bộ phận pháp chế đã kiểm tra kỹ điều khoản phạt trước khi ký.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=clause&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=clause&type=1',
    difficulty: 3,
    frequency: 5,
    tags: ['contract', 'legal'],
  },
  {
    topicId: 'top_contracts_negotiation',
    word: 'stipulate',
    phonetic: '/ˈstɪp.jə.leɪt/',
    partOfSpeech: 'VERB',
    definition: 'Quy định rõ ràng, đưa ra điều kiện',
    definitionEn: 'To demand or specify a requirement as part of a bargain or agreement.',
    example: 'The contract stipulates that payment must be delivered within 30 days.',
    exampleVi: 'Hợp đồng quy định rõ khoản thanh toán phải được chuyển trong vòng 30 ngày.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=stipulate&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=stipulate&type=1',
    difficulty: 4,
    frequency: 5,
    tags: ['contract', 'agreement'],
  },
  {
    topicId: 'top_contracts_negotiation',
    word: 'binding',
    phonetic: '/ˈbaɪn.dɪŋ/',
    partOfSpeech: 'ADJECTIVE',
    definition: 'Có tính ràng buộc pháp lý',
    definitionEn: 'Involving an obligation that cannot be broken or legally evaded.',
    example: 'Once both parties sign, the memorandum of understanding becomes legally binding.',
    exampleVi: 'Một khi cả hai bên ký kết, bản ghi nhớ sẽ có giá trị ràng buộc về mặt pháp lý.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=binding&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=binding&type=1',
    difficulty: 3,
    frequency: 4,
    tags: ['contract', 'law'],
  },

  // HR & Recruitment
  {
    topicId: 'top_hr_recruitment',
    word: 'probationary',
    phonetic: '/proʊˈbeɪ.ʃən.er.i/',
    partOfSpeech: 'ADJECTIVE',
    definition: 'Thử việc, tập sự',
    definitionEn: 'Relating to a period of testing someone before they are given a permanent job.',
    example: 'New employees receive benefits after completing their three-month probationary period.',
    exampleVi: 'Nhân viên mới nhận được phúc lợi sau khi hoàn thành kỳ thử việc ba tháng.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=probationary&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=probationary&type=1',
    difficulty: 3,
    frequency: 5,
    tags: ['hr', 'career'],
  },
  {
    topicId: 'top_hr_recruitment',
    word: 'compensation',
    phonetic: '/ˌkɑːm.pənˈseɪ.ʃən/',
    partOfSpeech: 'NOUN',
    definition: 'Lương bổng, đãi ngộ, khoản bồi thường',
    definitionEn: 'Money awarded to someone as recompense for work or loss.',
    example: 'The company offers competitive compensation including stock options and bonuses.',
    exampleVi: 'Công ty đưa ra mức đãi ngộ cạnh tranh bao gồm cổ phiếu thưởng và tiền thưởng.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=compensation&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=compensation&type=1',
    difficulty: 3,
    frequency: 5,
    tags: ['hr', 'salary'],
  },

  // Marketing & Sales
  {
    topicId: 'top_marketing_sales',
    word: 'demographic',
    phonetic: '/ˌdem.əˈɡræf.ɪk/',
    partOfSpeech: 'NOUN',
    definition: 'Nhóm đối tượng nhân khẩu học',
    definitionEn: 'A particular sector of a population, especially considered as customers.',
    example: 'Our latest promotional campaign targets the 18 to 35 age demographic.',
    exampleVi: 'Chiến dịch quảng bá mới nhất của chúng tôi nhắm vào nhóm khách hàng từ 18 đến 35 tuổi.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=demographic&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=demographic&type=1',
    difficulty: 3,
    frequency: 4,
    tags: ['marketing', 'analytics'],
  },
  {
    topicId: 'top_marketing_sales',
    word: 'endorse',
    phonetic: '/ɪnˈdɔːrs/',
    partOfSpeech: 'VERB',
    definition: 'Chứng thực, đại diện quảng cáo sản phẩm',
    definitionEn: 'To declare approval or recommend a product in advertisements.',
    example: 'The sports celebrity agreed to endorse the new line of athletic footwear.',
    exampleVi: 'Ngôi sao thể thao đã đồng ý làm đại diện quảng bá cho dòng giày thể thao mới.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=endorse&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=endorse&type=1',
    difficulty: 3,
    frequency: 4,
    tags: ['marketing', 'brand'],
  },

  // Travel & Logistics - Shipping
  {
    topicId: 'top_shipping_freight',
    word: 'consignment',
    phonetic: '/kənˈsaɪn.mənt/',
    partOfSpeech: 'NOUN',
    definition: 'Lô hàng được giao, chuyến hàng',
    definitionEn: 'A batch of goods sent to someone.',
    example: 'The consignment of automotive components arrived safely at the warehouse.',
    exampleVi: 'Lô hàng linh kiện ô tô đã đến kho an toàn.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=consignment&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=consignment&type=1',
    difficulty: 3,
    frequency: 5,
    tags: ['shipping', 'logistics'],
  },
  {
    topicId: 'top_shipping_freight',
    word: 'customs',
    phonetic: '/ˈkʌs.təmz/',
    partOfSpeech: 'NOUN',
    definition: 'Cơ quan hải quan, thuế hải quan',
    definitionEn: 'The official department that collects taxes on imports and inspects baggage.',
    example: 'All imported machinery must be declared and cleared by customs.',
    exampleVi: 'Tất cả máy móc nhập khẩu phải được khai báo và thông quan bởi cơ quan hải quan.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=customs&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=customs&type=1',
    difficulty: 2,
    frequency: 5,
    tags: ['shipping', 'import'],
  },

  // Quality Control
  {
    topicId: 'top_quality_control',
    word: 'compliance',
    phonetic: '/kəmˈplaɪ.əns/',
    partOfSpeech: 'NOUN',
    definition: 'Sự tuân thủ tiêu chuẩn / luật lệ',
    definitionEn: 'The act of obeying an order, rule, or standard.',
    example: 'All medical devices are produced in strict compliance with safety regulations.',
    exampleVi: 'Mọi thiết bị y tế đều được sản xuất với sự tuân thủ nghiêm ngặt các quy chuẩn an toàn.',
    audioUsUrl: 'https://dict.youdao.com/dictvoice?audio=compliance&type=2',
    audioUkUrl: 'https://dict.youdao.com/dictvoice?audio=compliance&type=1',
    difficulty: 3,
    frequency: 5,
    tags: ['quality', 'safety', 'standard'],
  },
];

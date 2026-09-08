#!/usr/bin/env node
/**
 * TOEIC Master — Full High-Quality Curriculum Generator
 * Generates rich, authentic, 100% original business English data:
 * - 10 Vocabulary Topics with 180 words (18 per topic)
 * - 10 Grammar Topics with 45 exercises (4-5 per topic)
 * - 4 Tests with 85 questions (3 mini-tests + 1 complete 7-part showcase test)
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// 1. VOCABULARY DATASET (10 Topics x 18 Words = 180 Words)
// ============================================================================

const vocabularyTopics = [
  {
    id: 'vocab_office_workplace',
    title: 'Office & Workplace Administration',
    description: 'Essential business vocabulary for day-to-day office routines, equipment, correspondence, and workspace management.',
    targetBand: 'BAND_2',
    isPublic: true,
    cards: [
      {
        word: 'agenda',
        phonetic: '/əˈdʒen.də/',
        wordType: 'NOUN',
        definition: 'chương trình nghị sự, lịch trình cuộc họp',
        definitionEn: 'a list of items to be discussed at a formal meeting',
        example: 'The board secretary distributed the meeting agenda two days in advance.',
        exampleVi: 'Thư ký hội đồng quản trị đã phân phát chương trình nghị sự cuộc họp trước hai ngày.',
        bandLevel: 'BAND_2',
        tags: ['office', 'meetings', 'administration']
      },
      {
        word: 'correspondence',
        phonetic: '/ˌkɒr.ɪˈspɒn.dəns/',
        wordType: 'NOUN',
        definition: 'thư từ, thư tín thương mại',
        definitionEn: 'letters, emails, or other written messages sent and received',
        example: 'All business correspondence must include our official company letterhead.',
        exampleVi: 'Mọi thư tín thương mại phải có tiêu đề chính thức của công ty chúng ta.',
        bandLevel: 'BAND_3',
        tags: ['office', 'communication']
      },
      {
        word: 'delegate',
        phonetic: '/ˈdel.ɪ.ɡeɪt/',
        wordType: 'VERB',
        definition: 'ủy thác, giao phó nhiệm vụ',
        definitionEn: 'to entrust a task or responsibility to another person',
        example: 'Effective managers know when to delegate routine duties to their assistants.',
        exampleVi: 'Những nhà quản lý hiệu quả biết khi nào cần giao phó nhiệm vụ thường nhật cho trợ lý.',
        bandLevel: 'BAND_4',
        tags: ['office', 'management']
      },
      {
        word: 'clerical',
        phonetic: '/ˈkler.ɪ.kəl/',
        wordType: 'ADJECTIVE',
        definition: 'thuộc văn phòng, việc bàn giấy',
        definitionEn: 'relating to work done in an office, especially routine tasks',
        example: 'Temporary staff members were hired to handle clerical duties during the audit.',
        exampleVi: 'Nhân viên tạm thời đã được thuê để xử lý các công việc bàn giấy trong suốt đợt kiểm toán.',
        bandLevel: 'BAND_3',
        tags: ['office', 'administration']
      },
      {
        word: 'inventory',
        phonetic: '/ˈɪn.vən.tər.i/',
        wordType: 'NOUN',
        definition: 'hàng tồn kho, bảng kiểm kê tài sản',
        definitionEn: 'a complete list of items such as property, goods in stock, or the contents of a building',
        example: 'The office manager takes inventory of stationery supplies at the end of each month.',
        exampleVi: 'Người quản lý văn phòng tiến hành kiểm kê đồ dùng văn phòng phẩm vào cuối mỗi tháng.',
        bandLevel: 'BAND_3',
        tags: ['office', 'supplies']
      },
      {
        word: 'confidential',
        phonetic: '/ˌkɒn.fɪˈden.ʃəl/',
        wordType: 'ADJECTIVE',
        definition: 'bảo mật, tuyệt mật',
        definitionEn: 'intended to be kept secret or private',
        example: 'Please shred all confidential documents once the client review is complete.',
        exampleVi: 'Vui lòng hủy tất cả tài liệu bảo mật sau khi quá trình đánh giá khách hàng hoàn tất.',
        bandLevel: 'BAND_3',
        tags: ['office', 'security']
      },
      {
        word: 'stationery',
        phonetic: '/ˈsteɪ.ʃən.ər.i/',
        wordType: 'NOUN',
        definition: 'văn phòng phẩm (giấy, bút, phong bì)',
        definitionEn: 'writing materials and office supplies like paper, pens, and envelopes',
        example: 'Our department placed a bulk order for recycled printer paper and stationery.',
        exampleVi: 'Phòng ban chúng tôi đã đặt mua số lượng lớn giấy in tái chế và văn phòng phẩm.',
        bandLevel: 'BAND_2',
        tags: ['office', 'supplies']
      },
      {
        word: 'colleague',
        phonetic: '/ˈkɒl.iːɡ/',
        wordType: 'NOUN',
        definition: 'đồng nghiệp',
        definitionEn: 'a person with whom one works in a profession or business',
        example: 'Mr. Tanaka thanked his colleagues for their assistance during the software rollout.',
        exampleVi: 'Ông Tanaka đã cảm ơn các đồng nghiệp vì sự hỗ trợ của họ trong quá trình triển khai phần mềm.',
        bandLevel: 'BAND_1',
        tags: ['office', 'teamwork']
      },
      {
        word: 'facilitate',
        phonetic: '/fəˈsɪl.ɪ.teɪt/',
        wordType: 'VERB',
        definition: 'tạo điều kiện thuận lợi, điều phối',
        definitionEn: 'to make an action or process easy or easier',
        example: 'The new cloud storage platform will facilitate smoother collaboration between branches.',
        exampleVi: 'Nền tảng lưu trữ đám mây mới sẽ tạo điều kiện thuận lợi cho việc hợp tác mượt mà hơn giữa các chi nhánh.',
        bandLevel: 'BAND_4',
        tags: ['office', 'efficiency']
      },
      {
        word: 'memo',
        phonetic: '/ˈmem.əʊ/',
        wordType: 'NOUN',
        definition: 'thông báo nội bộ, bản ghi nhớ',
        definitionEn: 'a written message, especially in business, distributed internally',
        example: 'The HR director issued a memo regarding the revised remote work policy.',
        exampleVi: 'Giám đốc nhân sự đã ban hành một bản thông báo nội bộ về chính sách làm việc từ xa được sửa đổi.',
        bandLevel: 'BAND_2',
        tags: ['office', 'communication']
      },
      {
        word: 'supervise',
        phonetic: '/ˈsuː.pə.vaɪz/',
        wordType: 'VERB',
        definition: 'giám sát, quản lý',
        definitionEn: 'to observe and direct the execution of a task or the work of a person',
        example: 'Senior associates are expected to supervise interns during their first three months.',
        exampleVi: 'Các chuyên viên cấp cao dự kiến sẽ giám sát thực tập sinh trong ba tháng đầu tiên.',
        bandLevel: 'BAND_3',
        tags: ['office', 'management']
      },
      {
        word: 'protocol',
        phonetic: '/ˈprəʊ.tə.kɒl/',
        wordType: 'NOUN',
        definition: 'quy trình chuẩn, nghi thức',
        definitionEn: 'the official procedure or system of rules governing workplace actions',
        example: 'Employees must adhere to strict security protocols when handling server data.',
        exampleVi: 'Nhân viên phải tuân thủ các quy trình an ninh nghiêm ngặt khi xử lý dữ liệu máy chủ.',
        bandLevel: 'BAND_4',
        tags: ['office', 'policy']
      },
      {
        word: 'reception',
        phonetic: '/rɪˈsep.ʃən/',
        wordType: 'NOUN',
        definition: 'quầy lễ tân, sự đón tiếp',
        definitionEn: 'the area in an office building where visitors are greeted',
        example: 'All visitors must register at the ground floor reception and obtain a guest badge.',
        exampleVi: 'Mọi khách đến thăm đều phải đăng ký tại quầy lễ tân tầng trệt và nhận thẻ khách.',
        bandLevel: 'BAND_2',
        tags: ['office', 'visitor']
      },
      {
        word: 'archive',
        phonetic: '/ˈɑː.kaɪv/',
        wordType: 'VERB',
        definition: 'lưu trữ hồ sơ tài liệu',
        definitionEn: 'to place or store in an archive for long-term preservation',
        example: 'Accounting records older than five years are archived securely off-site.',
        exampleVi: 'Hồ sơ kế toán cũ hơn 5 năm được lưu trữ an toàn tại kho lưu trữ bên ngoài.',
        bandLevel: 'BAND_3',
        tags: ['office', 'records']
      },
      {
        word: 'procure',
        phonetic: '/prəˈkjʊər/',
        wordType: 'VERB',
        definition: 'mua sắm trang thiết bị, thu mua',
        definitionEn: 'to obtain goods or services through formal purchasing channels',
        example: 'The administrative department procured ergonomic chairs for the entire sales team.',
        exampleVi: 'Phòng hành chính đã mua sắm ghế công thái học cho toàn bộ đội ngũ kinh doanh.',
        bandLevel: 'BAND_4',
        tags: ['office', 'purchasing']
      },
      {
        word: 'punctual',
        phonetic: '/ˈpʌŋk.tʃu.əl/',
        wordType: 'ADJECTIVE',
        definition: 'đúng giờ',
        definitionEn: 'happening or doing something at the agreed or proper time',
        example: 'All attendees are urged to be punctual for the executive briefing at 9:00 AM.',
        exampleVi: 'Tất cả người tham dự được yêu cầu phải đúng giờ cho buổi họp điều hành lúc 9:00 sáng.',
        bandLevel: 'BAND_2',
        tags: ['office', 'professionalism']
      },
      {
        word: 'teleconference',
        phonetic: '/ˈtel.ɪˌkɒn.fər.əns/',
        wordType: 'NOUN',
        definition: 'cuộc họp từ xa qua điện thoại/video',
        definitionEn: 'a conference involving participants in different locations using telecommunication systems',
        example: 'We hosted a teleconference with our European regional directors this morning.',
        exampleVi: 'Chúng tôi đã tổ chức một cuộc họp từ xa với các giám đốc khu vực Châu Âu sáng nay.',
        bandLevel: 'BAND_3',
        tags: ['office', 'technology']
      },
      {
        word: 'workflow',
        phonetic: '/ˈwɜːk.fləʊ/',
        wordType: 'NOUN',
        definition: 'luồng công việc, tiến trình xử lý',
        definitionEn: 'the sequence of industrial, administrative, or other processes through which a piece of work passes',
        example: 'Automating invoice approvals significantly improved the finance department workflow.',
        exampleVi: 'Việc tự động hóa phê duyệt hóa đơn đã cải thiện đáng kể luồng công việc của phòng tài chính.',
        bandLevel: 'BAND_3',
        tags: ['office', 'productivity']
      }
    ]
  },
  {
    id: 'vocab_travel_hospitality',
    title: 'Travel, Tourism & Hospitality',
    description: 'Key vocabulary for corporate travel arrangements, lodging, itineraries, transportation, and hotel customer services.',
    targetBand: 'BAND_2',
    isPublic: true,
    cards: [
      {
        word: 'itinerary',
        phonetic: '/aɪˈtɪn.ər.ər.i/',
        wordType: 'NOUN',
        definition: 'lịch trình chi tiết chuyến đi',
        definitionEn: 'a planned route or journey schedule with dates and times',
        example: 'The travel agency emailed the revised itinerary directly to the executive assistant.',
        exampleVi: 'Đại lý du lịch đã gửi lịch trình chuyến đi sửa đổi qua email trực tiếp cho trợ lý điều hành.',
        bandLevel: 'BAND_3',
        tags: ['travel', 'planning']
      },
      {
        word: 'accommodation',
        phonetic: '/əˌkɒm.əˈdeɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'chỗ ở, nơi lưu trú',
        definitionEn: 'a room, group of rooms, or building in which someone may live or stay',
        example: 'Hotel accommodations for the annual sales seminar will be covered by the company.',
        exampleVi: 'Chi phí chỗ ở khách sạn cho hội thảo bán hàng thường niên sẽ do công ty chi trả.',
        bandLevel: 'BAND_3',
        tags: ['travel', 'hospitality']
      },
      {
        word: 'commute',
        phonetic: '/kəˈmjuːt/',
        wordType: 'VERB',
        definition: 'đi lại hàng ngày giữa nhà và nơi làm việc',
        definitionEn: 'to travel some distance between one\'s home and place of work on a regular basis',
        example: 'Many employees commute to the city center headquarters by express subway train.',
        exampleVi: 'Nhiều nhân viên đi lại hàng ngày tới trụ sở trung tâm thành phố bằng tàu điện ngầm tốc hành.',
        bandLevel: 'BAND_2',
        tags: ['travel', 'transportation']
      },
      {
        word: 'reimburse',
        phonetic: '/ˌriː.ɪmˈbɜːs/',
        wordType: 'VERB',
        definition: 'hoàn trả công tác phí',
        definitionEn: 'to repay someone an amount of money that has been spent for business purposes',
        example: 'The finance team will reimburse your travel expenses upon submission of original receipts.',
        exampleVi: 'Đội ngũ tài chính sẽ hoàn trả các chi phí đi lại của bạn khi nộp các hóa đơn gốc.',
        bandLevel: 'BAND_4',
        tags: ['travel', 'finance']
      },
      {
        word: 'amenity',
        phonetic: '/əˈmiː.nə.ti/',
        wordType: 'NOUN',
        definition: 'tiện nghi khách sạn, dịch vụ gia tăng',
        definitionEn: 'a desirable or useful feature or facility of a building or hotel',
        example: 'Complimentary high-speed Wi-Fi is one of the most requested hotel amenities.',
        exampleVi: 'Wi-Fi tốc độ cao miễn phí là một trong những tiện nghi khách sạn được yêu cầu nhiều nhất.',
        bandLevel: 'BAND_3',
        tags: ['travel', 'hospitality']
      },
      {
        word: 'reservation',
        phonetic: '/ˌrez.əˈveɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'sự đặt chỗ trước',
        definitionEn: 'an arrangement to have something kept for someone\'s use at a later time',
        example: 'Please confirm your flight reservation at least 48 hours prior to departure.',
        exampleVi: 'Vui lòng xác nhận việc đặt chỗ chuyến bay của bạn ít nhất 48 giờ trước giờ khởi hành.',
        bandLevel: 'BAND_2',
        tags: ['travel', 'booking']
      },
      {
        word: 'cancellation',
        phonetic: '/ˌsæn.səlˈeɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'sự hủy bỏ (chuyến bay, phòng)',
        definitionEn: 'the action of annulling something established or booked',
        example: 'There is no fee for hotel cancellation if made 24 hours in advance.',
        exampleVi: 'Không có phí hủy phòng khách sạn nếu được thực hiện trước 24 giờ.',
        bandLevel: 'BAND_2',
        tags: ['travel', 'policy']
      },
      {
        word: 'shuttle',
        phonetic: '/ˈʃʌt.əl/',
        wordType: 'NOUN',
        definition: 'xe trung chuyển đưa đón',
        definitionEn: 'a vehicle that travels regularly between two places',
        example: 'A complimentary shuttle departs every thirty minutes from terminal two to the hotel.',
        exampleVi: 'Một chuyến xe trung chuyển miễn phí khởi hành cứ 30 phút một lần từ ga số 2 đến khách sạn.',
        bandLevel: 'BAND_2',
        tags: ['travel', 'transportation']
      },
      {
        word: 'concierge',
        phonetic: '/kɒn.siˈeəʒ/',
        wordType: 'NOUN',
        definition: 'nhân viên hỗ trợ khách hàng tại khách sạn',
        definitionEn: 'a hotel employee whose job is to assist guests by booking tours, making reservations, etc.',
        example: 'The hotel concierge booked premium tickets for the international convention opening gala.',
        exampleVi: 'Nhân viên hỗ trợ khách sạn đã đặt vé hạng nhất cho dạ tiệc khai mạc hội nghị quốc tế.',
        bandLevel: 'BAND_4',
        tags: ['travel', 'hospitality']
      },
      {
        word: 'luggage',
        phonetic: '/ˈlʌɡ.ɪdʒ/',
        wordType: 'NOUN',
        definition: 'hành lý',
        definitionEn: 'suitcases or other bags in which to pack personal belongings for traveling',
        example: 'Passengers are advised to label all checked luggage with their contact phone numbers.',
        exampleVi: 'Hành khách được khuyên nên gắn nhãn ghi số điện thoại liên lạc lên toàn bộ hành lý ký gửi.',
        bandLevel: 'BAND_1',
        tags: ['travel', 'airport']
      },
      {
        word: 'departure',
        phonetic: '/dɪˈpɑː.tʃər/',
        wordType: 'NOUN',
        definition: 'sự khởi hành, giờ xuất phát',
        definitionEn: 'the action of leaving, especially to start a journey',
        example: 'The departure gate for flight BA-402 was changed from gate 12 to gate 19.',
        exampleVi: 'Cổng khởi hành cho chuyến bay BA-402 đã được đổi từ cổng 12 sang cổng 19.',
        bandLevel: 'BAND_2',
        tags: ['travel', 'airport']
      },
      {
        word: 'transit',
        phonetic: '/ˈtræn.zɪt/',
        wordType: 'NOUN',
        definition: 'sự quá cảnh, sự chuyển tiếp',
        definitionEn: 'the passage of people or goods from one place to another',
        example: 'Our flight to London includes a three-hour transit at Incheon International Airport.',
        exampleVi: 'Chuyến bay của chúng tôi tới London bao gồm thời gian quá cảnh 3 tiếng tại Sân bay Quốc tế Incheon.',
        bandLevel: 'BAND_3',
        tags: ['travel', 'flights']
      },
      {
        word: 'destination',
        phonetic: '/ˌdes.tɪˈneɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'điểm đến, nơi dự định tới',
        definitionEn: 'the place to which someone or something is going or being sent',
        example: 'Tokyo is the most popular destination for our company\'s regional trade delegations.',
        exampleVi: 'Tokyo là điểm đến phổ biến nhất cho các đoàn đại biểu thương mại khu vực của công ty chúng tôi.',
        bandLevel: 'BAND_2',
        tags: ['travel', 'planning']
      },
      {
        word: 'complimentary',
        phonetic: '/ˌkɒm.plɪˈmen.tər.i/',
        wordType: 'ADJECTIVE',
        definition: 'miễn phí (được phục vụ như một món quà kèm theo)',
        definitionEn: 'given or supplied free of charge as a courtesy',
        example: 'Guests staying on executive floors enjoy complimentary breakfast and afternoon tea.',
        exampleVi: 'Du khách ở các tầng điều hành được hưởng bữa sáng và trà chiều miễn phí.',
        bandLevel: 'BAND_3',
        tags: ['travel', 'hospitality']
      },
      {
        word: 'boarding',
        phonetic: '/ˈbɔː.dɪŋ/',
        wordType: 'NOUN',
        definition: 'sự lên máy bay/tàu',
        definitionEn: 'the action of getting on or into a ship, aircraft, train, or other vehicle',
        example: 'Boarding begins forty minutes prior to departure for all international long-haul flights.',
        exampleVi: 'Việc lên máy bay bắt đầu trước giờ khởi hành 40 phút đối với tất cả các chuyến bay dài quốc tế.',
        bandLevel: 'BAND_2',
        tags: ['travel', 'airport']
      },
      {
        word: 'customs',
        phonetic: '/ˈkʌs.təmz/',
        wordType: 'NOUN',
        definition: 'hải quan, cửa khẩu',
        definitionEn: 'the official department that administers and collects duties levied by a government on imported goods',
        example: 'You must present your declaration card when passing through customs and border control.',
        exampleVi: 'Bạn phải xuất trình tờ khai hải quan khi đi qua khu vực hải quan và kiểm soát biên giới.',
        bandLevel: 'BAND_3',
        tags: ['travel', 'airport']
      },
      {
        word: 'extended',
        phonetic: '/ɪkˈsten.dɪd/',
        wordType: 'ADJECTIVE',
        definition: 'kéo dài, gia hạn',
        definitionEn: 'made larger or longer in duration',
        example: 'The vice president took an extended business trip across five Southeast Asian markets.',
        exampleVi: 'Phó chủ tịch đã có một chuyến công tác kéo dài qua 5 thị trường Đông Nam Á.',
        bandLevel: 'BAND_3',
        tags: ['travel', 'business-trip']
      },
      {
        word: 'inconvenience',
        phonetic: '/ˌɪn.kənˈviː.ni.əns/',
        wordType: 'NOUN',
        definition: 'sự phiền toái, bất tiện',
        definitionEn: 'trouble or problems that affect you or cause you discomfort',
        example: 'The airline offered meal vouchers to compensate travelers for the flight delay inconvenience.',
        exampleVi: 'Hãng hàng không đã cung cấp phiếu ăn để bồi thường cho du khách vì sự bất tiện của việc hoãn chuyến bay.',
        bandLevel: 'BAND_3',
        tags: ['travel', 'customer-service']
      }
    ]
  },
  {
    id: 'vocab_marketing_advertising',
    title: 'Marketing, Advertising & Branding',
    description: 'Terminology for promotional campaigns, market research, brand equity, consumer behavior, and sales channels.',
    targetBand: 'BAND_3',
    isPublic: true,
    cards: [
      {
        word: 'campaign',
        phonetic: '/kæmˈpeɪn/',
        wordType: 'NOUN',
        definition: 'chiến dịch quảng cáo/truyền thông',
        definitionEn: 'an organized course of action to promote a product or service',
        example: 'Our digital marketing campaign generated over fifty thousand qualified leads in one month.',
        exampleVi: 'Chiến dịch tiếp thị kỹ thuật số của chúng tôi đã tạo ra hơn 50.000 khách hàng tiềm năng trong một tháng.',
        bandLevel: 'BAND_3',
        tags: ['marketing', 'advertising']
      },
      {
        word: 'demographic',
        phonetic: '/ˌdem.əˈɡræf.ɪk/',
        wordType: 'NOUN',
        definition: 'nhóm nhân khẩu học mục tiêu',
        definitionEn: 'a particular sector of a population grouped by age, income, or habits',
        example: 'The new smartphone model is aimed at the tech-savvy young adult demographic.',
        exampleVi: 'Mẫu điện thoại thông minh mới hướng tới nhóm nhân khẩu học người trẻ am hiểu công nghệ.',
        bandLevel: 'BAND_4',
        tags: ['marketing', 'research']
      },
      {
        word: 'endorse',
        phonetic: '/ɪnˈdɔːs/',
        wordType: 'VERB',
        definition: 'quảng bá, chứng thực sản phẩm',
        definitionEn: 'to declare one\'s public approval or support of a product in advertising',
        example: 'A famous Olympic athlete was signed to endorse our latest line of running shoes.',
        exampleVi: 'Một vận động viên Olympic nổi tiếng đã được ký hợp đồng để quảng bá cho dòng giày chạy mới nhất của chúng tôi.',
        bandLevel: 'BAND_4',
        tags: ['marketing', 'branding']
      },
      {
        word: 'penetrate',
        phonetic: '/ˈpen.ɪ.treɪt/',
        wordType: 'VERB',
        definition: 'thâm nhập (thị trường)',
        definitionEn: 'to succeed in selling a company\'s products or services within a new market',
        example: 'By partnering with local distributors, the brand managed to penetrate the European market.',
        exampleVi: 'Bằng cách hợp tác với các nhà phân phối địa phương, thương hiệu đã thâm nhập thành công vào thị trường Châu Âu.',
        bandLevel: 'BAND_4',
        tags: ['marketing', 'strategy']
      },
      {
        word: 'brochure',
        phonetic: '/ˈbrəʊ.ʃər/',
        wordType: 'NOUN',
        definition: 'cuốn tài liệu giới thiệu sản phẩm',
        definitionEn: 'a small book or magazine containing pictures and information about a product or service',
        example: 'The sales representatives handed out glossy brochures detailing the luxury apartment project.',
        exampleVi: 'Các đại diện bán hàng đã phát các cuốn tài liệu giới thiệu bóng bẩy mô tả chi tiết dự án căn hộ cao cấp.',
        bandLevel: 'BAND_2',
        tags: ['marketing', 'collateral']
      },
      {
        word: 'survey',
        phonetic: '/ˈsɜː.veɪ/',
        wordType: 'NOUN',
        definition: 'cuộc khảo sát thị trường',
        definitionEn: 'an investigation of the opinions or experience of a group of people based on a series of questions',
        example: 'According to a recent consumer survey, brand loyalty has increased by fifteen percent.',
        exampleVi: 'Theo một cuộc khảo sát người tiêu dùng gần đây, lòng trung thành với thương hiệu đã tăng thêm 15%.',
        bandLevel: 'BAND_2',
        tags: ['marketing', 'research']
      },
      {
        word: 'benchmark',
        phonetic: '/ˈbentʃ.mɑːk/',
        wordType: 'NOUN',
        definition: 'tiêu chuẩn đối sánh, mốc chuẩn',
        definitionEn: 'a standard or point of reference against which things may be compared or assessed',
        example: 'The company uses international customer satisfaction ratings as an operational benchmark.',
        exampleVi: 'Công ty sử dụng xếp hạng hài lòng khách hàng quốc tế làm tiêu chuẩn đối sánh hoạt động.',
        bandLevel: 'BAND_4',
        tags: ['marketing', 'analytics']
      },
      {
        word: 'promotional',
        phonetic: '/prəˈməʊ.ʃən.əl/',
        wordType: 'ADJECTIVE',
        definition: 'mang tính xúc tiến, khuyến mãi',
        definitionEn: 'relating to the advertisement and popularization of a product or brand',
        example: 'We sent promotional discount codes to all subscribers who joined the mailing list.',
        exampleVi: 'Chúng tôi đã gửi mã giảm giá khuyến mãi cho tất cả người đăng ký tham gia danh sách gửi thư.',
        bandLevel: 'BAND_3',
        tags: ['marketing', 'sales']
      },
      {
        word: 'loyalty',
        phonetic: '/ˈlɔɪ.əl.ti/',
        wordType: 'NOUN',
        definition: 'lòng trung thành của khách hàng',
        definitionEn: 'the quality of being loyal to a brand or company by continuing to buy its products',
        example: 'The new rewards program is designed to cultivate long-term customer loyalty.',
        exampleVi: 'Chương trình tích điểm đổi quà mới được thiết kế để xây dựng lòng trung thành lâu dài của khách hàng.',
        bandLevel: 'BAND_3',
        tags: ['marketing', 'retention']
      },
      {
        word: 'sponsorship',
        phonetic: '/ˈspɒn.sə.ʃɪp/',
        wordType: 'NOUN',
        definition: 'sự tài trợ thương mại',
        definitionEn: 'financial support received from a sponsor to promote business publicity',
        example: 'The telecommunications company announced its official sponsorship of the national marathon.',
        exampleVi: 'Công ty viễn thông đã công bố việc tài trợ chính thức cho giải chạy marathon quốc gia.',
        bandLevel: 'BAND_3',
        tags: ['marketing', 'pr']
      },
      {
        word: 'segment',
        phonetic: '/ˈseɡ.mənt/',
        wordType: 'NOUN',
        definition: 'phân khúc thị trường',
        definitionEn: 'each of the parts into which a market is divided based on customer characteristics',
        example: 'Our luxury cosmetics division focuses exclusively on the premium retail segment.',
        exampleVi: 'Bộ phận mỹ phẩm xa xỉ của chúng tôi chỉ tập trung duy nhất vào phân khúc bán lẻ cao cấp.',
        bandLevel: 'BAND_4',
        tags: ['marketing', 'segmentation']
      },
      {
        word: 'publicity',
        phonetic: '/pʌbˈlɪs.ə.ti/',
        wordType: 'NOUN',
        definition: 'sự chú ý của công chúng, quan hệ công chúng',
        definitionEn: 'notice or attention given to someone or something by the media',
        example: 'The innovative product design received tremendous publicity in national trade magazines.',
        exampleVi: 'Thiết kế sản phẩm sáng tạo đã nhận được sự chú ý vô cùng lớn của công chúng trên các tạp chí thương mại quốc gia.',
        bandLevel: 'BAND_3',
        tags: ['marketing', 'pr']
      },
      {
        word: 'competitor',
        phonetic: '/kəmˈpet.ɪ.tər/',
        wordType: 'NOUN',
        definition: 'đối thủ cạnh tranh',
        definitionEn: 'a person, company, or team that is competing with others in a commercial field',
        example: 'Our main competitor launched a rival product priced ten percent below ours.',
        exampleVi: 'Đối thủ cạnh tranh chính của chúng tôi đã tung ra sản phẩm cạnh tranh có giá thấp hơn 10% so với chúng tôi.',
        bandLevel: 'BAND_2',
        tags: ['marketing', 'competition']
      },
      {
        word: 'launch',
        phonetic: '/lɔːntʃ/',
        wordType: 'VERB',
        definition: 'tung ra thị trường, ra mắt',
        definitionEn: 'to introduce a new product or service to the public market',
        example: 'The automotive company plans to launch three electric vehicle models next spring.',
        exampleVi: 'Công ty ô tô có kế hoạch ra mắt ba mẫu xe điện vào mùa xuân tới.',
        bandLevel: 'BAND_2',
        tags: ['marketing', 'product']
      },
      {
        word: 'flyer',
        phonetic: '/ˈflaɪ.ər/',
        wordType: 'NOUN',
        definition: 'tờ rơi quảng cáo',
        definitionEn: 'a small sheet of printed paper used to advertise an event or product',
        example: 'Volunteers distributed promotional flyers outside the convention exhibition hall.',
        exampleVi: 'Các tình nguyện viên đã phát tờ rơi quảng cáo bên ngoài hội trường triển lãm của hội nghị.',
        bandLevel: 'BAND_2',
        tags: ['marketing', 'advertising']
      },
      {
        word: 'commercial',
        phonetic: '/kəˈmɜː.ʃəl/',
        wordType: 'NOUN',
        definition: 'đoạn quảng cáo truyền hình/phát thanh',
        definitionEn: 'a television or radio advertisement',
        example: 'The thirty-second television commercial was broadcast during prime-time sports programming.',
        exampleVi: 'Đoạn quảng cáo truyền hình 30 giây đã được phát sóng trong khung giờ vàng của chương trình thể thao.',
        bandLevel: 'BAND_2',
        tags: ['marketing', 'media']
      },
      {
        word: 'reputation',
        phonetic: '/ˌrep.jʊˈteɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'danh tiếng, uy tín thương hiệu',
        definitionEn: 'the beliefs or opinions that are generally held about a company or brand',
        example: 'The firm has earned an international reputation for delivering unmatched customer care.',
        exampleVi: 'Công ty đã tạo dựng được uy tín quốc tế nhờ cung cấp dịch vụ chăm sóc khách hàng vô song.',
        bandLevel: 'BAND_3',
        tags: ['marketing', 'brand']
      },
      {
        word: 'target',
        phonetic: '/ˈtɑː.ɡɪt/',
        wordType: 'VERB',
        definition: 'nhắm tới mục tiêu, hướng đến',
        definitionEn: 'to aim an advertisement or campaign at a specific group of people',
        example: 'The advertising campaign specifically targets busy working parents seeking healthy snacks.',
        exampleVi: 'Chiến dịch quảng cáo đặc biệt nhắm tới các bậc cha mẹ đi làm bận rộn đang tìm kiếm đồ ăn nhẹ lành mạnh.',
        bandLevel: 'BAND_2',
        tags: ['marketing', 'targeting']
      }
    ]
  },
  {
    id: 'vocab_human_resources',
    title: 'Human Resources & Hiring',
    description: 'Vocabulary for recruitment, interviews, employee benefits, performance reviews, compensation, and staff development.',
    targetBand: 'BAND_3',
    isPublic: true,
    cards: [
      {
        word: 'applicant',
        phonetic: '/ˈæp.lɪ.kənt/',
        wordType: 'NOUN',
        definition: 'ứng viên xin việc',
        definitionEn: 'a person who formally applies for something, especially a job vacancy',
        example: 'More than two hundred applicants submitted their résumés for the graphic designer post.',
        exampleVi: 'Hơn hai trăm ứng viên đã nộp hồ sơ xin việc cho vị trí thiết kế đồ họa.',
        bandLevel: 'BAND_2',
        tags: ['hr', 'recruitment']
      },
      {
        word: 'candidate',
        phonetic: '/ˈkæn.dɪ.dət/',
        wordType: 'NOUN',
        definition: 'ứng viên triển vọng',
        definitionEn: 'a person who applies for a job or is nominated for an election and is under consideration',
        example: 'The hiring committee selected three shortlisted candidates for final round interviews.',
        exampleVi: 'Hội đồng tuyển dụng đã chọn ra ba ứng viên trong danh sách rút gọn cho vòng phỏng vấn cuối.',
        bandLevel: 'BAND_2',
        tags: ['hr', 'recruitment']
      },
      {
        word: 'compensation',
        phonetic: '/ˌkɒm.pənˈseɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'tiền lương bổng và đãi ngộ',
        definitionEn: 'the money and benefits that an employee receives for their work',
        example: 'The executive compensation package includes stock options, annual bonuses, and health coverage.',
        exampleVi: 'Gói lương bổng và đãi ngộ của giám đốc điều hành bao gồm quyền mua cổ phiếu, thưởng hàng năm và bảo hiểm y tế.',
        bandLevel: 'BAND_4',
        tags: ['hr', 'payroll']
      },
      {
        word: 'probationary',
        phonetic: '/prəˈbeɪ.ʃən.ər.i/',
        wordType: 'ADJECTIVE',
        definition: 'thử việc, trong giai đoạn tập sự',
        definitionEn: 'relating to a process of testing or trial during a preliminary period of employment',
        example: 'New software engineers serve a three-month probationary period before receiving full benefits.',
        exampleVi: 'Các kỹ sư phần mềm mới sẽ trải qua thời gian thử việc ba tháng trước khi nhận đầy đủ phúc lợi.',
        bandLevel: 'BAND_4',
        tags: ['hr', 'employment']
      },
      {
        word: 'curriculum vitae',
        phonetic: '/kəˌrɪk.jʊ.ləm ˈviː.taɪ/',
        wordType: 'NOUN',
        definition: 'hồ sơ sơ yếu lý lịch (CV)',
        definitionEn: 'a brief account of a person\'s education, qualifications, and previous experience',
        example: 'Candidates must submit an updated curriculum vitae along with two reference letters.',
        exampleVi: 'Các ứng viên phải nộp sơ yếu lý lịch mới nhất kèm theo hai thư giới thiệu.',
        bandLevel: 'BAND_3',
        tags: ['hr', 'application']
      },
      {
        word: 'appraisal',
        phonetic: '/əˈpreɪ.zəl/',
        wordType: 'NOUN',
        definition: 'đánh giá hiệu quả công việc',
        definitionEn: 'an assessment or evaluation of the performance or value of an employee',
        example: 'Annual performance appraisals determine end-of-year bonuses and promotion eligibility.',
        exampleVi: 'Các đợt đánh giá hiệu quả công việc thường niên sẽ quyết định tiền thưởng cuối năm và tiêu chuẩn thăng chức.',
        bandLevel: 'BAND_4',
        tags: ['hr', 'performance']
      },
      {
        word: 'recruit',
        phonetic: '/rɪˈkruːt/',
        wordType: 'VERB',
        definition: 'tuyển dụng, chiêu mộ',
        definitionEn: 'to enlist someone in a business or organization as a worker',
        example: 'We are seeking to recruit an experienced supply chain coordinator for our Da Nang branch.',
        exampleVi: 'Chúng tôi đang tìm kiếm để tuyển dụng một điều phối viên chuỗi cung ứng giàu kinh nghiệm cho chi nhánh Đà Nẵng.',
        bandLevel: 'BAND_2',
        tags: ['hr', 'hiring']
      },
      {
        word: 'qualification',
        phonetic: '/ˌkwɒl.ɪ.fɪˈkeɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'bằng cấp, năng lực chuyên môn',
        definitionEn: 'an official record of achievement, skill, or experience required for a job',
        example: 'Applicants must possess strong analytical qualifications and fluency in spoken Japanese.',
        exampleVi: 'Ứng viên phải có bằng cấp chuyên môn vững vàng về phân tích và nói tiếng Nhật lưu loát.',
        bandLevel: 'BAND_3',
        tags: ['hr', 'requirements']
      },
      {
        word: 'pension',
        phonetic: '/ˈpen.ʃən/',
        wordType: 'NOUN',
        definition: 'lương hưu, chế độ hưu trí',
        definitionEn: 'a regular payment made during a person\'s retirement from an investment fund',
        example: 'The firm matches up to six percent of employee contributions to their retirement pension fund.',
        exampleVi: 'Công ty đóng góp đối ứng lên tới 6% khoản đóng góp của nhân viên vào quỹ lương hưu của họ.',
        bandLevel: 'BAND_3',
        tags: ['hr', 'benefits']
      },
      {
        word: 'severance',
        phonetic: '/ˈsev.ər.əns/',
        wordType: 'NOUN',
        definition: 'trợ cấp thôi việc',
        definitionEn: 'an amount in money paid to an employee upon dismissal or end of contract',
        example: 'Laid-off workers received six months of salary as part of their severance package.',
        exampleVi: 'Những công nhân bị cho thôi việc đã nhận được sáu tháng lương như một phần của gói trợ cấp thôi việc.',
        bandLevel: 'BAND_4',
        tags: ['hr', 'policy']
      },
      {
        word: 'turnover',
        phonetic: '/ˈtɜːnˌəʊ.vər/',
        wordType: 'NOUN',
        definition: 'tỷ lệ luân chuyển nhân sự',
        definitionEn: 'the rate at which employees leave a company and are replaced by new staff',
        example: 'Improved workplace wellness initiatives helped reduce staff turnover by twenty percent.',
        exampleVi: 'Các sáng kiến nâng cao phúc lợi tại nơi làm việc đã giúp giảm tỷ lệ luân chuyển nhân sự đi 20%.',
        bandLevel: 'BAND_4',
        tags: ['hr', 'analytics']
      },
      {
        word: 'personnel',
        phonetic: '/ˌpɜː.sənˈel/',
        wordType: 'NOUN',
        definition: 'nhân sự, đội ngũ nhân viên',
        definitionEn: 'people employed in an organization or used in an undertaking',
        example: 'All security personnel must wear identification badges at all times on company premises.',
        exampleVi: 'Tất cả nhân viên an ninh phải đeo thẻ định danh vào mọi thời điểm trong khuôn viên công ty.',
        bandLevel: 'BAND_3',
        tags: ['hr', 'staff']
      },
      {
        word: 'promote',
        phonetic: '/prəˈməʊt/',
        wordType: 'VERB',
        definition: 'thăng chức, đề bạt',
        definitionEn: 'to raise someone to a higher position or rank',
        example: 'The board voted to promote Ms. Davis to regional vice president of marketing.',
        exampleVi: 'Hội đồng quản trị đã biểu quyết thăng chức bà Davis lên làm phó chủ tịch tiếp thị khu vực.',
        bandLevel: 'BAND_2',
        tags: ['hr', 'career']
      },
      {
        word: 'resign',
        phonetic: '/rɪˈzaɪn/',
        wordType: 'VERB',
        definition: 'từ chức, xin thôi việc',
        definitionEn: 'voluntarily leave a job or position of office',
        example: 'The chief financial officer decided to resign due to personal health reasons.',
        exampleVi: 'Giám đốc tài chính đã quyết định từ chức vì lý do sức khỏe cá nhân.',
        bandLevel: 'BAND_2',
        tags: ['hr', 'career']
      },
      {
        word: 'orientation',
        phonetic: '/ˌɔː.ri.enˈteɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'buổi định hướng cho nhân viên mới',
        definitionEn: 'a course or period introducing a new employee to their job and work environment',
        example: 'New hires attend a full-day orientation session covering company values and IT tools.',
        exampleVi: 'Nhân viên mới tham dự buổi định hướng trọn ngày giới thiệu các giá trị công ty và công cụ CNTT.',
        bandLevel: 'BAND_3',
        tags: ['hr', 'training']
      },
      {
        word: 'mentor',
        phonetic: '/ˈmen.tɔːr/',
        wordType: 'NOUN',
        definition: 'người hướng dẫn, cố vấn',
        definitionEn: 'an experienced and trusted adviser who guides an inexperienced colleague',
        example: 'Each junior accountant is assigned a senior mentor during their first fiscal quarter.',
        exampleVi: 'Mỗi kế toán viên sơ cấp được phân công một người cố vấn cấp cao trong quý tài chính đầu tiên của họ.',
        bandLevel: 'BAND_2',
        tags: ['hr', 'training']
      },
      {
        word: 'remuneration',
        phonetic: '/rɪˌmjuː.nərˈeɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'tiền thù lao, tiền công',
        definitionEn: 'money paid for work or a service provided',
        example: 'The consulting firm offers competitive remuneration commensurate with candidate experience.',
        exampleVi: 'Công ty tư vấn đưa ra mức thù lao cạnh tranh tương xứng với kinh nghiệm của ứng viên.',
        bandLevel: 'BAND_5',
        tags: ['hr', 'payroll']
      },
      {
        word: 'vacancy',
        phonetic: '/ˈveɪ.kən.si/',
        wordType: 'NOUN',
        definition: 'vị trí tuyển dụng còn trống',
        definitionEn: 'an unoccupied position or job waiting to be filled',
        example: 'We currently have an immediate vacancy for a bilingual executive assistant.',
        exampleVi: 'Hiện tại chúng tôi có một vị trí tuyển dụng còn trống ngay cho chức danh trợ lý điều hành song ngữ.',
        bandLevel: 'BAND_2',
        tags: ['hr', 'recruitment']
      }
    ]
  },
  {
    id: 'vocab_contracts_negotiations',
    title: 'Contracts, Legal Agreements & Negotiations',
    description: 'Vital terminology for contract clauses, legal obligations, binding agreements, terms and conditions, and business bargaining.',
    targetBand: 'BAND_4',
    isPublic: true,
    cards: [
      {
        word: 'clause',
        phonetic: '/klɔːz/',
        wordType: 'NOUN',
        definition: 'điều khoản trong hợp đồng',
        definitionEn: 'a particular and separate article, stipulation, or condition in a legal document',
        example: 'The contract contains an explicit confidentiality clause prohibiting disclosures to third parties.',
        exampleVi: 'Hợp đồng chứa một điều khoản bảo mật rõ ràng nghiêm cấm tiết lộ thông tin cho bên thứ ba.',
        bandLevel: 'BAND_3',
        tags: ['contracts', 'legal']
      },
      {
        word: 'binding',
        phonetic: '/ˈbaɪn.dɪŋ/',
        wordType: 'ADJECTIVE',
        definition: 'có tính ràng buộc pháp lý',
        definitionEn: 'involving an obligation that cannot be legally broken',
        example: 'Both corporate parties signed a legally binding agreement in the presence of an attorney.',
        exampleVi: 'Cả hai bên doanh nghiệp đã ký kết một thỏa thuận có tính ràng buộc pháp lý trước sự chứng kiến của luật sư.',
        bandLevel: 'BAND_4',
        tags: ['contracts', 'legal']
      },
      {
        word: 'breach',
        phonetic: '/briːtʃ/',
        wordType: 'NOUN',
        definition: 'sự vi phạm (hợp đồng, thỏa thuận)',
        definitionEn: 'an act of breaking or failing to observe a law, agreement, or code of conduct',
        example: 'Failing to deliver the machinery by November 15 constitutes a material breach of contract.',
        exampleVi: 'Việc không giao máy móc trước ngày 15 tháng 11 cấu thành một sự vi phạm nghiêm trọng hợp đồng.',
        bandLevel: 'BAND_4',
        tags: ['contracts', 'legal']
      },
      {
        word: 'stipulate',
        phonetic: '/ˈstɪp.jə.leɪt/',
        wordType: 'VERB',
        definition: 'quy định, đặt điều kiện bắt buộc',
        definitionEn: 'to demand or specify a requirement as part of a bargain or agreement',
        example: 'The procurement guidelines stipulate that all purchases over ten thousand dollars require executive approval.',
        exampleVi: 'Hướng dẫn thu mua quy định rằng tất cả các khoản mua sắm trên mười nghìn đô la đều cần có sự phê duyệt của ban điều hành.',
        bandLevel: 'BAND_4',
        tags: ['contracts', 'requirements']
      },
      {
        word: 'compromise',
        phonetic: '/ˈkɒm.prə.maɪz/',
        wordType: 'NOUN',
        definition: 'sự thỏa hiệp, nhượng bộ lẫn nhau',
        definitionEn: 'an agreement reached by each side making concessions',
        example: 'After six hours of negotiation, the union and management finally reached an equitable compromise.',
        exampleVi: 'Sau sáu giờ đàm phán, công đoàn và ban quản lý cuối cùng đã đạt được sự thỏa hiệp công bằng.',
        bandLevel: 'BAND_3',
        tags: ['contracts', 'negotiations']
      },
      {
        word: 'indemnify',
        phonetic: '/ɪnˈdem.nɪ.faɪ/',
        wordType: 'VERB',
        definition: 'bồi thường, bồi hoàn thiệt hại',
        definitionEn: 'to compensate someone for harm, loss, or legal liability incurred',
        example: 'The vendor agreed to indemnify the university against any future copyright infringement claims.',
        exampleVi: 'Nhà cung cấp đã đồng ý bồi thường cho trường đại học trước bất kỳ khiếu nại vi phạm bản quyền nào trong tương lai.',
        bandLevel: 'BAND_5',
        tags: ['contracts', 'legal']
      },
      {
        word: 'terminate',
        phonetic: '/ˈtɜː.mɪ.neɪt/',
        wordType: 'VERB',
        definition: 'chấm dứt (hợp đồng, thỏa thuận)',
        definitionEn: 'to bring something to an end or close',
        example: 'Either party may terminate the lease agreement by providing thirty days written notice.',
        exampleVi: 'Bất kỳ bên nào cũng có thể chấm dứt hợp đồng thuê bằng cách gửi văn bản thông báo trước 30 ngày.',
        bandLevel: 'BAND_3',
        tags: ['contracts', 'terms']
      },
      {
        word: 'null and void',
        phonetic: '/ˌnʌl ənd ˈvɔɪd/',
        wordType: 'PHRASE',
        definition: 'vô hiệu lực pháp lý',
        definitionEn: 'having no legal force or validity',
        example: 'If the required deposit is not received within seven banking days, this agreement becomes null and void.',
        exampleVi: 'Nếu khoản tiền đặt cọc theo yêu cầu không được nhận trong vòng bảy ngày làm việc của ngân hàng, thỏa thuận này sẽ trở nên vô hiệu lực.',
        bandLevel: 'BAND_4',
        tags: ['contracts', 'legal']
      },
      {
        word: 'counteroffer',
        phonetic: '/ˈkaʊn.tərˌɒf.ər/',
        wordType: 'NOUN',
        definition: 'lời đề nghị đối ứng, đề xuất ngược lại',
        definitionEn: 'an offer made in response to another offer during negotiation',
        example: 'The supplier rejected our initial quotation and submitted a counteroffer with a five percent reduction.',
        exampleVi: 'Nhà cung cấp đã từ chối bảng báo giá ban đầu của chúng tôi và đưa ra một đề xuất đối ứng với mức giảm 5%.',
        bandLevel: 'BAND_4',
        tags: ['contracts', 'bargaining']
      },
      {
        word: 'concession',
        phonetic: '/kənˈseʃ.ən/',
        wordType: 'NOUN',
        definition: 'sự nhượng bộ trong đàm phán',
        definitionEn: 'a thing that is granted, especially in response to demands during negotiations',
        example: 'Both negotiating teams made significant concessions to finalize the joint venture agreement.',
        exampleVi: 'Cả hai đội đàm phán đều đã đưa ra những sự nhượng bộ đáng kể để hoàn thiện hợp đồng liên doanh.',
        bandLevel: 'BAND_4',
        tags: ['contracts', 'negotiations']
      },
      {
        word: 'party',
        phonetic: '/ˈpɑː.ti/',
        wordType: 'NOUN',
        definition: 'bên tham gia (hợp đồng, vụ kiện)',
        definitionEn: 'a person or group participating in an action or affair, such as a contract',
        example: 'Neither party shall be liable for delays caused by circumstances beyond reasonable control.',
        exampleVi: 'Không bên nào phải chịu trách nhiệm về những sự chậm trễ gây ra bởi các hoàn cảnh nằm ngoài tầm kiểm soát hợp lý.',
        bandLevel: 'BAND_3',
        tags: ['contracts', 'parties']
      },
      {
        word: 'warranty',
        phonetic: '/ˈwɒr.ən.ti/',
        wordType: 'NOUN',
        definition: 'cam kết bảo hành, điều khoản bảo hành',
        definitionEn: 'a written guarantee promising to repair or replace an article if necessary within a specified period',
        example: 'The industrial printer is covered under a three-year manufacturer warranty for all parts and labor.',
        exampleVi: 'Máy in công nghiệp được bảo hành bởi nhà sản xuất trong ba năm cho toàn bộ linh kiện và công thợ.',
        bandLevel: 'BAND_3',
        tags: ['contracts', 'guarantee']
      },
      {
        word: 'liability',
        phonetic: '/ˌlaɪ.əˈbɪl.ə.ti/',
        wordType: 'NOUN',
        definition: 'trách nhiệm pháp lý',
        definitionEn: 'the state of being legally responsible for something',
        example: 'The logistics provider accepts full liability for damaged cargo during ocean freight transport.',
        exampleVi: 'Đơn vị vận chuyển chấp nhận toàn bộ trách nhiệm pháp lý đối với hàng hóa bị hư hại trong quá trình vận chuyển đường biển.',
        bandLevel: 'BAND_4',
        tags: ['contracts', 'legal']
      },
      {
        word: 'enforceable',
        phonetic: '/ɪnˈfɔː.sə.bəl/',
        wordType: 'ADJECTIVE',
        definition: 'có thể cưỡng chế thi hành, có hiệu lực',
        definitionEn: 'able to be imposed so that it must be complied with',
        example: 'The judge ruled that the non-compete covenant was legally valid and enforceable.',
        exampleVi: 'Thẩm phán đã phán quyết rằng thỏa thuận không cạnh tranh là hoàn toàn hợp pháp và có thể cưỡng chế thi hành.',
        bandLevel: 'BAND_4',
        tags: ['contracts', 'court']
      },
      {
        word: 'obligation',
        phonetic: '/ˌɒb.lɪˈɡeɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'nghĩa vụ pháp lý, bổn phận',
        definitionEn: 'an act or course of action to which a person is morally or legally bound',
        example: 'Both corporations fulfilled all contractual obligations well ahead of the agreed deadline.',
        exampleVi: 'Cả hai tập đoàn đã hoàn thành mọi nghĩa vụ theo hợp đồng trước thời hạn đã thỏa thuận.',
        bandLevel: 'BAND_3',
        tags: ['contracts', 'terms']
      },
      {
        word: 'provisional',
        phonetic: '/prəˈvɪʒ.ən.əl/',
        wordType: 'ADJECTIVE',
        definition: 'tạm thời, có giá trị lâm thời',
        definitionEn: 'arranged or existing for the present, possibly to be changed later',
        example: 'The companies signed a provisional memorandum of understanding pending regulatory approval.',
        exampleVi: 'Các công ty đã ký một biên bản ghi nhớ tạm thời trong khi chờ đợi sự chấp thuận từ cơ quan quản lý.',
        bandLevel: 'BAND_4',
        tags: ['contracts', 'agreement']
      },
      {
        word: 'settlement',
        phonetic: '/ˈset.əl.mənt/',
        wordType: 'NOUN',
        definition: 'sự dàn xếp, hòa giải ngoài tòa',
        definitionEn: 'an official agreement intended to resolve a dispute or conflict',
        example: 'The commercial partners reached an out-of-court settlement, avoiding lengthy litigation.',
        exampleVi: 'Các đối tác thương mại đã đạt được sự dàn xếp ngoài tòa án, tránh được vụ kiện tụng kéo dài.',
        bandLevel: 'BAND_4',
        tags: ['contracts', 'disputes']
      },
      {
        word: 'validity',
        phonetic: '/vəˈlɪd.ə.ti/',
        wordType: 'NOUN',
        definition: 'tính hiệu lực, giá trị pháp lý',
        definitionEn: 'the state of being legally or officially acceptable and binding',
        example: 'The license maintains its validity for five consecutive years from the issuance date.',
        exampleVi: 'Giấy phép duy trì hiệu lực trong năm năm liên tiếp kể từ ngày cấp.',
        bandLevel: 'BAND_3',
        tags: ['contracts', 'legal']
      }
    ]
  },
  {
    id: 'vocab_corporate_finance',
    title: 'Corporate Finance & Accounting',
    description: 'Core financial vocabulary for financial statements, auditing, budgeting, revenue, profitability, and taxation.',
    targetBand: 'BAND_4',
    isPublic: true,
    cards: [
      {
        word: 'revenue',
        phonetic: '/ˈrev.ən.juː/',
        wordType: 'NOUN',
        definition: 'doanh thu, tổng thu',
        definitionEn: 'income generated from normal business operations and sales',
        example: 'Quarterly revenue surpassed Wall Street projections due to stellar export sales.',
        exampleVi: 'Doanh thu hàng quý đã vượt qua các dự báo của phố Wall nhờ doanh số xuất khẩu xuất sắc.',
        bandLevel: 'BAND_3',
        tags: ['finance', 'accounting']
      },
      {
        word: 'expenditure',
        phonetic: '/ɪkˈspen.dɪ.tʃər/',
        wordType: 'NOUN',
        definition: 'chi phí, chi tiêu tài chính',
        definitionEn: 'an amount of money spent on goods or business assets',
        example: 'Capital expenditure on automated production equipment will increase by ten percent next fiscal year.',
        exampleVi: 'Chi tiêu vốn cho các thiết bị sản xuất tự động sẽ tăng 10% trong năm tài chính tới.',
        bandLevel: 'BAND_4',
        tags: ['finance', 'budget']
      },
      {
        word: 'audit',
        phonetic: '/ˈɔː.dɪt/',
        wordType: 'NOUN',
        definition: 'cuộc kiểm toán tài chính',
        definitionEn: 'an official systematic inspection of an organization\'s accounts by an independent body',
        example: 'An independent external accounting firm was hired to conduct the annual financial audit.',
        exampleVi: 'Một công ty kế toán độc lập bên ngoài đã được thuê để tiến hành cuộc kiểm toán tài chính thường niên.',
        bandLevel: 'BAND_3',
        tags: ['finance', 'compliance']
      },
      {
        word: 'dividend',
        phonetic: '/ˈdɪv.ɪ.dend/',
        wordType: 'NOUN',
        definition: 'cổ tức',
        definitionEn: 'a sum of money paid regularly by a company to its shareholders out of profits',
        example: 'The board voted to declare an annual cash dividend of two dollars per common share.',
        exampleVi: 'Hội đồng quản trị đã biểu quyết công bố mức cổ tức tiền mặt hàng năm là hai đô la cho mỗi cổ phiếu phổ thông.',
        bandLevel: 'BAND_4',
        tags: ['finance', 'stocks']
      },
      {
        word: 'fiscal',
        phonetic: '/ˈfɪs.kəl/',
        wordType: 'ADJECTIVE',
        definition: 'thuộc về tài chính, năm tài khóa',
        definitionEn: 'relating to government revenue, taxes, or the public and corporate financial year',
        example: 'The company reported record operating profits at the conclusion of the fourth fiscal quarter.',
        exampleVi: 'Công ty đã báo cáo lợi nhuận hoạt động kỷ lục vào thời điểm kết thúc quý tài chính thứ tư.',
        bandLevel: 'BAND_3',
        tags: ['finance', 'calendar']
      },
      {
        word: 'deficit',
        phonetic: '/ˈdef.ɪ.sɪt/',
        wordType: 'NOUN',
        definition: 'thâm hụt tài chính',
        definitionEn: 'the amount by which spending exceeds income over a given period',
        example: 'The administration introduced cost-cutting initiatives to shrink the operating budget deficit.',
        exampleVi: 'Ban quản trị đã đưa ra các sáng kiến cắt giảm chi phí để thu hẹp mức thâm hụt ngân sách hoạt động.',
        bandLevel: 'BAND_4',
        tags: ['finance', 'economy']
      },
      {
        word: 'asset',
        phonetic: '/ˈæs.et/',
        wordType: 'NOUN',
        definition: 'tài sản của doanh nghiệp',
        definitionEn: 'a useful or valuable thing, person, or quality possessed by a company',
        example: 'Current assets on the balance sheet include cash reserves and short-term accounts receivable.',
        exampleVi: 'Tài sản ngắn hạn trên bảng cân đối kế toán bao gồm quỹ tiền mặt và các khoản phải thu ngắn hạn.',
        bandLevel: 'BAND_3',
        tags: ['finance', 'accounting']
      },
      {
        word: 'balance sheet',
        phonetic: '/ˈbæl.əns ˌʃiːt/',
        wordType: 'NOUN',
        definition: 'bảng cân đối kế toán',
        definitionEn: 'a statement of the assets, liabilities, and capital of a business at a particular point in time',
        example: 'The chief accountant presented the audited balance sheet to the investment committee.',
        exampleVi: 'Kế toán trưởng đã trình bày bảng cân đối kế toán đã kiểm toán trước hội đồng đầu tư.',
        bandLevel: 'BAND_3',
        tags: ['finance', 'statements']
      },
      {
        word: 'depreciation',
        phonetic: '/dɪˌpriː.ʃiˈeɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'khấu hao tài sản cố định',
        definitionEn: 'a reduction in the value of an asset with the passage of time, due in particular to wear and tear',
        example: 'The tax accountant calculated straight-line depreciation for the fleet of commercial delivery vans.',
        exampleVi: 'Kế toán thuế đã tính khấu hao đường thẳng cho đội xe van giao hàng thương mại.',
        bandLevel: 'BAND_4',
        tags: ['finance', 'accounting']
      },
      {
        word: 'subsidy',
        phonetic: '/ˈsʌb.sɪ.di/',
        wordType: 'NOUN',
        definition: 'trợ cấp tài chính từ chính phủ',
        definitionEn: 'a sum of money granted by the government to assist an industry or business',
        example: 'Renewable energy manufacturers received substantial government subsidies to expand solar farms.',
        exampleVi: 'Các nhà sản xuất năng lượng tái tạo đã nhận được những khoản trợ cấp đáng kể từ chính phủ để mở rộng các trang trại năng lượng mặt trời.',
        bandLevel: 'BAND_4',
        tags: ['finance', 'government']
      },
      {
        word: 'turnover',
        phonetic: '/ˈtɜːnˌəʊ.vər/',
        wordType: 'NOUN',
        definition: 'doanh số thương mại, doanh thu bán lẻ',
        definitionEn: 'the amount of money taken by a business in a particular period',
        example: 'Annual retail turnover reached eighty million euros across our department store chain.',
        exampleVi: 'Doanh số thương mại hàng năm đạt 80 triệu euro trên toàn bộ chuỗi cửa hàng bách hóa của chúng tôi.',
        bandLevel: 'BAND_3',
        tags: ['finance', 'sales']
      },
      {
        word: 'lucrative',
        phonetic: '/ˈluː.krə.tɪv/',
        wordType: 'ADJECTIVE',
        definition: 'sinh lời cao, béo bở',
        definitionEn: 'producing a great deal of profit or income',
        example: 'The enterprise entered into a lucrative partnership with a global cloud computing provider.',
        exampleVi: 'Doanh nghiệp đã tham gia vào một mối quan hệ đối tác sinh lời cao với nhà cung cấp điện toán đám mây toàn cầu.',
        bandLevel: 'BAND_4',
        tags: ['finance', 'business']
      },
      {
        word: 'solvent',
        phonetic: '/ˈsɒl.vənt/',
        wordType: 'ADJECTIVE',
        definition: 'có khả năng thanh toán nợ nần',
        definitionEn: 'having assets in excess of liabilities; able to pay one\'s debts',
        example: 'Strong operating cash flow ensured that the regional airline remained solvent during the recession.',
        exampleVi: 'Dòng tiền hoạt động mạnh mẽ đã đảm bảo hãng hàng không khu vực vẫn có đủ khả năng thanh toán nợ trong suốt thời kỳ suy thoái.',
        bandLevel: 'BAND_4',
        tags: ['finance', 'solvency']
      },
      {
        word: 'reconcile',
        phonetic: '/ˈrek.ən.saɪl/',
        wordType: 'VERB',
        definition: 'đối chiếu tài khoản kế toán',
        definitionEn: 'to compare two sets of records to ensure figures agree and are accurate',
        example: 'The bookkeeper must reconcile monthly bank statements with internal ledger accounts.',
        exampleVi: 'Người ghi chép sổ sách phải đối chiếu sao kê ngân hàng hàng tháng với các tài khoản sổ cái nội bộ.',
        bandLevel: 'BAND_4',
        tags: ['finance', 'accounting']
      },
      {
        word: 'collateral',
        phonetic: '/kəˈlæt.ər.əl/',
        wordType: 'NOUN',
        definition: 'tài sản thế chấp khoản vay',
        definitionEn: 'something pledged as security for repayment of a loan, to be forfeited in the event of default',
        example: 'The manufacturing company pledged its central warehouse as collateral for the bank loan.',
        exampleVi: 'Công ty sản xuất đã thế chấp nhà kho trung tâm của mình làm tài sản bảo đảm cho khoản vay ngân hàng.',
        bandLevel: 'BAND_4',
        tags: ['finance', 'banking']
      },
      {
        word: 'portfolio',
        phonetic: '/pɔːtˈfəʊ.li.əʊ/',
        wordType: 'NOUN',
        definition: 'danh mục đầu tư tài chính',
        definitionEn: 'a range of investments held by a person or organization',
        example: 'The pension fund manager diversified the equity portfolio to minimize downside risk.',
        exampleVi: 'Người quản lý quỹ hưu trí đã đa dạng hóa danh mục vốn cổ phần để giảm thiểu rủi ro thua lỗ.',
        bandLevel: 'BAND_3',
        tags: ['finance', 'investments']
      },
      {
        word: 'overhead',
        phonetic: '/ˈəʊ.və.hed/',
        wordType: 'NOUN',
        definition: 'chi phí quản lý gián tiếp, chi phí cố định',
        definitionEn: 'ongoing business expenses not directly attributed to creating a product or service',
        example: 'Relocating to a modern suburban campus reduced our office rental overhead by thirty percent.',
        exampleVi: 'Việc chuyển địa điểm sang một khu làm việc ngoại ô hiện đại đã giảm 30% chi phí gián tiếp thuê văn phòng của chúng tôi.',
        bandLevel: 'BAND_3',
        tags: ['finance', 'expenses']
      },
      {
        word: 'yield',
        phonetic: '/jiːld/',
        wordType: 'NOUN',
        definition: 'tỷ suất lợi nhuận, lợi tức',
        definitionEn: 'the income return on an investment, such as the interest or dividends received',
        example: 'Corporate treasury bonds currently offer an attractive annual yield of 4.8 percent.',
        exampleVi: 'Trái phiếu kho bạc doanh nghiệp hiện đem lại tỷ suất lợi nhuận hàng năm hấp dẫn ở mức 4,8%.',
        bandLevel: 'BAND_4',
        tags: ['finance', 'bonds']
      }
    ]
  },
  {
    id: 'vocab_it_technology',
    title: 'Information Technology & Systems',
    description: 'Technical terminology for software, cloud infrastructure, cybersecurity, network diagnostics, and database management.',
    targetBand: 'BAND_3',
    isPublic: true,
    cards: [
      {
        word: 'compatible',
        phonetic: '/kəmˈpæt.ə.bəl/',
        wordType: 'ADJECTIVE',
        definition: 'tương thích (phần mềm/hệ thống)',
        definitionEn: 'able to exist or occur together without conflict; able to be used with other hardware or software',
        example: 'The updated ERP system is fully compatible with both Windows and macOS workstations.',
        exampleVi: 'Hệ thống ERP cập nhật hoàn toàn tương thích với cả máy trạm chạy Windows lẫn macOS.',
        bandLevel: 'BAND_3',
        tags: ['it', 'software']
      },
      {
        word: 'configure',
        phonetic: '/kənˈfɪɡ.ər/',
        wordType: 'VERB',
        definition: 'cấu hình hệ thống phần mềm/phần cứng',
        definitionEn: 'to set up or arrange equipment or a system so that it can be used for a particular purpose',
        example: 'Network engineers must configure the firewall to block unauthorized external port access.',
        exampleVi: 'Các kỹ sư mạng phải cấu hình tường lửa để chặn quyền truy cập cổng bên ngoài trái phép.',
        bandLevel: 'BAND_3',
        tags: ['it', 'networking']
      },
      {
        word: 'downtime',
        phonetic: '/ˈdaʊn.taɪm/',
        wordType: 'NOUN',
        definition: 'thời gian hệ thống ngừng hoạt động',
        definitionEn: 'time during which a machine, especially a computer network, is out of action',
        example: 'Routine database server maintenance was scheduled on Sunday night to prevent business downtime.',
        exampleVi: 'Bảo trì máy chủ cơ sở dữ liệu định kỳ đã được lên lịch vào tối Chủ nhật để tránh thời gian ngừng hoạt động kinh doanh.',
        bandLevel: 'BAND_3',
        tags: ['it', 'maintenance']
      },
      {
        word: 'encryption',
        phonetic: '/ɪnˈkrɪp.ʃən/',
        wordType: 'NOUN',
        definition: 'sự mã hóa dữ liệu',
        definitionEn: 'the process of converting information or data into a code, especially to prevent unauthorized access',
        example: 'End-to-end 256-bit encryption safeguards sensitive credit card numbers during checkout.',
        exampleVi: 'Mã hóa đầu cuối 256-bit bảo vệ an toàn các số thẻ tín dụng nhạy cảm trong quá trình thanh toán.',
        bandLevel: 'BAND_4',
        tags: ['it', 'security']
      },
      {
        word: 'troubleshoot',
        phonetic: '/ˈtrʌb.əl.ʃuːt/',
        wordType: 'VERB',
        definition: 'khắc phục sự cố kỹ thuật',
        definitionEn: 'to trace and solve problems in a computer system or piece of machinery',
        example: 'The IT helpdesk technician remoted into my laptop to troubleshoot the VPN connectivity issue.',
        exampleVi: 'Kỹ thuật viên phòng trợ giúp CNTT đã truy cập từ xa vào máy tính xách tay của tôi để khắc phục sự cố kết nối VPN.',
        bandLevel: 'BAND_3',
        tags: ['it', 'support']
      },
      {
        word: 'scalable',
        phonetic: '/ˈskeɪ.lə.bəl/',
        wordType: 'ADJECTIVE',
        definition: 'có khả năng mở rộng quy mô linh hoạt',
        definitionEn: 'able to be changed in size or scale to handle growing amounts of work',
        example: 'We chose a scalable cloud architecture that effortlessly handles holiday traffic spikes.',
        exampleVi: 'Chúng tôi đã chọn kiến trúc đám mây có khả năng mở rộng linh hoạt để xử lý dễ dàng lưu lượng truy cập tăng vọt dịp lễ.',
        bandLevel: 'BAND_4',
        tags: ['it', 'cloud']
      },
      {
        word: 'infrastructure',
        phonetic: '/ˈɪn.frəˌstrʌk.tʃər/',
        wordType: 'NOUN',
        definition: 'cơ sở hạ tầng kỹ thuật số',
        definitionEn: 'the basic systems and services that are necessary for an organization or system to run',
        example: 'Substantial investment in IT infrastructure ensured 99.99 percent uptime for all online banking services.',
        exampleVi: 'Khoản đầu tư đáng kể vào cơ sở hạ tầng CNTT đã đảm bảo thời gian hoạt động 99,99% cho mọi dịch vụ ngân hàng trực tuyến.',
        bandLevel: 'BAND_3',
        tags: ['it', 'systems']
      },
      {
        word: 'vulnerability',
        phonetic: '/ˌvʌl.nər.əˈbɪl.ə.ti/',
        wordType: 'NOUN',
        definition: 'lỗ hổng bảo mật',
        definitionEn: 'a weakness in a computer system or software that can be exploited by an attacker',
        example: 'The security team released an urgent patch to eliminate a critical zero-day vulnerability.',
        exampleVi: 'Đội ngũ an ninh đã phát hành một bản vá khẩn cấp để loại bỏ một lỗ hổng bảo mật zero-day nghiêm trọng.',
        bandLevel: 'BAND_4',
        tags: ['it', 'security']
      },
      {
        word: 'backup',
        phonetic: '/ˈbæk.ʌp/',
        wordType: 'NOUN',
        definition: 'bản sao lưu dữ liệu dự phòng',
        definitionEn: 'a copy of a file or other item of data made in case the original is lost or damaged',
        example: 'Automated nightly backups ensure company files can be recovered instantly after hardware failure.',
        exampleVi: 'Các bản sao lưu tự động hàng đêm đảm bảo các tập tin công ty có thể được phục hồi ngay lập tức sau sự cố phần cứng.',
        bandLevel: 'BAND_2',
        tags: ['it', 'data']
      },
      {
        word: 'retrieve',
        phonetic: '/rɪˈtriːv/',
        wordType: 'VERB',
        definition: 'truy xuất dữ liệu, tìm lại',
        definitionEn: 'to find and bring back stored information from a computer system',
        example: 'The business intelligence tool allows analysts to retrieve sales reports in seconds.',
        exampleVi: 'Công cụ trí tuệ kinh doanh cho phép các chuyên gia phân tích truy xuất các báo cáo bán hàng trong vài giây.',
        bandLevel: 'BAND_3',
        tags: ['it', 'database']
      },
      {
        word: 'bandwidth',
        phonetic: '/ˈbænd.wɪtθ/',
        wordType: 'NOUN',
        definition: 'băng thông truyền dữ liệu',
        definitionEn: 'the capacity for data transfer of an electronic communications system',
        example: 'Upgrading to commercial fiber-optic internet provided ample bandwidth for 4K video conferencing.',
        exampleVi: 'Nâng cấp lên internet cáp quang thương mại đã cung cấp băng thông dồi dào cho các cuộc họp truyền hình 4K.',
        bandLevel: 'BAND_3',
        tags: ['it', 'network']
      },
      {
        word: 'outdated',
        phonetic: '/ˌaʊtˈdeɪ.tɪd/',
        wordType: 'ADJECTIVE',
        definition: 'lỗi thời, quá hạn',
        definitionEn: 'obsolete; no longer useful, valid, or modern',
        example: 'Replacing outdated server hardware decreased power consumption by forty percent.',
        exampleVi: 'Việc thay thế phần cứng máy chủ lỗi thời đã giúp giảm 40% lượng điện năng tiêu thụ.',
        bandLevel: 'BAND_2',
        tags: ['it', 'hardware']
      },
      {
        word: 'authenticate',
        phonetic: '/ɔːˈθen.tɪ.keɪt/',
        wordType: 'VERB',
        definition: 'xác thực danh tính người dùng',
        definitionEn: 'to prove or verify the identity of a user or process',
        example: 'Users must authenticate their login via two-factor authentication on mobile devices.',
        exampleVi: 'Người dùng phải xác thực đăng nhập thông qua xác thực hai yếu tố trên thiết bị di động.',
        bandLevel: 'BAND_3',
        tags: ['it', 'security']
      },
      {
        word: 'migrate',
        phonetic: '/maɪˈɡreɪt/',
        wordType: 'VERB',
        definition: 'chuyển đổi dữ liệu sang nền tảng mới',
        definitionEn: 'to move from one operating environment or database to another',
        example: 'The firm contracted specialists to migrate on-premise servers to AWS cloud environments.',
        exampleVi: 'Công ty đã thuê các chuyên gia để chuyển đổi các máy chủ tại chỗ sang môi trường đám mây AWS.',
        bandLevel: 'BAND_4',
        tags: ['it', 'cloud']
      },
      {
        word: 'malfunction',
        phonetic: '/ˌmælˈfʌŋk.ʃən/',
        wordType: 'NOUN',
        definition: 'sự cố trục trặc kỹ thuật',
        definitionEn: 'a failure to function normally or properly',
        example: 'A hardware malfunction in the primary router interrupted internet access across the third floor.',
        exampleVi: 'Một trục trặc phần cứng ở bộ định tuyến chính đã làm gián đoạn truy cập internet trên khắp tầng ba.',
        bandLevel: 'BAND_3',
        tags: ['it', 'hardware']
      },
      {
        word: 'protocol',
        phonetic: '/ˈprəʊ.tə.kɒl/',
        wordType: 'NOUN',
        definition: 'giao thức mạng máy tính',
        definitionEn: 'a set of rules governing the exchange or transmission of data between devices',
        example: 'HTTPS is the secure communication protocol utilized for all web transactions.',
        exampleVi: 'HTTPS là giao thức truyền thông an toàn được sử dụng cho tất cả các giao dịch trên web.',
        bandLevel: 'BAND_3',
        tags: ['it', 'networking']
      },
      {
        word: 'specifications',
        phonetic: '/ˌspes.ɪ.fɪˈkeɪ.ʃənz/',
        wordType: 'NOUN',
        definition: 'thông số kỹ thuật chi tiết',
        definitionEn: 'a detailed description of the design and materials used to make something',
        example: 'Review the technical specifications before purchasing memory modules for the server.',
        exampleVi: 'Hãy xem lại các thông số kỹ thuật chi tiết trước khi mua các thanh bộ nhớ cho máy chủ.',
        bandLevel: 'BAND_3',
        tags: ['it', 'hardware']
      },
      {
        word: 'deployment',
        phonetic: '/dɪˈplɔɪ.mənt/',
        wordType: 'NOUN',
        definition: 'sự triển khai phần mềm lên hệ thống',
        definitionEn: 'the action of bringing resources or software into effective action and use',
        example: 'The continuous deployment pipeline automatically pushes verified code to staging servers.',
        exampleVi: 'Quy trình triển khai liên tục tự động đẩy mã nguồn đã qua kiểm định lên các máy chủ kiểm thử.',
        bandLevel: 'BAND_4',
        tags: ['it', 'devops']
      }
    ]
  },
  {
    id: 'vocab_healthcare_medical',
    title: 'Healthcare & Medical Services',
    description: 'Medical and wellness vocabulary covering clinical procedures, pharmaceuticals, health insurance, occupational safety, and patient care.',
    targetBand: 'BAND_3',
    isPublic: true,
    cards: [
      {
        word: 'prescription',
        phonetic: '/prɪˈskrɪp.ʃən/',
        wordType: 'NOUN',
        definition: 'đơn thuốc, toa thuốc',
        definitionEn: 'an instruction written by a medical practitioner authorizing a patient to be issued with a medicine',
        example: 'The physician wrote a prescription for antibiotics to treat the respiratory infection.',
        exampleVi: 'Bác sĩ đã kê một đơn thuốc kháng sinh để điều trị bệnh nhiễm trùng đường hô hấp.',
        bandLevel: 'BAND_2',
        tags: ['health', 'medical']
      },
      {
        word: 'practitioner',
        phonetic: '/prækˈtɪʃ.ən.ər/',
        wordType: 'NOUN',
        definition: 'bác sĩ đa khoa, người hành nghề y',
        definitionEn: 'a person actively engaged in an art, discipline, or profession, especially medicine',
        example: 'Employees should visit a registered medical practitioner to obtain an official medical certificate.',
        exampleVi: 'Nhân viên nên đến gặp bác sĩ hành nghề y đã đăng ký để xin giấy chứng nhận y tế chính thức.',
        bandLevel: 'BAND_3',
        tags: ['health', 'doctor']
      },
      {
        word: 'coverage',
        phonetic: '/ˈkʌv.ər.ɪdʒ/',
        wordType: 'NOUN',
        definition: 'phạm vi bảo hiểm y tế',
        definitionEn: 'the amount of protection given by an insurance policy',
        example: 'Our corporate health plan provides comprehensive dental and optical insurance coverage.',
        exampleVi: 'Gói bảo hiểm sức khỏe doanh nghiệp của chúng tôi cung cấp phạm vi bảo hiểm nha khoa và thị lực toàn diện.',
        bandLevel: 'BAND_3',
        tags: ['health', 'insurance']
      },
      {
        word: 'preventive',
        phonetic: '/prɪˈven.tɪv/',
        wordType: 'ADJECTIVE',
        definition: 'mang tính phòng ngừa bệnh',
        definitionEn: 'designed to keep something undesirable, such as illness, from occurring',
        example: 'The company sponsors free annual preventive health screenings for all factory workers.',
        exampleVi: 'Công ty tài trợ khám sức khỏe phòng ngừa định kỳ hàng năm miễn phí cho toàn bộ công nhân nhà máy.',
        bandLevel: 'BAND_3',
        tags: ['health', 'wellness']
      },
      {
        word: 'clinic',
        phonetic: '/ˈklɪn.ɪk/',
        wordType: 'NOUN',
        definition: 'phòng khám chữa bệnh',
        definitionEn: 'an establishment or hospital department where outpatients are given medical treatment',
        example: 'The corporate park opened an on-site health clinic to treat minor workplace injuries.',
        exampleVi: 'Khu công viên văn phòng đã mở một phòng khám sức khỏe tại chỗ để điều trị các chấn thương nhẹ tại nơi làm việc.',
        bandLevel: 'BAND_2',
        tags: ['health', 'facilities']
      },
      {
        word: 'sanitation',
        phonetic: '/ˌsæn.ɪˈteɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'vệ sinh dịch tễ, vệ sinh môi trường',
        definitionEn: 'conditions relating to public health, especially the provision of clean drinking water and sewage disposal',
        example: 'Food processing facilities must maintain the highest standards of hygiene and sanitation.',
        exampleVi: 'Các cơ sở chế biến thực phẩm phải duy trì các tiêu chuẩn vệ sinh dịch tễ và an toàn cao nhất.',
        bandLevel: 'BAND_3',
        tags: ['health', 'safety']
      },
      {
        word: 'symptom',
        phonetic: '/ˈsɪmp.təm/',
        wordType: 'NOUN',
        definition: 'triệu chứng bệnh',
        definitionEn: 'a physical or mental feature indicating a condition of disease',
        example: 'Staff members exhibiting flu symptoms are instructed to work from home.',
        exampleVi: 'Những nhân viên có triệu chứng cúm được hướng dẫn làm việc tại nhà.',
        bandLevel: 'BAND_2',
        tags: ['health', 'medical']
      },
      {
        word: 'pharmaceutical',
        phonetic: '/ˌfɑː.məˈsjuː.tɪ.kəl/',
        wordType: 'ADJECTIVE',
        definition: 'thuộc về dược phẩm',
        definitionEn: 'relating to medicinal drugs, or their preparation, use, or sale',
        example: 'The pharmaceutical corporation invested millions into research for a groundbreaking vaccine.',
        exampleVi: 'Tập đoàn dược phẩm đã đầu tư hàng triệu đô la vào nghiên cứu một loại vắc-xin mang tính đột phá.',
        bandLevel: 'BAND_3',
        tags: ['health', 'industry']
      },
      {
        word: 'ergonomic',
        phonetic: '/ˌɜː.ɡəˈnɒm.ɪk/',
        wordType: 'ADJECTIVE',
        definition: 'công thái học (thiết kế phù hợp với cơ thể)',
        definitionEn: 'designed for efficiency and comfort in the working environment',
        example: 'Ergonomic office keyboards help reduce the risk of repetitive strain injuries among programmers.',
        exampleVi: 'Bàn phím văn phòng công thái học giúp giảm nguy cơ chấn thương do căng thẳng lặp đi lặp lại ở các lập trình viên.',
        bandLevel: 'BAND_4',
        tags: ['health', 'ergonomics']
      },
      {
        word: 'consultation',
        phonetic: '/ˌkɒn.sʌlˈteɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'buổi hội chẩn, tư vấn sức khỏe',
        definitionEn: 'a meeting with an expert or doctor, such as a medical specialist, in order to seek advice',
        example: 'The specialist offers virtual consultations for employees working overseas.',
        exampleVi: 'Bác sĩ chuyên khoa cung cấp các buổi tư vấn trực tuyến cho những nhân viên làm việc ở nước ngoài.',
        bandLevel: 'BAND_3',
        tags: ['health', 'advice']
      },
      {
        word: 'first-aid',
        phonetic: '/ˌfɜːst ˈeɪd/',
        wordType: 'NOUN',
        definition: 'sơ cứu y tế ban đầu',
        definitionEn: 'help given to a sick or injured person until full medical treatment is available',
        example: 'Fully stocked first-aid kits are stationed on every floor near the fire exits.',
        exampleVi: 'Các hộp sơ cứu được trang bị đầy đủ thuốc men được bố trí ở mỗi tầng gần các lối thoát hiểm chống cháy.',
        bandLevel: 'BAND_2',
        tags: ['health', 'safety']
      },
      {
        word: 'dosage',
        phonetic: '/ˈdəʊ.sɪdʒ/',
        wordType: 'NOUN',
        definition: 'liều lượng thuốc',
        definitionEn: 'the size or frequency of a dose of a medicine or drug',
        example: 'Do not exceed the recommended daily dosage stated on the medication label.',
        exampleVi: 'Không được vượt quá liều lượng thuốc hàng ngày được khuyến cáo ghi trên nhãn thuốc.',
        bandLevel: 'BAND_3',
        tags: ['health', 'medicine']
      },
      {
        word: 'admission',
        phonetic: '/ədˈmɪʃ.ən/',
        wordType: 'NOUN',
        definition: 'việc nhập viện',
        definitionEn: 'the process or fact of entering or being allowed to enter a place or organization, especially a hospital',
        example: 'Hospital admission procedures were expedited for emergency room patients.',
        exampleVi: 'Thủ tục nhập viện đã được xúc tiến nhanh chóng cho các bệnh nhân tại phòng cấp cứu.',
        bandLevel: 'BAND_3',
        tags: ['health', 'hospital']
      },
      {
        word: 'chronic',
        phonetic: '/ˈkrɒn.ɪk/',
        wordType: 'ADJECTIVE',
        definition: 'mãn tính (kéo dài kinh niên)',
        definitionEn: 'persisting for a long time or constantly recurring',
        example: 'The wellness seminar focused on managing stress to prevent chronic health conditions.',
        exampleVi: 'Hội thảo sức khỏe tập trung vào việc quản lý căng thẳng để ngăn ngừa các tình trạng bệnh mãn tính.',
        bandLevel: 'BAND_4',
        tags: ['health', 'wellness']
      },
      {
        word: 'disability',
        phonetic: '/ˌdɪs.əˈbɪl.ə.ti/',
        wordType: 'NOUN',
        definition: 'sự thương tật, khuyết tật lao động',
        definitionEn: 'a physical or mental condition that limits a person\'s movements, senses, or activities',
        example: 'Short-term disability insurance replaces sixty percent of an employee\'s wages during illness.',
        exampleVi: 'Bảo hiểm thương tật ngắn hạn thay thế 60% tiền lương của nhân viên trong suốt thời gian ốm đau.',
        bandLevel: 'BAND_3',
        tags: ['health', 'benefits']
      },
      {
        word: 'nutrition',
        phonetic: '/njuːˈtrɪʃ.ən/',
        wordType: 'NOUN',
        definition: 'chế độ dinh dưỡng',
        definitionEn: 'the process of providing or obtaining the food necessary for health and growth',
        example: 'The company cafeteria revised its menu in consultation with a certified nutrition specialist.',
        exampleVi: 'Nhà ăn công ty đã sửa đổi thực đơn sau khi tham khảo ý kiến của chuyên gia dinh dưỡng được chứng nhận.',
        bandLevel: 'BAND_2',
        tags: ['health', 'wellness']
      },
      {
        word: 'allergic',
        phonetic: '/əˈlɜː.dʒɪk/',
        wordType: 'ADJECTIVE',
        definition: 'bị dị ứng',
        definitionEn: 'caused by or relating to an allergy',
        example: 'Caterers must be informed if any attendees are allergic to nuts or dairy products.',
        exampleVi: 'Đơn vị phục vụ tiệc phải được thông báo nếu có bất kỳ người tham dự nào bị dị ứng với các loại hạt hoặc sản phẩm từ sữa.',
        bandLevel: 'BAND_2',
        tags: ['health', 'safety']
      },
      {
        word: 'rehabilitation',
        phonetic: '/ˌriː.həˌbɪl.ɪˈteɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'phục hồi chức năng sau chấn thương',
        definitionEn: 'the action of restoring someone to health or normal life through training and therapy',
        example: 'Physical rehabilitation programs assist employees in returning to work safely after injury.',
        exampleVi: 'Các chương trình phục hồi chức năng thể chất hỗ trợ nhân viên quay trở lại làm việc an toàn sau chấn thương.',
        bandLevel: 'BAND_4',
        tags: ['health', 'therapy']
      }
    ]
  },
  {
    id: 'vocab_retail_sales',
    title: 'Retail, Sales & Customer Service',
    description: 'Practical vocabulary for retail operations, discount promotions, inventory clearance, returns, warranties, and client satisfaction.',
    targetBand: 'BAND_2',
    isPublic: true,
    cards: [
      {
        word: 'clearance',
        phonetic: '/ˈklɪə.rəns/',
        wordType: 'NOUN',
        definition: 'xả hàng, giải phóng hàng tồn',
        definitionEn: 'the disposal of unwanted goods or inventory at reduced prices',
        example: 'The electronics outlet is holding a massive end-of-season clearance sale this weekend.',
        exampleVi: 'Cửa hàng điện máy đang tổ chức một đợt bán hàng xả kho cuối mùa quy mô lớn vào cuối tuần này.',
        bandLevel: 'BAND_2',
        tags: ['retail', 'sales']
      },
      {
        word: 'voucher',
        phonetic: '/ˈvaʊ.tʃər/',
        wordType: 'NOUN',
        definition: 'phiếu quà tặng, phiếu giảm giá',
        definitionEn: 'a small printed piece of paper or code that entitles the holder to a discount or goods',
        example: 'Shoppers who spend over fifty dollars receive a complimentary ten-dollar grocery voucher.',
        exampleVi: 'Người mua sắm chi tiêu trên 50 đô la sẽ nhận được một phiếu mua hàng tạp hóa 10 đô la miễn phí.',
        bandLevel: 'BAND_2',
        tags: ['retail', 'promotions']
      },
      {
        word: 'wholesale',
        phonetic: '/ˈhəʊl.seɪl/',
        wordType: 'ADJECTIVE',
        definition: 'bán buôn, bán sỉ',
        definitionEn: 'the selling of goods in large quantities to be retailed by others',
        example: 'Restaurants can purchase fresh organic produce directly at wholesale prices from local farms.',
        exampleVi: 'Các nhà hàng có thể mua nông sản hữu cơ tươi trực tiếp với giá bán buôn từ các nông trại địa phương.',
        bandLevel: 'BAND_3',
        tags: ['retail', 'commerce']
      },
      {
        word: 'refund',
        phonetic: '/ˈriː.fʌnd/',
        wordType: 'NOUN',
        definition: 'khoản tiền hoàn lại',
        definitionEn: 'a repayment of a sum of money, typically to a dissatisfied customer',
        example: 'Customers may request a full refund within thirty days by showing the original register receipt.',
        exampleVi: 'Khách hàng có thể yêu cầu hoàn lại tiền đầy đủ trong vòng 30 ngày bằng cách xuất trình biên lai gốc.',
        bandLevel: 'BAND_2',
        tags: ['retail', 'customer-service']
      },
      {
        word: 'patron',
        phonetic: '/ˈpeɪ.trən/',
        wordType: 'NOUN',
        definition: 'khách hàng quen, người bảo trợ',
        definitionEn: 'a person who gives financial or other support to a person, organization, cause, or shop',
        example: 'The bookstore offered an exclusive preview night for its loyal club patrons.',
        exampleVi: 'Hiệu sách đã tổ chức một đêm xem trước độc quyền dành cho các khách hàng quen thuộc câu lạc bộ.',
        bandLevel: 'BAND_3',
        tags: ['retail', 'customers']
      },
      {
        word: 'restock',
        phonetic: '/ˌriːˈstɒk/',
        wordType: 'VERB',
        definition: 'bổ sung hàng lên kệ, nhập thêm hàng',
        definitionEn: 'to replenish with fresh stock or supplies',
        example: 'Supermarket staff work overnight to restock shelves with dairy and bakery goods.',
        exampleVi: 'Nhân viên siêu thị làm việc qua đêm để bổ sung hàng lên kệ đối với các mặt hàng sữa và bánh mì.',
        bandLevel: 'BAND_2',
        tags: ['retail', 'inventory']
      },
      {
        word: 'inquiry',
        phonetic: '/ɪnˈkwaɪə.ri/',
        wordType: 'NOUN',
        definition: 'thắc mắc, câu hỏi của khách hàng',
        definitionEn: 'an act of asking for information from customer support',
        example: 'Our support team responds to every online customer inquiry within two hours.',
        exampleVi: 'Đội ngũ hỗ trợ của chúng tôi phản hồi mọi câu hỏi thắc mắc trực tuyến của khách hàng trong vòng hai giờ.',
        bandLevel: 'BAND_2',
        tags: ['retail', 'support']
      },
      {
        word: 'discount',
        phonetic: '/ˈdɪs.kaʊnt/',
        wordType: 'NOUN',
        definition: 'chiết khấu, giảm giá',
        definitionEn: 'a deduction from the usual cost of something',
        example: 'Students and senior citizens are entitled to a fifteen percent discount on all book purchases.',
        exampleVi: 'Học sinh sinh viên và người cao tuổi được hưởng mức giảm giá 15% cho tất cả các đơn mua sách.',
        bandLevel: 'BAND_1',
        tags: ['retail', 'pricing']
      },
      {
        word: 'merchandise',
        phonetic: '/ˈmɜː.tʃən.daɪs/',
        wordType: 'NOUN',
        definition: 'hàng hóa bán lẻ',
        definitionEn: 'goods to be bought and sold in commerce',
        example: 'The flagship store displays its newest seasonal merchandise in eye-catching window arrangements.',
        exampleVi: 'Cửa hàng hàng đầu trưng bày hàng hóa mùa mới nhất trong các ô cửa kính bắt mắt.',
        bandLevel: 'BAND_3',
        tags: ['retail', 'goods']
      },
      {
        word: 'guarantee',
        phonetic: '/ˌɡær.ənˈtiː/',
        wordType: 'VERB',
        definition: 'cam kết, đảm bảo chất lượng',
        definitionEn: 'to provide a formal assurance that certain conditions will be fulfilled',
        example: 'We guarantee that all electronics sold in our store are 100 percent authentic.',
        exampleVi: 'Chúng tôi đảm bảo rằng tất cả các sản phẩm điện tử bán trong cửa hàng đều là hàng chính hãng 100%.',
        bandLevel: 'BAND_2',
        tags: ['retail', 'quality']
      },
      {
        word: 'receipt',
        phonetic: '/rɪˈsiːt/',
        wordType: 'NOUN',
        definition: 'biên lai, hóa đơn mua hàng',
        definitionEn: 'a written acknowledgment of having received a specified amount of money or goods',
        example: 'A digital copy of your purchase receipt was automatically sent to your registered email.',
        exampleVi: 'Bản sao kỹ thuật số biên lai mua hàng của bạn đã tự động được gửi tới email đã đăng ký.',
        bandLevel: 'BAND_1',
        tags: ['retail', 'billing']
      },
      {
        word: 'complaint',
        phonetic: '/kəmˈpleɪnt/',
        wordType: 'NOUN',
        definition: 'khiếu nại của khách hàng',
        definitionEn: 'a statement that a situation is unsatisfactory or unacceptable',
        example: 'The store manager personally addressed the customer complaint regarding late package delivery.',
        exampleVi: 'Quản lý cửa hàng đã đích thân giải quyết khiếu nại của khách hàng về việc giao kiện hàng trễ.',
        bandLevel: 'BAND_2',
        tags: ['retail', 'customer-service']
      },
      {
        word: 'installment',
        phonetic: '/ɪnˈstɔːl.mənt/',
        wordType: 'NOUN',
        definition: 'trả góp từng kỳ',
        definitionEn: 'a sum of money due as one of several equal payments for something, spread over an agreed period',
        example: 'Customers can buy the home theater system in twelve monthly interest-free installments.',
        exampleVi: 'Khách hàng có thể mua hệ thống rạp hát gia đình theo mười hai kỳ trả góp hàng tháng không lãi suất.',
        bandLevel: 'BAND_3',
        tags: ['retail', 'payment']
      },
      {
        word: 'defect',
        phonetic: '/ˈdiː.fekt/',
        wordType: 'NOUN',
        definition: 'lỗi kỹ thuật, khuyết tật của sản phẩm',
        definitionEn: 'a shortcoming, imperfection, or lack of perfection in a manufactured product',
        example: 'The company recalled five thousand coffee makers due to an electrical heating defect.',
        exampleVi: 'Công ty đã thu hồi 5.000 máy pha cà phê do lỗi gia nhiệt về điện.',
        bandLevel: 'BAND_3',
        tags: ['retail', 'quality']
      },
      {
        word: 'satisfaction',
        phonetic: '/ˌsæt.ɪsˈfæk.ʃən/',
        wordType: 'NOUN',
        definition: 'sự hài lòng của người tiêu dùng',
        definitionEn: 'fulfillment of one\'s wishes, expectations, or needs, or the pleasure derived from this',
        example: 'Client satisfaction remains the primary metric for evaluating our customer support agents.',
        exampleVi: 'Sự hài lòng của khách hàng vẫn là chỉ số đo lường chính để đánh giá các chuyên viên hỗ trợ của chúng tôi.',
        bandLevel: 'BAND_2',
        tags: ['retail', 'kpi']
      },
      {
        word: 'express',
        phonetic: '/ɪkˈspres/',
        wordType: 'ADJECTIVE',
        definition: 'chuyển phát nhanh, tốc hành',
        definitionEn: 'operating at high speed or traveling with few or no stops',
        example: 'For urgent orders, customers can opt for express delivery to receive packages within 24 hours.',
        exampleVi: 'Đối với các đơn hàng khẩn cấp, khách hàng có thể chọn giao hàng chuyển phát nhanh để nhận gói hàng trong 24 giờ.',
        bandLevel: 'BAND_2',
        tags: ['retail', 'shipping']
      },
      {
        word: 'bargain',
        phonetic: '/ˈbɑː.ɡɪn/',
        wordType: 'NOUN',
        definition: 'món hàng giá hời',
        definitionEn: 'a thing bought or offered for sale more cheaply than is usual or expected',
        example: 'At half the retail price, this designer winter coat is an extraordinary bargain.',
        exampleVi: 'Với mức giá chỉ bằng một nửa giá bán lẻ, chiếc áo khoác mùa đông của nhà thiết kế này là một món hàng giá hời đặc biệt.',
        bandLevel: 'BAND_2',
        tags: ['retail', 'deals']
      },
      {
        word: 'loyalty card',
        phonetic: '/ˈlɔɪ.əl.ti ˌkɑːd/',
        wordType: 'NOUN',
        definition: 'thẻ khách hàng thân thiết',
        definitionEn: 'a card issued by a store to one of its customers, used to record points earned',
        example: 'Present your loyalty card at the cashier desk to collect reward points on every transaction.',
        exampleVi: 'Xuất trình thẻ khách hàng thân thiết tại quầy thu ngân để tích lũy điểm thưởng trên mỗi giao dịch.',
        bandLevel: 'BAND_2',
        tags: ['retail', 'rewards']
      }
    ]
  },
  {
    id: 'vocab_manufacturing_logistics',
    title: 'Manufacturing, Logistics & Quality Control',
    description: 'Technical terminology for assembly lines, warehousing, supply chain distribution, safety compliance, and ISO quality standards.',
    targetBand: 'BAND_3',
    isPublic: true,
    cards: [
      {
        word: 'assembly line',
        phonetic: '/əˈsem.bli ˌlaɪn/',
        wordType: 'NOUN',
        definition: 'dây chuyền lắp ráp công nghiệp',
        definitionEn: 'a series of workers and machines in a factory by which a succession of identical items is progressively assembled',
        example: 'The automotive plant introduced robotic welders along the main assembly line.',
        exampleVi: 'Nhà máy sản xuất ô tô đã đưa máy hàn robot vào hoạt động dọc theo dây chuyền lắp ráp chính.',
        bandLevel: 'BAND_3',
        tags: ['manufacturing', 'factory']
      },
      {
        word: 'consignment',
        phonetic: '/kənˈsaɪn.mənt/',
        wordType: 'NOUN',
        definition: 'lô hàng gửi đi, chuyến hàng ký gửi',
        definitionEn: 'a batch of goods destined for or delivered to someone',
        example: 'The first consignment of industrial solar panels arrived safely at the port of Hai Phong.',
        exampleVi: 'Lô hàng tấm pin năng lượng mặt trời công nghiệp đầu tiên đã cập cảng Hải Phòng an toàn.',
        bandLevel: 'BAND_4',
        tags: ['manufacturing', 'shipping']
      },
      {
        word: 'warehouse',
        phonetic: '/ˈweə.haʊs/',
        wordType: 'NOUN',
        definition: 'nhà kho tổng, kho hàng hóa',
        definitionEn: 'a large building where raw materials or manufactured goods may be stored prior to distribution',
        example: 'Our central logistics warehouse utilizes automated sorting conveyors for rapid dispatch.',
        exampleVi: 'Kho hậu cần trung tâm của chúng tôi sử dụng băng chuyền phân loại tự động để điều phối hàng hóa nhanh chóng.',
        bandLevel: 'BAND_2',
        tags: ['manufacturing', 'storage']
      },
      {
        word: 'logistics',
        phonetic: '/ləˈdʒɪs.tɪks/',
        wordType: 'NOUN',
        definition: 'hậu cần, quản trị chuỗi cung ứng',
        definitionEn: 'the detailed coordination of a complex operation involving many people, facilities, or supplies',
        example: 'The company hired a global logistics specialist to streamline its Asian distribution network.',
        exampleVi: 'Công ty đã thuê một chuyên gia hậu cần toàn cầu để tối ưu hóa mạng lưới phân phối tại Châu Á.',
        bandLevel: 'BAND_3',
        tags: ['manufacturing', 'distribution']
      },
      {
        word: 'freight',
        phonetic: '/freɪt/',
        wordType: 'NOUN',
        definition: 'hàng hóa chuyên chở (đường biển/hàng không)',
        definitionEn: 'goods transported in bulk by truck, train, ship, or aircraft',
        example: 'Air freight is more expensive than sea cargo but reduces delivery lead times from weeks to days.',
        exampleVi: 'Vận chuyển hàng hóa bằng đường hàng không đắt hơn đường biển nhưng giúp giảm thời gian giao hàng từ vài tuần xuống còn vài ngày.',
        bandLevel: 'BAND_3',
        tags: ['manufacturing', 'shipping']
      },
      {
        word: 'inventory',
        phonetic: '/ˈɪn.vən.tər.i/',
        wordType: 'NOUN',
        definition: 'lượng hàng trong kho, việc kiểm kê',
        definitionEn: 'a complete list of items such as property, goods in stock, or the contents of a building',
        example: 'Just-in-time manufacturing keeps inventory carrying costs to an absolute minimum.',
        exampleVi: 'Sản xuất tức thời (Just-in-time) giúp giảm chi phí lưu giữ hàng trong kho xuống mức tối thiểu tuyệt đối.',
        bandLevel: 'BAND_3',
        tags: ['manufacturing', 'operations']
      },
      {
        word: 'procurement',
        phonetic: '/prəˈkjʊə.mənt/',
        wordType: 'NOUN',
        definition: 'sự thu mua nguyên vật liệu, mua sắm',
        definitionEn: 'the action of obtaining or procuring goods and services for production',
        example: 'The procurement manager negotiates volume discounts directly with raw steel mills.',
        exampleVi: 'Người quản lý thu mua đàm phán mức chiết khấu khối lượng trực tiếp với các nhà máy thép thô.',
        bandLevel: 'BAND_4',
        tags: ['manufacturing', 'sourcing']
      },
      {
        word: 'calibrate',
        phonetic: '/ˈkæl.ɪ.breɪt/',
        wordType: 'VERB',
        definition: 'hiệu chuẩn máy móc, căn chỉnh thiết bị',
        definitionEn: 'to mark or adjust a gauge or instrument with a standard scale of readings',
        example: 'Technicians must calibrate optical measuring sensors every morning before production commences.',
        exampleVi: 'Các kỹ thuật viên phải hiệu chuẩn các cảm biến đo lường quang học mỗi buổi sáng trước khi quá trình sản xuất bắt đầu.',
        bandLevel: 'BAND_4',
        tags: ['manufacturing', 'quality']
      },
      {
        word: 'dispatch',
        phonetic: '/dɪˈspætʃ/',
        wordType: 'VERB',
        definition: 'gửi đi, điều động vận chuyển',
        definitionEn: 'to send off to a destination or for a purpose',
        example: 'Orders placed before 2:00 PM are dispatched from the distribution center on the same day.',
        exampleVi: 'Các đơn hàng đặt trước 2:00 chiều sẽ được gửi đi từ trung tâm phân phối ngay trong cùng ngày.',
        bandLevel: 'BAND_3',
        tags: ['manufacturing', 'logistics']
      },
      {
        word: 'compliance',
        phonetic: '/kəmˈplaɪ.əns/',
        wordType: 'NOUN',
        definition: 'sự tuân thủ tiêu chuẩn/quy định',
        definitionEn: 'the state or fact of according with or meeting rules or standards',
        example: 'The chemical plant underwent a safety audit to confirm strict compliance with environmental laws.',
        exampleVi: 'Nhà máy hóa chất đã trải qua một cuộc kiểm tra an toàn để xác nhận sự tuân thủ nghiêm ngặt luật môi trường.',
        bandLevel: 'BAND_3',
        tags: ['manufacturing', 'standards']
      },
      {
        word: 'output',
        phonetic: '/ˈaʊt.pʊt/',
        wordType: 'NOUN',
        definition: 'sản lượng sản xuất',
        definitionEn: 'the amount of something produced by a person, machine, or industry',
        example: 'Factory output rose by twelve percent following the installation of faster conveyor belts.',
        exampleVi: 'Sản lượng nhà máy đã tăng 12% sau khi lắp đặt các băng chuyền có tốc độ nhanh hơn.',
        bandLevel: 'BAND_3',
        tags: ['manufacturing', 'productivity']
      },
      {
        word: 'overhaul',
        phonetic: '/ˈəʊ.və.hɔːl/',
        wordType: 'VERB',
        definition: 'đại tu, kiểm tra và bảo dưỡng toàn diện',
        definitionEn: 'to take apart a piece of machinery or equipment in order to examine it and repair it if necessary',
        example: 'Engineers will overhaul turbine generator unit three during the scheduled plant shutdown.',
        exampleVi: 'Các kỹ sư sẽ đại tu tổ máy phát tuabin số 3 trong đợt dừng máy theo kế hoạch của nhà máy.',
        bandLevel: 'BAND_4',
        tags: ['manufacturing', 'maintenance']
      },
      {
        word: 'raw materials',
        phonetic: '/ˌrɔː məˈtɪə.ri.əlz/',
        wordType: 'NOUN',
        definition: 'nguyên liệu thô đầu vào',
        definitionEn: 'the basic material from which a product is made',
        example: 'A sudden price hike in raw materials compressed manufacturing profit margins.',
        exampleVi: 'Sự tăng giá đột ngột của các nguyên liệu thô đầu vào đã thu hẹp biên lợi nhuận sản xuất.',
        bandLevel: 'BAND_2',
        tags: ['manufacturing', 'supply']
      },
      {
        word: 'specification',
        phonetic: '/ˌspes.ɪ.fɪˈkeɪ.ʃən/',
        wordType: 'NOUN',
        definition: 'tiêu chuẩn kỹ thuật quy định',
        definitionEn: 'a detailed description of the design and materials used to make something',
        example: 'Every metal component must be fabricated according to exact client specifications.',
        exampleVi: 'Mỗi linh kiện kim loại đều phải được chế tạo theo đúng các tiêu chuẩn kỹ thuật chính xác của khách hàng.',
        bandLevel: 'BAND_3',
        tags: ['manufacturing', 'quality']
      },
      {
        word: 'lead time',
        phonetic: '/ˈliːd ˌtaɪm/',
        wordType: 'NOUN',
        definition: 'thời gian từ lúc đặt hàng đến khi nhận hàng',
        definitionEn: 'the time between the initiation and completion of a production process',
        example: 'By sourcing parts locally, the factory cut customer lead time from six weeks to twelve days.',
        exampleVi: 'Bằng cách tìm nguồn linh kiện tại địa phương, nhà máy đã cắt giảm thời gian giao hàng từ 6 tuần xuống còn 12 ngày.',
        bandLevel: 'BAND_4',
        tags: ['manufacturing', 'supply-chain']
      },
      {
        word: 'defect',
        phonetic: '/ˈdiː.fekt/',
        wordType: 'NOUN',
        definition: 'khuyết tật sản phẩm, phế phẩm',
        definitionEn: 'an imperfection or flaw in a manufactured product',
        example: 'Optical inspection cameras automatically flag any microscopic defects on circuit boards.',
        exampleVi: 'Camera kiểm tra quang học tự động đánh dấu mọi khuyết tật siêu nhỏ trên các bo mạch điện tử.',
        bandLevel: 'BAND_3',
        tags: ['manufacturing', 'qc']
      },
      {
        word: 'carrier',
        phonetic: '/ˈkær.i.ər/',
        wordType: 'NOUN',
        definition: 'hãng vận chuyển hàng hóa',
        definitionEn: 'a person or company that undertakes the professional conveyance of goods or people',
        example: 'We partner with an insured maritime carrier to ship heavy machinery across the Pacific.',
        exampleVi: 'Chúng tôi hợp tác với một hãng vận chuyển hàng hải có bảo hiểm để chở máy móc hạng nặng qua Thái Bình Dương.',
        bandLevel: 'BAND_3',
        tags: ['manufacturing', 'shipping']
      },
      {
        word: 'yield',
        phonetic: '/jiːld/',
        wordType: 'NOUN',
        definition: 'sản lượng thành phẩm đạt chuẩn',
        definitionEn: 'the amount of an agricultural or industrial product produced',
        example: 'The wafer manufacturing plant achieved a 98 percent semiconductor fabrication yield.',
        exampleVi: 'Nhà máy sản xuất tấm wafer đã đạt tỷ lệ sản lượng bán dẫn thành phẩm đạt chuẩn là 98%.',
        bandLevel: 'BAND_4',
        tags: ['manufacturing', 'metrics']
      }
    ]
  }
];

// ============================================================================
// 2. GRAMMAR DATASET (10 Core Topics with Complete Theory & 4-5 MC Exercises)
// ============================================================================

const grammarTopics = [
  {
    id: 'grammar_verb_tenses',
    title: 'Present and Past Verb Tenses in Business',
    description: 'Thì hiện tại và quá khứ trong ngữ cảnh công việc: phân biệt thì hiện tại hoàn thành, quá khứ đơn và hiện tại tiếp diễn.',
    targetBand: 'BAND_2',
    orderIndex: 1,
    rule: `# Present and Past Verb Tenses in Business English

## 1. Present Simple vs. Present Continuous
- **Hiện tại đơn (Present Simple)**: Dùng cho thói quen hàng ngày, lịch trình định sẵn, sự thật khách quan hoặc chính sách công ty.
  - *Dấu hiệu*: \`always\`, \`regularly\`, \`every month\`, \`annually\`, \`as a rule\`.
  - *Ví dụ*: The accounting department **reviews** expense reports every Friday.
- **Hiện tại tiếp diễn (Present Continuous)**: Dùng cho hành động đang diễn ra tại thời điểm nói hoặc xu hướng tạm thời trong kỳ hiện tại.
  - *Dấu hiệu*: \`currently\`, \`at present\`, \`now\`, \`this quarter\`.
  - *Ví dụ*: We **are currently renovating** our regional showroom.

## 2. Past Simple vs. Present Perfect
- **Quá khứ đơn (Past Simple)**: Diễn tả hành động đã hoàn tất tại một thời điểm xác định trong quá khứ.
  - *Dấu hiệu*: \`yesterday\`, \`last year\`, \`in 2023\`, \`two days ago\`.
  - *Ví dụ*: The firm **opened** its first international subsidiary in 2021.
- **Hiện tại hoàn thành (Present Perfect)**: Diễn tả hành động bắt đầu trong quá khứ và vẫn tiếp diễn, hoặc kết quả còn ảnh hưởng tới hiện tại.
  - *Dấu hiệu*: \`since\`, \`for\`, \`already\`, \`recently\`, \`lately\`, \`over the past three years\`.
  - *Ví dụ*: Mr. Henderson **has served** as CEO since 2018.`,
    formula: 'S + have/has + V3/ed + since [point of time] | S + V2/ed + [specific past time]',
    examples: [
      {
        sentence: 'Ms. Alvarez has worked at this marketing agency for over eight years.',
        translation: 'Bà Alvarez đã làm việc tại công ty quảng cáo này hơn tám năm.',
        highlight: 'has worked'
      },
      {
        sentence: 'The board approved the annual budget at yesterday’s special meeting.',
        translation: 'Hội đồng quản trị đã thông qua ngân sách thường niên tại cuộc họp đặc biệt ngày hôm qua.',
        highlight: 'approved'
      },
      {
        sentence: 'Our IT department is currently upgrading the primary database servers.',
        translation: 'Phòng CNTT của chúng tôi hiện đang nâng cấp các máy chủ cơ sở dữ liệu chính.',
        highlight: 'is currently upgrading'
      }
    ],
    tips: 'Trong Part 5, khi thấy cụm từ "over the past + [khoảng thời gian]" (e.g. over the past decade, over the last few months), hãy luôn chọn thì Hiện tại hoàn thành (Present Perfect).',
    commonErrors: [
      {
        wrong: 'He has visited our office yesterday.',
        correct: 'He visited our office yesterday.',
        explanation: 'Yesterday là thời điểm quá khứ xác định, phải chia thì Quá khứ đơn (Past Simple), không dùng Hiện tại hoàn thành.'
      },
      {
        wrong: 'The committee is meeting every Monday morning.',
        correct: 'The committee meets every Monday morning.',
        explanation: 'Thói quen lặp lại theo lịch trình cố định (every Monday) phải dùng thì Hiện tại đơn.'
      }
    ],
    exercises: [
      {
        question: 'Over the past three years, our customer service division ________ more than one million caller inquiries.',
        options: ['handles', 'handled', 'has handled', 'is handling'],
        correctAnswer: 'C',
        explanation: 'Cụm từ "Over the past three years" là dấu hiệu kinh điển của thì Hiện tại hoàn thành (Present Perfect), biểu thị hành động kéo dài liên tục đến hiện tại.',
        difficulty: 2
      },
      {
        question: 'Mr. Tanaka ________ the signed purchase agreement to the vendor yesterday afternoon.',
        options: ['returns', 'returned', 'has returned', 'is returning'],
        correctAnswer: 'B',
        explanation: 'Mốc thời gian xác định trong quá khứ "yesterday afternoon" yêu cầu dùng thì Quá khứ đơn (returned).',
        difficulty: 1
      },
      {
        question: 'At present, the engineering team ________ the structural integrity of the bridge prototype.',
        options: ['tests', 'is testing', 'tested', 'has tested'],
        correctAnswer: 'B',
        explanation: 'Trạng từ "At present" (hiện tại) chỉ hành động đang diễn ra tại thời điểm nói, cần dùng Hiện tại tiếp diễn (is testing).',
        difficulty: 2
      },
      {
        question: 'The executive committee ________ once a month to review departmental expenditure reports.',
        options: ['meets', 'is meeting', 'has met', 'will have met'],
        correctAnswer: 'A',
        explanation: 'Cụm từ "once a month" chỉ tần suất thói quen định kỳ, cần dùng thì Hiện tại đơn (meets).',
        difficulty: 1
      },
      {
        question: 'Since she joined the firm in 2022, Director Vance ________ three major restructuring initiatives.',
        options: ['oversees', 'oversaw', 'has overseen', 'is overseeing'],
        correctAnswer: 'C',
        explanation: 'Mệnh đề bắt đầu bằng "Since + mốc quá khứ" (Since she joined...), mệnh đề chính phải chia ở thì Hiện tại hoàn thành (has overseen).',
        difficulty: 3
      }
    ]
  },
  {
    id: 'grammar_passive_voice',
    title: 'Passive Voice in Corporate Documents & Notices',
    description: 'Thể bị động trong thông báo, báo cáo tài chính và email hành chính công ty.',
    targetBand: 'BAND_3',
    orderIndex: 2,
    rule: `# Passive Voice in TOEIC Business English

## 1. Cấu trúc cơ bản
- **Thể bị động**: \`S + be + Past Participle (V3/ed) (+ by Object)\`
- Trong môi trường văn phòng TOEIC, thể bị động được ưa chuộng khi:
  1. Người thực hiện hành động không quan trọng bằng đối tượng bị tác động.
  2. Muốn nhấn mạnh tính khách quan, trang trọng của quy định hoặc thông báo.
  3. Hành động đã diễn ra nhưng không muốn chỉ trích đích danh cá nhân.

## 2. Các dạng bị động thường gặp trong TOEIC
- **Bị động với Modal Verbs**: \`Modal (must / should / can / will) + be + V3/ed\`
  - *Ví dụ*: All travel receipts **must be submitted** within 10 days.
- **Bị động ở thì Hoàn thành**: \`have / has / had + been + V3/ed\`
  - *Ví dụ*: The merger **has been approved** by regulatory authorities.
- **Bị động ở thì Tiếp diễn**: \`am / is / are / was / were + being + V3/ed\`
  - *Ví dụ*: The headquarters lobby **is being repainted** this weekend.`,
    formula: 'S + be (chia theo thì) + V3/ed (+ by Agent)',
    examples: [
      {
        sentence: 'All confidential documents must be shredded before disposal.',
        translation: 'Tất cả các tài liệu bảo mật phải được cắt vụn trước khi tiêu hủy.',
        highlight: 'must be shredded'
      },
      {
        sentence: 'The annual trade banquet was hosted by the Chamber of Commerce.',
        translation: 'Bữa tiệc thương mại thường niên đã được chủ trì bởi Phòng Thương mại.',
        highlight: 'was hosted'
      },
      {
        sentence: 'A new cybersecurity policy has been implemented across all branches.',
        translation: 'Một chính sách an ninh mạng mới đã được áp dụng trên tất cả các chi nhánh.',
        highlight: 'has been implemented'
      }
    ],
    tips: 'Để nhận biết câu chủ động hay bị động trong Part 5: Nếu sau chỗ trống KHÔNG có tân ngữ (Direct Object) mà có giới từ (by, for, to, at) hoặc trạng từ, khả năng rất cao là chọn dạng Bị động (be + V3/ed).',
    commonErrors: [
      {
        wrong: 'The shipment was arrived on time.',
        correct: 'The shipment arrived on time.',
        explanation: 'Các nội động từ (Intransitive verbs) như arrive, happen, occur, remain KHÔNG bao giờ chia ở thể bị động.'
      },
      {
        wrong: 'The proposal will review by the management tomorrow.',
        correct: 'The proposal will be reviewed by the management tomorrow.',
        explanation: 'Dạng bị động với tương lai đơn phải có "be": will + be + V3/ed.'
      }
    ],
    exercises: [
      {
        question: 'All employees who wish to attend the leadership seminar ________ to register by Friday afternoon.',
        options: ['require', 'are requiring', 'are required', 'have required'],
        correctAnswer: 'C',
        explanation: 'Chủ ngữ "All employees" là đối tượng được/bị yêu cầu (không tự yêu cầu ai khác), phía sau là "to register", nên phải dùng bị động "are required".',
        difficulty: 2
      },
      {
        question: 'The updated safety manual ________ to all floor managers early next week.',
        options: ['will distribute', 'will be distributed', 'is distributing', 'distributes'],
        correctAnswer: 'B',
        explanation: 'Chủ ngữ "The updated safety manual" là vật bị phân phát, kết hợp với thời gian tương lai "next week", đáp án đúng là "will be distributed".',
        difficulty: 2
      },
      {
        question: 'The keynote address ________ by Dr. Evelyn Reed at the opening of yesterday’s symposium.',
        options: ['delivered', 'was delivered', 'has delivered', 'is delivering'],
        correctAnswer: 'B',
        explanation: 'Cụm "by Dr. Evelyn Reed" và mốc thời gian "yesterday" chỉ rõ thể bị động thì Quá khứ đơn: "was delivered".',
        difficulty: 2
      },
      {
        question: 'A complete inventory of storage supplies ________ twice each calendar year.',
        options: ['conducts', 'is conducted', 'is conducting', 'has conducted'],
        correctAnswer: 'B',
        explanation: 'Việc kiểm kê (inventory) không thể tự thực hiện mà "được tiến hành" định kỳ: "is conducted".',
        difficulty: 2
      }
    ]
  },
  {
    id: 'grammar_relative_clauses',
    title: 'Relative Clauses & Reduced Clauses',
    description: 'Mệnh đề quan hệ xác định/không xác định và kỹ thuật rút gọn mệnh đề quan hệ dạng V-ing/V-ed.',
    targetBand: 'BAND_3',
    orderIndex: 3,
    rule: `# Relative Clauses and Reduced Clauses in TOEIC

## 1. Đại từ quan hệ (Relative Pronouns)
- **Who**: Thay cho danh từ chỉ người làm chủ ngữ.
  - *Ví dụ*: The consultant **who drafted the blueprint** is here.
- **Whom**: Thay cho danh từ chỉ người làm tân ngữ (sau giới từ bắt buộc dùng whom).
  - *Ví dụ*: The executive **to whom you spoke** will reply soon.
- **Which**: Thay cho danh từ chỉ sự vật/hiện tượng.
  - *Ví dụ*: The software **which was installed yesterday** is fast.
- **That**: Thay thế cho cả người lẫn vật trong mệnh đề xác định (không đứng sau dấu phẩy hay giới từ).
- **Whose**: Chỉ quan hệ sở hữu cho cả người và vật (\`N + whose + N\`).
  - *Ví dụ*: Candidates **whose applications were approved** will be contacted.

## 2. Rút gọn Mệnh đề quan hệ (Reduced Relative Clauses)
Đây là cấu trúc xuất hiện liên tục trong Part 5 & 6:
- **Chủ động**: Rút gọn thành \`V-ing\`
  - *Gốc*: The engineer who oversees the plant -> *Rút gọn*: The engineer **overseeing** the plant.
- **Bị động**: Rút gọn thành \`V-ed / V3\`
  - *Gốc*: The items that were ordered yesterday -> *Rút gọn*: The items **ordered** yesterday.`,
    formula: 'N (người/vật) + [V-ing (chủ động) / V3-ed (bị động)] + Complement',
    examples: [
      {
        sentence: 'Anyone wishing to renew their parking permit must submit an online request.',
        translation: 'Bất kỳ ai muốn gia hạn giấy phép đỗ xe của mình đều phải nộp yêu cầu trực tuyến.',
        highlight: 'wishing to renew'
      },
      {
        sentence: 'Products manufactured at our Da Nang facility meet strict ISO 9001 standards.',
        translation: 'Các sản phẩm được sản xuất tại cơ sở Đà Nẵng của chúng tôi đáp ứng các tiêu chuẩn ISO 9001 nghiêm ngặt.',
        highlight: 'manufactured at our Da Nang facility'
      },
      {
        sentence: 'The technician whose team solved the network outage was commended by the board.',
        translation: 'Kỹ thuật viên mà đội ngũ của anh ấy đã khắc phục sự cố ngừng mạng đã được hội đồng quản trị biểu dương.',
        highlight: 'whose team solved'
      }
    ],
    tips: 'Trong câu có sẵn động từ chính vị ngữ rồi, nếu trước danh từ có chỗ trống hoặc sau danh từ cần bổ nghĩa mà không có đại từ quan hệ (who/which/that), hãy nghĩ ngay đến rút gọn mệnh đề quan hệ: V-ing nếu mang nghĩa chủ động, V3/ed nếu mang nghĩa bị động.',
    commonErrors: [
      {
        wrong: 'The manager who I spoke yesterday is away.',
        correct: 'The manager to whom I spoke yesterday is away. (hoặc: who I spoke to)',
        explanation: 'Động từ "speak" đi với giới từ "to", khi đưa lên đầu mệnh đề quan hệ phải dùng "to whom".'
      },
      {
        wrong: 'Employees want to participate should sign up today.',
        correct: 'Employees wanting to participate should sign up today.',
        explanation: 'Câu đã có động từ chính "should sign up", phần bổ nghĩa cho "Employees" phải rút gọn thành "wanting" (chủ động).'
      }
    ],
    exercises: [
      {
        question: 'Applicants ________ to apply for the overseas transfer program must hold at least three years of tenure.',
        options: ['wish', 'wished', 'wishing', 'are wishing'],
        correctAnswer: 'C',
        explanation: 'Câu đã có động từ chính là "must hold". Vị trí chỗ trống cần rút gọn mệnh đề quan hệ chủ động (who wish -> wishing).',
        difficulty: 3
      },
      {
        question: 'Any equipment ________ during shipment will be repaired or replaced free of charge.',
        options: ['damaging', 'damaged', 'damages', 'is damaged'],
        correctAnswer: 'B',
        explanation: 'Câu có động từ chính là "will be repaired". Chỗ trống bổ nghĩa bị động cho "Any equipment" (thiết bị bị hư hỏng trong quá trình vận chuyển), rút gọn thành "damaged" (which was damaged).',
        difficulty: 2
      },
      {
        question: 'The marketing specialist ________ presentation impressed the client has been promoted.',
        options: ['who', 'whom', 'whose', 'which'],
        correctAnswer: 'C',
        explanation: 'Phía sau chỗ trống là danh từ "presentation" thuộc quyền sở hữu của chuyên gia tiếp thị ("whose presentation" = bài thuyết trình của người đó).',
        difficulty: 3
      },
      {
        question: 'The historic factory building, ________ was constructed in 1952, has been converted into modern loft offices.',
        options: ['that', 'which', 'what', 'who'],
        correctAnswer: 'B',
        explanation: 'Mệnh đề quan hệ không xác định có dấu phẩy (,) bổ nghĩa cho vật (building) bắt buộc dùng "which", không được dùng "that".',
        difficulty: 2
      }
    ]
  },
  {
    id: 'grammar_prepositions',
    title: 'Prepositions of Time, Place & Common Collocations',
    description: 'Giới từ chỉ thời gian, nơi chốn và các cụm giới từ cố định thường gặp trong hợp đồng kinh tế và email trao đổi.',
    targetBand: 'BAND_2',
    orderIndex: 4,
    rule: `# Prepositions of Time, Place, and Collocations in TOEIC

## 1. Giới từ chỉ Thời gian
- **In**: Dùng cho tháng, năm, mùa, thế kỷ, buổi trong ngày (\`in May\`, \`in 2026\`, \`in the morning\`).
- **On**: Dùng cho ngày cụ thể trong tuần, ngày tháng kết hợp, ngày lễ (\`on Monday\`, \`on October 15th\`).
- **At**: Dùng cho giờ cụ thể, thời điểm ngắn (\`at 9:00 AM\`, \`at noon\`, \`at midnight\`).
- **By vs. Until**:
  - \`By\`: Hoàn thành trước hoặc muộn nhất là thời điểm đó (hành động dứt điểm). Ví dụ: Submit the report **by 5 PM**.
  - \`Until\`: Duy trì liên tục cho đến thời điểm đó. Ví dụ: The showroom remains open **until 9 PM**.
- **Within**: Trong vòng một khoảng thời gian (\`within 5 business days\`).

## 2. Giới từ chỉ Nơi chốn
- **At**: Tại một địa điểm cụ thể, sự kiện (\`at the conference\`, \`at the airport\`).
- **In**: Bên trong không gian kín, thành phố, quốc gia (\`in Tokyo\`, \`in the meeting room\`).
- **On**: Trên bề mặt, tầng của tòa nhà (\`on the 4th floor\`, \`on the website\`).

## 3. Cụm giới từ cố định (Prepositional Collocations)
- \`in compliance with\` (tuân thủ theo)
- \`regardless of\` (bất kể, bất chấp)
- \`prior to\` (trước khi = before)
- \`in response to\` (để phản hồi lại)
- \`on behalf of\` (thay mặt cho)`,
    formula: 'Preposition + Noun / Noun Phrase / V-ing',
    examples: [
      {
        sentence: 'Prior to boarding the aircraft, passengers must display their valid passports.',
        translation: 'Trước khi lên máy bay, hành khách phải xuất trình hộ chiếu hợp lệ.',
        highlight: 'Prior to boarding'
      },
      {
        sentence: 'The contract was drafted in compliance with local commercial regulations.',
        translation: 'Hợp đồng được soạn thảo tuân thủ các quy định thương mại địa phương.',
        highlight: 'in compliance with'
      },
      {
        sentence: 'Please ensure your project deliverables are submitted by Friday afternoon.',
        translation: 'Vui lòng đảm bảo các sản phẩm dự án của bạn được nộp muộn nhất trước chiều thứ Sáu.',
        highlight: 'by Friday afternoon'
      }
    ],
    tips: 'Chú ý sự khác biệt giữa "During + Danh từ" (During the seminar) và "While + Mệnh đề" (While we were attending the seminar). Cả hai đều mang nghĩa "trong khi" nhưng cấu trúc ngữ pháp hoàn toàn khác nhau.',
    commonErrors: [
      {
        wrong: 'Submit your tax return until April 15.',
        correct: 'Submit your tax return by April 15.',
        explanation: 'Hành động nộp hồ sơ thuế là hành động dứt điểm, phải dùng "by" (trước hoặc tại hạn chót), không dùng "until".'
      },
      {
        wrong: 'He completed the audit during two weeks.',
        correct: 'He completed the audit in two weeks (hoặc: within two weeks).',
        explanation: '"During" chỉ một sự kiện hoặc khoảng thời gian định danh (during the summer, during the meeting), không đi trực tiếp với số đếm đo lường thời gian.'
      }
    ],
    exercises: [
      {
        question: 'All travel expense claims must be submitted ________ thirty days of returning from the business trip.',
        options: ['within', 'between', 'during', 'among'],
        correctAnswer: 'A',
        explanation: 'Cấu trúc "within + khoảng thời gian" (trong vòng 30 ngày) là lựa chọn chính xác duy nhất.',
        difficulty: 1
      },
      {
        question: 'The CEO delivered a brief speech ________ behalf of the entire executive leadership committee.',
        options: ['at', 'on', 'in', 'to'],
        correctAnswer: 'B',
        explanation: 'Cụm thành ngữ cố định "on behalf of someone" mang nghĩa "thay mặt cho ai đó".',
        difficulty: 1
      },
      {
        question: 'The warranty remains valid ________ the client adheres to the authorized maintenance schedule.',
        options: ['provided that', 'prior to', 'in addition', 'regardless'],
        correctAnswer: 'A',
        explanation: '"Provided that" (= if / với điều kiện là) là liên từ liên kết mệnh đề điều kiện, các phương án còn lại là giới từ/trạng từ không đi cùng mệnh đề S+V.',
        difficulty: 3
      },
      {
        question: 'The customer service telephone hotline is staffed ________ 8:00 AM to 6:00 PM every weekday.',
        options: ['at', 'from', 'between', 'since'],
        correctAnswer: 'B',
        explanation: 'Cặp liên từ chỉ khoảng thời gian: "from... to..." (từ 8:00 sáng đến 6:00 chiều).',
        difficulty: 1
      }
    ]
  },
  {
    id: 'grammar_comparisons',
    title: 'Comparative, Superlative & Degree Modifiers',
    description: 'Cấu trúc so sánh hơn, so sánh nhất, so sánh bằng và các trạng từ nhấn mạnh mức độ (much, significantly, far).',
    targetBand: 'BAND_3',
    orderIndex: 5,
    rule: `# Comparisons and Degree Modifiers in TOEIC

## 1. So sánh bằng (Equative Comparison)
- Cấu trúc: \`as + adj / adv + as\`
- *Ví dụ*: The new laser printer operates **as quietly as** the previous model.

## 2. So sánh hơn (Comparative)
- Tính từ/trạng từ ngắn (1 âm tiết): \`adj/adv-er + than\` (\`faster than\`, \`cheaper than\`).
- Tính từ/trạng từ dài (2 âm tiết trở lên): \`more + adj/adv + than\` (\`more efficient than\`).
- **Trạng từ nhấn mạnh so sánh hơn**:
  - \`much\`, \`far\`, \`significantly\`, \`substantially\`, \`considerably\`, \`a lot\`.
  - **Lưu ý cực quan trọng**: KHÔNG dùng \`very\`, \`more\`, \`quite\` trước dạng so sánh hơn!

## 3. So sánh nhất (Superlative)
- Cấu trúc: \`the + adj-est / the most + adj\`
- *Ví dụ*: This branch recorded **the most impressive** quarterly growth in the company's history.
- Cụm từ đi kèm: \`among\`, \`of all\`, \`ever\`, \`in the world\`.

## 4. So sánh kép (Double Comparative)
- Cấu trúc: \`The + comparative..., the + comparative...\` (Càng... thì càng...)
- *Ví dụ*: **The sooner** we finalize the vendor agreement, **the faster** production can begin.`,
    formula: 'much/significantly/far + comparative (adj-er / more adj) + than',
    examples: [
      {
        sentence: 'The new electric SUV is significantly more energy-efficient than its gasoline predecessor.',
        translation: 'Mẫu xe SUV điện mới tiết kiệm năng lượng hơn đáng kể so với mẫu xe chạy bằng xăng trước đó.',
        highlight: 'significantly more energy-efficient than'
      },
      {
        sentence: 'Among all applicants interviewed, Ms. Park possessed the most extensive leadership credentials.',
        translation: 'Trong số tất cả các ứng viên được phỏng vấn, bà Park sở hữu các chứng chỉ lãnh đạo toàn diện nhất.',
        highlight: 'the most extensive'
      },
      {
        sentence: 'The earlier we ship the export consignment, the lower the port storage fees will be.',
        translation: 'Chúng ta gửi lô hàng xuất khẩu càng sớm thì phí lưu kho tại cảng sẽ càng thấp.',
        highlight: 'The earlier..., the lower...'
      }
    ],
    tips: 'Nếu phía sau có "than", hãy tìm tính từ/trạng từ so sánh hơn (er/more). Nếu phía trước có "the" và phía sau có phạm vi (of all, in the firm), hãy tìm so sánh nhất (est/most). Nhớ rằng "significantly/much" bổ nghĩa cho so sánh hơn, không dùng "very".',
    commonErrors: [
      {
        wrong: 'The new engine is very faster than the old one.',
        correct: 'The new engine is much faster than the old one.',
        explanation: 'Không dùng "very" trước tính từ so sánh hơn, phải dùng "much/significantly/substantially".'
      },
      {
        wrong: 'He is the more experienced technician in our department.',
        correct: 'He is the most experienced technician in our department.',
        explanation: 'Khi so sánh trong một tập thể có nhiều người ("in our department"), phải dùng so sánh nhất ("the most experienced").'
      }
    ],
    exercises: [
      {
        question: 'The updated accounting software processes payroll records ________ faster than the legacy platform.',
        options: ['very', 'much', 'more', 'too'],
        correctAnswer: 'B',
        explanation: '"Faster" là tính từ so sánh hơn, trạng từ bổ nghĩa cho so sánh hơn phải là "much" (hoặc significantly/far). "Very" và "too" không đi cùng so sánh hơn.',
        difficulty: 2
      },
      {
        question: 'Of the three logistics contractors evaluated, Global Freight presented ________ cost-effective proposal.',
        options: ['more', 'most', 'the most', 'as much'],
        correctAnswer: 'C',
        explanation: 'So sánh giữa 3 đối tượng ("Of the three...") đòi hỏi dùng so sánh nhất có mạo từ "the": "the most cost-effective".',
        difficulty: 2
      },
      {
        question: 'The seminar room was not nearly as ________ as the event organizers had anticipated.',
        options: ['spacious', 'spaciousness', 'more spacious', 'most spacious'],
        correctAnswer: 'A',
        explanation: 'Cấu trúc so sánh bằng "as + adj + as" yêu cầu tính từ nguyên mẫu: "spacious".',
        difficulty: 1
      },
      {
        question: 'Quarterly revenues rose ________ higher than financial analysts had initially estimated.',
        options: ['great', 'substantially', 'substance', 'substantial'],
        correctAnswer: 'B',
        explanation: 'Cần một trạng từ (substantially) để bổ nghĩa cho tính từ so sánh hơn "higher".',
        difficulty: 3
      }
    ]
  },
  {
    id: 'grammar_conditionals_inversion',
    title: 'Conditionals & Hypothetical Situations',
    description: 'Câu điều kiện loại 1, 2, 3 và thể đảo ngữ rút gọn If (Should, Were, Had) trong văn phong thương mại.',
    targetBand: 'BAND_4',
    orderIndex: 6,
    rule: `# Conditionals and Inversion in TOEIC Business English

## 1. Ba loại câu điều kiện cơ bản
- **Loại 1 (Có thật ở hiện tại/tương lai)**:
  - Cấu trúc: \`If + S + V(s/es), S + will / can / must + V-bare\`
  - *Ví dụ*: If the client **approves** the quote, we **will sign** the contract tomorrow.
- **Loại 2 (Giả định trái với hiện tại)**:
  - Cấu trúc: \`If + S + V2/ed (were), S + would / could + V-bare\`
  - *Ví dụ*: If we **had** more capital, we **would expand** into the European market.
- **Loại 3 (Giả định trái với quá khứ)**:
  - Cấu trúc: \`If + S + had + V3/ed, S + would / could + have + V3/ed\`
  - *Ví dụ*: If you **had alerted** us earlier, we **could have mitigated** the shipment delay.

## 2. Đảo ngữ câu điều kiện (Inversion) - CỰC KỲ PHỔ BIẾN TRONG TOEIC
Khi bỏ "If", các trợ động từ được đảo lên đầu câu:
- **Đảo ngữ Loại 1**: \`Should + S + V-bare, S + will + V-bare\`
  - *Gốc*: If you have any inquiries... -> *Đảo ngữ*: **Should you have** any inquiries, please contact our helpdesk.
- **Đảo ngữ Loại 2**: \`Were + S + to-V (hoặc Were + S + Adj), S + would + V-bare\`
  - *Gốc*: If the board were to decide... -> *Đảo ngữ*: **Were the board to decide**...
- **Đảo ngữ Loại 3**: \`Had + S + V3/ed, S + would have + V3/ed\`
  - *Gốc*: If we had known... -> *Đảo ngữ*: **Had we known** about the tariff increase, we would have adjusted our pricing.`,
    formula: 'Should + S + V-bare... | Had + S + V3/ed, S + would have + V3/ed',
    examples: [
      {
        sentence: 'Should you require any additional financial documentation, please do not hesitate to contact our office.',
        translation: 'Nếu quý khách cần bất kỳ tài liệu tài chính bổ sung nào, xin vui lòng đừng ngần ngại liên hệ văn phòng chúng tôi.',
        highlight: 'Should you require'
      },
      {
        sentence: 'Had the marketing campaign launched two weeks earlier, holiday sales figures would have been higher.',
        translation: 'Giá như chiến dịch quảng cáo được tung ra sớm hai tuần thì số liệu doanh số mùa lễ đã cao hơn.',
        highlight: 'Had the marketing campaign launched'
      },
      {
        sentence: 'If the supplier delivers the components on schedule, assembly will finish ahead of the deadline.',
        translation: 'Nếu nhà cung cấp giao các linh kiện đúng lịch trình, việc lắp ráp sẽ kết thúc trước thời hạn.',
        highlight: 'If the supplier delivers'
      }
    ],
    tips: 'Trong Part 5, nếu thấy đầu câu có "Should" hoặc "Had" đứng trước chủ ngữ mà cuối câu lại là dấu chấm (.) chứ không phải dấu hỏi (?), đó 100% là câu ĐẢO NGỮ điều kiện!',
    commonErrors: [
      {
        wrong: 'Should you to require assistance, call extension 402.',
        correct: 'Should you require assistance, call extension 402.',
        explanation: 'Sau trợ động từ "Should", động từ phải ở dạng nguyên mẫu không "to" (V-bare): "require".'
      },
      {
        wrong: 'If we would have signed earlier, we would have saved money.',
        correct: 'If we had signed earlier, we would have saved money.',
        explanation: 'Trong mệnh đề If của câu điều kiện loại 3, tuyệt đối KHÔNG dùng "would have", phải dùng "had + V3/ed".'
      }
    ],
    exercises: [
      {
        question: '________ you experience any difficulties logging into the corporate portal, please notify technical support immediately.',
        options: ['Unless', 'Should', 'Whether', 'Although'],
        correctAnswer: 'B',
        explanation: 'Đảo ngữ câu điều kiện loại 1 với "Should" đứng đầu câu: "Should you experience..." (= If you experience...).',
        difficulty: 3
      },
      {
        question: 'Had the maintenance team ________ the ventilation filters on time, the equipment shutdown could have been avoided.',
        options: ['inspect', 'inspected', 'inspecting', 'inspection'],
        correctAnswer: 'B',
        explanation: 'Đảo ngữ câu điều kiện loại 3: "Had + S + V3/ed". Động từ đúng phải là "inspected".',
        difficulty: 3
      },
      {
        question: 'If the city council ________ our construction permit, work on the new facility will begin next month.',
        options: ['approves', 'approved', 'had approved', 'approving'],
        correctAnswer: 'A',
        explanation: 'Câu điều kiện loại 1 với vế chính là "will begin", mệnh đề If phải chia ở thì Hiện tại đơn: "approves".',
        difficulty: 2
      },
      {
        question: '________ the weather conditions deteriorate further, tonight’s outdoor promotional event will be postponed.',
        options: ['Were', 'Should', 'Had', 'Would'],
        correctAnswer: 'B',
        explanation: 'Vế chính dùng tương lai đơn "will be postponed", đây là điều kiện loại 1 đảo ngữ với "Should + S + V-bare".',
        difficulty: 3
      }
    ]
  },
  {
    id: 'grammar_gerunds_infinitives',
    title: 'Gerunds, Infinitives & Causative Verbs',
    description: 'Quy tắc dùng V-ing và To-V sau các động từ thương mại phổ biến, giới từ, và cấu trúc nhờ bảo (make, let, have, get).',
    targetBand: 'BAND_3',
    orderIndex: 7,
    rule: `# Gerunds and Infinitives in Business Context

## 1. Động từ theo sau bởi Danh động từ (V-ing)
- Các động từ kinh doanh thường đi với V-ing:
  - \`consider\` (cân nhắc)
  - \`postpone / delay\` (hoãn lại)
  - \`suggest / recommend\` (gợi ý, đề xuất)
  - \`avoid\` (tránh)
  - \`mind\` (phiền)
  - \`enjoy / finish\` (hoàn thành)
- **Các cụm từ cố định đi với V-ing**:
  - \`look forward to + V-ing\` (rất mong đợi)
  - \`be committed to + V-ing\` (cam kết làm gì)
  - \`be dedicated to + V-ing\` (tận tụy làm gì)
  - \`in addition to + V-ing\` (ngoài việc)
  - \`be responsible for + V-ing\` (chịu trách nhiệm cho)

## 2. Động từ theo sau bởi Động từ nguyên mẫu có To (To-V)
- Các động từ thường đi với To-V:
  - \`agree\` (đồng ý)
  - \`decide\` (quyết định)
  - \`hesitate\` (do dự: \`do not hesitate to contact\`)
  - \`plan / intend\` (lên kế hoạch)
  - \`manage\` (xoay xở để)
  - \`fail\` (thất bại, không làm được)
  - \`refuse\` (từ chối)
  - \`aim / strive\` (cố gắng nỗ lực)
- Cấu trúc: \`V + Object + To-V\` (\`encourage / remind / allow / permit / invite someone to do something\`).

## 3. Thể nhờ bảo (Causative Verbs)
- \`Have someone DO something\` (nhờ ai làm gì - V-bare)
- \`Have something DONE\` (nhờ vật gì được làm - V3/ed)
- \`Get someone TO DO something\` (thuyết phục ai làm gì - To-V)
- \`Get something DONE\` (nhờ vật gì được làm - V3/ed)`,
    formula: 'look forward to + V-ing | encourage + O + to-V | have + O(vật) + V3/ed',
    examples: [
      {
        sentence: 'We look forward to welcoming your trade delegation to our corporate headquarters next Tuesday.',
        translation: 'Chúng tôi rất mong được đón tiếp đoàn đại biểu thương mại của quý vị tới trụ sở công ty chúng tôi vào thứ Ba tới.',
        highlight: 'look forward to welcoming'
      },
      {
        sentence: 'Management decided to postpone the international product rollout until the third quarter.',
        translation: 'Ban quản lý đã quyết định hoãn việc ra mắt sản phẩm quốc tế cho đến quý ba.',
        highlight: 'decided to postpone'
      },
      {
        sentence: 'The human resources director encouraged all branch supervisors to attend the compliance workshop.',
        translation: 'Giám đốc nhân sự đã khuyến khích tất cả các giám sát viên chi nhánh tham dự hội thảo tuân thủ.',
        highlight: 'encouraged all branch supervisors to attend'
      }
    ],
    tips: 'Cực kỳ cẩn thận với giới từ "to" trong các cụm như "look forward to", "be committed to", "object to", "prior to". Chữ "to" ở đây là GIỚI TỪ, nên từ theo sau bắt buộc phải là V-ing hoặc Danh từ, không bao giờ dùng V-bare!',
    commonErrors: [
      {
        wrong: 'We look forward to hear from you soon.',
        correct: 'We look forward to hearing from you soon.',
        explanation: 'Cụm "look forward to" đi với V-ing ("hearing"), không dùng động từ nguyên thể.'
      },
      {
        wrong: 'The supervisor reminded him submit the expense report.',
        correct: 'The supervisor reminded him to submit the expense report.',
        explanation: 'Cấu trúc "remind someone + To-V": cần có giới từ "to".'
      }
    ],
    exercises: [
      {
        question: 'Our legal department is fully committed to ________ all proprietary software patents.',
        options: ['protect', 'protects', 'protecting', 'protection'],
        correctAnswer: 'C',
        explanation: 'Cụm từ "be committed to + V-ing" (cam kết làm gì đó). Ở đây "to" là giới từ nên theo sau là V-ing (protecting).',
        difficulty: 2
      },
      {
        question: 'The executive committee considered ________ the outdated factory facility to lower operating costs.',
        options: ['sell', 'selling', 'to sell', 'sold'],
        correctAnswer: 'B',
        explanation: 'Động từ "consider" đòi hỏi theo sau là một Danh động từ (V-ing): "selling".',
        difficulty: 2
      },
      {
        question: 'Do not hesitate ________ our helpdesk team should you require assistance with your account.',
        options: ['contact', 'contacting', 'to contact', 'contacted'],
        correctAnswer: 'C',
        explanation: 'Cụm từ quen thuộc trong thư tín thương mại: "hesitate + To-V" -> "hesitate to contact".',
        difficulty: 1
      },
      {
        question: 'The operations manager will have the cooling system ________ by certified technicians this afternoon.',
        options: ['inspect', 'inspected', 'inspecting', 'to inspect'],
        correctAnswer: 'B',
        explanation: 'Thể nhờ bảo bị động: "have + Object (the cooling system - vật) + V3/ed (inspected)".',
        difficulty: 3
      }
    ]
  },
  {
    id: 'grammar_parts_of_speech',
    title: 'Parts of Speech & Word Suffix Patterns',
    description: 'Quy tắc vàng phân biệt danh từ, tính từ, trạng từ, động từ qua vị trí ngữ pháp và các hậu tố (suffixes) điển hình.',
    targetBand: 'BAND_2',
    orderIndex: 8,
    rule: `# Parts of Speech and Suffix Patterns in TOEIC

Part 5 có khoảng 8-12 câu thuần túy kiểm tra việc chọn đúng **Từ loại** (Parts of Speech). Chỉ cần nắm vững vị trí là làm được trong 10 giây:

## 1. Vị trí của Danh từ (Noun)
- Làm chủ ngữ (đầu câu) hoặc tân ngữ (sau ngoại động từ).
- Sau mạo từ (\`a, an, the\`), từ chỉ định (\`this, that, these, those\`), tính từ sở hữu (\`my, your, our, their, its\`).
- Sau giới từ (\`in, on, at, for, with\`).
- Sau tính từ (\`Adj + Noun\`).
- *Hậu tố Danh từ*: \`-tion, -sion, -ment, -ance, -ence, -ity, -ness, -er, -or, -ant\`.

## 2. Vị trí của Tính từ (Adjective)
- Đứng trước danh từ để bổ nghĩa (\`Adj + Noun\`).
- Đứng sau động từ liên kết (Linking verbs: \`be, seem, appear, remain, become, look\`).
- Cấu trúc: \`make / keep / find + Object + Adj\`.
- *Hậu tố Tính từ*: \`-ful, -less, -ive, -able, -ible, -al, -ous, -ic, -ent, -ant\`.

## 3. Vị trí của Trạng từ (Adverb)
- Bổ nghĩa cho động từ: đứng trước hoặc sau động từ chính.
- Bổ nghĩa cho tính từ: đứng ngay trước tính từ (\`Adv + Adj + Noun\`).
- Bổ nghĩa cho cả câu: đứng đầu câu trước dấu phẩy (\`Adv, S + V + O\`).
- Đứng giữa trợ động từ và động từ chính vị ngữ (\`have + Adv + V3/ed\` hoặc \`be + Adv + V3/ed\`).
- *Hậu tố Trạng từ*: thường là \`Tính từ + ly\` (\`quick -> quickly\`, \`frequent -> frequently\`).`,
    formula: 'Article / Possessive + (Adv) + (Adj) + NOUN | be + (Adv) + V3/ed',
    examples: [
      {
        sentence: 'The technician successfully restored all network services ahead of schedule.',
        translation: 'Kỹ thuật viên đã khôi phục thành công mọi dịch vụ mạng trước thời hạn.',
        highlight: 'successfully restored'
      },
      {
        sentence: 'The regional director emphasized the importance of regular workplace safety inspections.',
        translation: 'Giám đốc khu vực nhấn mạnh tầm quan trọng của việc kiểm tra an toàn nơi làm việc định kỳ.',
        highlight: 'the importance of'
      },
      {
        sentence: 'All attendees found the presentation on cloud migration exceptionally informative.',
        translation: 'Tất cả người tham dự đều thấy bài thuyết trình về chuyển đổi đám mây đặc biệt hữu ích.',
        highlight: 'exceptionally informative'
      }
    ],
    tips: 'Công thức thần thánh: [Trợ động từ] + _______ + [Động từ chính] -> Chỗ trống 99% điền TRẠNG TỪ (-ly). Ví dụ: has [recently] announced, was [carefully] reviewed.',
    commonErrors: [
      {
        wrong: 'Please handle the prototype careful.',
        correct: 'Please handle the prototype carefully.',
        explanation: 'Bổ nghĩa cho động từ hành động "handle" phải là trạng từ "carefully", không dùng tính từ "careful".'
      },
      {
        wrong: 'The report was complete accurate.',
        correct: 'The report was completely accurate.',
        explanation: 'Bổ nghĩa cho tính từ "accurate" phải là trạng từ "completely".'
      }
    ],
    exercises: [
      {
        question: 'The committee members reviewed the financial proposals ________ before casting their final votes.',
        options: ['careful', 'carefulness', 'carefully', 'caring'],
        correctAnswer: 'C',
        explanation: 'Cần một trạng từ (carefully) để bổ nghĩa cho hành động ngoại động từ "reviewed the financial proposals".',
        difficulty: 1
      },
      {
        question: 'Maintaining strict customer data ________ is the top priority for our cybersecurity division.',
        options: ['confidential', 'confidentiality', 'confidentially', 'confide'],
        correctAnswer: 'B',
        explanation: 'Vị trí sau cụm từ bổ nghĩa "customer data" cần một danh từ để tạo thành cụm danh từ làm tân ngữ cho "Maintaining": "data confidentiality" (tính bảo mật dữ liệu).',
        difficulty: 2
      },
      {
        question: 'The renovated headquarters cafeteria offers a wide ________ of nutritious lunch options.',
        options: ['vary', 'variety', 'various', 'variously'],
        correctAnswer: 'B',
        explanation: 'Cụm danh từ định lượng phổ biến: "a wide variety of + N" (sự đa dạng phong phú của cái gì).',
        difficulty: 1
      },
      {
        question: 'Dr. Evelyn Martinez is ________ regarded as one of the country’s leading supply chain researchers.',
        options: ['high', 'higher', 'highest', 'highly'],
        correctAnswer: 'D',
        explanation: 'Vị trí đứng giữa "is" và quá khứ phân từ "regarded" cần một trạng từ chỉ mức độ: "highly regarded" (được đánh giá cao).',
        difficulty: 2
      },
      {
        question: 'Customer reviews indicate that the newly released tablet is both lightweight and ________.',
        options: ['durable', 'durability', 'durably', 'duration'],
        correctAnswer: 'A',
        explanation: 'Cấu trúc song hành với liên từ "both... and...": "lightweight" là tính từ, do đó từ đi sau "and" cũng phải là một tính từ tương đương ("durable").',
        difficulty: 2
      }
    ]
  },
  {
    id: 'grammar_conjunctions_connectors',
    title: 'Conjunctions, Prepositions & Sentence Connectors',
    description: 'Phân biệt liên từ phụ thuộc (Because, Although, While), giới từ tương đương (Because of, Despite, During) và trạng từ liên kết (However, Therefore).',
    targetBand: 'BAND_3',
    orderIndex: 9,
    rule: `# Conjunctions, Prepositions, and Connectors in TOEIC

Đây là chủ điểm "bẫy" kinh điển nhất trong Part 5 & 6, kiểm tra việc phân biệt:
1. **Liên từ phụ thuộc (Subordinating Conjunctions)**: Đi với một MỆNH ĐỀ (\`Conjunction + S + V\`).
2. **Giới từ tương đương (Prepositions)**: Đi với một DANH TỪ hoặc CỤM DANH TỪ (\`Preposition + Noun / V-ing\`).
3. **Trạng từ liên kết (Conjunctive Adverbs)**: Đứng đầu câu sau dấu chấm và trước dấu phẩy (\`Connector, S + V\`).

## Bảng đối chiếu thần thánh:
| Ý nghĩa | Liên từ (S + V) | Giới từ (Noun / V-ing) | Trạng từ liên kết (, S + V) |
| :--- | :--- | :--- | :--- |
| **Mặc dù, Dù cho** | Although, Even though, Though | Despite, In spite of | However, Nonetheless, Nevertheless |
| **Bởi vì, Do** | Because, Since, As, Now that | Because of, Due to, Owing to | Therefore, As a result, Consequently |
| **Trong khi** | While, Whereas | During | Meanwhile |
| **Miễn là, Nếu** | Provided that, As long as, If | In case of | Otherwise |`,
    formula: 'Conjunction + S + V | Preposition + Noun Phrase | Conjunctive Adverb, S + V',
    examples: [
      {
        sentence: 'Although the weather was severe, international flights departed on schedule.',
        translation: 'Mặc dù thời tiết khắc nghiệt, các chuyến bay quốc tế vẫn khởi hành đúng giờ.',
        highlight: 'Although the weather was severe'
      },
      {
        sentence: 'Despite the severe weather, international flights departed on schedule.',
        translation: 'Bất chấp thời tiết khắc nghiệt, các chuyến bay quốc tế vẫn khởi hành đúng giờ.',
        highlight: 'Despite the severe weather'
      },
      {
        sentence: 'The initial marketing campaign was expensive; however, it yielded record-breaking sales.',
        translation: 'Chiến dịch quảng cáo ban đầu khá tốn kém; tuy nhiên, nó đã mang lại doanh số kỷ lục.',
        highlight: 'however, it yielded'
      }
    ],
    tips: 'Nhìn ngay phía sau chỗ trống: Nếu thấy có cả Chủ ngữ + Động từ chia thì (S + V), LOẠI NGAY các giới từ (Despite, Due to, During, Because of). Nếu phía sau chỉ có Cụm danh từ (Noun phrase), LOẠI NGAY các liên từ (Although, Because, While, Since).',
    commonErrors: [
      {
        wrong: 'Despite he worked late, he arrived early.',
        correct: 'Although he worked late, he arrived early.',
        explanation: '"he worked late" là một mệnh đề đầy đủ (S + V), phải dùng liên từ "Although", không được dùng giới từ "Despite".'
      },
      {
        wrong: 'Because the rain, the soccer match was canceled.',
        correct: 'Because of the rain, the soccer match was canceled.',
        explanation: '"the rain" chỉ là một danh từ, phải dùng giới từ "Because of", không dùng liên từ "Because".'
      }
    ],
    exercises: [
      {
        question: '________ the significant increase in raw material costs, the enterprise maintained its annual profitability targets.',
        options: ['Although', 'Despite', 'Even though', 'Because'],
        correctAnswer: 'B',
        explanation: 'Phía sau chỗ trống là một cụm danh từ ("the significant increase in raw material costs"), không có động từ chia thì, do đó phải dùng giới từ chỉ sự tương phản: "Despite".',
        difficulty: 2
      },
      {
        question: 'The branch manager approved the purchase requisition ________ the equipment was urgently required for the project.',
        options: ['because', 'because of', 'due to', 'owing to'],
        correctAnswer: 'A',
        explanation: 'Phía sau là mệnh đề hoàn chỉnh có S + V ("the equipment was urgently required"), do đó phải chọn liên từ phụ thuộc "because".',
        difficulty: 2
      },
      {
        question: 'Staff may work remotely up to two days per week ________ their quarterly project deadlines are met.',
        options: ['prior to', 'provided that', 'in spite of', 'in addition to'],
        correctAnswer: 'B',
        explanation: '"Provided that" (= with the condition that / miễn là) đóng vai trò là liên từ đi với mệnh đề "their quarterly project deadlines are met". Các phương án khác là giới từ.',
        difficulty: 3
      },
      {
        question: 'The executive committee debated the merger for four hours; ________, no consensus was reached.',
        options: ['despite', 'nevertheless', 'although', 'because of'],
        correctAnswer: 'B',
        explanation: 'Đứng sau dấu chấm phẩy (;) và trước dấu phẩy (,) ngăn cách một mệnh đề độc lập, cần dùng trạng từ liên kết "nevertheless" (tuy nhiên).',
        difficulty: 3
      }
    ]
  },
  {
    id: 'grammar_inversion_emphasis',
    title: 'Negative Adverb Inversion & Parallel Structure',
    description: 'Đảo ngữ với trạng từ phủ định (Rarely, Seldom, Not only... but also) và cấu trúc song hành (Parallelism).',
    targetBand: 'BAND_4',
    orderIndex: 10,
    rule: `# Inversion with Negative Adverbs and Parallel Structure

## 1. Đảo ngữ với Trạng từ mang nghĩa phủ định (Negative Inversion)
Khi các trạng từ mang nghĩa phủ định hoặc hạn chế đứng ở ĐẦU CÂU nhằm mục đích nhấn mạnh, ta bắt buộc phải đảo trợ động từ lên trước chủ ngữ:
- Các từ thường gặp: \`Rarely\`, \`Seldom\`, \`Hardly\`, \`Scarcely\`, \`Barely\`, \`Little\`, \`Never\`, \`Under no circumstances\`, \`Not only... but also\`.
- Cấu trúc: \`Negative Adverb + Auxiliary Verb (do/does/did/have/has/can/will) + S + Main Verb\`
  - *Gốc*: The company rarely offers discounts -> *Đảo ngữ*: **Rarely does the company offer** discounts.
  - *Gốc*: We have seldom witnessed such growth -> *Đảo ngữ*: **Seldom have we witnessed** such growth.
  - *Ví dụ*: **Under no circumstances should** confidential financial records be disclosed.

## 2. Cấu trúc song hành (Parallel Structure)
Các thành phần được nối bởi liên từ tương quan (\`and\`, \`or\`, \`but\`, \`both... and\`, \`either... or\`, \`neither... nor\`, \`not only... but also\`) phải cùng từ loại hoặc cùng dạng ngữ pháp:
- Noun and Noun: The job requires **dedication** and **creativity**.
- V-ing and V-ing: The duties include **organizing** files and **answering** calls.
- Adjective and Adjective: The system is **efficient**, **reliable**, and **affordable**.`,
    formula: 'Rarely/Seldom + Aux + S + V | both X and Y (where X and Y have identical form)',
    examples: [
      {
        sentence: 'Seldom has our research team encountered such a resilient compound during laboratory trials.',
        translation: 'Hiếm khi đội ngũ nghiên cứu của chúng tôi lại bắt gặp một hợp chất có khả năng chống chịu tốt như vậy trong các thử nghiệm phòng thí nghiệm.',
        highlight: 'Seldom has our research team encountered'
      },
      {
        sentence: 'Under no circumstances must unauthorized visitors enter the cleanroom manufacturing area.',
        translation: 'Trong bất kỳ hoàn cảnh nào, khách không có thẩm quyền tuyệt đối không được bước vào khu vực sản xuất phòng sạch.',
        highlight: 'Under no circumstances must unauthorized visitors enter'
      },
      {
        sentence: 'The ideal candidate will be responsible for drafting press releases, coordinating media interviews, and managing social channels.',
        translation: 'Ứng viên lý tưởng sẽ chịu trách nhiệm soạn thảo các thông cáo báo chí, điều phối các cuộc phỏng vấn truyền thông và quản lý các kênh mạng xã hội.',
        highlight: 'drafting..., coordinating..., and managing...'
      }
    ],
    tips: 'Nếu thấy từ đầu câu là trạng từ phủ định (Rarely, Seldom, Never, Under no circumstances, Not only), hãy chọn ngay phương án có trợ động từ đứng liền kề trước chủ ngữ (has the company..., does the manager...).',
    commonErrors: [
      {
        wrong: 'Rarely the firm changes its pricing model.',
        correct: 'Rarely does the firm change its pricing model.',
        explanation: 'Khi "Rarely" đứng đầu câu, bắt buộc phải đảo trợ động từ "does" lên trước chủ ngữ "the firm".'
      },
      {
        wrong: 'His responsibilities include writing reports, to schedule meetings, and filing invoices.',
        correct: 'His responsibilities include writing reports, scheduling meetings, and filing invoices.',
        explanation: 'Cấu trúc song hành yêu cầu tất cả các thành phần sau "include" đều phải ở cùng dạng danh động từ V-ing.'
      }
    ],
    exercises: [
      {
        question: 'Seldom ________ an employee demonstrated such extraordinary dedication to customer satisfaction.',
        options: ['has', 'having', 'is', 'will'],
        correctAnswer: 'A',
        explanation: 'Đảo ngữ với trạng từ phủ định "Seldom" đứng đầu câu kết hợp với quá khứ phân từ "demonstrated" -> chọn trợ động từ hoàn thành "has".',
        difficulty: 3
      },
      {
        question: 'Under no circumstances ________ company personnel share their computer login credentials with third parties.',
        options: ['should', 'ought', 'have to', 'must to'],
        correctAnswer: 'A',
        explanation: 'Cụm từ phủ định tuyệt đối "Under no circumstances" đứng đầu câu đòi hỏi đảo trợ động từ lên trước chủ ngữ: "should company personnel share...".',
        difficulty: 3
      },
      {
        question: 'The new employee handbook clearly outlines company policies, benefits, and ________.',
        options: ['expect', 'expecting', 'expectations', 'expectedly'],
        correctAnswer: 'C',
        explanation: 'Cấu trúc song hành với chuỗi danh từ: "policies" (danh từ), "benefits" (danh từ), "and [expectations]" (danh từ).',
        difficulty: 2
      },
      {
        question: 'Not only ________ the sales target for the third quarter, but our team also set a new annual revenue record.',
        options: ['we reached', 'did we reach', 'we did reach', 'we were reaching'],
        correctAnswer: 'B',
        explanation: 'Cấu trúc đảo ngữ với "Not only" ở đầu mệnh đề thứ nhất: "Not only did we reach... but our team also...".',
        difficulty: 4
      }
    ]
  }
];

// ============================================================================
// 3. TESTS DATASET (3 Mini-Tests + 1 Complete 7-Part Showcase Test)
// ============================================================================

const testsData = [
  {
    id: 'test_mini_01',
    title: 'Mini-Test 01: Core Grammar & Incomplete Sentences (Part 5)',
    description: 'Bài kiểm tra nhanh 20 câu trắc nghiệm ngữ pháp trọng điểm Part 5: thì động từ, thể bị động, từ loại và giới từ.',
    mode: 'MINI_TEST',
    timeLimit: 15,
    targetBand: 'BAND_2',
    questions: [
      {
        part: 'PART_5',
        questionNumber: 1,
        prompt: 'Ms. Thornton ________ her business trip itinerary to the executive director yesterday afternoon.',
        options: [
          { id: 'A', text: 'submits' },
          { id: 'B', text: 'submitted' },
          { id: 'C', text: 'submitting' },
          { id: 'D', text: 'has submitted' }
        ],
        correctOptionId: 'B',
        explanation: 'Thời gian quá khứ xác định "yesterday afternoon" yêu cầu thì Quá khứ đơn (submitted).'
      },
      {
        part: 'PART_5',
        questionNumber: 2,
        prompt: 'All travel expense claims must be approved ________ the department supervisor prior to reimbursement.',
        options: [
          { id: 'A', text: 'by' },
          { id: 'B', text: 'to' },
          { id: 'C', text: 'with' },
          { id: 'D', text: 'at' }
        ],
        correctOptionId: 'A',
        explanation: 'Cấu trúc bị động "be approved by [agent]" (được phê duyệt bởi người giám sát).'
      },
      {
        part: 'PART_5',
        questionNumber: 3,
        prompt: 'The new commercial software operates ________ more reliably than the previous version.',
        options: [
          { id: 'A', text: 'much' },
          { id: 'B', text: 'very' },
          { id: 'C', text: 'too' },
          { id: 'D', text: 'such' }
        ],
        correctOptionId: 'A',
        explanation: 'Trạng từ bổ nghĩa nhấn mạnh cho so sánh hơn "more reliably" là "much". "Very" và "too" không đi với so sánh hơn.'
      },
      {
        part: 'PART_5',
        questionNumber: 4,
        prompt: 'Applicants ________ to take the aptitude test must arrive twenty minutes before the session begins.',
        options: [
          { id: 'A', text: 'require' },
          { id: 'B', text: 'required' },
          { id: 'C', text: 'requiring' },
          { id: 'D', text: 'requirement' }
        ],
        correctOptionId: 'B',
        explanation: 'Rút gọn mệnh đề quan hệ dạng bị động: "Applicants (who are) required to take...".'
      },
      {
        part: 'PART_5',
        questionNumber: 5,
        prompt: 'Please handle the delicate optical instruments ________ when packing them for overseas air freight.',
        options: [
          { id: 'A', text: 'careful' },
          { id: 'B', text: 'carefully' },
          { id: 'C', text: 'carefulness' },
          { id: 'D', text: 'caring' }
        ],
        correctOptionId: 'B',
        explanation: 'Bổ nghĩa cho động từ hành động "handle" cần một trạng từ thể cách: "carefully".'
      },
      {
        part: 'PART_5',
        questionNumber: 6,
        prompt: 'Over the past six months, our logistics facility ________ more than eighty thousand freight packages.',
        options: [
          { id: 'A', text: 'processes' },
          { id: 'B', text: 'is processing' },
          { id: 'C', text: 'has processed' },
          { id: 'D', text: 'processed' }
        ],
        correctOptionId: 'C',
        explanation: 'Dấu hiệu "Over the past six months" yêu cầu dùng thì Hiện tại hoàn thành: "has processed".'
      },
      {
        part: 'PART_5',
        questionNumber: 7,
        prompt: 'The keynote speaker delivered an ________ presentation on artificial intelligence applications in logistics.',
        options: [
          { id: 'A', text: 'impress' },
          { id: 'B', text: 'impression' },
          { id: 'C', text: 'impressive' },
          { id: 'D', text: 'impressively' }
        ],
        correctOptionId: 'C',
        explanation: 'Vị trí đứng trước danh từ "presentation" cần một tính từ bổ nghĩa: "impressive".'
      },
      {
        part: 'PART_5',
        questionNumber: 8,
        prompt: 'Staff members are reminded to lock their desk drawers ________ leaving the premises in the evening.',
        options: [
          { id: 'A', text: 'before' },
          { id: 'B', text: 'during' },
          { id: 'C', text: 'until' },
          { id: 'D', text: 'between' }
        ],
        correctOptionId: 'A',
        explanation: 'Giới từ chỉ thời gian "before + V-ing" (trước khi rời khỏi cơ quan).'
      },
      {
        part: 'PART_5',
        questionNumber: 9,
        prompt: '________ you encounter any technical difficulty while submitting your timesheet, contact the IT hotline.',
        options: [
          { id: 'A', text: 'Should' },
          { id: 'B', text: 'Were' },
          { id: 'C', text: 'Had' },
          { id: 'D', text: 'Unless' }
        ],
        correctOptionId: 'A',
        explanation: 'Đảo ngữ câu điều kiện loại 1 với "Should + S + V-bare" (= If you encounter).'
      },
      {
        part: 'PART_5',
        questionNumber: 10,
        prompt: 'The management team expressed their sincere ________ for the employees’ hard work during the renovation.',
        options: [
          { id: 'A', text: 'appreciate' },
          { id: 'B', text: 'appreciation' },
          { id: 'C', text: 'appreciative' },
          { id: 'D', text: 'appreciatively' }
        ],
        correctOptionId: 'B',
        explanation: 'Sau tính từ "sincere" cần một danh từ: "appreciation" (sự trân trọng/cảm kích).'
      },
      {
        part: 'PART_5',
        questionNumber: 11,
        prompt: 'Customer surveys indicate that our regional showroom is ________ located near major subway connections.',
        options: [
          { id: 'A', text: 'convenience' },
          { id: 'B', text: 'convenient' },
          { id: 'C', text: 'conveniently' },
          { id: 'D', text: 'convening' }
        ],
        correctOptionId: 'C',
        explanation: 'Cụm trạng từ bổ nghĩa cho phân từ "conveniently located" (tọa lạc ở vị trí thuận tiện).'
      },
      {
        part: 'PART_5',
        questionNumber: 12,
        prompt: 'Neither the department supervisor ________ the senior accountant was available to verify the invoice.',
        options: [
          { id: 'A', text: 'or' },
          { id: 'B', text: 'nor' },
          { id: 'C', text: 'and' },
          { id: 'D', text: 'also' }
        ],
        correctOptionId: 'B',
        explanation: 'Cặp liên từ tương quan cố định: "Neither... nor...".'
      },
      {
        part: 'PART_5',
        questionNumber: 13,
        prompt: 'The board of directors is considering ________ an independent auditor to examine the financial records.',
        options: [
          { id: 'A', text: 'hire' },
          { id: 'B', text: 'hiring' },
          { id: 'C', text: 'to hire' },
          { id: 'D', text: 'hired' }
        ],
        correctOptionId: 'B',
        explanation: 'Động từ "consider" luôn đi kèm với danh động từ: "consider hiring".'
      },
      {
        part: 'PART_5',
        questionNumber: 14,
        prompt: '________ the weather was unseasonably cold, attendance at the outdoor product exhibition was exceptionally high.',
        options: [
          { id: 'A', text: 'Although' },
          { id: 'B', text: 'Despite' },
          { id: 'C', text: 'In spite of' },
          { id: 'D', text: 'Because of' }
        ],
        correctOptionId: 'A',
        explanation: 'Phía sau là mệnh đề S + V ("the weather was unseasonably cold"), do đó phải dùng liên từ "Although".'
      },
      {
        part: 'PART_5',
        questionNumber: 15,
        prompt: 'The manufacturing facility maintains strict ________ with international ISO environmental regulations.',
        options: [
          { id: 'A', text: 'comply' },
          { id: 'B', text: 'compliance' },
          { id: 'C', text: 'compliant' },
          { id: 'D', text: 'compliantly' }
        ],
        correctOptionId: 'B',
        explanation: 'Sau tính từ "strict" cần một danh từ: "strict compliance with" (sự tuân thủ nghiêm ngặt đối với).'
      },
      {
        part: 'PART_5',
        questionNumber: 16,
        prompt: 'Mr. Watanabe will be promoted to vice president ________ he achieves his annual sales targets.',
        options: [
          { id: 'A', text: 'provided that' },
          { id: 'B', text: 'in order to' },
          { id: 'C', text: 'because of' },
          { id: 'D', text: 'due to' }
        ],
        correctOptionId: 'A',
        explanation: '"Provided that" (= if / miễn là) là liên từ liên kết mệnh đề điều kiện.'
      },
      {
        part: 'PART_5',
        questionNumber: 17,
        prompt: 'The automated assembly line has operated with zero downtime ________ its installation in January.',
        options: [
          { id: 'A', text: 'since' },
          { id: 'B', text: 'for' },
          { id: 'C', text: 'in' },
          { id: 'D', text: 'during' }
        ],
        correctOptionId: 'A',
        explanation: 'Đi cùng thì Hiện tại hoàn thành "has operated", mốc thời gian "its installation in January" cần dùng giới từ "since" (kể từ khi).'
      },
      {
        part: 'PART_5',
        questionNumber: 18,
        prompt: 'Dr. Evelyn Reed is widely considered to be one of the most ________ economists in the region.',
        options: [
          { id: 'A', text: 'influence' },
          { id: 'B', text: 'influential' },
          { id: 'C', text: 'influentially' },
          { id: 'D', text: 'influencing' }
        ],
        correctOptionId: 'B',
        explanation: 'Cụm so sánh nhất "the most [influential] economists": cần một tính từ bổ nghĩa cho "economists".'
      },
      {
        part: 'PART_5',
        questionNumber: 19,
        prompt: 'The company handbook outlines all safety protocols that employees are expected to ________.',
        options: [
          { id: 'A', text: 'follow' },
          { id: 'B', text: 'follows' },
          { id: 'C', text: 'followed' },
          { id: 'D', text: 'following' }
        ],
        correctOptionId: 'A',
        explanation: 'Cấu trúc bị động "be expected to + V-bare": động từ nguyên mẫu là "follow".'
      },
      {
        part: 'PART_5',
        questionNumber: 20,
        prompt: 'Seldom ________ our organization experienced such rapid quarter-over-quarter customer growth.',
        options: [
          { id: 'A', text: 'has' },
          { id: 'B', text: 'have' },
          { id: 'C', text: 'is' },
          { id: 'D', text: 'was' }
        ],
        correctOptionId: 'A',
        explanation: 'Đảo ngữ trạng từ phủ định: "Seldom + has + our organization (chủ ngữ số ít) + experienced...".'
      }
    ]
  },
  {
    id: 'test_mini_02',
    title: 'Mini-Test 02: Business Vocabulary & Collocations (Part 5)',
    description: 'Bài kiểm tra 20 câu trắc nghiệm từ vựng thương mại chuyên sâu: đàm phán hợp đồng, thanh toán, nhân sự và quản lý kho vận.',
    mode: 'MINI_TEST',
    timeLimit: 15,
    targetBand: 'BAND_3',
    questions: [
      {
        part: 'PART_5',
        questionNumber: 1,
        prompt: 'The chief executive distributed a detailed ________ outlining the topics to be discussed during tomorrow’s board meeting.',
        options: [
          { id: 'A', text: 'agenda' },
          { id: 'B', text: 'fare' },
          { id: 'C', text: 'ticket' },
          { id: 'D', text: 'customs' }
        ],
        correctOptionId: 'A',
        explanation: '"agenda" (chương trình nghị sự cuộc họp). Các từ còn lại không phù hợp ngữ cảnh công việc.'
      },
      {
        part: 'PART_5',
        questionNumber: 2,
        prompt: 'The accounting team will ________ travel expenses once all original receipts are submitted.',
        options: [
          { id: 'A', text: 'reimburse' },
          { id: 'B', text: 'terminate' },
          { id: 'C', text: 'postpone' },
          { id: 'D', text: 'demote' }
        ],
        correctOptionId: 'A',
        explanation: '"reimburse" (hoàn trả công tác phí).'
      },
      {
        part: 'PART_5',
        questionNumber: 3,
        prompt: 'Both corporations entered into a legally ________ agreement that prevents the sharing of proprietary technology.',
        options: [
          { id: 'A', text: 'binding' },
          { id: 'B', text: 'tentative' },
          { id: 'C', text: 'clerical' },
          { id: 'D', text: 'temporary' }
        ],
        correctOptionId: 'A',
        explanation: '"legally binding agreement" (thỏa thuận có tính ràng buộc pháp lý).'
      },
      {
        part: 'PART_5',
        questionNumber: 4,
        prompt: 'A substantial portion of annual operating ________ was allocated to updating cybersecurity infrastructure.',
        options: [
          { id: 'A', text: 'revenue' },
          { id: 'B', text: 'expenditure' },
          { id: 'C', text: 'deficit' },
          { id: 'D', text: 'dividend' }
        ],
        correctOptionId: 'B',
        explanation: '"operating expenditure" (chi phí hoạt động). Cụm "allocated to" chỉ việc phân bổ chi phí.'
      },
      {
        part: 'PART_5',
        questionNumber: 5,
        prompt: 'The updated warehouse management system is fully ________ with our current handheld barcode scanners.',
        options: [
          { id: 'A', text: 'compatible' },
          { id: 'B', text: 'hesitant' },
          { id: 'C', text: 'lucrative' },
          { id: 'D', text: 'provisional' }
        ],
        correctOptionId: 'A',
        explanation: '"compatible with" (tương thích với).'
      },
      {
        part: 'PART_5',
        questionNumber: 6,
        prompt: 'Employees are strongly encouraged to attend the free annual ________ health screenings offered at the company clinic.',
        options: [
          { id: 'A', text: 'preventive' },
          { id: 'B', text: 'damaging' },
          { id: 'C', text: 'deficient' },
          { id: 'D', text: 'hazardous' }
        ],
        correctOptionId: 'A',
        explanation: '"preventive health screenings" (khám sức khỏe phòng ngừa).'
      },
      {
        part: 'PART_5',
        questionNumber: 7,
        prompt: 'The furniture retail chain launched a nationwide ________ sale to liquidate surplus winter inventory.',
        options: [
          { id: 'A', text: 'clearance' },
          { id: 'B', text: 'absence' },
          { id: 'C', text: 'vacancy' },
          { id: 'D', text: 'allowance' }
        ],
        correctOptionId: 'A',
        explanation: '"clearance sale" (đợt xả kho thanh lý hàng tồn).'
      },
      {
        part: 'PART_5',
        questionNumber: 8,
        prompt: 'Technicians must ________ measuring devices each morning to ensure precision during component assembly.',
        options: [
          { id: 'A', text: 'calibrate' },
          { id: 'B', text: 'cancel' },
          { id: 'C', text: 'compromise' },
          { id: 'D', text: 'resign' }
        ],
        correctOptionId: 'A',
        explanation: '"calibrate" (hiệu chuẩn thiết bị đo lường để đảm bảo độ chính xác).'
      },
      {
        part: 'PART_5',
        questionNumber: 9,
        prompt: 'The human resources department announced an immediate ________ for a bilingual corporate communications officer.',
        options: [
          { id: 'A', text: 'vacancy' },
          { id: 'B', text: 'itinerary' },
          { id: 'C', text: 'subsidy' },
          { id: 'D', text: 'collateral' }
        ],
        correctOptionId: 'A',
        explanation: '"vacancy" (vị trí tuyển dụng còn trống).'
      },
      {
        part: 'PART_5',
        questionNumber: 10,
        prompt: 'The new luxury sedan has already earned an outstanding ________ for fuel economy and driver comfort.',
        options: [
          { id: 'A', text: 'reputation' },
          { id: 'B', text: 'concession' },
          { id: 'C', text: 'malfunction' },
          { id: 'D', text: 'sanitation' }
        ],
        correctOptionId: 'A',
        explanation: '"reputation for" (danh tiếng/uy tín về cái gì).'
      },
      {
        part: 'PART_5',
        questionNumber: 11,
        prompt: 'Our marketing team designed promotional flyers to ________ young urban professionals seeking eco-friendly transport.',
        options: [
          { id: 'A', text: 'target' },
          { id: 'B', text: 'terminate' },
          { id: 'C', text: 'reconcile' },
          { id: 'D', text: 'overhaul' }
        ],
        correctOptionId: 'A',
        explanation: '"target" (nhắm tới đối tượng khách hàng mục tiêu).'
      },
      {
        part: 'PART_5',
        questionNumber: 12,
        prompt: 'The vendor pledged to ________ the client against any financial losses stemming from third-party copyright claims.',
        options: [
          { id: 'A', text: 'indemnify' },
          { id: 'B', text: 'calculate' },
          { id: 'C', text: 'commute' },
          { id: 'D', text: 'demote' }
        ],
        correctOptionId: 'A',
        explanation: '"indemnify someone against" (bồi thường/bảo đảm cho ai khỏi thiệt hại).'
      },
      {
        part: 'PART_5',
        questionNumber: 13,
        prompt: 'Because of automated invoicing, the finance division reduced processing ________ from five days to four hours.',
        options: [
          { id: 'A', text: 'lead time' },
          { id: 'B', text: 'curriculum' },
          { id: 'C', text: 'pension' },
          { id: 'D', text: 'stationery' }
        ],
        correctOptionId: 'A',
        explanation: '"lead time" (thời gian từ lúc bắt đầu đến khi hoàn thành quy trình xử lý).'
      },
      {
        part: 'PART_5',
        questionNumber: 14,
        prompt: 'The airline provided stranded passengers with meal vouchers to compensate for the flight ________.',
        options: [
          { id: 'A', text: 'inconvenience' },
          { id: 'B', text: 'appraisal' },
          { id: 'C', text: 'subsidy' },
          { id: 'D', text: 'warranty' }
        ],
        correctOptionId: 'A',
        explanation: '"compensate for the inconvenience" (bồi thường cho sự bất tiện gây ra).'
      },
      {
        part: 'PART_5',
        questionNumber: 15,
        prompt: 'A registered patent ensures that our proprietary manufacturing technique remains legally ________ in international courts.',
        options: [
          { id: 'A', text: 'enforceable' },
          { id: 'B', text: 'allergic' },
          { id: 'C', text: 'punctual' },
          { id: 'D', text: 'provisional' }
        ],
        correctOptionId: 'A',
        explanation: '"enforceable" (có hiệu lực thi hành theo pháp luật).'
      },
      {
        part: 'PART_5',
        questionNumber: 16,
        prompt: 'The hospital completed a thorough ________ of its emergency backup power generators.',
        options: [
          { id: 'A', text: 'overhaul' },
          { id: 'B', text: 'ballot' },
          { id: 'C', text: 'brochure' },
          { id: 'D', text: 'concession' }
        ],
        correctOptionId: 'A',
        explanation: '"overhaul" (cuộc đại tu, kiểm tra bảo dưỡng toàn diện).'
      },
      {
        part: 'PART_5',
        questionNumber: 17,
        prompt: 'Frequent flyer club members enjoy ________ access to the premier airport executive lounge.',
        options: [
          { id: 'A', text: 'complimentary' },
          { id: 'B', text: 'confidential' },
          { id: 'C', text: 'chronic' },
          { id: 'D', text: 'clerical' }
        ],
        correctOptionId: 'A',
        explanation: '"complimentary access" (quyền ra vào miễn phí như một ưu đãi tặng kèm).'
      },
      {
        part: 'PART_5',
        questionNumber: 18,
        prompt: 'The logistics agency dispatched an ocean ________ of consumer electronics to the European distribution hub.',
        options: [
          { id: 'A', text: 'consignment' },
          { id: 'B', text: 'settlement' },
          { id: 'C', text: 'prescription' },
          { id: 'D', text: 'turnover' }
        ],
        correctOptionId: 'A',
        explanation: '"consignment" (lô hàng vận chuyển).'
      },
      {
        part: 'PART_5',
        questionNumber: 19,
        prompt: 'To protect customer identity, database administrators implemented end-to-end 256-bit ________.',
        options: [
          { id: 'A', text: 'encryption' },
          { id: 'B', text: 'sanitation' },
          { id: 'C', text: 'negotiation' },
          { id: 'D', text: 'orientation' }
        ],
        correctOptionId: 'A',
        explanation: '"256-bit encryption" (mã hóa dữ liệu 256-bit an toàn).'
      },
      {
        part: 'PART_5',
        questionNumber: 20,
        prompt: 'The newly appointed director plans to ________ routine office responsibilities to senior team coordinators.',
        options: [
          { id: 'A', text: 'delegate' },
          { id: 'B', text: 'reconcile' },
          { id: 'C', text: 'rescind' },
          { id: 'D', text: 'demote' }
        ],
        correctOptionId: 'A',
        explanation: '"delegate responsibilities" (ủy thác, giao phó trách nhiệm).'
      }
    ]
  },
  {
    id: 'test_mini_03',
    title: 'Mini-Test 03: Workplace Communications (Part 5 & Part 6)',
    description: 'Bài kiểm tra 20 câu tích hợp: 16 câu Part 5 (Incomplete Sentences) và 4 câu Part 6 (Text Completion) hoàn thiện đoạn văn bản email công sở.',
    mode: 'MINI_TEST',
    timeLimit: 15,
    targetBand: 'BAND_3',
    questions: [
      {
        part: 'PART_5',
        questionNumber: 1,
        prompt: 'The chief executive distributed a memo reminding employees to wear their identification badges ________ all times.',
        options: [
          { id: 'A', text: 'at' },
          { id: 'B', text: 'in' },
          { id: 'C', text: 'on' },
          { id: 'D', text: 'to' }
        ],
        correctOptionId: 'A',
        explanation: 'Cụm thành ngữ giới từ cố định: "at all times" (luôn luôn, vào mọi thời điểm).'
      },
      {
        part: 'PART_5',
        questionNumber: 2,
        prompt: 'Before signing the commercial lease agreement, the tenant asked an attorney to examine the cancellation ________.',
        options: [
          { id: 'A', text: 'clause' },
          { id: 'B', text: 'clinic' },
          { id: 'C', text: 'customs' },
          { id: 'D', text: 'commute' }
        ],
        correctOptionId: 'A',
        explanation: '"cancellation clause" (điều khoản hủy bỏ hợp đồng).'
      },
      {
        part: 'PART_5',
        questionNumber: 3,
        prompt: 'The revised human resources guidelines will be ________ to all personnel via the corporate intranet.',
        options: [
          { id: 'A', text: 'distributed' },
          { id: 'B', text: 'distribution' },
          { id: 'C', text: 'distributor' },
          { id: 'D', text: 'distributing' }
        ],
        correctOptionId: 'A',
        explanation: 'Dạng bị động tương lai "will be + V3/ed": "distributed".'
      },
      {
        part: 'PART_5',
        questionNumber: 4,
        prompt: 'Our branch manager decided to ________ the staff briefing until all regional representatives had arrived.',
        options: [
          { id: 'A', text: 'postpone' },
          { id: 'B', text: 'indemnify' },
          { id: 'C', text: 'calibrate' },
          { id: 'D', text: 'reimburse' }
        ],
        correctOptionId: 'A',
        explanation: '"postpone the briefing" (hoãn buổi thông báo lại).'
      },
      {
        part: 'PART_5',
        questionNumber: 5,
        prompt: 'Mr. Vance has ________ contributed to our company\'s international business development over the last decade.',
        options: [
          { id: 'A', text: 'significantly' },
          { id: 'B', text: 'significant' },
          { id: 'C', text: 'significance' },
          { id: 'D', text: 'signify' }
        ],
        correctOptionId: 'A',
        explanation: 'Vị trí giữa trợ động từ "has" và động từ "contributed" cần một trạng từ: "significantly".'
      },
      {
        part: 'PART_5',
        questionNumber: 6,
        prompt: 'The conference organizers announced that free shuttle buses will run ________ the hotel and the convention center.',
        options: [
          { id: 'A', text: 'between' },
          { id: 'B', text: 'among' },
          { id: 'C', text: 'during' },
          { id: 'D', text: 'against' }
        ],
        correctOptionId: 'A',
        explanation: 'Cấu trúc "between X and Y" (giữa hai địa điểm: khách sạn và trung tâm hội nghị).'
      },
      {
        part: 'PART_5',
        questionNumber: 7,
        prompt: 'Any staff member wishing to enroll in the leadership program must submit an ________ before October 31.',
        options: [
          { id: 'A', text: 'application' },
          { id: 'B', text: 'applicant' },
          { id: 'C', text: 'applicable' },
          { id: 'D', text: 'apply' }
        ],
        correctOptionId: 'A',
        explanation: 'Sau mạo từ "an" cần một danh từ chỉ sự vật/hồ sơ: "application" (đơn xin tham gia).'
      },
      {
        part: 'PART_5',
        questionNumber: 8,
        prompt: 'The engineering team completed the safety audit ________ than originally anticipated by management.',
        options: [
          { id: 'A', text: 'quicker' },
          { id: 'B', text: 'more quickly' },
          { id: 'C', text: 'most quickly' },
          { id: 'D', text: 'quickness' }
        ],
        correctOptionId: 'B',
        explanation: 'Bổ nghĩa cho động từ "completed" với cấu trúc so sánh hơn có "than" cần trạng từ so sánh hơn: "more quickly".'
      },
      {
        part: 'PART_5',
        questionNumber: 9,
        prompt: 'The corporate legal team is drafting a ________ agreement pending regulatory review.',
        options: [
          { id: 'A', text: 'provisional' },
          { id: 'B', text: 'punctual' },
          { id: 'C', text: 'clerical' },
          { id: 'D', text: 'chronic' }
        ],
        correctOptionId: 'A',
        explanation: '"provisional agreement" (thỏa thuận tạm thời/lâm thời trong khi chờ phê duyệt).'
      },
      {
        part: 'PART_5',
        questionNumber: 10,
        prompt: 'The new employee expressed gratitude to her assigned ________ for providing invaluable onboarding guidance.',
        options: [
          { id: 'A', text: 'mentor' },
          { id: 'B', text: 'inventory' },
          { id: 'C', text: 'voucher' },
          { id: 'D', text: 'downtime' }
        ],
        correctOptionId: 'A',
        explanation: '"mentor" (người hướng dẫn/cố vấn kinh nghiệm).'
      },
      {
        part: 'PART_5',
        questionNumber: 11,
        prompt: 'Customers are advised to keep the original store receipt in case they need to request a ________.',
        options: [
          { id: 'A', text: 'refund' },
          { id: 'B', text: 'transit' },
          { id: 'C', text: 'collateral' },
          { id: 'D', text: 'ballot' }
        ],
        correctOptionId: 'A',
        explanation: '"request a refund" (yêu cầu hoàn tiền lại khi có biên lai gốc).'
      },
      {
        part: 'PART_5',
        questionNumber: 12,
        prompt: 'The marketing agency conducted an in-depth survey to assess brand ________ among younger consumers.',
        options: [
          { id: 'A', text: 'loyalty' },
          { id: 'B', text: 'deficit' },
          { id: 'C', text: 'dividend' },
          { id: 'D', text: 'amenity' }
        ],
        correctOptionId: 'A',
        explanation: '"brand loyalty" (lòng trung thành thương hiệu).'
      },
      {
        part: 'PART_5',
        questionNumber: 13,
        prompt: 'Senior associates must verify that all database tables are ________ backed up every midnight.',
        options: [
          { id: 'A', text: 'automatically' },
          { id: 'B', text: 'automatic' },
          { id: 'C', text: 'automation' },
          { id: 'D', text: 'automating' }
        ],
        correctOptionId: 'A',
        explanation: 'Trạng từ "automatically" bổ nghĩa cho dạng bị động "backed up".'
      },
      {
        part: 'PART_5',
        questionNumber: 14,
        prompt: 'A sudden increase in international shipping ________ forced the firm to adjust its export pricing.',
        options: [
          { id: 'A', text: 'rates' },
          { id: 'B', text: 'rated' },
          { id: 'C', text: 'rating' },
          { id: 'D', text: 'rate' }
        ],
        correctOptionId: 'A',
        explanation: 'Cụm danh từ "shipping rates" (cước phí vận chuyển hàng hóa).'
      },
      {
        part: 'PART_5',
        questionNumber: 15,
        prompt: 'Neither the financial director nor the department managers ________ in favor of shortening the training period.',
        options: [
          { id: 'A', text: 'were' },
          { id: 'B', text: 'was' },
          { id: 'C', text: 'is' },
          { id: 'D', text: 'being' }
        ],
        correctOptionId: 'A',
        explanation: 'Trong cấu trúc "Neither A nor B", động từ chia theo danh từ gần nhất "the department managers" (số nhiều trong quá khứ -> were).'
      },
      {
        part: 'PART_5',
        questionNumber: 16,
        prompt: 'Ms. Gomez was commended by the board for her ________ management of the regional branch relocation.',
        options: [
          { id: 'A', text: 'exceptional' },
          { id: 'B', text: 'exceptionally' },
          { id: 'C', text: 'exception' },
          { id: 'D', text: 'except' }
        ],
        correctOptionId: 'A',
        explanation: 'Trước danh từ "management" cần một tính từ bổ nghĩa: "exceptional" (xuất sắc).'
      },
      // Part 6 Passage Questions (Questions 17-20)
      {
        part: 'PART_6',
        questionNumber: 17,
        passageText: `MEMORANDUM
To: All Headquarters Staff
From: Corporate Human Resources Division
Date: November 4, 2026
Subject: Annual Workplace Wellness Initiatives

We are pleased to announce the schedule for our upcoming Annual Wellness Week, which will take place from November 16 to November 20. This year, the company has partnered with certified health practitioners to provide free on-site biometric screenings.

All full-time and contract personnel are strongly encouraged to participate in these [17] ________ health assessments. Regular checkups play a crucial role in detecting potential issues early.

[18] ________. In addition, the cafeteria will feature a revised healthy menu prepared in consultation with nutritionists.

Appointments for health screenings can be scheduled online via the employee portal starting this Thursday. Please note that slots are limited and will be filled on a [19] ________ basis.

Should you have any questions regarding the schedule or eligible services, do not hesitate [20] ________ the HR wellness coordinator at extension 408.`,
        prompt: 'Choose the best option to complete blank [17]:',
        options: [
          { id: 'A', text: 'preventive' },
          { id: 'B', text: 'hazardous' },
          { id: 'C', text: 'damaging' },
          { id: 'D', text: 'deficient' }
        ],
        correctOptionId: 'A',
        explanation: '"preventive health assessments" (các cuộc đánh giá sức khỏe phòng ngừa). Phù hợp với ngữ cảnh khám sức khỏe định kỳ.'
      },
      {
        part: 'PART_6',
        questionNumber: 18,
        prompt: 'Choose the best sentence to insert into blank [18]:',
        options: [
          { id: 'A', text: 'Screening results will be kept strictly confidential and shared only with each individual.' },
          { id: 'B', text: 'The parking lot will be closed for repaving throughout the entire weekend.' },
          { id: 'C', text: 'All overseas flights require advance booking through the designated travel agency.' },
          { id: 'D', text: 'Factory production was temporarily suspended due to routine machine maintenance.' }
        ],
        correctOptionId: 'A',
        explanation: 'Câu này bổ sung thông tin trấn an về tính bảo mật của kết quả khám sức khỏe (confidentiality), hoàn toàn logic với đoạn văn.'
      },
      {
        part: 'PART_6',
        questionNumber: 19,
        prompt: 'Choose the best option to complete blank [19]:',
        options: [
          { id: 'A', text: 'first-come, first-served' },
          { id: 'B', text: 'null and void' },
          { id: 'C', text: 'out of date' },
          { id: 'D', text: 'point of view' }
        ],
        correctOptionId: 'A',
        explanation: 'Thành ngữ công sở cố định: "on a first-come, first-served basis" (theo thứ tự ai đăng ký trước được phục vụ trước).'
      },
      {
        part: 'PART_6',
        questionNumber: 20,
        prompt: 'Choose the best option to complete blank [20]:',
        options: [
          { id: 'A', text: 'to contact' },
          { id: 'B', text: 'contacting' },
          { id: 'C', text: 'contact' },
          { id: 'D', text: 'contacted' }
        ],
        correctOptionId: 'A',
        explanation: 'Cấu trúc cố định "hesitate to do something": "do not hesitate to contact".'
      }
    ]
  },
  {
    id: 'test_showcase_full',
    title: 'ETS Showcase Test: Full Parts 1 to 7 Diagnostic',
    description: 'Bộ đề thi mẫu hoàn chỉnh kiểm thử toàn diện cả 7 Parts (Part 1 Ảnh, Part 2 Hỏi-Đáp, Part 3 Hội thoại, Part 4 Bài nói, Part 5 Điền câu, Part 6 Hoàn thành văn bản, Part 7 Đọc hiểu).',
    mode: 'FULL_TEST',
    timeLimit: 30,
    targetBand: 'BAND_3',
    questions: [
      // PART 1: Photographs (Questions 1-2)
      {
        part: 'PART_1',
        questionNumber: 1,
        imageUrl: '/images/test-samples/part1_office_meeting.webp',
        prompt: 'Look at the photograph and choose the statement that best describes what you see in the picture:\n\n(A) A woman is typing on a desktop computer.\n(B) Several colleagues are seated around a conference table.\n(C) A presentation screen is being dismantled.\n(D) Papers are scattered across the carpeted floor.',
        options: [
          { id: 'A', text: 'A woman is typing on a desktop computer.' },
          { id: 'B', text: 'Several colleagues are seated around a conference table.' },
          { id: 'C', text: 'A presentation screen is being dismantled.' },
          { id: 'D', text: 'Papers are scattered across the carpeted floor.' }
        ],
        correctOptionId: 'B',
        explanation: 'Đáp án (B) mô tả chính xác nhất bức ảnh chụp cuộc họp bàn tròn nơi các đồng nghiệp đang ngồi thảo luận.'
      },
      {
        part: 'PART_1',
        questionNumber: 2,
        imageUrl: '/images/test-samples/part1_warehouse.webp',
        prompt: 'Look at the photograph and choose the statement that best describes what you see in the picture:\n\n(A) A forklift is transporting stacked cardboard cartons.\n(B) The warehouse shelves are completely empty.\n(C) Workers are sweeping the loading dock outside.\n(D) Delivery vans are parked along the highway.',
        options: [
          { id: 'A', text: 'A forklift is transporting stacked cardboard cartons.' },
          { id: 'B', text: 'The warehouse shelves are completely empty.' },
          { id: 'C', text: 'Workers are sweeping the loading dock outside.' },
          { id: 'D', text: 'Delivery vans are parked along the highway.' }
        ],
        correctOptionId: 'A',
        explanation: 'Đáp án (A) miêu tả hành động chiếc xe nâng (forklift) đang di chuyển các kiện hàng trong kho hàng.'
      },

      // PART 2: Question-Response (Questions 3-5)
      {
        part: 'PART_2',
        questionNumber: 3,
        prompt: 'Where did you leave the client’s signed contract?\n\n(A) In the blue folder on Mr. Tanaka’s desk.\n(B) Yes, the terms were very reasonable.\n(C) About three days ago.',
        options: [
          { id: 'A', text: 'In the blue folder on Mr. Tanaka’s desk.' },
          { id: 'B', text: 'Yes, the terms were very reasonable.' },
          { id: 'C', text: 'About three days ago.' }
        ],
        correctOptionId: 'A',
        explanation: 'Câu hỏi bắt đầu bằng "Where" (ở đâu), đáp án chỉ nơi chốn chính xác là (A) "In the blue folder on Mr. Tanaka’s desk".'
      },
      {
        part: 'PART_2',
        questionNumber: 4,
        prompt: 'Who is responsible for organizing this Friday’s regional sales seminar?\n\n(A) At the Grand Plaza Hotel.\n(B) Ms. Patterson from marketing is handling it.\n(C) Yes, it begins at nine sharp.',
        options: [
          { id: 'A', text: 'At the Grand Plaza Hotel.' },
          { id: 'B', text: 'Ms. Patterson from marketing is handling it.' },
          { id: 'C', text: 'Yes, it begins at nine sharp.' }
        ],
        correctOptionId: 'B',
        explanation: 'Câu hỏi bắt đầu bằng "Who" (ai chịu trách nhiệm), đáp án chỉ người là (B) "Ms. Patterson from marketing is handling it".'
      },
      {
        part: 'PART_2',
        questionNumber: 5,
        prompt: 'When is the revised annual budget expected to be approved by the board?\n\n(A) By late next Wednesday afternoon.\n(B) We exceeded our sales revenue targets.\n(C) For the accounting department.',
        options: [
          { id: 'A', text: 'By late next Wednesday afternoon.' },
          { id: 'B', text: 'We exceeded our sales revenue targets.' },
          { id: 'C', text: 'For the accounting department.' }
        ],
        correctOptionId: 'A',
        explanation: 'Câu hỏi bắt đầu bằng "When" (khi nào), đáp án chỉ thời gian là (A) "By late next Wednesday afternoon".'
      },

      // PART 3: Short Conversations (Questions 6-8)
      {
        part: 'PART_3',
        questionNumber: 6,
        passageText: `Questions 6 through 8 refer to the following conversation:

Man: Good morning, Brenda. Have you had a chance to review the quotation we received from Apex Office Supplies?
Woman: Yes, Jack, I looked over it this morning. Their bulk discount for printer paper and ink cartridges is fifteen percent lower than what our current vendor charges.
Man: That sounds like a significant cost saving. But can they guarantee same-day delivery if we place orders before noon?
Woman: Their sales representative confirmed they maintain a local warehouse in the industrial park, so same-day dispatch won't be an issue. I'll prepare the vendor switch proposal for the director right away.`,
        prompt: 'What are the speakers mainly discussing?',
        options: [
          { id: 'A', text: 'Purchasing office supplies from a new vendor' },
          { id: 'B', text: 'Upgrading computer monitors in the accounting division' },
          { id: 'C', text: 'Organizing an annual corporate anniversary celebration' },
          { id: 'D', text: 'Hiring a temporary administrative assistant' }
        ],
        correctOptionId: 'A',
        explanation: 'Hai người đang thảo luận về bảng báo giá và chiết khấu từ nhà cung cấp văn phòng phẩm mới (Apex Office Supplies).'
      },
      {
        part: 'PART_3',
        questionNumber: 7,
        prompt: 'What advantage does Apex Office Supplies offer according to the woman?',
        options: [
          { id: 'A', text: 'Free international courier delivery' },
          { id: 'B', text: 'A fifteen percent lower bulk price' },
          { id: 'C', text: 'A five-year equipment warranty' },
          { id: 'D', text: 'Customized stationery printing' }
        ],
        correctOptionId: 'B',
        explanation: 'Người phụ nữ nói rõ: "Their bulk discount for printer paper and ink cartridges is fifteen percent lower".'
      },
      {
        part: 'PART_3',
        questionNumber: 8,
        prompt: 'What will the woman probably do next?',
        options: [
          { id: 'A', text: 'Cancel the company’s internet subscription' },
          { id: 'B', text: 'Prepare a vendor switch proposal for the director' },
          { id: 'C', text: 'Call the maintenance department to fix the printer' },
          { id: 'D', text: 'Ship a package to the European branch' }
        ],
        correctOptionId: 'B',
        explanation: 'Câu cuối cùng của người phụ nữ: "I\'ll prepare the vendor switch proposal for the director right away".'
      },

      // PART 4: Short Talks (Questions 9-11)
      {
        part: 'PART_4',
        questionNumber: 9,
        passageText: `Questions 9 through 11 refer to the following telephone voicemail message:

"Hello, this is Marcus Bradley from Bradley Commercial Real Estate calling for Ms. Evelyn Davis. I am calling to update you regarding the lease agreement for the second-floor office suite on Riverside Avenue. The property owner has reviewed your proposed move-in date and agreed to waive the first month's parking fee as an incentive. However, they requested an updated copy of your corporation's audited financial statement before finalizing the five-year lease. Please email that document to my office by 4:00 PM tomorrow so we can draft the final contract for your signature. You can reach me at 555-0194 if you have any questions. Thank you."`,
        prompt: 'What is the purpose of the phone call?',
        options: [
          { id: 'A', text: 'To update the listener regarding a commercial office lease' },
          { id: 'B', text: 'To announce the cancellation of a property viewing' },
          { id: 'C', text: 'To complain about late maintenance work in a building' },
          { id: 'D', text: 'To invite attendees to an architectural seminar' }
        ],
        correctOptionId: 'A',
        explanation: 'Người gọi mở đầu: "I am calling to update you regarding the lease agreement for the second-floor office suite".'
      },
      {
        part: 'PART_4',
        questionNumber: 10,
        prompt: 'What concession has the property owner agreed to offer?',
        options: [
          { id: 'A', text: 'A ten percent reduction on the purchase price' },
          { id: 'B', text: 'Waiving the first month\'s parking fee' },
          { id: 'C', text: 'Free high-speed fiber internet for one year' },
          { id: 'D', text: 'Customized executive furniture installation' }
        ],
        correctOptionId: 'B',
        explanation: 'Người gọi nêu rõ: "agreed to waive the first month\'s parking fee as an incentive".'
      },
      {
        part: 'PART_4',
        questionNumber: 11,
        prompt: 'What does the speaker ask Ms. Davis to email by tomorrow afternoon?',
        options: [
          { id: 'A', text: 'Her driver’s license number' },
          { id: 'B', text: 'An audited corporate financial statement' },
          { id: 'C', text: 'A letter of recommendation from her bank' },
          { id: 'D', text: 'A photograph of her previous office' }
        ],
        correctOptionId: 'B',
        explanation: 'Người nói yêu cầu: "requested an updated copy of your corporation\'s audited financial statement... Please email that document to my office by 4:00 PM tomorrow".'
      },

      // PART 5: Incomplete Sentences (Questions 12-17)
      {
        part: 'PART_5',
        questionNumber: 12,
        prompt: 'All employees participating in the regional conference must submit their registration forms ________ October 20.',
        options: [
          { id: 'A', text: 'by' },
          { id: 'B', text: 'to' },
          { id: 'C', text: 'in' },
          { id: 'D', text: 'on' }
        ],
        correctOptionId: 'A',
        explanation: 'Hạn chót dứt điểm nộp biểu mẫu: "by October 20" (trước hoặc muộn nhất vào ngày 20 tháng 10).'
      },
      {
        part: 'PART_5',
        questionNumber: 13,
        prompt: 'The newly introduced software operates ________ more smoothly than the previous version.',
        options: [
          { id: 'A', text: 'substantially' },
          { id: 'B', text: 'substantial' },
          { id: 'C', text: 'substance' },
          { id: 'D', text: 'substantiate' }
        ],
        correctOptionId: 'A',
        explanation: 'Trạng từ "substantially" bổ nghĩa nhấn mạnh cho tính từ/trạng từ so sánh hơn "more smoothly".'
      },
      {
        part: 'PART_5',
        questionNumber: 14,
        prompt: 'Ms. Vance was commended by the board for her ________ management of the factory expansion project.',
        options: [
          { id: 'A', text: 'exceptional' },
          { id: 'B', text: 'exceptionally' },
          { id: 'C', text: 'exception' },
          { id: 'D', text: 'excepting' }
        ],
        correctOptionId: 'A',
        explanation: 'Trước danh từ "management" cần một tính từ bổ nghĩa: "exceptional".'
      },
      {
        part: 'PART_5',
        questionNumber: 15,
        prompt: 'The manufacturing plant has operated with zero safety incidents ________ it reopened following renovations.',
        options: [
          { id: 'A', text: 'since' },
          { id: 'B', text: 'during' },
          { id: 'C', text: 'for' },
          { id: 'D', text: 'while' }
        ],
        correctOptionId: 'A',
        explanation: 'Mệnh đề thì Hiện tại hoàn thành ("has operated") đi với "since + mệnh đề quá khứ đơn" ("since it reopened").'
      },
      {
        part: 'PART_5',
        questionNumber: 16,
        prompt: 'Neither the accounting manager ________ the chief financial officer approved the proposed budget increase.',
        options: [
          { id: 'A', text: 'nor' },
          { id: 'B', text: 'or' },
          { id: 'C', text: 'and' },
          { id: 'D', text: 'also' }
        ],
        correctOptionId: 'A',
        explanation: 'Cấu trúc tương quan "Neither... nor...".'
      },
      {
        part: 'PART_5',
        questionNumber: 17,
        prompt: 'Should you ________ any problems with the wireless network, contact technical support immediately.',
        options: [
          { id: 'A', text: 'experience' },
          { id: 'B', text: 'experienced' },
          { id: 'C', text: 'experiencing' },
          { id: 'D', text: 'to experience' }
        ],
        correctOptionId: 'A',
        explanation: 'Đảo ngữ câu điều kiện loại 1 với "Should + S + V-bare": động từ nguyên mẫu là "experience".'
      },

      // PART 6: Text Completion (Questions 18-21)
      {
        part: 'PART_6',
        questionNumber: 18,
        passageText: `EMAIL NOTICE
To: All Regional Sales Representatives
From: Marcus Hayes, Director of Global Distribution
Date: August 12, 2026
Subject: Implementation of New Client Relationship Portal

Dear Team,

Starting Monday, August 17, our company will officially migrate to the Nexus-360 client relationship management platform. This state-of-the-art system has been designed to [18] ________ administrative lead times and facilitate seamless communication between field reps and headquarters.

All client records, quotation drafts, and contract histories [19] ________ transferred to the new cloud database over the weekend.

[20] ________.

Should you encounter any difficulty accessing client accounts on Monday morning, please contact the IT support desk [21] ________ extension 204.

Best regards,
Marcus Hayes`,
        prompt: 'Choose the best option to complete blank [18]:',
        options: [
          { id: 'A', text: 'reduce' },
          { id: 'B', text: 'prolong' },
          { id: 'C', text: 'damage' },
          { id: 'D', text: 'hesitate' }
        ],
        correctOptionId: 'A',
        explanation: '"reduce administrative lead times" (cắt giảm thời gian xử lý thủ tục hành chính).'
      },
      {
        part: 'PART_6',
        questionNumber: 19,
        prompt: 'Choose the best option to complete blank [19]:',
        options: [
          { id: 'A', text: 'will be' },
          { id: 'B', text: 'was' },
          { id: 'C', text: 'is' },
          { id: 'D', text: 'having been' }
        ],
        correctOptionId: 'A',
        explanation: 'Hành động chuyển đổi dữ liệu diễn ra vào cuối tuần tới: thì tương lai bị động "will be transferred".'
      },
      {
        part: 'PART_6',
        questionNumber: 20,
        prompt: 'Choose the best sentence to insert into blank [20]:',
        options: [
          { id: 'A', text: 'A mandatory sixty-minute training webinar will be hosted this Friday at 10:00 AM.' },
          { id: 'B', text: 'Our annual holiday celebration has been rescheduled for next January.' },
          { id: 'C', text: 'Parking lot maintenance will restrict vehicle access during the lunch hour.' },
          { id: 'D', text: 'Overseas business travel expenses must be submitted within thirty days.' }
        ],
        correctOptionId: 'A',
        explanation: 'Câu nói về buổi hội thảo hướng dẫn sử dụng phần mềm mới (training webinar) kết nối tự nhiên và chặt chẽ nhất với thông báo triển khai hệ thống.'
      },
      {
        part: 'PART_6',
        questionNumber: 21,
        prompt: 'Choose the best option to complete blank [21]:',
        options: [
          { id: 'A', text: 'at' },
          { id: 'B', text: 'in' },
          { id: 'C', text: 'with' },
          { id: 'D', text: 'on' }
        ],
        correctOptionId: 'A',
        explanation: 'Cụm từ chỉ số máy nhánh nội bộ: "at extension [number]".'
      },

      // PART 7: Reading Comprehension (Questions 22-25)
      {
        part: 'PART_7',
        questionNumber: 22,
        passageText: `READING PASSAGE: BUSINESS MEMORANDUM & PRESS RELEASE

KIMURA ADVANCED LOGISTICS
INTERNAL MEMORANDUM

To: Executive Leadership Team
From: Kenjiro Sato, Chief Operating Officer
Date: October 14, 2026
Subject: Opening of New Automated Distribution Center in Da Nang

I am delighted to report that our new automated distribution center in the Hoa Khanh Industrial Zone in Da Nang is scheduled to commence commercial operations on November 1, two weeks ahead of our initial timetable.

The 45,000-square-meter facility represents a $35 million strategic investment. It is equipped with advanced robotic sorting conveyors and AI-powered optical barcode scanners capable of handling up to 50,000 consignments per day. This expansion will allow us to offer guaranteed next-day delivery across central Vietnam, while reducing our regional carbon emissions by twenty percent through rooftop solar panel arrays.

A formal ribbon-cutting ceremony and facility tour will be held on Thursday, November 5, from 10:00 AM to 1:00 PM. High-ranking representatives from the Ministry of Industry and Trade and several key commercial clients have already confirmed their attendance.

Department heads wishing to send representatives to the opening ceremony must submit the names of designated attendees to the corporate communications office by October 24 so that security badges and transportation vouchers can be issued.`,
        prompt: 'What is the main topic of the memorandum?',
        options: [
          { id: 'A', text: 'The inauguration of a new automated logistics facility in Da Nang' },
          { id: 'B', text: 'An increase in freight shipping tariffs across Southeast Asia' },
          { id: 'C', text: 'The dismissal of a regional warehouse contractor' },
          { id: 'D', text: 'A merger between two commercial real estate firms' }
        ],
        correctOptionId: 'A',
        explanation: 'Bản ghi nhớ thông báo về việc mở và đưa vào vận hành trung tâm phân phối tự động mới tại Đà Nẵng.'
      },
      {
        part: 'PART_7',
        questionNumber: 23,
        prompt: 'According to the memorandum, what is significant about the start date?',
        options: [
          { id: 'A', text: 'It occurs two weeks ahead of schedule.' },
          { id: 'B', text: 'It has been delayed until next spring.' },
          { id: 'C', text: 'It coincides with the company’s fiftieth anniversary.' },
          { id: 'D', text: 'It requires approval from international environmental regulators.' }
        ],
        correctOptionId: 'A',
        explanation: 'Văn bản nêu rõ: "scheduled to commence commercial operations on November 1, two weeks ahead of our initial timetable".'
      },
      {
        part: 'PART_7',
        questionNumber: 24,
        prompt: 'What environmental feature of the facility is highlighted?',
        options: [
          { id: 'A', text: 'Rooftop solar panel arrays' },
          { id: 'B', text: 'An on-site geothermal heating system' },
          { id: 'C', text: 'A fleet of hydrogen-powered transport ships' },
          { id: 'D', text: 'Recycled rainwater collection tanks' }
        ],
        correctOptionId: 'A',
        explanation: 'Đoạn văn ghi: "reducing our regional carbon emissions by twenty percent through rooftop solar panel arrays".'
      },
      {
        part: 'PART_7',
        questionNumber: 25,
        prompt: 'What must department heads do by October 24 if they want staff to attend the ceremony?',
        options: [
          { id: 'A', text: 'Submit designated attendees\' names to corporate communications' },
          { id: 'B', text: 'Book their own hotel accommodations in Da Nang' },
          { id: 'C', text: 'Pay an admission fee for security clearance' },
          { id: 'D', text: 'Complete an online safety inspection training course' }
        ],
        correctOptionId: 'A',
        explanation: 'Câu cuối: "must submit the names of designated attendees to the corporate communications office by October 24".'
      }
    ]
  }
];

// ============================================================================
// 4. WRITE JSON FILES
// ============================================================================

function main() {
  const contentDir = path.resolve(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  const vocabPath = path.join(contentDir, 'vocabulary.full.json');
  fs.writeFileSync(vocabPath, JSON.stringify(vocabularyTopics, null, 2), 'utf8');
  console.log(`✅ [VOCABULARY] Đã tạo file ${vocabPath} (${vocabularyTopics.length} chủ đề, ${vocabularyTopics.reduce((acc, t) => acc + t.cards.length, 0)} từ vựng).`);

  const grammarPath = path.join(contentDir, 'grammar.full.json');
  fs.writeFileSync(grammarPath, JSON.stringify(grammarTopics, null, 2), 'utf8');
  console.log(`✅ [GRAMMAR] Đã tạo file ${grammarPath} (${grammarTopics.length} chủ điểm, ${grammarTopics.reduce((acc, t) => acc + t.exercises.length, 0)} bài tập).`);

  const testsPath = path.join(contentDir, 'tests.full.json');
  fs.writeFileSync(testsPath, JSON.stringify(testsData, null, 2), 'utf8');
  console.log(`✅ [TESTS] Đã tạo file ${testsPath} (${testsData.length} đề thi, ${testsData.reduce((acc, t) => acc + t.questions.length, 0)} câu hỏi trắc nghiệm).`);
}

main();

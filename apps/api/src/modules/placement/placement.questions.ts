/**
 * Placement Test Questions — ~100 sample questions
 * Structure: 40 grammar + 40 vocabulary + 20 reading comprehension
 *
 * NOTE: Content is placeholder for technical flow testing.
 * Replace with real TOEIC-aligned questions before production.
 */

export interface PlacementQuestion {
  id: string;
  type: 'grammar' | 'vocabulary' | 'reading';
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  bandLevel: 1 | 2 | 3 | 4 | 5 | 6; // estimated difficulty band
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // ── GRAMMAR (40 câu) ──────────────────────────────────────────────

  // Band 1-2 — Basic tenses
  {
    id: 'g001', type: 'grammar', bandLevel: 1,
    questionText: 'She _____ to work every day.',
    options: [{ id: 'a', text: 'go' }, { id: 'b', text: 'goes' }, { id: 'c', text: 'going' }, { id: 'd', text: 'gone' }],
    correctOptionId: 'b',
  },
  {
    id: 'g002', type: 'grammar', bandLevel: 1,
    questionText: 'They _____ a meeting right now.',
    options: [{ id: 'a', text: 'have' }, { id: 'b', text: 'are having' }, { id: 'c', text: 'is having' }, { id: 'd', text: 'had' }],
    correctOptionId: 'b',
  },
  {
    id: 'g003', type: 'grammar', bandLevel: 1,
    questionText: 'The report _____ yesterday.',
    options: [{ id: 'a', text: 'submit' }, { id: 'b', text: 'submitted' }, { id: 'c', text: 'was submitted' }, { id: 'd', text: 'is submitted' }],
    correctOptionId: 'c',
  },
  {
    id: 'g004', type: 'grammar', bandLevel: 1,
    questionText: 'I _____ this company for five years.',
    options: [{ id: 'a', text: 'work' }, { id: 'b', text: 'worked' }, { id: 'c', text: 'have worked' }, { id: 'd', text: 'am working' }],
    correctOptionId: 'c',
  },
  {
    id: 'g005', type: 'grammar', bandLevel: 2,
    questionText: 'If it _____ tomorrow, the meeting will be cancelled.',
    options: [{ id: 'a', text: 'rains' }, { id: 'b', text: 'rain' }, { id: 'c', text: 'will rain' }, { id: 'd', text: 'rained' }],
    correctOptionId: 'a',
  },
  {
    id: 'g006', type: 'grammar', bandLevel: 2,
    questionText: 'The manager asked that all staff _____ on time.',
    options: [{ id: 'a', text: 'arrive' }, { id: 'b', text: 'arrives' }, { id: 'c', text: 'arrived' }, { id: 'd', text: 'arriving' }],
    correctOptionId: 'a',
  },
  {
    id: 'g007', type: 'grammar', bandLevel: 2,
    questionText: 'Neither the CEO nor the directors _____ the proposal.',
    options: [{ id: 'a', text: 'approve' }, { id: 'b', text: 'approves' }, { id: 'c', text: 'approved' }, { id: 'd', text: 'approving' }],
    correctOptionId: 'c',
  },
  {
    id: 'g008', type: 'grammar', bandLevel: 2,
    questionText: 'The document needs _____ before distribution.',
    options: [{ id: 'a', text: 'review' }, { id: 'b', text: 'to review' }, { id: 'c', text: 'reviewing' }, { id: 'd', text: 'reviewed' }],
    correctOptionId: 'c',
  },
  {
    id: 'g009', type: 'grammar', bandLevel: 2,
    questionText: 'By the time she arrived, the meeting _____ already.',
    options: [{ id: 'a', text: 'ended' }, { id: 'b', text: 'had ended' }, { id: 'c', text: 'has ended' }, { id: 'd', text: 'ends' }],
    correctOptionId: 'b',
  },
  {
    id: 'g010', type: 'grammar', bandLevel: 2,
    questionText: 'We look forward to _____ from you soon.',
    options: [{ id: 'a', text: 'hear' }, { id: 'b', text: 'hearing' }, { id: 'c', text: 'heard' }, { id: 'd', text: 'to hear' }],
    correctOptionId: 'b',
  },
  // Band 3 — Intermediate
  {
    id: 'g011', type: 'grammar', bandLevel: 3,
    questionText: 'The shipment was delayed _____ bad weather conditions.',
    options: [{ id: 'a', text: 'due to' }, { id: 'b', text: 'because' }, { id: 'c', text: 'despite' }, { id: 'd', text: 'although' }],
    correctOptionId: 'a',
  },
  {
    id: 'g012', type: 'grammar', bandLevel: 3,
    questionText: 'Sales figures _____ significantly since the new campaign launched.',
    options: [{ id: 'a', text: 'rise' }, { id: 'b', text: 'rose' }, { id: 'c', text: 'have risen' }, { id: 'd', text: 'are rising' }],
    correctOptionId: 'c',
  },
  {
    id: 'g013', type: 'grammar', bandLevel: 3,
    questionText: 'The contract, _____ was signed last month, expires in December.',
    options: [{ id: 'a', text: 'who' }, { id: 'b', text: 'which' }, { id: 'c', text: 'that' }, { id: 'd', text: 'what' }],
    correctOptionId: 'b',
  },
  {
    id: 'g014', type: 'grammar', bandLevel: 3,
    questionText: 'Employees are required to _____ their expenses within 30 days.',
    options: [{ id: 'a', text: 'reimburse' }, { id: 'b', text: 'submit' }, { id: 'c', text: 'reimbursed' }, { id: 'd', text: 'submitting' }],
    correctOptionId: 'b',
  },
  {
    id: 'g015', type: 'grammar', bandLevel: 3,
    questionText: '_____ the difficult market conditions, the company maintained profitability.',
    options: [{ id: 'a', text: 'Because of' }, { id: 'b', text: 'Due to' }, { id: 'c', text: 'Despite' }, { id: 'd', text: 'Since' }],
    correctOptionId: 'c',
  },
  {
    id: 'g016', type: 'grammar', bandLevel: 3,
    questionText: 'The new policy will be _____ effective next quarter.',
    options: [{ id: 'a', text: 'make' }, { id: 'b', text: 'made' }, { id: 'c', text: 'making' }, { id: 'd', text: 'to make' }],
    correctOptionId: 'b',
  },
  {
    id: 'g017', type: 'grammar', bandLevel: 3,
    questionText: 'All applicants must _____ a valid work permit.',
    options: [{ id: 'a', text: 'possess' }, { id: 'b', text: 'possessing' }, { id: 'c', text: 'possession' }, { id: 'd', text: 'possessed' }],
    correctOptionId: 'a',
  },
  {
    id: 'g018', type: 'grammar', bandLevel: 3,
    questionText: 'The budget _____ by 15% to cover additional costs.',
    options: [{ id: 'a', text: 'increased' }, { id: 'b', text: 'was increased' }, { id: 'c', text: 'has increased' }, { id: 'd', text: 'increase' }],
    correctOptionId: 'b',
  },
  {
    id: 'g019', type: 'grammar', bandLevel: 4,
    questionText: 'Had the team _____ earlier, they would have met the deadline.',
    options: [{ id: 'a', text: 'start' }, { id: 'b', text: 'started' }, { id: 'c', text: 'starts' }, { id: 'd', text: 'starting' }],
    correctOptionId: 'b',
  },
  {
    id: 'g020', type: 'grammar', bandLevel: 4,
    questionText: 'The CEO emphasized the importance of _____ customer relationships.',
    options: [{ id: 'a', text: 'sustain' }, { id: 'b', text: 'sustained' }, { id: 'c', text: 'sustaining' }, { id: 'd', text: 'to sustain' }],
    correctOptionId: 'c',
  },
  {
    id: 'g021', type: 'grammar', bandLevel: 4,
    questionText: 'It is imperative that the data _____ securely.',
    options: [{ id: 'a', text: 'store' }, { id: 'b', text: 'be stored' }, { id: 'c', text: 'stores' }, { id: 'd', text: 'stored' }],
    correctOptionId: 'b',
  },
  {
    id: 'g022', type: 'grammar', bandLevel: 4,
    questionText: '_____ submitted on time, the report was well-received by the board.',
    options: [{ id: 'a', text: 'Although' }, { id: 'b', text: 'Having been' }, { id: 'c', text: 'Because' }, { id: 'd', text: 'Since' }],
    correctOptionId: 'b',
  },
  {
    id: 'g023', type: 'grammar', bandLevel: 4,
    questionText: 'The merger _____ subject to regulatory approval.',
    options: [{ id: 'a', text: 'remains' }, { id: 'b', text: 'remain' }, { id: 'c', text: 'remaining' }, { id: 'd', text: 'remained' }],
    correctOptionId: 'a',
  },
  {
    id: 'g024', type: 'grammar', bandLevel: 4,
    questionText: 'Rarely _____ such a comprehensive proposal been presented to the board.',
    options: [{ id: 'a', text: 'has' }, { id: 'b', text: 'have' }, { id: 'c', text: 'had' }, { id: 'd', text: 'having' }],
    correctOptionId: 'a',
  },
  {
    id: 'g025', type: 'grammar', bandLevel: 4,
    questionText: 'The new regulations, _____ compliance is mandatory, take effect in January.',
    options: [{ id: 'a', text: 'which' }, { id: 'b', text: 'with which' }, { id: 'c', text: 'whom' }, { id: 'd', text: 'whose' }],
    correctOptionId: 'b',
  },
  {
    id: 'g026', type: 'grammar', bandLevel: 5,
    questionText: 'The board voted to _____ the dividend, citing strong earnings.',
    options: [{ id: 'a', text: 'raise' }, { id: 'b', text: 'rise' }, { id: 'c', text: 'arose' }, { id: 'd', text: 'raised' }],
    correctOptionId: 'a',
  },
  {
    id: 'g027', type: 'grammar', bandLevel: 5,
    questionText: 'Not until the final quarter _____ the company reach its targets.',
    options: [{ id: 'a', text: 'does' }, { id: 'b', text: 'did' }, { id: 'c', text: 'had' }, { id: 'd', text: 'was' }],
    correctOptionId: 'b',
  },
  {
    id: 'g028', type: 'grammar', bandLevel: 5,
    questionText: 'The proposal _____ favorably by the committee, pending minor revisions.',
    options: [{ id: 'a', text: 'was received' }, { id: 'b', text: 'received' }, { id: 'c', text: 'has received' }, { id: 'd', text: 'receiving' }],
    correctOptionId: 'a',
  },
  {
    id: 'g029', type: 'grammar', bandLevel: 5,
    questionText: 'So complex _____ the integration that it required additional resources.',
    options: [{ id: 'a', text: 'it was' }, { id: 'b', text: 'was it' }, { id: 'c', text: 'it is' }, { id: 'd', text: 'is it' }],
    correctOptionId: 'b',
  },
  {
    id: 'g030', type: 'grammar', bandLevel: 5,
    questionText: 'The findings _____ that customer satisfaction has improved markedly.',
    options: [{ id: 'a', text: 'indicate' }, { id: 'b', text: 'indicated' }, { id: 'c', text: 'are indicating' }, { id: 'd', text: 'indication' }],
    correctOptionId: 'a',
  },
  {
    id: 'g031', type: 'grammar', bandLevel: 3,
    questionText: 'The team leader, along with her colleagues, _____ the project plan.',
    options: [{ id: 'a', text: 'approve' }, { id: 'b', text: 'approves' }, { id: 'c', text: 'approved' }, { id: 'd', text: 'approving' }],
    correctOptionId: 'c',
  },
  {
    id: 'g032', type: 'grammar', bandLevel: 2,
    questionText: 'Could you please _____ this form before leaving?',
    options: [{ id: 'a', text: 'fill out' }, { id: 'b', text: 'filling out' }, { id: 'c', text: 'filled out' }, { id: 'd', text: 'fill in out' }],
    correctOptionId: 'a',
  },
  {
    id: 'g033', type: 'grammar', bandLevel: 3,
    questionText: 'The office will be closed _____ the public holiday.',
    options: [{ id: 'a', text: 'on account for' }, { id: 'b', text: 'because of' }, { id: 'c', text: 'because' }, { id: 'd', text: 'for' }],
    correctOptionId: 'b',
  },
  {
    id: 'g034', type: 'grammar', bandLevel: 2,
    questionText: 'She suggested _____ the meeting to next week.',
    options: [{ id: 'a', text: 'postpone' }, { id: 'b', text: 'to postpone' }, { id: 'c', text: 'postponing' }, { id: 'd', text: 'postponed' }],
    correctOptionId: 'c',
  },
  {
    id: 'g035', type: 'grammar', bandLevel: 4,
    questionText: 'Were the project to be cancelled, significant funds _____ wasted.',
    options: [{ id: 'a', text: 'will be' }, { id: 'b', text: 'would be' }, { id: 'c', text: 'had been' }, { id: 'd', text: 'are' }],
    correctOptionId: 'b',
  },
  {
    id: 'g036', type: 'grammar', bandLevel: 3,
    questionText: 'The staff _____ about the new policy through an email.',
    options: [{ id: 'a', text: 'notified' }, { id: 'b', text: 'were notified' }, { id: 'c', text: 'notifying' }, { id: 'd', text: 'notify' }],
    correctOptionId: 'b',
  },
  {
    id: 'g037', type: 'grammar', bandLevel: 1,
    questionText: 'There _____ many options available for the new project.',
    options: [{ id: 'a', text: 'is' }, { id: 'b', text: 'are' }, { id: 'c', text: 'was' }, { id: 'd', text: 'has' }],
    correctOptionId: 'b',
  },
  {
    id: 'g038', type: 'grammar', bandLevel: 2,
    questionText: 'I wish I _____ more time to prepare for the presentation.',
    options: [{ id: 'a', text: 'have' }, { id: 'b', text: 'had' }, { id: 'c', text: 'will have' }, { id: 'd', text: 'had had' }],
    correctOptionId: 'b',
  },
  {
    id: 'g039', type: 'grammar', bandLevel: 3,
    questionText: 'The director asked who _____ responsible for the error.',
    options: [{ id: 'a', text: 'is' }, { id: 'b', text: 'was' }, { id: 'c', text: 'were' }, { id: 'd', text: 'had been' }],
    correctOptionId: 'b',
  },
  {
    id: 'g040', type: 'grammar', bandLevel: 4,
    questionText: 'The company\'s success is largely attributed to its _____ approach to innovation.',
    options: [{ id: 'a', text: 'single-minded' }, { id: 'b', text: 'single-mindedly' }, { id: 'c', text: 'single mindedness' }, { id: 'd', text: 'single mindedly' }],
    correctOptionId: 'a',
  },

  // ── VOCABULARY (40 câu) ────────────────────────────────────────────

  // Band 1-2 — Common business words
  {
    id: 'v001', type: 'vocabulary', bandLevel: 1,
    questionText: 'Please _____ your appointment 24 hours in advance.',
    options: [{ id: 'a', text: 'confirm' }, { id: 'b', text: 'confine' }, { id: 'c', text: 'conform' }, { id: 'd', text: 'conflict' }],
    correctOptionId: 'a',
  },
  {
    id: 'v002', type: 'vocabulary', bandLevel: 1,
    questionText: 'The annual _____ showed a 20% increase in revenue.',
    options: [{ id: 'a', text: 'record' }, { id: 'b', text: 'report' }, { id: 'c', text: 'result' }, { id: 'd', text: 'review' }],
    correctOptionId: 'b',
  },
  {
    id: 'v003', type: 'vocabulary', bandLevel: 1,
    questionText: 'All employees must _____ to the company\'s safety guidelines.',
    options: [{ id: 'a', text: 'attend' }, { id: 'b', text: 'agree' }, { id: 'c', text: 'adhere' }, { id: 'd', text: 'admit' }],
    correctOptionId: 'c',
  },
  {
    id: 'v004', type: 'vocabulary', bandLevel: 2,
    questionText: 'The project was completed _____ of schedule.',
    options: [{ id: 'a', text: 'ahead' }, { id: 'b', text: 'before' }, { id: 'c', text: 'prior' }, { id: 'd', text: 'early' }],
    correctOptionId: 'a',
  },
  {
    id: 'v005', type: 'vocabulary', bandLevel: 2,
    questionText: 'We need to _____ a solution before the deadline.',
    options: [{ id: 'a', text: 'devise' }, { id: 'b', text: 'divide' }, { id: 'c', text: 'divert' }, { id: 'd', text: 'deliver' }],
    correctOptionId: 'a',
  },
  {
    id: 'v006', type: 'vocabulary', bandLevel: 2,
    questionText: 'The company plans to _____ its operations to three new cities.',
    options: [{ id: 'a', text: 'extend' }, { id: 'b', text: 'expand' }, { id: 'c', text: 'expose' }, { id: 'd', text: 'expend' }],
    correctOptionId: 'b',
  },
  {
    id: 'v007', type: 'vocabulary', bandLevel: 2,
    questionText: 'All invoices must be _____ within 30 days.',
    options: [{ id: 'a', text: 'paid' }, { id: 'b', text: 'settled' }, { id: 'c', text: 'cleared' }, { id: 'd', text: 'completed' }],
    correctOptionId: 'b',
  },
  {
    id: 'v008', type: 'vocabulary', bandLevel: 2,
    questionText: 'We are looking for a candidate with excellent _____ skills.',
    options: [{ id: 'a', text: 'communication' }, { id: 'b', text: 'conversation' }, { id: 'c', text: 'commentary' }, { id: 'd', text: 'consultation' }],
    correctOptionId: 'a',
  },
  {
    id: 'v009', type: 'vocabulary', bandLevel: 3,
    questionText: 'The new software will _____ manual data entry.',
    options: [{ id: 'a', text: 'eliminate' }, { id: 'b', text: 'emulate' }, { id: 'c', text: 'eradicate' }, { id: 'd', text: 'elevate' }],
    correctOptionId: 'a',
  },
  {
    id: 'v010', type: 'vocabulary', bandLevel: 3,
    questionText: 'The proposal was _____ by the board of directors.',
    options: [{ id: 'a', text: 'ratified' }, { id: 'b', text: 'rectified' }, { id: 'c', text: 'resolved' }, { id: 'd', text: 'reserved' }],
    correctOptionId: 'a',
  },
  {
    id: 'v011', type: 'vocabulary', bandLevel: 3,
    questionText: 'Our company values _____ with all business partners.',
    options: [{ id: 'a', text: 'transparency' }, { id: 'b', text: 'transference' }, { id: 'c', text: 'transcription' }, { id: 'd', text: 'transition' }],
    correctOptionId: 'a',
  },
  {
    id: 'v012', type: 'vocabulary', bandLevel: 3,
    questionText: 'The manager must _____ tasks effectively among team members.',
    options: [{ id: 'a', text: 'distribute' }, { id: 'b', text: 'delegate' }, { id: 'c', text: 'dedicate' }, { id: 'd', text: 'deliver' }],
    correctOptionId: 'b',
  },
  {
    id: 'v013', type: 'vocabulary', bandLevel: 3,
    questionText: 'The company must _____ to local labor laws.',
    options: [{ id: 'a', text: 'comply' }, { id: 'b', text: 'agree' }, { id: 'c', text: 'adapt' }, { id: 'd', text: 'apply' }],
    correctOptionId: 'a',
  },
  {
    id: 'v014', type: 'vocabulary', bandLevel: 3,
    questionText: 'After careful _____, we decided to accept the offer.',
    options: [{ id: 'a', text: 'deliberation' }, { id: 'b', text: 'designation' }, { id: 'c', text: 'demonstration' }, { id: 'd', text: 'description' }],
    correctOptionId: 'a',
  },
  {
    id: 'v015', type: 'vocabulary', bandLevel: 3,
    questionText: 'The quarterly _____ will be presented at the shareholders\' meeting.',
    options: [{ id: 'a', text: 'earnings' }, { id: 'b', text: 'outcomes' }, { id: 'c', text: 'findings' }, { id: 'd', text: 'results' }],
    correctOptionId: 'a',
  },
  {
    id: 'v016', type: 'vocabulary', bandLevel: 4,
    questionText: 'The _____ clause in the contract protects both parties.',
    options: [{ id: 'a', text: 'indemnity' }, { id: 'b', text: 'identity' }, { id: 'c', text: 'integrity' }, { id: 'd', text: 'industry' }],
    correctOptionId: 'a',
  },
  {
    id: 'v017', type: 'vocabulary', bandLevel: 4,
    questionText: 'The auditors found no _____ in the financial records.',
    options: [{ id: 'a', text: 'discrepancies' }, { id: 'b', text: 'discoveries' }, { id: 'c', text: 'discussions' }, { id: 'd', text: 'distinctions' }],
    correctOptionId: 'a',
  },
  {
    id: 'v018', type: 'vocabulary', bandLevel: 4,
    questionText: 'The company has a strong _____ for ethical business practices.',
    options: [{ id: 'a', text: 'reputation' }, { id: 'b', text: 'recognition' }, { id: 'c', text: 'recommendation' }, { id: 'd', text: 'reservation' }],
    correctOptionId: 'a',
  },
  {
    id: 'v019', type: 'vocabulary', bandLevel: 4,
    questionText: 'The new strategy aims to _____ market share in Asia.',
    options: [{ id: 'a', text: 'consolidate' }, { id: 'b', text: 'concentrate' }, { id: 'c', text: 'contemplate' }, { id: 'd', text: 'constitute' }],
    correctOptionId: 'a',
  },
  {
    id: 'v020', type: 'vocabulary', bandLevel: 4,
    questionText: 'We need to _____ the risks before proceeding with the investment.',
    options: [{ id: 'a', text: 'mitigate' }, { id: 'b', text: 'motivate' }, { id: 'c', text: 'moderate' }, { id: 'd', text: 'modulate' }],
    correctOptionId: 'a',
  },
  {
    id: 'v021', type: 'vocabulary', bandLevel: 2,
    questionText: 'The new product received _____ feedback from customers.',
    options: [{ id: 'a', text: 'positive' }, { id: 'b', text: 'possible' }, { id: 'c', text: 'productive' }, { id: 'd', text: 'protective' }],
    correctOptionId: 'a',
  },
  {
    id: 'v022', type: 'vocabulary', bandLevel: 3,
    questionText: 'The factory operates at full _____ during peak season.',
    options: [{ id: 'a', text: 'capacity' }, { id: 'b', text: 'capability' }, { id: 'c', text: 'captivity' }, { id: 'd', text: 'capture' }],
    correctOptionId: 'a',
  },
  {
    id: 'v023', type: 'vocabulary', bandLevel: 3,
    questionText: 'Management must address the _____ in the current process.',
    options: [{ id: 'a', text: 'deficiency' }, { id: 'b', text: 'definition' }, { id: 'c', text: 'deflection' }, { id: 'd', text: 'defense' }],
    correctOptionId: 'a',
  },
  {
    id: 'v024', type: 'vocabulary', bandLevel: 2,
    questionText: 'The _____ for the job included five years of experience.',
    options: [{ id: 'a', text: 'requirements' }, { id: 'b', text: 'renewals' }, { id: 'c', text: 'references' }, { id: 'd', text: 'revisions' }],
    correctOptionId: 'a',
  },
  {
    id: 'v025', type: 'vocabulary', bandLevel: 4,
    questionText: 'The executive gave an _____ speech at the annual conference.',
    options: [{ id: 'a', text: 'eloquent' }, { id: 'b', text: 'elegant' }, { id: 'c', text: 'elevated' }, { id: 'd', text: 'elaborate' }],
    correctOptionId: 'a',
  },
  {
    id: 'v026', type: 'vocabulary', bandLevel: 5,
    questionText: 'The acquisition was subject to _____ scrutiny from regulators.',
    options: [{ id: 'a', text: 'stringent' }, { id: 'b', text: 'strenuous' }, { id: 'c', text: 'strategic' }, { id: 'd', text: 'structural' }],
    correctOptionId: 'a',
  },
  {
    id: 'v027', type: 'vocabulary', bandLevel: 5,
    questionText: 'The company\'s growth trajectory has been _____ over the past decade.',
    options: [{ id: 'a', text: 'unprecedented' }, { id: 'b', text: 'undermined' }, { id: 'c', text: 'underlined' }, { id: 'd', text: 'underrated' }],
    correctOptionId: 'a',
  },
  {
    id: 'v028', type: 'vocabulary', bandLevel: 5,
    questionText: 'The new policy will _____ employees to take ownership of their work.',
    options: [{ id: 'a', text: 'empower' }, { id: 'b', text: 'employ' }, { id: 'c', text: 'endorse' }, { id: 'd', text: 'enforce' }],
    correctOptionId: 'a',
  },
  {
    id: 'v029', type: 'vocabulary', bandLevel: 3,
    questionText: 'The company will _____ all travel expenses for the conference.',
    options: [{ id: 'a', text: 'reimburse' }, { id: 'b', text: 'reinforce' }, { id: 'c', text: 'reiterate' }, { id: 'd', text: 'relocate' }],
    correctOptionId: 'a',
  },
  {
    id: 'v030', type: 'vocabulary', bandLevel: 4,
    questionText: 'The contract includes a _____ clause for early termination.',
    options: [{ id: 'a', text: 'penalty' }, { id: 'b', text: 'premium' }, { id: 'c', text: 'provision' }, { id: 'd', text: 'privilege' }],
    correctOptionId: 'a',
  },
  {
    id: 'v031', type: 'vocabulary', bandLevel: 2,
    questionText: 'The presentation was _____ for all department heads.',
    options: [{ id: 'a', text: 'mandatory' }, { id: 'b', text: 'managerial' }, { id: 'c', text: 'marginal' }, { id: 'd', text: 'manual' }],
    correctOptionId: 'a',
  },
  {
    id: 'v032', type: 'vocabulary', bandLevel: 3,
    questionText: 'We need to _____ a comprehensive plan to improve productivity.',
    options: [{ id: 'a', text: 'formulate' }, { id: 'b', text: 'fluctuate' }, { id: 'c', text: 'facilitate' }, { id: 'd', text: 'fabricate' }],
    correctOptionId: 'a',
  },
  {
    id: 'v033', type: 'vocabulary', bandLevel: 4,
    questionText: 'The project was put on hold due to budget _____ .',
    options: [{ id: 'a', text: 'constraints' }, { id: 'b', text: 'constructs' }, { id: 'c', text: 'contracts' }, { id: 'd', text: 'contacts' }],
    correctOptionId: 'a',
  },
  {
    id: 'v034', type: 'vocabulary', bandLevel: 3,
    questionText: 'The company aims to _____ its brand image through targeted marketing.',
    options: [{ id: 'a', text: 'enhance' }, { id: 'b', text: 'enforce' }, { id: 'c', text: 'engage' }, { id: 'd', text: 'enclose' }],
    correctOptionId: 'a',
  },
  {
    id: 'v035', type: 'vocabulary', bandLevel: 5,
    questionText: 'The _____ of the new system significantly improved operational efficiency.',
    options: [{ id: 'a', text: 'implementation' }, { id: 'b', text: 'implication' }, { id: 'c', text: 'improvisation' }, { id: 'd', text: 'impediment' }],
    correctOptionId: 'a',
  },
  {
    id: 'v036', type: 'vocabulary', bandLevel: 2,
    questionText: 'Please _____ your travel arrangements at least two weeks in advance.',
    options: [{ id: 'a', text: 'book' }, { id: 'b', text: 'request' }, { id: 'c', text: 'arrange' }, { id: 'd', text: 'coordinate' }],
    correctOptionId: 'c',
  },
  {
    id: 'v037', type: 'vocabulary', bandLevel: 3,
    questionText: 'The training program will _____ all new hires to company policies.',
    options: [{ id: 'a', text: 'orient' }, { id: 'b', text: 'order' }, { id: 'c', text: 'organize' }, { id: 'd', text: 'observe' }],
    correctOptionId: 'a',
  },
  {
    id: 'v038', type: 'vocabulary', bandLevel: 4,
    questionText: 'The market research revealed a _____ opportunity in the mobile sector.',
    options: [{ id: 'a', text: 'lucrative' }, { id: 'b', text: 'legislative' }, { id: 'c', text: 'legitimate' }, { id: 'd', text: 'literal' }],
    correctOptionId: 'a',
  },
  {
    id: 'v039', type: 'vocabulary', bandLevel: 3,
    questionText: 'The company plans to _____ its workforce by 15% next year.',
    options: [{ id: 'a', text: 'reduce' }, { id: 'b', text: 'downsize' }, { id: 'c', text: 'minimize' }, { id: 'd', text: 'decrease' }],
    correctOptionId: 'b',
  },
  {
    id: 'v040', type: 'vocabulary', bandLevel: 5,
    questionText: 'The board approved the _____ of three regional offices into one headquarters.',
    options: [{ id: 'a', text: 'consolidation' }, { id: 'b', text: 'consultation' }, { id: 'c', text: 'constellation' }, { id: 'd', text: 'conservation' }],
    correctOptionId: 'a',
  },

  // ── READING (20 câu) ───────────────────────────────────────────────

  {
    id: 'r001', type: 'reading', bandLevel: 2,
    questionText: 'The memo states: "All staff are required to complete the safety training by Friday." What does this mean?',
    options: [
      { id: 'a', text: 'Safety training is optional' },
      { id: 'b', text: 'Staff must finish training before Friday' },
      { id: 'c', text: 'Training will start on Friday' },
      { id: 'd', text: 'Some staff need training' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r002', type: 'reading', bandLevel: 2,
    questionText: 'The notice reads: "Parking is available for customers only between 9 AM and 6 PM." Who can use the parking?',
    options: [
      { id: 'a', text: 'Anyone during business hours' },
      { id: 'b', text: 'Employees at all times' },
      { id: 'c', text: 'Customers during specified hours' },
      { id: 'd', text: 'Customers at any time' },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'r003', type: 'reading', bandLevel: 3,
    questionText: 'The email says: "We regret to inform you that your application has not been successful at this time, but we encourage you to apply again in the future." What is the main message?',
    options: [
      { id: 'a', text: 'The applicant got the job' },
      { id: 'b', text: 'The application was rejected' },
      { id: 'c', text: 'The company needs more information' },
      { id: 'd', text: 'The position has been filled' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r004', type: 'reading', bandLevel: 3,
    questionText: '"Q3 revenue increased by 12% year-over-year, driven primarily by strong performance in the Asia-Pacific region." What contributed most to the increase?',
    options: [
      { id: 'a', text: 'New product launches' },
      { id: 'b', text: 'Cost reductions' },
      { id: 'c', text: 'Asia-Pacific market performance' },
      { id: 'd', text: 'European market expansion' },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'r005', type: 'reading', bandLevel: 3,
    questionText: '"Employees who work more than 40 hours per week are entitled to overtime pay at 1.5 times their regular rate." An employee works 45 hours. How many hours qualify for overtime?',
    options: [
      { id: 'a', text: '40 hours' }, { id: 'b', text: '5 hours' }, { id: 'c', text: '45 hours' }, { id: 'd', text: '1.5 hours' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r006', type: 'reading', bandLevel: 4,
    questionText: '"Despite the challenging economic climate, the company maintained its market position through strategic cost optimization and targeted investment in high-growth segments." What strategy did the company use?',
    options: [
      { id: 'a', text: 'Aggressive expansion into new markets' },
      { id: 'b', text: 'Cost cutting and focused investment' },
      { id: 'c', text: 'Mergers and acquisitions' },
      { id: 'd', text: 'Reducing product range' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r007', type: 'reading', bandLevel: 4,
    questionText: '"The warranty covers manufacturing defects for a period of two years from the date of purchase. Physical damage caused by misuse is not covered." A customer dropped their device. Is this covered?',
    options: [
      { id: 'a', text: 'Yes, within 2 years' },
      { id: 'b', text: 'No, physical damage is excluded' },
      { id: 'c', text: 'Only if reported within 30 days' },
      { id: 'd', text: 'Yes, all damages are covered' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r008', type: 'reading', bandLevel: 3,
    questionText: 'A job ad states: "Minimum 3 years of experience in project management, with PMP certification preferred." Is PMP certification required?',
    options: [
      { id: 'a', text: 'Yes, it is mandatory' },
      { id: 'b', text: 'No, it is optional but advantageous' },
      { id: 'c', text: 'Only for senior positions' },
      { id: 'd', text: 'Yes, along with 5 years experience' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r009', type: 'reading', bandLevel: 4,
    questionText: '"Candidates are encouraged to submit their portfolio along with their CV. Applications without a portfolio will still be considered." What is true about portfolios?',
    options: [
      { id: 'a', text: 'Portfolio is required for all candidates' },
      { id: 'b', text: 'Applications without portfolios are rejected' },
      { id: 'c', text: 'Portfolio submission is encouraged but not mandatory' },
      { id: 'd', text: 'Only senior candidates need portfolios' },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'r010', type: 'reading', bandLevel: 4,
    questionText: '"The conference will be held at the Grand Hotel. Participants must register by September 1st to receive the early-bird discount. Full price applies after this date." What happens if you register on September 5th?',
    options: [
      { id: 'a', text: 'You cannot attend' },
      { id: 'b', text: 'You pay the full price' },
      { id: 'c', text: 'You receive the discount' },
      { id: 'd', text: 'You must register at the venue' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r011', type: 'reading', bandLevel: 5,
    questionText: '"The committee, after extensive deliberation, concluded that restructuring was not only inevitable but also essential for the long-term viability of the organization." What does the committee conclude?',
    options: [
      { id: 'a', text: 'Restructuring should be avoided' },
      { id: 'b', text: 'Restructuring is necessary for survival' },
      { id: 'c', text: 'The organization is doing well' },
      { id: 'd', text: 'More deliberation is needed' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r012', type: 'reading', bandLevel: 5,
    questionText: '"The proposed merger, while potentially transformative, carries significant integration risks that must be carefully weighed against the projected synergies." What is implied?',
    options: [
      { id: 'a', text: 'The merger should proceed immediately' },
      { id: 'b', text: 'The merger carries no risks' },
      { id: 'c', text: 'Benefits and risks must be balanced' },
      { id: 'd', text: 'The merger will definitely fail' },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'r013', type: 'reading', bandLevel: 3,
    questionText: 'The sign reads: "Authorized Personnel Only — Please Present ID Badge." Who may enter?',
    options: [
      { id: 'a', text: 'Anyone with a visitor pass' },
      { id: 'b', text: 'Only those with authorized ID badges' },
      { id: 'c', text: 'All employees' },
      { id: 'd', text: 'Management only' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r014', type: 'reading', bandLevel: 3,
    questionText: '"Refunds are available within 14 days of purchase, provided the item is in its original condition and accompanied by a receipt." A customer bought an item 10 days ago and has the receipt. Can they get a refund?',
    options: [
      { id: 'a', text: 'No, the item must be returned immediately' },
      { id: 'b', text: 'Yes, if the item is in original condition' },
      { id: 'c', text: 'Only for defective items' },
      { id: 'd', text: 'Yes, receipt is not needed' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r015', type: 'reading', bandLevel: 4,
    questionText: '"Our quarterly earnings exceeded analyst expectations by 8%, largely attributable to cost-containment measures implemented in the first half of the year." What primarily drove the strong earnings?',
    options: [
      { id: 'a', text: 'Higher product prices' },
      { id: 'b', text: 'Cost-reduction efforts' },
      { id: 'c', text: 'New product launches' },
      { id: 'd', text: 'Expansion into new markets' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r016', type: 'reading', bandLevel: 2,
    questionText: 'The flyer says: "Buy 2, Get 1 Free on all office supplies this weekend." How many items must you buy to get one free?',
    options: [{ id: 'a', text: '1' }, { id: 'b', text: '2' }, { id: 'c', text: '3' }, { id: 'd', text: '4' }],
    correctOptionId: 'b',
  },
  {
    id: 'r017', type: 'reading', bandLevel: 4,
    questionText: '"The pilot program, launched in three cities, demonstrated a 23% reduction in operational costs. Based on these results, we recommend a phased nationwide rollout." What does "phased rollout" mean?',
    options: [
      { id: 'a', text: 'Immediate nationwide implementation' },
      { id: 'b', text: 'Gradual expansion across the country' },
      { id: 'c', text: 'Abandonment of the program' },
      { id: 'd', text: 'Continuation only in three cities' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r018', type: 'reading', bandLevel: 5,
    questionText: '"The fiscal year report underscores a paradox: while top-line revenue grew by 18%, net profit margins contracted due to disproportionate increases in operating expenses." What is the paradox?',
    options: [
      { id: 'a', text: 'Revenue and profit both grew' },
      { id: 'b', text: 'Revenue grew but profitability declined' },
      { id: 'c', text: 'Costs decreased while revenue fell' },
      { id: 'd', text: 'The company made a loss' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'r019', type: 'reading', bandLevel: 3,
    questionText: 'The notice says: "Deliveries after 5 PM will be processed the next business day." A package arrives at 6 PM on Friday. When will it be processed?',
    options: [
      { id: 'a', text: 'Saturday' }, { id: 'b', text: 'Sunday' }, { id: 'c', text: 'Monday' }, { id: 'd', text: 'Friday' },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'r020', type: 'reading', bandLevel: 4,
    questionText: '"All participants are reminded that information shared during this session is strictly confidential and should not be disclosed to any third parties without prior written consent." What are participants prohibited from doing?',
    options: [
      { id: 'a', text: 'Attending the session' },
      { id: 'b', text: 'Sharing session information without permission' },
      { id: 'c', text: 'Taking notes during the session' },
      { id: 'd', text: 'Recording the session' },
    ],
    correctOptionId: 'b',
  },
];

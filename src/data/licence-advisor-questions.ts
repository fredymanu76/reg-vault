// REG-VAULT Licence Advisor Questions
// Questions to determine the appropriate FCA licence type

export interface AdvisorQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
  helpText?: string;
  regulatoryReference?: string;
  type: 'single' | 'multiple' | 'number' | 'boolean' | 'text';
  options?: QuestionOption[];
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
  };
  weight: number; // Importance for scoring (1-10)
  impactOn: LicenceScoreImpact[];
}

export interface QuestionOption {
  id: string;
  label: string;
  value: string | number | boolean;
  helpText?: string;
}

export interface LicenceScoreImpact {
  licence: 'SPI' | 'API' | 'SEMI' | 'EMI' | 'RAISP';
  condition: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_equals';
  value: string | number | boolean | string[];
  scoreImpact: number; // -100 to +100
  eliminates?: boolean; // If true, this answer eliminates this licence option
}

export type QuestionCategory =
  | 'business_activities'
  | 'transaction_volumes'
  | 'customer_types'
  | 'e_money'
  | 'geographic_scope'
  | 'capital'
  | 'technology'
  | 'regulatory_history';

export const LICENCE_ADVISOR_QUESTIONS: AdvisorQuestion[] = [
  // ==========================================
  // Business Activities (Questions 1-5)
  // ==========================================
  {
    id: 'q1_primary_activity',
    category: 'business_activities',
    question: 'What is your primary payment service activity?',
    helpText: 'Select the main service you will offer. You can add additional services later.',
    regulatoryReference: 'PSR 2017, Schedule 1',
    type: 'single',
    options: [
      {
        id: 'money_remittance',
        label: 'Money Remittance',
        value: 'money_remittance',
        helpText: 'Transferring money without creating payment accounts',
      },
      {
        id: 'payment_accounts',
        label: 'Payment Accounts',
        value: 'payment_accounts',
        helpText: 'Operating accounts for customers to make/receive payments',
      },
      {
        id: 'card_issuing',
        label: 'Card Issuing',
        value: 'card_issuing',
        helpText: 'Issuing debit or prepaid cards',
      },
      {
        id: 'merchant_acquiring',
        label: 'Merchant Acquiring',
        value: 'merchant_acquiring',
        helpText: 'Processing card payments for merchants',
      },
      {
        id: 'payment_initiation',
        label: 'Payment Initiation (PISP)',
        value: 'payment_initiation',
        helpText: 'Initiating payments on behalf of customers (Open Banking)',
      },
      {
        id: 'account_information',
        label: 'Account Information (AISP)',
        value: 'account_information',
        helpText: 'Providing aggregated account information (Open Banking)',
      },
    ],
    weight: 10,
    impactOn: [
      { licence: 'RAISP', condition: 'equals', value: 'account_information', scoreImpact: 100 },
      { licence: 'RAISP', condition: 'not_equals', value: 'account_information', scoreImpact: -100, eliminates: true },
      { licence: 'SPI', condition: 'equals', value: 'money_remittance', scoreImpact: 30 },
      { licence: 'API', condition: 'equals', value: 'merchant_acquiring', scoreImpact: 40 },
      { licence: 'EMI', condition: 'equals', value: 'card_issuing', scoreImpact: 30 },
      { licence: 'EMI', condition: 'equals', value: 'payment_accounts', scoreImpact: 20 },
    ],
  },
  {
    id: 'q2_additional_services',
    category: 'business_activities',
    question: 'Which additional payment services will you offer?',
    helpText: 'Select all that apply. This helps determine licensing requirements.',
    type: 'multiple',
    options: [
      { id: 'fx', label: 'Foreign Exchange', value: 'fx' },
      { id: 'direct_debit', label: 'Direct Debit Collection', value: 'direct_debit' },
      { id: 'standing_orders', label: 'Standing Orders', value: 'standing_orders' },
      { id: 'cash_advances', label: 'Cash Advances', value: 'cash_advances' },
      { id: 'none', label: 'None of the above', value: 'none' },
    ],
    weight: 5,
    impactOn: [
      { licence: 'SPI', condition: 'contains', value: ['fx', 'direct_debit'], scoreImpact: -10 },
      { licence: 'API', condition: 'contains', value: ['fx', 'direct_debit'], scoreImpact: 10 },
    ],
  },
  {
    id: 'q3_e_money_issuance',
    category: 'e_money',
    question: 'Will you issue electronic money?',
    helpText: 'E-money is digitally stored monetary value that represents a claim on the issuer. Examples include prepaid cards and digital wallets.',
    regulatoryReference: 'EMR 2011, Regulation 2',
    type: 'boolean',
    options: [
      { id: 'yes', label: 'Yes', value: true },
      { id: 'no', label: 'No', value: false },
    ],
    weight: 10,
    impactOn: [
      { licence: 'EMI', condition: 'equals', value: true, scoreImpact: 100 },
      { licence: 'SEMI', condition: 'equals', value: true, scoreImpact: 80 },
      { licence: 'SPI', condition: 'equals', value: true, scoreImpact: -100, eliminates: true },
      { licence: 'API', condition: 'equals', value: true, scoreImpact: -100, eliminates: true },
      { licence: 'RAISP', condition: 'equals', value: true, scoreImpact: -100, eliminates: true },
    ],
  },
  {
    id: 'q4_hold_funds',
    category: 'business_activities',
    question: 'Will you hold customer funds overnight?',
    helpText: 'If you hold customer funds beyond immediate payment execution, you may need safeguarding arrangements.',
    regulatoryReference: 'PSR 2017, Regulation 23',
    type: 'boolean',
    options: [
      { id: 'yes', label: 'Yes', value: true },
      { id: 'no', label: 'No', value: false },
    ],
    weight: 7,
    impactOn: [
      { licence: 'API', condition: 'equals', value: true, scoreImpact: 20 },
      { licence: 'SPI', condition: 'equals', value: true, scoreImpact: -20 },
    ],
  },
  {
    id: 'q5_agent_network',
    category: 'business_activities',
    question: 'Will you use agents or distributors to provide services?',
    helpText: 'Agents act on behalf of the payment institution. SPIs have restrictions on agent use.',
    regulatoryReference: 'PSR 2017, Regulation 36',
    type: 'boolean',
    options: [
      { id: 'yes', label: 'Yes', value: true },
      { id: 'no', label: 'No', value: false },
    ],
    weight: 6,
    impactOn: [
      { licence: 'SPI', condition: 'equals', value: true, scoreImpact: -30 },
      { licence: 'API', condition: 'equals', value: true, scoreImpact: 20 },
    ],
  },

  // ==========================================
  // Transaction Volumes (Questions 6-9)
  // ==========================================
  {
    id: 'q6_monthly_volume',
    category: 'transaction_volumes',
    question: 'What is your expected average monthly payment volume?',
    helpText: 'SPIs are limited to €3 million average monthly transactions. Enter your estimate.',
    regulatoryReference: 'PSR 2017, Regulation 14',
    type: 'single',
    options: [
      { id: 'under_500k', label: 'Under €500,000', value: 250000 },
      { id: '500k_1m', label: '€500,000 - €1 million', value: 750000 },
      { id: '1m_3m', label: '€1 million - €3 million', value: 2000000 },
      { id: '3m_10m', label: '€3 million - €10 million', value: 6500000 },
      { id: '10m_50m', label: '€10 million - €50 million', value: 30000000 },
      { id: 'over_50m', label: 'Over €50 million', value: 75000000 },
    ],
    weight: 10,
    impactOn: [
      { licence: 'SPI', condition: 'greater_than', value: 3000000, scoreImpact: -100, eliminates: true },
      { licence: 'SPI', condition: 'less_than', value: 3000000, scoreImpact: 50 },
      { licence: 'SEMI', condition: 'greater_than', value: 5000000, scoreImpact: -100, eliminates: true },
      { licence: 'API', condition: 'greater_than', value: 3000000, scoreImpact: 40 },
      { licence: 'EMI', condition: 'greater_than', value: 5000000, scoreImpact: 30 },
    ],
  },
  {
    id: 'q7_e_money_outstanding',
    category: 'e_money',
    question: 'What is your expected average outstanding e-money?',
    helpText: 'Small EMIs are limited to €5 million average outstanding e-money. This affects capital requirements.',
    regulatoryReference: 'EMR 2011, Regulation 8',
    type: 'single',
    options: [
      { id: 'under_1m', label: 'Under €1 million', value: 500000 },
      { id: '1m_5m', label: '€1 million - €5 million', value: 3000000 },
      { id: '5m_20m', label: '€5 million - €20 million', value: 12500000 },
      { id: '20m_100m', label: '€20 million - €100 million', value: 60000000 },
      { id: 'over_100m', label: 'Over €100 million', value: 150000000 },
    ],
    weight: 8,
    impactOn: [
      { licence: 'SEMI', condition: 'greater_than', value: 5000000, scoreImpact: -100, eliminates: true },
      { licence: 'SEMI', condition: 'less_than', value: 5000000, scoreImpact: 50 },
      { licence: 'EMI', condition: 'greater_than', value: 5000000, scoreImpact: 40 },
    ],
  },
  {
    id: 'q8_transaction_count',
    category: 'transaction_volumes',
    question: 'How many transactions do you expect to process monthly?',
    helpText: 'This helps determine operational complexity and capital method calculations.',
    type: 'single',
    options: [
      { id: 'under_10k', label: 'Under 10,000', value: 5000 },
      { id: '10k_50k', label: '10,000 - 50,000', value: 30000 },
      { id: '50k_200k', label: '50,000 - 200,000', value: 125000 },
      { id: '200k_1m', label: '200,000 - 1 million', value: 600000 },
      { id: 'over_1m', label: 'Over 1 million', value: 2000000 },
    ],
    weight: 5,
    impactOn: [
      { licence: 'SPI', condition: 'greater_than', value: 100000, scoreImpact: -20 },
      { licence: 'API', condition: 'greater_than', value: 100000, scoreImpact: 15 },
    ],
  },
  {
    id: 'q9_growth_expectation',
    category: 'transaction_volumes',
    question: 'What is your expected annual growth rate over the next 3 years?',
    helpText: 'High growth may push you beyond small institution thresholds.',
    type: 'single',
    options: [
      { id: 'stable', label: 'Stable (0-10%)', value: 5 },
      { id: 'moderate', label: 'Moderate (10-30%)', value: 20 },
      { id: 'high', label: 'High (30-50%)', value: 40 },
      { id: 'very_high', label: 'Very High (50%+)', value: 75 },
    ],
    weight: 6,
    impactOn: [
      { licence: 'SPI', condition: 'greater_than', value: 30, scoreImpact: -40 },
      { licence: 'SEMI', condition: 'greater_than', value: 30, scoreImpact: -40 },
      { licence: 'API', condition: 'greater_than', value: 30, scoreImpact: 20 },
      { licence: 'EMI', condition: 'greater_than', value: 30, scoreImpact: 20 },
    ],
  },

  // ==========================================
  // Customer Types (Questions 10-12)
  // ==========================================
  {
    id: 'q10_customer_types',
    category: 'customer_types',
    question: 'Who are your target customers?',
    helpText: 'This affects AML requirements and regulatory expectations.',
    type: 'single',
    options: [
      { id: 'consumers', label: 'Consumers only', value: 'consumers' },
      { id: 'businesses', label: 'Businesses only', value: 'businesses' },
      { id: 'both', label: 'Both consumers and businesses', value: 'both' },
    ],
    weight: 4,
    impactOn: [
      { licence: 'RAISP', condition: 'equals', value: 'consumers', scoreImpact: 20 },
      { licence: 'API', condition: 'equals', value: 'businesses', scoreImpact: 15 },
    ],
  },
  {
    id: 'q11_high_risk_customers',
    category: 'customer_types',
    question: 'Will you serve any high-risk customer segments?',
    helpText: 'High-risk segments include gambling, crypto exchanges, money service businesses, or PEPs.',
    type: 'multiple',
    options: [
      { id: 'gambling', label: 'Gambling/Gaming', value: 'gambling' },
      { id: 'crypto', label: 'Cryptocurrency exchanges', value: 'crypto' },
      { id: 'msb', label: 'Money Service Businesses', value: 'msb' },
      { id: 'adult', label: 'Adult entertainment', value: 'adult' },
      { id: 'none', label: 'None of the above', value: 'none' },
    ],
    weight: 5,
    impactOn: [
      { licence: 'SPI', condition: 'not_equals', value: ['none'], scoreImpact: -30 },
      { licence: 'SEMI', condition: 'not_equals', value: ['none'], scoreImpact: -30 },
    ],
  },
  {
    id: 'q12_vulnerable_customers',
    category: 'customer_types',
    question: 'Will you specifically target vulnerable customers?',
    helpText: 'The FCA has enhanced expectations for firms serving vulnerable customers.',
    type: 'boolean',
    options: [
      { id: 'yes', label: 'Yes', value: true },
      { id: 'no', label: 'No', value: false },
    ],
    weight: 3,
    impactOn: [
      { licence: 'API', condition: 'equals', value: true, scoreImpact: 10 },
      { licence: 'EMI', condition: 'equals', value: true, scoreImpact: 10 },
    ],
  },

  // ==========================================
  // Geographic Scope (Questions 13-14)
  // ==========================================
  {
    id: 'q13_geographic_scope',
    category: 'geographic_scope',
    question: 'Where will you operate?',
    helpText: 'Passporting allows you to operate across the EEA. SPIs cannot passport.',
    regulatoryReference: 'PSR 2017, Regulation 30',
    type: 'single',
    options: [
      { id: 'uk_only', label: 'UK only', value: 'uk_only' },
      { id: 'uk_eea', label: 'UK and EEA', value: 'uk_eea' },
      { id: 'global', label: 'Global (including non-EEA)', value: 'global' },
    ],
    weight: 8,
    impactOn: [
      { licence: 'SPI', condition: 'not_equals', value: 'uk_only', scoreImpact: -100, eliminates: true },
      { licence: 'SEMI', condition: 'not_equals', value: 'uk_only', scoreImpact: -100, eliminates: true },
      { licence: 'API', condition: 'equals', value: 'uk_eea', scoreImpact: 30 },
      { licence: 'EMI', condition: 'equals', value: 'uk_eea', scoreImpact: 30 },
    ],
  },
  {
    id: 'q14_correspondent_banking',
    category: 'geographic_scope',
    question: 'Will you need correspondent banking relationships?',
    helpText: 'Cross-border payments typically require correspondent banking. This is harder for smaller institutions.',
    type: 'boolean',
    options: [
      { id: 'yes', label: 'Yes', value: true },
      { id: 'no', label: 'No', value: false },
    ],
    weight: 5,
    impactOn: [
      { licence: 'SPI', condition: 'equals', value: true, scoreImpact: -40 },
      { licence: 'SEMI', condition: 'equals', value: true, scoreImpact: -30 },
      { licence: 'API', condition: 'equals', value: true, scoreImpact: 20 },
    ],
  },

  // ==========================================
  // Capital & Resources (Questions 15-17)
  // ==========================================
  {
    id: 'q15_available_capital',
    category: 'capital',
    question: 'What is your available initial capital?',
    helpText: 'Different licence types have different minimum capital requirements. APIs require €125,000, EMIs require €350,000.',
    regulatoryReference: 'PSR 2017, Regulation 17 / EMR 2011, Regulation 6',
    type: 'single',
    options: [
      { id: 'under_50k', label: 'Under €50,000', value: 25000 },
      { id: '50k_125k', label: '€50,000 - €125,000', value: 87500 },
      { id: '125k_350k', label: '€125,000 - €350,000', value: 237500 },
      { id: '350k_1m', label: '€350,000 - €1 million', value: 675000 },
      { id: 'over_1m', label: 'Over €1 million', value: 1500000 },
    ],
    weight: 9,
    impactOn: [
      { licence: 'API', condition: 'less_than', value: 125000, scoreImpact: -100, eliminates: true },
      { licence: 'EMI', condition: 'less_than', value: 350000, scoreImpact: -100, eliminates: true },
      { licence: 'SPI', condition: 'less_than', value: 125000, scoreImpact: 50 },
      { licence: 'SEMI', condition: 'less_than', value: 350000, scoreImpact: 50 },
      { licence: 'RAISP', condition: 'less_than', value: 125000, scoreImpact: 30 },
    ],
  },
  {
    id: 'q16_funding_secured',
    category: 'capital',
    question: 'Do you have secured funding or investment?',
    helpText: 'The FCA expects applicants to have confirmed funding before applying.',
    type: 'single',
    options: [
      { id: 'confirmed', label: 'Yes, confirmed funding', value: 'confirmed' },
      { id: 'in_progress', label: 'In progress', value: 'in_progress' },
      { id: 'not_yet', label: 'Not yet', value: 'not_yet' },
    ],
    weight: 4,
    impactOn: [
      { licence: 'API', condition: 'equals', value: 'not_yet', scoreImpact: -20 },
      { licence: 'EMI', condition: 'equals', value: 'not_yet', scoreImpact: -30 },
    ],
  },
  {
    id: 'q17_compliance_resources',
    category: 'capital',
    question: 'What compliance resources will you have?',
    helpText: 'Full authorisation requires dedicated compliance functions.',
    type: 'single',
    options: [
      { id: 'full_team', label: 'Full in-house compliance team', value: 'full_team' },
      { id: 'dedicated_person', label: 'Dedicated compliance officer', value: 'dedicated_person' },
      { id: 'outsourced', label: 'Outsourced compliance function', value: 'outsourced' },
      { id: 'part_time', label: 'Part-time/shared resource', value: 'part_time' },
    ],
    weight: 6,
    impactOn: [
      { licence: 'API', condition: 'equals', value: 'part_time', scoreImpact: -30 },
      { licence: 'EMI', condition: 'equals', value: 'part_time', scoreImpact: -40 },
      { licence: 'SPI', condition: 'equals', value: 'part_time', scoreImpact: 10 },
    ],
  },

  // ==========================================
  // Technology & Operations (Questions 18-19)
  // ==========================================
  {
    id: 'q18_technology_approach',
    category: 'technology',
    question: 'How will you build your technology platform?',
    helpText: 'The FCA expects firms to have appropriate systems and controls.',
    type: 'single',
    options: [
      { id: 'build', label: 'Build in-house', value: 'build' },
      { id: 'buy', label: 'Use existing platform (BaaS)', value: 'buy' },
      { id: 'hybrid', label: 'Hybrid approach', value: 'hybrid' },
    ],
    weight: 4,
    impactOn: [
      { licence: 'SPI', condition: 'equals', value: 'buy', scoreImpact: 20 },
      { licence: 'SEMI', condition: 'equals', value: 'buy', scoreImpact: 20 },
    ],
  },
  {
    id: 'q19_time_to_market',
    category: 'technology',
    question: 'What is your target time to market?',
    helpText: 'Registration (SPI/SEMI) is faster than full authorisation (API/EMI).',
    type: 'single',
    options: [
      { id: 'asap', label: 'As soon as possible (< 6 months)', value: 'asap' },
      { id: 'moderate', label: '6-12 months', value: 'moderate' },
      { id: 'flexible', label: 'Flexible (12+ months)', value: 'flexible' },
    ],
    weight: 5,
    impactOn: [
      { licence: 'SPI', condition: 'equals', value: 'asap', scoreImpact: 40 },
      { licence: 'SEMI', condition: 'equals', value: 'asap', scoreImpact: 40 },
      { licence: 'API', condition: 'equals', value: 'asap', scoreImpact: -20 },
      { licence: 'EMI', condition: 'equals', value: 'asap', scoreImpact: -30 },
    ],
  },

  // ==========================================
  // Regulatory History (Question 20)
  // ==========================================
  {
    id: 'q20_regulatory_history',
    category: 'regulatory_history',
    question: 'Do the founders/directors have previous FCA-regulated experience?',
    helpText: 'The FCA assesses fitness and propriety of key individuals.',
    type: 'single',
    options: [
      { id: 'extensive', label: 'Yes, extensive experience', value: 'extensive' },
      { id: 'some', label: 'Some experience', value: 'some' },
      { id: 'none', label: 'No prior experience', value: 'none' },
    ],
    weight: 5,
    impactOn: [
      { licence: 'API', condition: 'equals', value: 'none', scoreImpact: -20 },
      { licence: 'EMI', condition: 'equals', value: 'none', scoreImpact: -30 },
      { licence: 'SPI', condition: 'equals', value: 'none', scoreImpact: 10 },
    ],
  },
];

// Helper function to get questions by category
export function getQuestionsByCategory(category: QuestionCategory): AdvisorQuestion[] {
  return LICENCE_ADVISOR_QUESTIONS.filter((q) => q.category === category);
}

// Get all question categories
export const QUESTION_CATEGORIES: { id: QuestionCategory; label: string; description: string }[] = [
  {
    id: 'business_activities',
    label: 'Business Activities',
    description: 'Define the payment services you plan to offer',
  },
  {
    id: 'e_money',
    label: 'E-Money',
    description: 'Electronic money issuance questions',
  },
  {
    id: 'transaction_volumes',
    label: 'Transaction Volumes',
    description: 'Expected payment volumes and growth',
  },
  {
    id: 'customer_types',
    label: 'Customer Types',
    description: 'Target customer segments',
  },
  {
    id: 'geographic_scope',
    label: 'Geographic Scope',
    description: 'Where you plan to operate',
  },
  {
    id: 'capital',
    label: 'Capital & Resources',
    description: 'Available funding and resources',
  },
  {
    id: 'technology',
    label: 'Technology & Operations',
    description: 'Technology approach and timeline',
  },
  {
    id: 'regulatory_history',
    label: 'Regulatory History',
    description: 'Previous regulatory experience',
  },
];

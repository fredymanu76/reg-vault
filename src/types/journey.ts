// REG-VAULT Journey System Types
// Intelligent FCA Licence Application Platform

// ==========================================
// Journey Stage Definitions
// ==========================================

export enum JourneyStage {
  LICENCE_ADVISOR = 'licence-advisor',
  INTAKE = 'intake',
  FCA_FORMS = 'fca-forms',
  BUSINESS_PLAN = 'business-plan',
  FINANCIAL_PROJECTIONS = 'financial-projections',
  POLICIES = 'policies',
  DIAGRAMS = 'diagrams',
  BUNDLE_REVIEW = 'bundle-review',
  SUBMISSION = 'submission',
}

export type StageStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface StageInfo {
  id: JourneyStage;
  name: string;
  description: string;
  icon: string;
  order: number;
  dependencies: JourneyStage[];
  estimatedTime?: string;
}

export const JOURNEY_STAGES: Record<JourneyStage, StageInfo> = {
  [JourneyStage.LICENCE_ADVISOR]: {
    id: JourneyStage.LICENCE_ADVISOR,
    name: 'Licence Advisor',
    description: 'Determine the right FCA licence type for your business',
    icon: 'Compass',
    order: 1,
    dependencies: [],
    estimatedTime: '15-20 minutes',
  },
  [JourneyStage.INTAKE]: {
    id: JourneyStage.INTAKE,
    name: 'Intake Questionnaire',
    description: 'Provide core business information',
    icon: 'ClipboardList',
    order: 2,
    dependencies: [JourneyStage.LICENCE_ADVISOR],
    estimatedTime: '30-45 minutes',
  },
  [JourneyStage.FCA_FORMS]: {
    id: JourneyStage.FCA_FORMS,
    name: 'FCA Forms',
    description: 'Complete required FCA application forms',
    icon: 'FileText',
    order: 3,
    dependencies: [JourneyStage.INTAKE],
    estimatedTime: '1-2 hours',
  },
  [JourneyStage.BUSINESS_PLAN]: {
    id: JourneyStage.BUSINESS_PLAN,
    name: 'Business Plan',
    description: 'Generate your regulatory business plan',
    icon: 'FileEdit',
    order: 4,
    dependencies: [JourneyStage.INTAKE],
    estimatedTime: '2-3 hours',
  },
  [JourneyStage.FINANCIAL_PROJECTIONS]: {
    id: JourneyStage.FINANCIAL_PROJECTIONS,
    name: 'Financial Projections',
    description: 'Create 3-5 year financial forecasts and capital calculations',
    icon: 'Calculator',
    order: 5,
    dependencies: [JourneyStage.INTAKE],
    estimatedTime: '1-2 hours',
  },
  [JourneyStage.POLICIES]: {
    id: JourneyStage.POLICIES,
    name: 'Policies & Procedures',
    description: 'Generate compliance policies tailored to your licence',
    icon: 'Shield',
    order: 6,
    dependencies: [JourneyStage.LICENCE_ADVISOR],
    estimatedTime: '2-3 hours',
  },
  [JourneyStage.DIAGRAMS]: {
    id: JourneyStage.DIAGRAMS,
    name: 'System Diagrams',
    description: 'Create payment flow and architecture diagrams',
    icon: 'GitBranch',
    order: 7,
    dependencies: [JourneyStage.INTAKE],
    estimatedTime: '1 hour',
  },
  [JourneyStage.BUNDLE_REVIEW]: {
    id: JourneyStage.BUNDLE_REVIEW,
    name: 'Bundle Review',
    description: 'Review and finalize your application bundle',
    icon: 'Package',
    order: 8,
    dependencies: [
      JourneyStage.FCA_FORMS,
      JourneyStage.BUSINESS_PLAN,
      JourneyStage.FINANCIAL_PROJECTIONS,
      JourneyStage.POLICIES,
      JourneyStage.DIAGRAMS,
    ],
    estimatedTime: '1-2 hours',
  },
  [JourneyStage.SUBMISSION]: {
    id: JourneyStage.SUBMISSION,
    name: 'Submission',
    description: 'Submit your application to the FCA',
    icon: 'Send',
    order: 9,
    dependencies: [JourneyStage.BUNDLE_REVIEW],
    estimatedTime: '30 minutes',
  },
};

// ==========================================
// Journey State
// ==========================================

export interface StageProgress {
  stage: JourneyStage;
  status: StageStatus;
  progress: number; // 0-100
  completedItems: string[];
  totalItems: number;
  startedAt?: string;
  completedAt?: string;
  lastUpdatedAt?: string;
}

export interface JourneyState {
  id: string;
  applicationName: string;
  currentStage: JourneyStage;
  stages: Record<JourneyStage, StageProgress>;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

// ==========================================
// Licence Types (FCA/PSR/EMR)
// ==========================================

export type LicenceType =
  | 'SPI' // Small Payment Institution
  | 'API' // Authorised Payment Institution
  | 'SEMI' // Small EMI
  | 'EMI' // Electronic Money Institution
  | 'RAISP'; // Registered Account Information Service Provider

export interface LicenceRequirements {
  type: LicenceType;
  fullName: string;
  description: string;
  regulation: 'PSR2017' | 'EMR2011';
  initialCapital: number;
  ongoingCapital: {
    methodA?: boolean;
    methodB?: boolean;
    methodC?: boolean;
    methodD?: boolean;
  };
  safeguarding: boolean;
  passporting: boolean;
  volumeLimit?: number;
  activities: string[];
  keyFeatures: string[];
}

export interface LicenceRecommendation {
  recommended: LicenceType;
  alternatives: LicenceType[];
  confidence: 'high' | 'medium' | 'low';
  reasoning: string[];
  capitalRequirement: {
    initial: number;
    ongoing: number;
    method: string;
  };
  warnings: string[];
  regulatoryReferences: string[];
}

// ==========================================
// Intake/Questionnaire Data
// ==========================================

export interface BusinessInfo {
  companyName: string;
  companyNumber?: string;
  incorporationDate?: string;
  registeredAddress: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  tradingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  website?: string;
  description: string;
}

export interface PaymentServicesInfo {
  services: PaymentServiceType[];
  customerTypes: CustomerType[];
  geographicScope: string[];
  expectedVolumes: {
    monthly: number;
    annual: number;
  };
  averageTransactionValue: number;
  currencies: string[];
}

export type PaymentServiceType =
  | 'money_remittance'
  | 'payment_initiation'
  | 'account_information'
  | 'payment_accounts'
  | 'card_issuing'
  | 'merchant_acquiring'
  | 'e_money_issuance';

export type CustomerType = 'consumers' | 'businesses' | 'both';

export interface PersonInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  role: PersonRole;
  ownership?: number; // percentage
  cv?: string;
  qualifications?: string[];
  regulatoryHistory?: string;
}

export type PersonRole =
  | 'director'
  | 'beneficial_owner'
  | 'compliance_officer'
  | 'mlro'
  | 'ceo'
  | 'cfo'
  | 'cto';

export interface JourneyData {
  licenceType?: LicenceType;
  licenceRecommendation?: LicenceRecommendation;
  businessInfo?: BusinessInfo;
  paymentServices?: PaymentServicesInfo;
  persons?: PersonInfo[];
  businessPlan?: BusinessPlanData;
  financialProjections?: FinancialProjections;
  policies?: PolicyDocument[];
  diagrams?: DiagramData[];
  customData: Record<string, unknown>;
}

// ==========================================
// AI Assistant Types
// ==========================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  context?: {
    stage: JourneyStage;
    field?: string;
    action?: 'help' | 'autofill' | 'validate' | 'generate';
  };
  citations?: Citation[];
  suggestions?: Suggestion[];
}

export interface Citation {
  source: string;
  text: string;
  url?: string;
  regulation?: string;
}

export interface Suggestion {
  id: string;
  type: 'quick_action' | 'autofill' | 'guidance';
  label: string;
  action: string;
  data?: unknown;
}

export interface AIAssistantState {
  isOpen: boolean;
  isMinimized: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  currentContext: {
    stage: JourneyStage;
    field?: string;
  };
  suggestions: Suggestion[];
}

// ==========================================
// Financial Projections Types
// ==========================================

export interface FinancialAssumptions {
  projectionYears: number; // 3 or 5
  startYear: number;
  revenueGrowthRate: number[]; // per year
  inflationRate: number;
  taxRate: number;
  workingCapitalDays: {
    receivables: number;
    payables: number;
  };
}

export interface RevenueStream {
  id: string;
  name: string;
  type: 'transaction_fee' | 'subscription' | 'fx_margin' | 'interest' | 'other';
  baseValue: number;
  unit: 'per_transaction' | 'monthly' | 'annual' | 'percentage';
  volumeAssumptions: number[]; // per year
  growthRate: number;
}

export interface CostItem {
  id: string;
  name: string;
  category: CostCategory;
  type: 'fixed' | 'variable';
  amount: number;
  frequency: 'monthly' | 'annual' | 'one_time';
  variableRate?: number; // percentage of revenue if variable
  yearlyAmounts?: number[]; // override per year
}

export type CostCategory =
  | 'staff'
  | 'technology'
  | 'compliance'
  | 'professional_fees'
  | 'premises'
  | 'marketing'
  | 'insurance'
  | 'other';

export interface ProfitAndLoss {
  year: number;
  revenue: {
    streams: { name: string; amount: number }[];
    total: number;
  };
  costs: {
    byCategory: Record<CostCategory, number>;
    total: number;
  };
  grossProfit: number;
  operatingProfit: number;
  tax: number;
  netProfit: number;
}

export interface CashFlow {
  year: number;
  operatingCashFlow: number;
  investingCashFlow: number;
  financingCashFlow: number;
  netCashFlow: number;
  openingBalance: number;
  closingBalance: number;
}

export interface BalanceSheet {
  year: number;
  assets: {
    currentAssets: {
      cash: number;
      receivables: number;
      other: number;
      total: number;
    };
    fixedAssets: {
      tangible: number;
      intangible: number;
      total: number;
    };
    totalAssets: number;
  };
  liabilities: {
    currentLiabilities: {
      payables: number;
      safeguarded: number;
      other: number;
      total: number;
    };
    longTermLiabilities: number;
    totalLiabilities: number;
  };
  equity: {
    shareCapital: number;
    retainedEarnings: number;
    totalEquity: number;
  };
}

export interface CapitalRequirement {
  licenceType: LicenceType;
  initialCapital: number;
  ongoingCapital: {
    methodA?: number; // 10% of fixed overheads
    methodB?: number; // Based on payment volume
    methodC?: number; // Based on relevant income
    methodD?: number; // 2% of average e-money (EMI only)
  };
  recommendedMethod: 'A' | 'B' | 'C' | 'D';
  minimumCapital: number;
  safeguardingRequired: number;
  buffer: number;
  totalRequired: number;
}

export interface SensitivityScenario {
  name: 'base' | 'optimistic' | 'pessimistic';
  revenueMultiplier: number;
  costMultiplier: number;
  projections: {
    pnl: ProfitAndLoss[];
    cashFlow: CashFlow[];
    capitalAdequacy: boolean[];
  };
}

export interface FinancialProjections {
  assumptions: FinancialAssumptions;
  revenueStreams: RevenueStream[];
  costs: CostItem[];
  statements: {
    pnl: ProfitAndLoss[];
    cashFlow: CashFlow[];
    balanceSheet: BalanceSheet[];
  };
  capitalRequirement: CapitalRequirement;
  sensitivity: SensitivityScenario[];
}

// ==========================================
// Business Plan Types
// ==========================================

export interface BusinessPlanSection {
  id: string;
  title: string;
  order: number;
  content: string;
  aiGenerated: boolean;
  lastEditedAt: string;
  regulatoryAlignment: {
    score: number;
    references: string[];
    gaps: string[];
  };
}

export interface BusinessPlanData {
  sections: BusinessPlanSection[];
  version: number;
  createdAt: string;
  updatedAt: string;
  exportedAt?: string;
}

export const BUSINESS_PLAN_SECTIONS = [
  { id: 'executive_summary', title: 'Executive Summary', order: 1 },
  { id: 'business_model', title: 'Business Model', order: 2 },
  { id: 'market_analysis', title: 'Market Analysis', order: 3 },
  { id: 'products_services', title: 'Products & Services', order: 4 },
  { id: 'operations', title: 'Operations', order: 5 },
  { id: 'technology', title: 'Technology & Systems', order: 6 },
  { id: 'management_team', title: 'Management Team', order: 7 },
  { id: 'regulatory_strategy', title: 'Regulatory Strategy', order: 8 },
  { id: 'risk_management', title: 'Risk Management', order: 9 },
  { id: 'financial_overview', title: 'Financial Overview', order: 10 },
] as const;

// ==========================================
// Policy Document Types
// ==========================================

export interface PolicyDocument {
  id: string;
  name: string;
  category: PolicyCategory;
  content: string;
  version: string;
  status: 'draft' | 'review' | 'approved';
  generatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  regulatoryMappings: {
    regulation: string;
    section: string;
    requirement: string;
  }[];
}

export type PolicyCategory =
  | 'aml_kyc'
  | 'safeguarding'
  | 'complaints'
  | 'data_protection'
  | 'business_continuity'
  | 'outsourcing'
  | 'governance'
  | 'operational_resilience'
  | 'financial_crime';

// ==========================================
// Diagram Types
// ==========================================

export interface DiagramData {
  id: string;
  name: string;
  type: DiagramType;
  content: string; // Mermaid or SVG
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type DiagramType =
  | 'payment_flow'
  | 'system_architecture'
  | 'organizational_structure'
  | 'aml_process'
  | 'customer_journey';

// ==========================================
// Bundle/Submission Types
// ==========================================

export interface BundleItem {
  id: string;
  name: string;
  type: 'form' | 'document' | 'policy' | 'diagram' | 'financial';
  required: boolean;
  status: 'not_started' | 'in_progress' | 'complete' | 'validated' | 'error';
  validationErrors?: string[];
  fileUrl?: string;
  generatedAt?: string;
}

export interface ApplicationBundle {
  id: string;
  applicationId: string;
  licenceType: LicenceType;
  items: BundleItem[];
  fcaChecklist: {
    item: string;
    completed: boolean;
    notes?: string;
  }[];
  readinessScore: number; // 0-100
  validatedAt?: string;
  submittedAt?: string;
}

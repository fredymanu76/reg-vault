// REG-VAULT Financial Templates
// Pre-configured financial projections templates for different business models

import { RevenueStream, CostItem, CostCategory, FinancialAssumptions } from '../types/journey';

// ==========================================
// Default Assumptions
// ==========================================

export const DEFAULT_ASSUMPTIONS: FinancialAssumptions = {
  projectionYears: 3,
  startYear: new Date().getFullYear(),
  revenueGrowthRate: [0, 0.50, 0.30], // Year 1 base, 50% Y2, 30% Y3
  inflationRate: 0.025,
  taxRate: 0.19, // UK Corporation Tax for small profits
  workingCapitalDays: {
    receivables: 30,
    payables: 45,
  },
};

export const EXTENDED_ASSUMPTIONS: FinancialAssumptions = {
  projectionYears: 5,
  startYear: new Date().getFullYear(),
  revenueGrowthRate: [0, 0.50, 0.35, 0.25, 0.20],
  inflationRate: 0.025,
  taxRate: 0.25, // Main rate for larger profits
  workingCapitalDays: {
    receivables: 30,
    payables: 45,
  },
};

// ==========================================
// Revenue Stream Templates
// ==========================================

export interface RevenueTemplate {
  name: string;
  description: string;
  applicableTo: ('SPI' | 'API' | 'EMI' | 'SEMI' | 'RAISP')[];
  streams: Omit<RevenueStream, 'id'>[];
}

export const REVENUE_TEMPLATES: RevenueTemplate[] = [
  {
    name: 'Money Remittance',
    description: 'Classic money transfer business model',
    applicableTo: ['SPI', 'API'],
    streams: [
      {
        name: 'Transfer Fees',
        type: 'transaction_fee',
        baseValue: 4.99,
        unit: 'per_transaction',
        volumeAssumptions: [50000, 125000, 200000],
        growthRate: 0.5,
      },
      {
        name: 'FX Margin',
        type: 'fx_margin',
        baseValue: 75000,
        unit: 'monthly',
        volumeAssumptions: [],
        growthRate: 0.4,
      },
    ],
  },
  {
    name: 'Payment Account Provider',
    description: 'Business accounts with payment functionality',
    applicableTo: ['API', 'EMI'],
    streams: [
      {
        name: 'Account Subscription',
        type: 'subscription',
        baseValue: 9.99,
        unit: 'monthly',
        volumeAssumptions: [1000, 3000, 7500],
        growthRate: 0.6,
      },
      {
        name: 'Transaction Fees',
        type: 'transaction_fee',
        baseValue: 0.20,
        unit: 'per_transaction',
        volumeAssumptions: [100000, 350000, 800000],
        growthRate: 0.5,
      },
      {
        name: 'Premium Features',
        type: 'subscription',
        baseValue: 29.99,
        unit: 'monthly',
        volumeAssumptions: [100, 500, 1500],
        growthRate: 0.8,
      },
    ],
  },
  {
    name: 'Card Issuing',
    description: 'Prepaid or debit card programme',
    applicableTo: ['EMI', 'SEMI'],
    streams: [
      {
        name: 'Card Issuance Fee',
        type: 'transaction_fee',
        baseValue: 5.00,
        unit: 'per_transaction',
        volumeAssumptions: [10000, 40000, 100000],
        growthRate: 0.7,
      },
      {
        name: 'Interchange Revenue',
        type: 'transaction_fee',
        baseValue: 0.15,
        unit: 'per_transaction',
        volumeAssumptions: [500000, 2000000, 5000000],
        growthRate: 0.6,
      },
      {
        name: 'Monthly Card Fee',
        type: 'subscription',
        baseValue: 2.99,
        unit: 'monthly',
        volumeAssumptions: [10000, 40000, 100000],
        growthRate: 0.7,
      },
      {
        name: 'Float Interest',
        type: 'interest',
        baseValue: 50000,
        unit: 'annual',
        volumeAssumptions: [],
        growthRate: 0.5,
      },
    ],
  },
  {
    name: 'Merchant Acquiring',
    description: 'Payment acceptance for businesses',
    applicableTo: ['API', 'EMI'],
    streams: [
      {
        name: 'Transaction Processing',
        type: 'transaction_fee',
        baseValue: 0.25,
        unit: 'per_transaction',
        volumeAssumptions: [200000, 800000, 2000000],
        growthRate: 0.5,
      },
      {
        name: 'Merchant Service Charge',
        type: 'fx_margin', // Using as percentage basis
        baseValue: 100000,
        unit: 'monthly',
        volumeAssumptions: [],
        growthRate: 0.4,
      },
      {
        name: 'Terminal Rental',
        type: 'subscription',
        baseValue: 15.00,
        unit: 'monthly',
        volumeAssumptions: [500, 2000, 5000],
        growthRate: 0.6,
      },
    ],
  },
  {
    name: 'Open Banking (AISP)',
    description: 'Account aggregation and information services',
    applicableTo: ['RAISP'],
    streams: [
      {
        name: 'API Subscription - Starter',
        type: 'subscription',
        baseValue: 99,
        unit: 'monthly',
        volumeAssumptions: [100, 400, 1000],
        growthRate: 0.8,
      },
      {
        name: 'API Subscription - Business',
        type: 'subscription',
        baseValue: 499,
        unit: 'monthly',
        volumeAssumptions: [50, 200, 600],
        growthRate: 0.7,
      },
      {
        name: 'API Subscription - Enterprise',
        type: 'subscription',
        baseValue: 2999,
        unit: 'monthly',
        volumeAssumptions: [5, 20, 50],
        growthRate: 0.5,
      },
      {
        name: 'Per-API Call (Overage)',
        type: 'transaction_fee',
        baseValue: 0.01,
        unit: 'per_transaction',
        volumeAssumptions: [1000000, 5000000, 15000000],
        growthRate: 0.6,
      },
    ],
  },
  {
    name: 'Payment Initiation (PISP)',
    description: 'Payment initiation services for merchants',
    applicableTo: ['API', 'EMI'],
    streams: [
      {
        name: 'Payment Initiation Fee',
        type: 'transaction_fee',
        baseValue: 0.30,
        unit: 'per_transaction',
        volumeAssumptions: [50000, 200000, 500000],
        growthRate: 0.6,
      },
      {
        name: 'Merchant Integration Fee',
        type: 'other',
        baseValue: 500,
        unit: 'per_transaction',
        volumeAssumptions: [20, 80, 200],
        growthRate: 0.5,
      },
      {
        name: 'Monthly Platform Fee',
        type: 'subscription',
        baseValue: 199,
        unit: 'monthly',
        volumeAssumptions: [50, 200, 500],
        growthRate: 0.7,
      },
    ],
  },
];

// ==========================================
// Cost Structure Templates
// ==========================================

export interface CostTemplate {
  name: string;
  description: string;
  applicableTo: ('SPI' | 'API' | 'EMI' | 'SEMI' | 'RAISP')[];
  costs: Omit<CostItem, 'id'>[];
}

export const COST_TEMPLATES: CostTemplate[] = [
  {
    name: 'Lean Startup',
    description: 'Minimal viable structure for registered institutions',
    applicableTo: ['SPI', 'SEMI', 'RAISP'],
    costs: [
      {
        name: 'CEO/Founder',
        category: 'staff',
        type: 'fixed',
        amount: 6000,
        frequency: 'monthly',
      },
      {
        name: 'Compliance Officer (Part-time)',
        category: 'staff',
        type: 'fixed',
        amount: 3000,
        frequency: 'monthly',
      },
      {
        name: 'Outsourced Development',
        category: 'technology',
        type: 'fixed',
        amount: 5000,
        frequency: 'monthly',
      },
      {
        name: 'Cloud Infrastructure',
        category: 'technology',
        type: 'variable',
        amount: 0,
        frequency: 'monthly',
        variableRate: 3,
      },
      {
        name: 'Compliance Consultancy',
        category: 'compliance',
        type: 'fixed',
        amount: 2000,
        frequency: 'monthly',
      },
      {
        name: 'Legal & Professional',
        category: 'professional_fees',
        type: 'fixed',
        amount: 1500,
        frequency: 'monthly',
      },
      {
        name: 'Insurance (PI/Cyber)',
        category: 'insurance',
        type: 'fixed',
        amount: 15000,
        frequency: 'annual',
      },
      {
        name: 'Remote Working Allowance',
        category: 'premises',
        type: 'fixed',
        amount: 500,
        frequency: 'monthly',
      },
      {
        name: 'Marketing & Acquisition',
        category: 'marketing',
        type: 'variable',
        amount: 0,
        frequency: 'monthly',
        variableRate: 10,
      },
    ],
  },
  {
    name: 'Growth Stage API',
    description: 'Typical structure for an Authorised Payment Institution',
    applicableTo: ['API'],
    costs: [
      {
        name: 'Management Team (CEO, CFO, CTO)',
        category: 'staff',
        type: 'fixed',
        amount: 35000,
        frequency: 'monthly',
      },
      {
        name: 'Compliance Team',
        category: 'staff',
        type: 'fixed',
        amount: 12000,
        frequency: 'monthly',
      },
      {
        name: 'Operations Team',
        category: 'staff',
        type: 'fixed',
        amount: 15000,
        frequency: 'monthly',
      },
      {
        name: 'Technology Team',
        category: 'staff',
        type: 'fixed',
        amount: 25000,
        frequency: 'monthly',
      },
      {
        name: 'Cloud & Infrastructure',
        category: 'technology',
        type: 'fixed',
        amount: 8000,
        frequency: 'monthly',
      },
      {
        name: 'Software Licences',
        category: 'technology',
        type: 'fixed',
        amount: 5000,
        frequency: 'monthly',
      },
      {
        name: 'Payment Scheme Fees',
        category: 'technology',
        type: 'variable',
        amount: 0,
        frequency: 'monthly',
        variableRate: 5,
      },
      {
        name: 'Regulatory Technology',
        category: 'compliance',
        type: 'fixed',
        amount: 3000,
        frequency: 'monthly',
      },
      {
        name: 'External Audit',
        category: 'compliance',
        type: 'fixed',
        amount: 40000,
        frequency: 'annual',
      },
      {
        name: 'FCA Fees',
        category: 'compliance',
        type: 'fixed',
        amount: 25000,
        frequency: 'annual',
      },
      {
        name: 'Legal Services',
        category: 'professional_fees',
        type: 'fixed',
        amount: 5000,
        frequency: 'monthly',
      },
      {
        name: 'Accountancy',
        category: 'professional_fees',
        type: 'fixed',
        amount: 3000,
        frequency: 'monthly',
      },
      {
        name: 'Office Space',
        category: 'premises',
        type: 'fixed',
        amount: 6000,
        frequency: 'monthly',
      },
      {
        name: 'Insurance Package',
        category: 'insurance',
        type: 'fixed',
        amount: 50000,
        frequency: 'annual',
      },
      {
        name: 'Marketing',
        category: 'marketing',
        type: 'variable',
        amount: 0,
        frequency: 'monthly',
        variableRate: 8,
      },
      {
        name: 'Travel & Entertainment',
        category: 'other',
        type: 'fixed',
        amount: 2000,
        frequency: 'monthly',
      },
    ],
  },
  {
    name: 'Full EMI Structure',
    description: 'Comprehensive structure for an Electronic Money Institution',
    applicableTo: ['EMI'],
    costs: [
      {
        name: 'Executive Team',
        category: 'staff',
        type: 'fixed',
        amount: 50000,
        frequency: 'monthly',
      },
      {
        name: 'Compliance & Risk Team',
        category: 'staff',
        type: 'fixed',
        amount: 25000,
        frequency: 'monthly',
      },
      {
        name: 'Operations Team',
        category: 'staff',
        type: 'fixed',
        amount: 30000,
        frequency: 'monthly',
      },
      {
        name: 'Technology Team',
        category: 'staff',
        type: 'fixed',
        amount: 45000,
        frequency: 'monthly',
      },
      {
        name: 'Customer Service',
        category: 'staff',
        type: 'fixed',
        amount: 15000,
        frequency: 'monthly',
      },
      {
        name: 'Cloud Infrastructure',
        category: 'technology',
        type: 'fixed',
        amount: 15000,
        frequency: 'monthly',
      },
      {
        name: 'Core Banking Platform',
        category: 'technology',
        type: 'fixed',
        amount: 20000,
        frequency: 'monthly',
      },
      {
        name: 'Card Issuing Platform',
        category: 'technology',
        type: 'variable',
        amount: 0,
        frequency: 'monthly',
        variableRate: 8,
      },
      {
        name: 'Security & Monitoring',
        category: 'technology',
        type: 'fixed',
        amount: 8000,
        frequency: 'monthly',
      },
      {
        name: 'RegTech Solutions',
        category: 'compliance',
        type: 'fixed',
        amount: 10000,
        frequency: 'monthly',
      },
      {
        name: 'External Audit & Assurance',
        category: 'compliance',
        type: 'fixed',
        amount: 80000,
        frequency: 'annual',
      },
      {
        name: 'FCA Periodic Fees',
        category: 'compliance',
        type: 'fixed',
        amount: 100000,
        frequency: 'annual',
      },
      {
        name: 'Safeguarding Costs',
        category: 'compliance',
        type: 'variable',
        amount: 0,
        frequency: 'monthly',
        variableRate: 0.5,
      },
      {
        name: 'Legal Services',
        category: 'professional_fees',
        type: 'fixed',
        amount: 10000,
        frequency: 'monthly',
      },
      {
        name: 'Tax & Accountancy',
        category: 'professional_fees',
        type: 'fixed',
        amount: 8000,
        frequency: 'monthly',
      },
      {
        name: 'Office & Facilities',
        category: 'premises',
        type: 'fixed',
        amount: 15000,
        frequency: 'monthly',
      },
      {
        name: 'Insurance (PI, Cyber, D&O)',
        category: 'insurance',
        type: 'fixed',
        amount: 150000,
        frequency: 'annual',
      },
      {
        name: 'Marketing & Brand',
        category: 'marketing',
        type: 'variable',
        amount: 0,
        frequency: 'monthly',
        variableRate: 7,
      },
      {
        name: 'General & Admin',
        category: 'other',
        type: 'fixed',
        amount: 5000,
        frequency: 'monthly',
      },
    ],
  },
];

// ==========================================
// Industry Benchmarks
// ==========================================

export interface IndustryBenchmark {
  category: CostCategory | 'revenue';
  metric: string;
  percentOfRevenue?: { min: number; max: number };
  absoluteRange?: { min: number; max: number };
  notes: string;
}

export const INDUSTRY_BENCHMARKS: IndustryBenchmark[] = [
  {
    category: 'staff',
    metric: 'Staff costs as % of revenue',
    percentOfRevenue: { min: 25, max: 45 },
    notes: 'Higher in early stages, scales down with growth',
  },
  {
    category: 'technology',
    metric: 'Technology costs as % of revenue',
    percentOfRevenue: { min: 8, max: 20 },
    notes: 'Fintechs typically at higher end',
  },
  {
    category: 'compliance',
    metric: 'Compliance costs as % of revenue',
    percentOfRevenue: { min: 5, max: 15 },
    notes: 'Higher for EMIs and APIs',
  },
  {
    category: 'marketing',
    metric: 'Customer acquisition cost',
    absoluteRange: { min: 20, max: 150 },
    notes: 'Per customer, varies by channel',
  },
  {
    category: 'revenue',
    metric: 'Revenue per employee',
    absoluteRange: { min: 100000, max: 300000 },
    notes: 'Annual revenue divided by FTE count',
  },
  {
    category: 'revenue',
    metric: 'Gross margin',
    percentOfRevenue: { min: 40, max: 70 },
    notes: 'After direct costs, before operating expenses',
  },
];

// ==========================================
// Sensitivity Scenarios
// ==========================================

export interface ScenarioConfig {
  name: string;
  description: string;
  revenueMultiplier: number;
  costMultiplier: number;
  probability: number;
}

export const SENSITIVITY_SCENARIOS: ScenarioConfig[] = [
  {
    name: 'Pessimistic',
    description: 'Revenue 30% lower, costs 10% higher than plan',
    revenueMultiplier: 0.7,
    costMultiplier: 1.1,
    probability: 0.2,
  },
  {
    name: 'Base',
    description: 'Revenue and costs as planned',
    revenueMultiplier: 1.0,
    costMultiplier: 1.0,
    probability: 0.5,
  },
  {
    name: 'Optimistic',
    description: 'Revenue 20% higher, costs 5% lower than plan',
    revenueMultiplier: 1.2,
    costMultiplier: 0.95,
    probability: 0.3,
  },
];

// ==========================================
// Helper Functions
// ==========================================

export function getRevenueTemplatesForLicence(
  licenceType: 'SPI' | 'API' | 'EMI' | 'SEMI' | 'RAISP'
): RevenueTemplate[] {
  return REVENUE_TEMPLATES.filter((t) => t.applicableTo.includes(licenceType));
}

export function getCostTemplatesForLicence(
  licenceType: 'SPI' | 'API' | 'EMI' | 'SEMI' | 'RAISP'
): CostTemplate[] {
  return COST_TEMPLATES.filter((t) => t.applicableTo.includes(licenceType));
}

export function generateIdForItems<T extends object>(items: T[]): (T & { id: string })[] {
  return items.map((item) => ({
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  }));
}

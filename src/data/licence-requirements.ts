// REG-VAULT Licence Requirements Data
// FCA/PSR/EMR regulatory requirements for each licence type

import { LicenceType, LicenceRequirements } from '../types/journey';

export const LICENCE_REQUIREMENTS: Record<LicenceType, LicenceRequirements> = {
  SPI: {
    type: 'SPI',
    fullName: 'Small Payment Institution',
    description: 'Registration for lower-volume payment services with simplified requirements.',
    regulation: 'PSR2017',
    initialCapital: 0,
    ongoingCapital: {
      methodA: false,
      methodB: false,
      methodC: false,
      methodD: false,
    },
    safeguarding: true,
    passporting: false,
    volumeLimit: 3000000, // €3 million monthly average
    activities: [
      'Money remittance',
      'Payment execution (from/to payment accounts)',
      'Cash placement/withdrawal',
      'Payment transactions via card or similar',
    ],
    keyFeatures: [
      'No minimum capital requirement',
      'Limited to €3 million average monthly transactions',
      'Cannot passport to other EEA states',
      'Simplified governance requirements',
      'Must still safeguard customer funds',
      'Subject to conduct of business rules',
      'Registration typically faster than authorisation',
    ],
  },
  API: {
    type: 'API',
    fullName: 'Authorised Payment Institution',
    description: 'Full authorisation for payment services with no volume restrictions.',
    regulation: 'PSR2017',
    initialCapital: 125000, // €125,000
    ongoingCapital: {
      methodA: true,
      methodB: true,
      methodC: true,
      methodD: false,
    },
    safeguarding: true,
    passporting: true,
    activities: [
      'Money remittance',
      'Payment execution (from/to payment accounts)',
      'Issuing payment instruments',
      'Acquiring payment transactions',
      'Payment initiation services',
      'Cash placement/withdrawal',
      'Payment transactions via card or similar',
    ],
    keyFeatures: [
      '€125,000 minimum initial capital',
      'No transaction volume limits',
      'Can passport across EEA',
      'Full governance requirements apply',
      'Ongoing capital requirements (Method A, B, or C)',
      'Professional Indemnity Insurance may be required',
      'Subject to all conduct of business rules',
    ],
  },
  SEMI: {
    type: 'SEMI',
    fullName: 'Small Electronic Money Institution',
    description: 'Registration for lower-volume e-money issuance with simplified requirements.',
    regulation: 'EMR2011',
    initialCapital: 0,
    ongoingCapital: {
      methodA: false,
      methodB: false,
      methodC: false,
      methodD: false,
    },
    safeguarding: true,
    passporting: false,
    volumeLimit: 5000000, // €5 million average outstanding
    activities: [
      'E-money issuance',
      'Payment services related to e-money issuance',
      'Payment accounts for e-money holders',
    ],
    keyFeatures: [
      'No minimum capital requirement',
      'Limited to €5 million average outstanding e-money',
      'Cannot passport to other EEA states',
      'Simplified governance requirements',
      'Must safeguard funds equal to outstanding e-money',
      'Subject to EMR conduct requirements',
      'Registration typically faster than authorisation',
    ],
  },
  EMI: {
    type: 'EMI',
    fullName: 'Electronic Money Institution',
    description: 'Full authorisation for e-money issuance with no restrictions.',
    regulation: 'EMR2011',
    initialCapital: 350000, // €350,000
    ongoingCapital: {
      methodA: true,
      methodB: true,
      methodC: true,
      methodD: true, // 2% of average outstanding e-money
    },
    safeguarding: true,
    passporting: true,
    activities: [
      'E-money issuance',
      'All payment services',
      'Payment accounts',
      'Issuing payment instruments (cards)',
      'Acquiring payment transactions',
      'Money remittance',
      'Payment initiation and account information services',
    ],
    keyFeatures: [
      '€350,000 minimum initial capital',
      'No e-money volume limits',
      'Can passport across EEA',
      'Full governance requirements apply',
      'Own funds requirement (Method D or higher)',
      'Must safeguard 100% of outstanding e-money',
      'Can provide all payment services',
      'More complex ongoing reporting',
    ],
  },
  RAISP: {
    type: 'RAISP',
    fullName: 'Registered Account Information Service Provider',
    description: 'Registration for account information services only (Open Banking).',
    regulation: 'PSR2017',
    initialCapital: 0,
    ongoingCapital: {
      methodA: false,
      methodB: false,
      methodC: false,
      methodD: false,
    },
    safeguarding: false, // No funds held
    passporting: true,
    activities: [
      'Account information services',
      'Aggregating account data',
      'Providing consolidated view of accounts',
    ],
    keyFeatures: [
      'No minimum capital requirement',
      'Cannot hold customer funds',
      'Professional Indemnity Insurance required',
      'Simplified registration process',
      'Can passport across EEA',
      'Limited to account information only',
      'No payment initiation allowed',
      'Must comply with Open Banking standards',
    ],
  },
};

// Capital calculation methods explained
export const CAPITAL_METHODS = {
  A: {
    name: 'Method A - Fixed Overheads',
    description: '10% of fixed overheads from the previous year',
    calculation: 'Own funds = 10% × Fixed overheads',
    applicableTo: ['API', 'EMI'],
    regulatoryReference: 'PSR 2017, Regulation 18(2)(a)',
  },
  B: {
    name: 'Method B - Payment Volume',
    description: 'Sliding scale based on total payment volume',
    calculation: `
      4.0% × first €5m
      + 2.5% × €5m-€10m
      + 1.0% × €10m-€100m
      + 0.5% × €100m-€250m
      + 0.25% × €250m+
      (Result divided by 12 for monthly average)
    `,
    applicableTo: ['API', 'EMI'],
    regulatoryReference: 'PSR 2017, Regulation 18(2)(b)',
  },
  C: {
    name: 'Method C - Relevant Income',
    description: 'Sliding scale based on relevant payment services income',
    calculation: `
      10% × first €2.5m
      + 8% × €2.5m-€5m
      + 6% × €5m-€25m
      + 3% × €25m-€50m
      + 1.5% × €50m+
    `,
    applicableTo: ['API', 'EMI'],
    regulatoryReference: 'PSR 2017, Regulation 18(2)(c)',
  },
  D: {
    name: 'Method D - Average E-Money',
    description: '2% of average outstanding electronic money',
    calculation: 'Own funds = 2% × Average outstanding e-money',
    applicableTo: ['EMI'],
    regulatoryReference: 'EMR 2011, Regulation 6(5)',
  },
};

// FCA application fees
export const APPLICATION_FEES: Record<LicenceType, number> = {
  SPI: 500,
  API: 5000,
  SEMI: 500,
  EMI: 5000,
  RAISP: 500,
};

// Typical processing times (in months)
export const PROCESSING_TIMES: Record<LicenceType, { min: number; max: number }> = {
  SPI: { min: 3, max: 6 },
  API: { min: 6, max: 12 },
  SEMI: { min: 3, max: 6 },
  EMI: { min: 9, max: 15 },
  RAISP: { min: 3, max: 6 },
};

// Key regulatory references
export const REGULATORY_REFERENCES = {
  PSR2017: {
    fullName: 'Payment Services Regulations 2017',
    url: 'https://www.legislation.gov.uk/uksi/2017/752/contents',
    keyProvisions: [
      { section: 'Part 2', title: 'Registration and Authorisation' },
      { section: 'Regulation 14', title: 'Registration as small payment institution' },
      { section: 'Regulation 17', title: 'Initial capital' },
      { section: 'Regulation 18', title: 'Own funds requirements' },
      { section: 'Regulation 23', title: 'Safeguarding requirements' },
      { section: 'Part 5', title: 'Conduct of Business' },
      { section: 'Part 6', title: 'Rights and Obligations' },
    ],
  },
  EMR2011: {
    fullName: 'Electronic Money Regulations 2011',
    url: 'https://www.legislation.gov.uk/uksi/2011/99/contents',
    keyProvisions: [
      { section: 'Part 2', title: 'Registration and Authorisation' },
      { section: 'Regulation 5', title: 'Conditions for registration (SEMI)' },
      { section: 'Regulation 6', title: 'Conditions for authorisation (EMI)' },
      { section: 'Regulation 20', title: 'Safeguarding requirements' },
      { section: 'Regulation 21', title: 'Redemption' },
      { section: 'Part 5', title: 'Issuance and Redemption of E-Money' },
    ],
  },
  FSMA2000: {
    fullName: 'Financial Services and Markets Act 2000',
    url: 'https://www.legislation.gov.uk/ukpga/2000/8/contents',
    keyProvisions: [
      { section: 'Part 4A', title: 'Permission to Carry On Regulated Activities' },
      { section: 'Part 5', title: 'Performance of Regulated Activities' },
      { section: 'Part 16', title: 'The Ombudsman Scheme' },
    ],
  },
};

// Comparison table data
export interface LicenceComparisonRow {
  feature: string;
  category: string;
  SPI: string;
  API: string;
  SEMI: string;
  EMI: string;
  RAISP: string;
}

export const LICENCE_COMPARISON: LicenceComparisonRow[] = [
  {
    feature: 'Initial Capital',
    category: 'Capital',
    SPI: '€0',
    API: '€125,000',
    SEMI: '€0',
    EMI: '€350,000',
    RAISP: '€0',
  },
  {
    feature: 'Ongoing Capital',
    category: 'Capital',
    SPI: 'None',
    API: 'Method A, B, or C',
    SEMI: 'None',
    EMI: 'Method A, B, C, or D',
    RAISP: 'None',
  },
  {
    feature: 'Volume Limit',
    category: 'Limits',
    SPI: '€3m monthly',
    API: 'Unlimited',
    SEMI: '€5m average',
    EMI: 'Unlimited',
    RAISP: 'N/A',
  },
  {
    feature: 'Passporting',
    category: 'Scope',
    SPI: 'No',
    API: 'Yes',
    SEMI: 'No',
    EMI: 'Yes',
    RAISP: 'Yes',
  },
  {
    feature: 'E-Money Issuance',
    category: 'Activities',
    SPI: 'No',
    API: 'No',
    SEMI: 'Yes',
    EMI: 'Yes',
    RAISP: 'No',
  },
  {
    feature: 'Safeguarding',
    category: 'Requirements',
    SPI: 'Required',
    API: 'Required',
    SEMI: 'Required',
    EMI: 'Required',
    RAISP: 'Not required',
  },
  {
    feature: 'Application Fee',
    category: 'Costs',
    SPI: '£500',
    API: '£5,000',
    SEMI: '£500',
    EMI: '£5,000',
    RAISP: '£500',
  },
  {
    feature: 'Processing Time',
    category: 'Timeline',
    SPI: '3-6 months',
    API: '6-12 months',
    SEMI: '3-6 months',
    EMI: '9-15 months',
    RAISP: '3-6 months',
  },
  {
    feature: 'PII Required',
    category: 'Insurance',
    SPI: 'May be',
    API: 'Yes for PISP',
    SEMI: 'May be',
    EMI: 'Yes for PISP',
    RAISP: 'Yes',
  },
];

// Safeguarding methods
export const SAFEGUARDING_METHODS = [
  {
    method: 'Segregated Account',
    description: 'Hold customer funds in a separate account at an authorised credit institution',
    requirement: 'Account must be clearly designated as holding safeguarded funds',
    reference: 'PSR 2017, Regulation 23(6)',
  },
  {
    method: 'Insurance or Guarantee',
    description: 'Obtain insurance policy or comparable guarantee from an authorised insurer',
    requirement: 'Must cover the full amount of relevant funds',
    reference: 'PSR 2017, Regulation 23(7)',
  },
  {
    method: 'Qualifying Investment',
    description: 'Invest in secure, low-risk assets (government securities)',
    requirement: 'Subject to FCA approval of the investment approach',
    reference: 'PSR 2017, Regulation 23(8)',
  },
];

// Key compliance areas
export const COMPLIANCE_AREAS = [
  {
    area: 'AML/CFT',
    description: 'Anti-Money Laundering and Counter-Terrorist Financing',
    requirements: [
      'Customer Due Diligence (CDD)',
      'Enhanced Due Diligence for high-risk customers',
      'Transaction monitoring',
      'Suspicious Activity Reports (SARs)',
      'Staff training',
      'Appointed MLRO',
    ],
    reference: 'Money Laundering Regulations 2017',
  },
  {
    area: 'Safeguarding',
    description: 'Protection of customer funds',
    requirements: [
      'Segregation of funds',
      'Daily reconciliation',
      'Safeguarding records',
      'Resolution arrangements',
    ],
    reference: 'PSR 2017, Part 4',
  },
  {
    area: 'Governance',
    description: 'Corporate governance and internal controls',
    requirements: [
      'Sound governance arrangements',
      'Clear organisational structure',
      'Fit and proper persons',
      'Risk management framework',
      'Internal audit function',
    ],
    reference: 'PSR 2017, Regulation 19',
  },
  {
    area: 'Consumer Protection',
    description: 'Fair treatment of customers',
    requirements: [
      'Complaints handling procedure',
      'Clear terms and conditions',
      'Transparent pricing',
      'Execution timing requirements',
      'Refund rights',
    ],
    reference: 'PSR 2017, Parts 5-6',
  },
  {
    area: 'Operational Resilience',
    description: 'Business continuity and operational resilience',
    requirements: [
      'Business continuity plan',
      'Disaster recovery',
      'Important business services identification',
      'Impact tolerances',
      'Testing and self-assessment',
    ],
    reference: 'FCA PS21/3',
  },
];

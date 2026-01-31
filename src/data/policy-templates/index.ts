/**
 * REG-VAULT Policy Templates Index
 *
 * These are reference policy templates used by the AI to generate
 * customized policies for FCA licence applications.
 *
 * Source: Real FCA application policies (anonymized)
 * Licence Types: SPI, Small EMI, API, EMI
 */

export interface PolicyTemplate {
  id: string;
  name: string;
  filename: string;
  description: string;
  category: string;
  licenceTypes: string[];
  fcaReference: string[];
  isRequired: boolean;
}

export const policyTemplates: PolicyTemplate[] = [
  {
    id: 'aml-policy',
    name: 'Anti-Money Laundering (AML) Policy',
    filename: 'aml-policy.docx',
    description: 'Comprehensive AML policies, procedures, and internal controls covering customer due diligence, transaction monitoring, suspicious activity reporting, and staff training requirements.',
    category: 'financial_crime',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['SYSC 6.3', 'MLR 2017', 'JMLSG Guidance'],
    isRequired: true,
  },
  {
    id: 'business-continuity-policy',
    name: 'Business Continuity Plan',
    filename: 'business-continuity-policy.docx',
    description: 'Business continuity and disaster recovery procedures including risk assessment, recovery time objectives, backup procedures, and incident response protocols.',
    category: 'systems_controls',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['SYSC 4.1', 'SYSC 7.1'],
    isRequired: true,
  },
  {
    id: 'business-plan',
    name: 'Business Plan',
    filename: 'business-plan.docx',
    description: 'Comprehensive business plan including executive summary, market analysis, operational model, financial projections, and growth strategy for FCA application.',
    category: 'governance',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['COND 2.4', 'SUP 6'],
    isRequired: true,
  },
  {
    id: 'capital-adequacy-policy',
    name: 'Capital Adequacy Policy',
    filename: 'capital-adequacy-policy.docx',
    description: 'Capital requirements calculation, ongoing capital monitoring, and procedures for maintaining regulatory capital including own funds requirements.',
    category: 'capital',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['MIPRU 4', 'PSR 2017 Reg 20-22'],
    isRequired: true,
  },
  {
    id: 'complaints-policy',
    name: 'Complaints Handling Procedure',
    filename: 'complaints-policy.docx',
    description: 'Procedures for receiving, investigating, and resolving customer complaints including escalation procedures, record-keeping, and FOS referral processes.',
    category: 'conduct',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['DISP 1', 'BCOBS 5'],
    isRequired: true,
  },
  {
    id: 'consumer-duty-policy',
    name: 'Consumer Duty Policy',
    filename: 'consumer-duty-policy.docx',
    description: 'Policy addressing FCA Consumer Duty requirements including good outcomes for customers, fair value, consumer understanding, and consumer support.',
    category: 'conduct',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['PRIN 2A', 'Consumer Duty'],
    isRequired: true,
  },
  {
    id: 'data-security-policy',
    name: 'Data Security Policy',
    filename: 'data-security-policy.docx',
    description: 'Data protection and security procedures covering GDPR compliance, data classification, access controls, encryption standards, and breach notification procedures.',
    category: 'systems_controls',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['SYSC 13', 'GDPR', 'UK DPA 2018'],
    isRequired: true,
  },
  {
    id: 'it-policy',
    name: 'IT Policy',
    filename: 'it-policy.docx',
    description: 'Information technology governance policy covering system access, change management, software development, and IT risk management.',
    category: 'systems_controls',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['SYSC 7', 'SYSC 13'],
    isRequired: true,
  },
  {
    id: 'it-systems-policy',
    name: 'IT Systems Architecture',
    filename: 'it-systems-policy.docx',
    description: 'Documentation of proposed IT systems including core banking, payment processing, AML screening, and supporting infrastructure.',
    category: 'systems_controls',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['SYSC 7', 'PSR 2017 Reg 98'],
    isRequired: true,
  },
  {
    id: 'major-incident-policy',
    name: 'Major Incident Reporting Policy',
    filename: 'major-incident-policy.docx',
    description: 'Procedures for identifying, managing, and reporting major operational and security incidents to the FCA and affected parties.',
    category: 'systems_controls',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['SUP 15.3', 'PSR 2017 Reg 99'],
    isRequired: true,
  },
  {
    id: 'risk-assessment-policy',
    name: 'Risk Management Procedures',
    filename: 'risk-assessment-policy.docx',
    description: 'Enterprise risk management framework including risk identification, assessment, mitigation strategies, and ongoing monitoring procedures.',
    category: 'governance',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['SYSC 4.1', 'SYSC 7.1'],
    isRequired: true,
  },
  {
    id: 'safeguarding-policy',
    name: 'Safeguarding Arrangements Policy',
    filename: 'safeguarding-policy.docx',
    description: 'Procedures for safeguarding customer funds including segregation requirements, safeguarding accounts, reconciliation, and insurance arrangements.',
    category: 'safeguarding',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['PSR 2017 Reg 23-26', 'EMR 2011 Reg 21-24'],
    isRequired: true,
  },
  {
    id: 'security-policy',
    name: 'Security Policy',
    filename: 'security-policy.docx',
    description: 'Physical and logical security controls including access management, security monitoring, vulnerability management, and security awareness training.',
    category: 'systems_controls',
    licenceTypes: ['SPI', 'SMALL_EMI', 'API', 'EMI'],
    fcaReference: ['SYSC 13', 'PSR 2017 Reg 98'],
    isRequired: true,
  },
];

// Policy categories for filtering
export const policyCategories = [
  { id: 'governance', name: 'Governance', description: 'Corporate governance and management' },
  { id: 'financial_crime', name: 'Financial Crime', description: 'AML, fraud prevention, sanctions' },
  { id: 'safeguarding', name: 'Safeguarding', description: 'Customer funds protection' },
  { id: 'conduct', name: 'Conduct', description: 'Customer treatment and complaints' },
  { id: 'systems_controls', name: 'Systems & Controls', description: 'IT, security, and operational controls' },
  { id: 'reporting', name: 'Reporting', description: 'Regulatory reporting requirements' },
  { id: 'capital', name: 'Capital', description: 'Capital adequacy and financial resources' },
];

// Get policies by category
export function getPoliciesByCategory(category: string): PolicyTemplate[] {
  return policyTemplates.filter(p => p.category === category);
}

// Get policies by licence type
export function getPoliciesByLicenceType(licenceType: string): PolicyTemplate[] {
  return policyTemplates.filter(p => p.licenceTypes.includes(licenceType));
}

// Get required policies for a licence type
export function getRequiredPolicies(licenceType: string): PolicyTemplate[] {
  return policyTemplates.filter(p => p.isRequired && p.licenceTypes.includes(licenceType));
}

export default policyTemplates;

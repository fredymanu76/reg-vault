/**
 * FCA Application Forms Data Structure
 *
 * Defines the structure of FCA application forms for different licence types.
 * Based on official FCA application forms.
 */

export type LicenceType = 'SPI' | 'SMALL_EMI' | 'API' | 'EMI' | 'CONSUMER_CREDIT';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'number' | 'email' | 'phone' | 'currency' | 'file' | 'address' | 'person';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  intakeMapping?: string; // Maps to intake data field
  conditionalOn?: { field: string; value: string | boolean };
  subFields?: FormField[]; // For complex fields like address or person
}

export interface FormSection {
  id: string;
  number: string;
  title: string;
  description?: string;
  fields: FormField[];
  isRequired: boolean;
  estimatedTime?: number; // in minutes
}

export interface FormPage {
  id: string;
  number: string;
  title: string;
  sections: FormSection[];
}

export interface FCAForm {
  id: string;
  licenceType: LicenceType;
  title: string;
  description: string;
  version: string;
  fcaReference: string;
  totalPages: number;
  pages: FormPage[];
}

// SPI Registration Form Structure
export const spiForm: FCAForm = {
  id: 'spi-registration',
  licenceType: 'SPI',
  title: 'Small Payment Institution Registration',
  description: 'Application for registration as a Small Payment Institution under the Payment Services Regulations 2017',
  version: '2024',
  fcaReference: 'PSR 2017 Reg 14',
  totalPages: 12,
  pages: [
    {
      id: 'page-1',
      number: '1',
      title: 'Contact Details',
      sections: [
        {
          id: 'section-1.1',
          number: '1.1',
          title: 'About this form',
          description: 'Important information about completing this application',
          isRequired: true,
          estimatedTime: 2,
          fields: [
            {
              id: 'applicant-reference',
              label: 'Your reference (optional)',
              type: 'text',
              required: false,
              placeholder: 'Enter your internal reference number',
              helpText: 'This is for your own records and will be quoted in correspondence',
            },
          ],
        },
        {
          id: 'section-1.2',
          number: '1.2',
          title: 'Contact for this application',
          description: 'Person we should contact regarding this application',
          isRequired: true,
          estimatedTime: 5,
          fields: [
            {
              id: 'contact-title',
              label: 'Title',
              type: 'select',
              required: true,
              options: [
                { value: 'mr', label: 'Mr' },
                { value: 'mrs', label: 'Mrs' },
                { value: 'ms', label: 'Ms' },
                { value: 'miss', label: 'Miss' },
                { value: 'dr', label: 'Dr' },
                { value: 'other', label: 'Other' },
              ],
            },
            {
              id: 'contact-first-name',
              label: 'First name(s)',
              type: 'text',
              required: true,
              intakeMapping: 'contact.firstName',
            },
            {
              id: 'contact-surname',
              label: 'Surname',
              type: 'text',
              required: true,
              intakeMapping: 'contact.lastName',
            },
            {
              id: 'contact-job-title',
              label: 'Job title',
              type: 'text',
              required: true,
              intakeMapping: 'contact.jobTitle',
            },
            {
              id: 'contact-email',
              label: 'Email address',
              type: 'email',
              required: true,
              intakeMapping: 'contact.email',
            },
            {
              id: 'contact-phone',
              label: 'Telephone number',
              type: 'phone',
              required: true,
              intakeMapping: 'contact.phone',
            },
          ],
        },
      ],
    },
    {
      id: 'page-2',
      number: '2',
      title: 'Firm Details',
      sections: [
        {
          id: 'section-2.1',
          number: '2.1',
          title: 'Firm identification',
          description: 'Basic details about the applicant firm',
          isRequired: true,
          estimatedTime: 10,
          fields: [
            {
              id: 'firm-name',
              label: 'Full name of firm',
              type: 'text',
              required: true,
              intakeMapping: 'company.name',
              helpText: 'The full legal name as registered with Companies House',
            },
            {
              id: 'trading-names',
              label: 'Trading name(s)',
              type: 'textarea',
              required: false,
              placeholder: 'Enter any trading names, one per line',
              intakeMapping: 'company.tradingNames',
            },
            {
              id: 'company-number',
              label: 'Companies House registration number',
              type: 'text',
              required: true,
              intakeMapping: 'company.registrationNumber',
              validation: {
                pattern: '^[0-9A-Z]{8}$',
              },
            },
            {
              id: 'legal-status',
              label: 'Legal status',
              type: 'select',
              required: true,
              intakeMapping: 'company.legalStatus',
              options: [
                { value: 'private-limited', label: 'Private Limited Company' },
                { value: 'public-limited', label: 'Public Limited Company' },
                { value: 'llp', label: 'Limited Liability Partnership' },
                { value: 'partnership', label: 'Partnership' },
                { value: 'sole-trader', label: 'Sole Trader' },
                { value: 'other', label: 'Other' },
              ],
            },
            {
              id: 'date-incorporated',
              label: 'Date of incorporation',
              type: 'date',
              required: true,
              intakeMapping: 'company.incorporationDate',
            },
            {
              id: 'country-incorporation',
              label: 'Country of incorporation',
              type: 'select',
              required: true,
              intakeMapping: 'company.countryOfIncorporation',
              options: [
                { value: 'uk', label: 'United Kingdom' },
                { value: 'other-eea', label: 'Other EEA country' },
                { value: 'non-eea', label: 'Non-EEA country' },
              ],
            },
          ],
        },
        {
          id: 'section-2.2',
          number: '2.2',
          title: 'Registered office address',
          description: 'The official registered address of the firm',
          isRequired: true,
          estimatedTime: 5,
          fields: [
            {
              id: 'registered-address',
              label: 'Registered office address',
              type: 'address',
              required: true,
              intakeMapping: 'company.registeredAddress',
              subFields: [
                { id: 'address-line-1', label: 'Address line 1', type: 'text', required: true },
                { id: 'address-line-2', label: 'Address line 2', type: 'text', required: false },
                { id: 'city', label: 'City', type: 'text', required: true },
                { id: 'county', label: 'County', type: 'text', required: false },
                { id: 'postcode', label: 'Postcode', type: 'text', required: true },
                { id: 'country', label: 'Country', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          id: 'section-2.3',
          number: '2.3',
          title: 'Principal place of business',
          description: 'Main business address if different from registered office',
          isRequired: false,
          estimatedTime: 5,
          fields: [
            {
              id: 'same-as-registered',
              label: 'Is the principal place of business the same as the registered office?',
              type: 'radio',
              required: true,
              options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ],
            },
            {
              id: 'business-address',
              label: 'Principal place of business address',
              type: 'address',
              required: false,
              conditionalOn: { field: 'same-as-registered', value: 'no' },
              intakeMapping: 'company.businessAddress',
              subFields: [
                { id: 'address-line-1', label: 'Address line 1', type: 'text', required: true },
                { id: 'address-line-2', label: 'Address line 2', type: 'text', required: false },
                { id: 'city', label: 'City', type: 'text', required: true },
                { id: 'county', label: 'County', type: 'text', required: false },
                { id: 'postcode', label: 'Postcode', type: 'text', required: true },
                { id: 'country', label: 'Country', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'page-3',
      number: '3',
      title: 'Business Activities',
      sections: [
        {
          id: 'section-3.1',
          number: '3.1',
          title: 'Payment services',
          description: 'Select the payment services you wish to provide',
          isRequired: true,
          estimatedTime: 10,
          fields: [
            {
              id: 'payment-services',
              label: 'Which payment services do you want to provide?',
              type: 'checkbox',
              required: true,
              options: [
                { value: 'service-1', label: '1. Services enabling cash to be placed on or withdrawn from a payment account' },
                { value: 'service-2', label: '2. Execution of payment transactions (direct debits, card payments, credit transfers)' },
                { value: 'service-3', label: '3. Execution of payment transactions where funds are covered by a credit line' },
                { value: 'service-4', label: '4. Issuing payment instruments and/or acquiring payment transactions' },
                { value: 'service-5', label: '5. Money remittance' },
                { value: 'service-6', label: '6. Payment initiation services' },
                { value: 'service-7', label: '7. Account information services' },
              ],
            },
          ],
        },
        {
          id: 'section-3.2',
          number: '3.2',
          title: 'Business model',
          description: 'Describe your proposed payment services business',
          isRequired: true,
          estimatedTime: 20,
          fields: [
            {
              id: 'business-description',
              label: 'Describe your business model',
              type: 'textarea',
              required: true,
              intakeMapping: 'business.description',
              helpText: 'Explain the payment services you intend to provide, your target market, and how you will operate',
              validation: {
                minLength: 500,
                maxLength: 5000,
              },
            },
            {
              id: 'target-customers',
              label: 'Who are your target customers?',
              type: 'checkbox',
              required: true,
              options: [
                { value: 'individuals', label: 'Individual consumers' },
                { value: 'sme', label: 'Small and medium enterprises' },
                { value: 'corporate', label: 'Large corporates' },
                { value: 'other-psp', label: 'Other payment service providers' },
              ],
            },
            {
              id: 'geographic-scope',
              label: 'Geographic scope of services',
              type: 'checkbox',
              required: true,
              options: [
                { value: 'uk-domestic', label: 'UK domestic only' },
                { value: 'uk-eea', label: 'UK and EEA' },
                { value: 'international', label: 'International (including non-EEA)' },
              ],
            },
          ],
        },
        {
          id: 'section-3.3',
          number: '3.3',
          title: 'Projected volumes',
          description: 'Estimated transaction volumes and values',
          isRequired: true,
          estimatedTime: 10,
          fields: [
            {
              id: 'monthly-transactions-year1',
              label: 'Estimated monthly transactions (Year 1)',
              type: 'number',
              required: true,
              intakeMapping: 'projections.monthlyTransactionsY1',
            },
            {
              id: 'monthly-value-year1',
              label: 'Estimated monthly transaction value (Year 1)',
              type: 'currency',
              required: true,
              intakeMapping: 'projections.monthlyValueY1',
            },
            {
              id: 'monthly-transactions-year3',
              label: 'Estimated monthly transactions (Year 3)',
              type: 'number',
              required: true,
              intakeMapping: 'projections.monthlyTransactionsY3',
            },
            {
              id: 'monthly-value-year3',
              label: 'Estimated monthly transaction value (Year 3)',
              type: 'currency',
              required: true,
              intakeMapping: 'projections.monthlyValueY3',
            },
          ],
        },
      ],
    },
    {
      id: 'page-4',
      number: '4',
      title: 'Controllers & Close Links',
      sections: [
        {
          id: 'section-4.1',
          number: '4.1',
          title: 'Controllers',
          description: 'Details of persons with control over the firm',
          isRequired: true,
          estimatedTime: 15,
          fields: [
            {
              id: 'has-controllers',
              label: 'Does any person have control over the firm?',
              type: 'radio',
              required: true,
              helpText: 'A controller is a person who holds 10% or more of shares or voting rights, or who exercises significant influence',
              options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ],
            },
            {
              id: 'controller-details',
              label: 'Controller details',
              type: 'textarea',
              required: false,
              conditionalOn: { field: 'has-controllers', value: 'yes' },
              helpText: 'Provide details of each controller including name, percentage holding, and nature of control',
            },
          ],
        },
        {
          id: 'section-4.2',
          number: '4.2',
          title: 'Close links',
          description: 'Details of close links with other entities',
          isRequired: true,
          estimatedTime: 10,
          fields: [
            {
              id: 'has-close-links',
              label: 'Does the firm have close links with any other person or entity?',
              type: 'radio',
              required: true,
              helpText: 'Close links include parent/subsidiary relationships, significant shareholdings, or common management',
              options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ],
            },
            {
              id: 'close-links-details',
              label: 'Close links details',
              type: 'textarea',
              required: false,
              conditionalOn: { field: 'has-close-links', value: 'yes' },
            },
          ],
        },
      ],
    },
    {
      id: 'page-5',
      number: '5',
      title: 'Governance & Management',
      sections: [
        {
          id: 'section-5.1',
          number: '5.1',
          title: 'Directors and partners',
          description: 'Details of all directors, partners, or equivalent',
          isRequired: true,
          estimatedTime: 20,
          fields: [
            {
              id: 'directors-count',
              label: 'Total number of directors/partners',
              type: 'number',
              required: true,
            },
            {
              id: 'directors-info',
              label: 'Provide details of each director',
              type: 'textarea',
              required: true,
              helpText: 'For each director provide: Full name, Date of birth, Nationality, Residential address, Position held, Date appointed',
            },
          ],
        },
        {
          id: 'section-5.2',
          number: '5.2',
          title: 'Key individuals',
          description: 'Persons responsible for managing payment services',
          isRequired: true,
          estimatedTime: 15,
          fields: [
            {
              id: 'mlro-name',
              label: 'Money Laundering Reporting Officer (MLRO) name',
              type: 'text',
              required: true,
              intakeMapping: 'governance.mlroName',
            },
            {
              id: 'compliance-officer-name',
              label: 'Compliance Officer name',
              type: 'text',
              required: true,
              intakeMapping: 'governance.complianceOfficerName',
            },
            {
              id: 'head-of-operations-name',
              label: 'Head of Operations name',
              type: 'text',
              required: false,
              intakeMapping: 'governance.headOfOperationsName',
            },
          ],
        },
      ],
    },
    {
      id: 'page-6',
      number: '6',
      title: 'Financial Resources',
      sections: [
        {
          id: 'section-6.1',
          number: '6.1',
          title: 'Capital requirements',
          description: 'Evidence of adequate financial resources',
          isRequired: true,
          estimatedTime: 15,
          fields: [
            {
              id: 'initial-capital',
              label: 'Initial capital available (GBP)',
              type: 'currency',
              required: true,
              intakeMapping: 'financial.initialCapital',
              helpText: 'SPIs are not required to hold minimum capital but must demonstrate adequate resources',
            },
            {
              id: 'source-of-funds',
              label: 'Source of funds',
              type: 'textarea',
              required: true,
              intakeMapping: 'financial.sourceOfFunds',
              helpText: 'Explain where the capital/funding comes from',
            },
          ],
        },
        {
          id: 'section-6.2',
          number: '6.2',
          title: 'Financial projections',
          description: 'Three-year financial projections',
          isRequired: true,
          estimatedTime: 20,
          fields: [
            {
              id: 'revenue-year1',
              label: 'Projected revenue Year 1 (GBP)',
              type: 'currency',
              required: true,
              intakeMapping: 'financial.revenueY1',
            },
            {
              id: 'revenue-year2',
              label: 'Projected revenue Year 2 (GBP)',
              type: 'currency',
              required: true,
              intakeMapping: 'financial.revenueY2',
            },
            {
              id: 'revenue-year3',
              label: 'Projected revenue Year 3 (GBP)',
              type: 'currency',
              required: true,
              intakeMapping: 'financial.revenueY3',
            },
            {
              id: 'breakeven-date',
              label: 'Expected breakeven date',
              type: 'date',
              required: true,
              intakeMapping: 'financial.breakevenDate',
            },
          ],
        },
      ],
    },
    {
      id: 'page-7',
      number: '7',
      title: 'Safeguarding',
      sections: [
        {
          id: 'section-7.1',
          number: '7.1',
          title: 'Safeguarding method',
          description: 'How customer funds will be protected',
          isRequired: true,
          estimatedTime: 15,
          fields: [
            {
              id: 'safeguarding-method',
              label: 'Which safeguarding method will you use?',
              type: 'radio',
              required: true,
              intakeMapping: 'safeguarding.method',
              options: [
                { value: 'segregation', label: 'Segregation in a designated safeguarding account' },
                { value: 'insurance', label: 'Insurance policy or guarantee' },
                { value: 'combination', label: 'Combination of both methods' },
              ],
            },
            {
              id: 'safeguarding-bank',
              label: 'Name of safeguarding bank/institution',
              type: 'text',
              required: true,
              intakeMapping: 'safeguarding.bankName',
              conditionalOn: { field: 'safeguarding-method', value: 'segregation' },
            },
            {
              id: 'safeguarding-account-details',
              label: 'Safeguarding account arrangements',
              type: 'textarea',
              required: true,
              helpText: 'Describe your safeguarding arrangements in detail',
            },
          ],
        },
      ],
    },
    {
      id: 'page-8',
      number: '8',
      title: 'AML & Financial Crime',
      sections: [
        {
          id: 'section-8.1',
          number: '8.1',
          title: 'AML policies and procedures',
          description: 'Anti-money laundering controls',
          isRequired: true,
          estimatedTime: 20,
          fields: [
            {
              id: 'aml-policy-attached',
              label: 'Have you attached your AML policy?',
              type: 'radio',
              required: true,
              options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No - will submit separately' },
              ],
            },
            {
              id: 'customer-risk-assessment',
              label: 'Describe your customer risk assessment process',
              type: 'textarea',
              required: true,
              intakeMapping: 'aml.customerRiskAssessment',
            },
            {
              id: 'transaction-monitoring',
              label: 'Describe your transaction monitoring arrangements',
              type: 'textarea',
              required: true,
              intakeMapping: 'aml.transactionMonitoring',
            },
            {
              id: 'sanctions-screening',
              label: 'Describe your sanctions screening process',
              type: 'textarea',
              required: true,
              intakeMapping: 'aml.sanctionsScreening',
            },
          ],
        },
      ],
    },
    {
      id: 'page-9',
      number: '9',
      title: 'IT Systems & Security',
      sections: [
        {
          id: 'section-9.1',
          number: '9.1',
          title: 'IT infrastructure',
          description: 'Systems supporting payment services',
          isRequired: true,
          estimatedTime: 15,
          fields: [
            {
              id: 'core-systems',
              label: 'Describe your core payment systems',
              type: 'textarea',
              required: true,
              intakeMapping: 'it.coreSystems',
            },
            {
              id: 'hosting-arrangement',
              label: 'Where are your systems hosted?',
              type: 'select',
              required: true,
              options: [
                { value: 'on-premise', label: 'On-premise' },
                { value: 'cloud-uk', label: 'Cloud (UK data centres)' },
                { value: 'cloud-eea', label: 'Cloud (EEA data centres)' },
                { value: 'cloud-other', label: 'Cloud (other locations)' },
                { value: 'hybrid', label: 'Hybrid arrangement' },
              ],
            },
            {
              id: 'security-measures',
              label: 'Describe your security measures',
              type: 'textarea',
              required: true,
              intakeMapping: 'it.securityMeasures',
            },
          ],
        },
        {
          id: 'section-9.2',
          number: '9.2',
          title: 'Business continuity',
          description: 'Business continuity and disaster recovery',
          isRequired: true,
          estimatedTime: 10,
          fields: [
            {
              id: 'bcp-summary',
              label: 'Summarise your business continuity arrangements',
              type: 'textarea',
              required: true,
              intakeMapping: 'it.bcpSummary',
            },
            {
              id: 'recovery-time-objective',
              label: 'Recovery Time Objective (RTO)',
              type: 'text',
              required: true,
              placeholder: 'e.g., 4 hours',
            },
          ],
        },
      ],
    },
    {
      id: 'page-10',
      number: '10',
      title: 'Outsourcing',
      sections: [
        {
          id: 'section-10.1',
          number: '10.1',
          title: 'Outsourcing arrangements',
          description: 'Third parties providing services',
          isRequired: true,
          estimatedTime: 15,
          fields: [
            {
              id: 'has-outsourcing',
              label: 'Will you outsource any operational functions?',
              type: 'radio',
              required: true,
              options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ],
            },
            {
              id: 'outsourcing-details',
              label: 'Provide details of outsourcing arrangements',
              type: 'textarea',
              required: false,
              conditionalOn: { field: 'has-outsourcing', value: 'yes' },
              helpText: 'For each outsourced function: service provider name, location, function outsourced, oversight arrangements',
            },
          ],
        },
      ],
    },
    {
      id: 'page-11',
      number: '11',
      title: 'Complaints Handling',
      sections: [
        {
          id: 'section-11.1',
          number: '11.1',
          title: 'Complaints procedures',
          description: 'Customer complaints handling',
          isRequired: true,
          estimatedTime: 10,
          fields: [
            {
              id: 'complaints-policy-attached',
              label: 'Have you attached your complaints handling policy?',
              type: 'radio',
              required: true,
              options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No - will submit separately' },
              ],
            },
            {
              id: 'complaints-summary',
              label: 'Summarise your complaints handling process',
              type: 'textarea',
              required: true,
            },
            {
              id: 'fos-aware',
              label: 'Are you aware of the Financial Ombudsman Service requirements?',
              type: 'radio',
              required: true,
              options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'page-12',
      number: '12',
      title: 'Declaration',
      sections: [
        {
          id: 'section-12.1',
          number: '12.1',
          title: 'Declaration and signature',
          description: 'Confirm the accuracy of this application',
          isRequired: true,
          estimatedTime: 5,
          fields: [
            {
              id: 'declaration-accuracy',
              label: 'I confirm that the information in this application is accurate and complete',
              type: 'checkbox',
              required: true,
              options: [{ value: 'confirmed', label: 'Confirmed' }],
            },
            {
              id: 'declaration-notify',
              label: 'I undertake to notify the FCA of any material changes',
              type: 'checkbox',
              required: true,
              options: [{ value: 'confirmed', label: 'Confirmed' }],
            },
            {
              id: 'signatory-name',
              label: 'Name of signatory',
              type: 'text',
              required: true,
            },
            {
              id: 'signatory-position',
              label: 'Position held',
              type: 'text',
              required: true,
            },
            {
              id: 'signature-date',
              label: 'Date',
              type: 'date',
              required: true,
            },
          ],
        },
      ],
    },
  ],
};

// Small EMI Form Structure (abbreviated - similar structure)
export const smallEmiForm: FCAForm = {
  id: 'small-emi-registration',
  licenceType: 'SMALL_EMI',
  title: 'Small Electronic Money Institution Registration',
  description: 'Application for registration as a Small Electronic Money Institution under the Electronic Money Regulations 2011',
  version: '2024',
  fcaReference: 'EMR 2011 Reg 12',
  totalPages: 14,
  pages: [
    {
      id: 'page-1',
      number: '1',
      title: 'Contact Details',
      sections: [
        {
          id: 'section-1.1',
          number: '1.1',
          title: 'About this form',
          description: 'Important information about completing this application',
          isRequired: true,
          estimatedTime: 2,
          fields: [
            {
              id: 'applicant-reference',
              label: 'Your reference (optional)',
              type: 'text',
              required: false,
            },
          ],
        },
      ],
    },
    // Additional pages would follow the same pattern...
  ],
};

// API Form Structure
export const apiForm: FCAForm = {
  id: 'api-authorisation',
  licenceType: 'API',
  title: 'Authorised Payment Institution Application',
  description: 'Application for authorisation as a Payment Institution under the Payment Services Regulations 2017',
  version: '2024',
  fcaReference: 'PSR 2017 Reg 5',
  totalPages: 18,
  pages: [
    {
      id: 'page-1',
      number: '1',
      title: 'Contact Details',
      sections: [
        {
          id: 'section-1.1',
          number: '1.1',
          title: 'About this form',
          description: 'Important information about completing this application',
          isRequired: true,
          estimatedTime: 2,
          fields: [
            {
              id: 'applicant-reference',
              label: 'Your reference (optional)',
              type: 'text',
              required: false,
            },
          ],
        },
      ],
    },
  ],
};

// EMI Form Structure
export const emiForm: FCAForm = {
  id: 'emi-authorisation',
  licenceType: 'EMI',
  title: 'Authorised Electronic Money Institution Application',
  description: 'Application for authorisation as an Electronic Money Institution under the Electronic Money Regulations 2011',
  version: '2024',
  fcaReference: 'EMR 2011 Reg 6',
  totalPages: 20,
  pages: [
    {
      id: 'page-1',
      number: '1',
      title: 'Contact Details',
      sections: [
        {
          id: 'section-1.1',
          number: '1.1',
          title: 'About this form',
          description: 'Important information about completing this application',
          isRequired: true,
          estimatedTime: 2,
          fields: [
            {
              id: 'applicant-reference',
              label: 'Your reference (optional)',
              type: 'text',
              required: false,
            },
          ],
        },
      ],
    },
  ],
};

// Form registry
export const fcaForms: Record<LicenceType, FCAForm> = {
  SPI: spiForm,
  SMALL_EMI: smallEmiForm,
  API: apiForm,
  EMI: emiForm,
  CONSUMER_CREDIT: {
    id: 'consumer-credit',
    licenceType: 'CONSUMER_CREDIT',
    title: 'Consumer Credit Authorisation',
    description: 'Application for consumer credit permissions',
    version: '2024',
    fcaReference: 'CONC',
    totalPages: 16,
    pages: [],
  },
};

// Get form by licence type
export function getFormByLicenceType(licenceType: LicenceType): FCAForm | undefined {
  return fcaForms[licenceType];
}

// Calculate form completion percentage
export function calculateFormCompletion(form: FCAForm, answers: Record<string, unknown>): number {
  let totalFields = 0;
  let completedFields = 0;

  form.pages.forEach(page => {
    page.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required) {
          totalFields++;
          if (answers[field.id] !== undefined && answers[field.id] !== '') {
            completedFields++;
          }
        }
      });
    });
  });

  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
}

export default fcaForms;

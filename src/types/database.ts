// =============================================================================
// REG-VAULT DATABASE TYPES
// Auto-generated from Supabase schema
// =============================================================================

export type LicenceType =
  | 'SPI'
  | 'SMALL_EMI'
  | 'API'
  | 'EMI'
  | 'AISP'
  | 'PISP'
  | 'RAISP'
  | 'CONSUMER_CREDIT'
  | 'MORTGAGE_INTERMEDIARY'
  | 'INSURANCE_INTERMEDIARY';

export type ApplicationStatus =
  | 'draft'
  | 'intake_in_progress'
  | 'intake_complete'
  | 'documents_generating'
  | 'review_pending'
  | 'review_in_progress'
  | 'approved'
  | 'submitted_to_fca'
  | 'fca_queries'
  | 'authorised'
  | 'rejected'
  | 'withdrawn';

export type UserRole =
  | 'client_admin'
  | 'client_contributor'
  | 'internal_reviewer'
  | 'super_admin';

export type ObligationCategory =
  | 'governance'
  | 'financial_crime'
  | 'safeguarding'
  | 'conduct'
  | 'systems_controls'
  | 'reporting'
  | 'capital';

export type ObligationStrength = 'rule' | 'guidance' | 'expectation';

export type DocumentStatus =
  | 'draft'
  | 'generating'
  | 'review_pending'
  | 'approved'
  | 'rejected'
  | 'final';

export type RiskRating = 'low' | 'medium' | 'high' | 'critical';

// =============================================================================
// CORE ENTITIES
// =============================================================================

export interface Organisation {
  id: string;
  name: string;
  trading_name?: string;
  company_number?: string;
  incorporation_date?: string;
  registered_address?: Record<string, unknown>;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  licence_type?: LicenceType;
  created_at: string;
  updated_at: string;
  created_by?: string;
  metadata?: Record<string, unknown>;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  role: UserRole;
  organisation_id?: string;
  is_active: boolean;
  mfa_enabled: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface Application {
  id: string;
  organisation_id: string;
  reference_number?: string;
  licence_type: LicenceType;
  status: ApplicationStatus;
  detected_permissions?: string[];
  risk_flags?: RiskFlag[];
  progress_percentage: number;
  intake_completed_at?: string;
  submitted_at?: string;
  fca_reference?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  assigned_reviewer?: string;
  metadata?: Record<string, unknown>;
}

export interface RiskFlag {
  id: string;
  category: string;
  severity: RiskRating;
  description: string;
  remediation?: string;
  resolved: boolean;
}

// =============================================================================
// INTAKE & FACTS
// =============================================================================

export interface IntakeSection {
  id: string;
  name: string;
  description?: string;
  order_index: number;
  licence_types?: LicenceType[];
  is_required: boolean;
  created_at: string;
}

export interface IntakeQuestion {
  id: string;
  section_id: string;
  question_text: string;
  question_type: 'text' | 'textarea' | 'select' | 'multi_select' | 'date' | 'file' | 'boolean';
  options?: QuestionOption[];
  validation_rules?: ValidationRule[];
  help_text?: string;
  fca_mapping?: string;
  order_index: number;
  is_required: boolean;
  conditional_logic?: ConditionalLogic;
  created_at: string;
}

export interface QuestionOption {
  value: string;
  label: string;
}

export interface ValidationRule {
  type: 'required' | 'min_length' | 'max_length' | 'pattern' | 'custom';
  value?: string | number;
  message: string;
}

export interface ConditionalLogic {
  show_if: {
    question_id: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'not_contains';
    value: unknown;
  }[];
}

export interface Fact {
  id: string;
  application_id: string;
  question_id?: string;
  key: string;
  value: unknown;
  confidence_score: number;
  source: 'user_input' | 'ai_extracted' | 'calculated';
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// REGULATORY KNOWLEDGE BASE (RKB)
// =============================================================================

export interface RegulatorySource {
  id: string;
  authority: string;
  source_type: 'Handbook' | 'Regulation' | 'Guidance';
  module: string;
  reference: string;
  title: string;
  full_text?: string;
  effective_date?: string;
  version?: string;
  url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RegulatoryStatement {
  id: string;
  source_id: string;
  statement_text: string;
  obligation_category: ObligationCategory;
  obligation_strength: ObligationStrength;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LicenceApplicability {
  id: string;
  regulatory_statement_id: string;
  licence_type: LicenceType;
  applicability: 'Required' | 'Enhanced' | 'Optional' | 'N/A';
  notes?: string;
}

// =============================================================================
// POLICY MODULES
// =============================================================================

export interface PolicyModule {
  id: string;
  name: string;
  description?: string;
  risk_domain: string;
  is_reusable: boolean;
  licence_types?: LicenceType[];
  version: number;
  created_at: string;
  updated_at: string;
}

export interface PolicyModuleSection {
  id: string;
  policy_module_id: string;
  section_title: string;
  base_text: string;
  configurable_fields?: ConfigurableField[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ConfigurableField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'fact_reference';
  default_value?: string;
  fact_key?: string;
}

export interface PolicyRegulationMapping {
  id: string;
  policy_module_id: string;
  section_id: string;
  regulatory_statement_id: string;
  control_description: string;
  created_at: string;
}

// =============================================================================
// GENERATED DOCUMENTS
// =============================================================================

export interface Policy {
  id: string;
  application_id: string;
  policy_module_id?: string;
  name: string;
  content: string;
  version: number;
  status: DocumentStatus;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface BusinessPlan {
  id: string;
  application_id: string;
  content: BusinessPlanContent;
  financial_projections?: FinancialProjections;
  sensitivity_analysis?: SensitivityAnalysis;
  risk_mitigation?: RiskMitigation[];
  version: number;
  status: DocumentStatus;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessPlanContent {
  executive_summary: string;
  business_model: string;
  market_analysis: string;
  operations: string;
  management_team: string;
  regulatory_strategy: string;
}

export interface FinancialProjections {
  years: number[];
  revenue: number[];
  costs: number[];
  profit: number[];
  assumptions: string[];
}

export interface SensitivityAnalysis {
  scenarios: {
    name: string;
    description: string;
    impact: number;
  }[];
}

export interface RiskMitigation {
  risk: string;
  likelihood: RiskRating;
  impact: RiskRating;
  mitigation: string;
}

export interface Diagram {
  id: string;
  application_id: string;
  type: 'funds_flow' | 'process_flow' | 'org_chart';
  name: string;
  source: string;
  svg_url?: string;
  png_url?: string;
  version: number;
  status: DocumentStatus;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// CONTROLS & EVIDENCE
// =============================================================================

export interface Control {
  id: string;
  policy_module_section_id?: string;
  control_code: string;
  control_text: string;
  frequency?: string;
  owner_role?: string;
  created_at: string;
  updated_at: string;
}

export interface ProcessStep {
  id: string;
  control_id: string;
  step_order: number;
  step_description: string;
  created_at: string;
}

export interface EvidenceRequirement {
  id: string;
  control_id: string;
  evidence_type: string;
  description?: string;
  retention_period?: string;
  created_at: string;
}

// =============================================================================
// FCA APPLICATION PACK
// =============================================================================

export interface FCAFormMapping {
  id: string;
  licence_type: LicenceType;
  form_name: string;
  field_reference: string;
  field_label: string;
  field_type: string;
  fact_key?: string;
  validation_rules?: ValidationRule[];
  help_text?: string;
  created_at: string;
}

export interface FCAFormAnswer {
  id: string;
  application_id: string;
  form_mapping_id: string;
  answer_value?: string;
  ai_generated: boolean;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BundlePack {
  id: string;
  application_id: string;
  version: number;
  status: DocumentStatus;
  contents: BundleContent[];
  zip_url?: string;
  pdf_url?: string;
  generated_at?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface BundleContent {
  type: 'form' | 'policy' | 'diagram' | 'business_plan' | 'evidence';
  document_id: string;
  name: string;
  included: boolean;
}

// =============================================================================
// FCA CORRESPONDENCE
// =============================================================================

export interface FCACorrespondence {
  id: string;
  application_id: string;
  type: 'incoming' | 'outgoing';
  subject: string;
  content: string;
  attachments?: Attachment[];
  received_at?: string;
  sent_at?: string;
  fca_reference?: string;
  requires_response: boolean;
  response_deadline?: string;
  created_at: string;
  created_by?: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface DraftResponse {
  id: string;
  correspondence_id: string;
  content: string;
  ai_generated: boolean;
  citations?: Citation[];
  version: number;
  status: DocumentStatus;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Citation {
  statement_id: string;
  reference: string;
  text: string;
}

// =============================================================================
// AUDIT LOG
// =============================================================================

export interface AuditLog {
  id: string;
  entity: string;
  entity_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_value?: Record<string, unknown>;
  new_value?: Record<string, unknown>;
  performed_by?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

// =============================================================================
// DOCUMENT UPLOADS
// =============================================================================

export interface DocumentUpload {
  id: string;
  application_id: string;
  fact_id?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  uploaded_by?: string;
  created_at: string;
}

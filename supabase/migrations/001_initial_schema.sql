-- =============================================================================
-- REG-VAULT DATABASE SCHEMA
-- FCA AI Authorisation Platform
-- Version: 1.0.0
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE licence_type AS ENUM (
  'SPI',           -- Small Payment Institution
  'SMALL_EMI',     -- Small Electronic Money Institution
  'API',           -- Authorised Payment Institution
  'EMI',           -- Electronic Money Institution
  'AISP',          -- Account Information Service Provider
  'PISP',          -- Payment Initiation Service Provider
  'RAISP',         -- Registered Account Information Service Provider
  'CONSUMER_CREDIT',
  'MORTGAGE_INTERMEDIARY',
  'INSURANCE_INTERMEDIARY'
);

CREATE TYPE application_status AS ENUM (
  'draft',
  'intake_in_progress',
  'intake_complete',
  'documents_generating',
  'review_pending',
  'review_in_progress',
  'approved',
  'submitted_to_fca',
  'fca_queries',
  'authorised',
  'rejected',
  'withdrawn'
);

CREATE TYPE user_role AS ENUM (
  'client_admin',      -- Founder
  'client_contributor', -- MLRO, Finance
  'internal_reviewer',
  'super_admin'
);

CREATE TYPE obligation_category AS ENUM (
  'governance',
  'financial_crime',
  'safeguarding',
  'conduct',
  'systems_controls',
  'reporting',
  'capital'
);

CREATE TYPE obligation_strength AS ENUM (
  'rule',
  'guidance',
  'expectation'
);

CREATE TYPE document_status AS ENUM (
  'draft',
  'generating',
  'review_pending',
  'approved',
  'rejected',
  'final'
);

CREATE TYPE risk_rating AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Organisations (Tenants)
CREATE TABLE organisations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  trading_name TEXT,
  company_number TEXT,
  incorporation_date DATE,
  registered_address JSONB,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  licence_type licence_type,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'client_contributor',
  organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  mfa_enabled BOOLEAN DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  reference_number TEXT UNIQUE,
  licence_type licence_type NOT NULL,
  status application_status DEFAULT 'draft',
  detected_permissions TEXT[],
  risk_flags JSONB DEFAULT '[]'::JSONB,
  progress_percentage INTEGER DEFAULT 0,
  intake_completed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  fca_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  assigned_reviewer UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}'::JSONB
);

-- =============================================================================
-- INTAKE & FACTS
-- =============================================================================

-- Intake Sections
CREATE TABLE intake_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  licence_types licence_type[],
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intake Questions
CREATE TABLE intake_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES intake_sections(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- text, textarea, select, multi_select, date, file, boolean
  options JSONB, -- For select/multi_select
  validation_rules JSONB,
  help_text TEXT,
  fca_mapping TEXT, -- Maps to FCA form field
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  conditional_logic JSONB, -- Show/hide based on other answers
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Facts (Structured answers from intake)
CREATE TABLE facts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  question_id UUID REFERENCES intake_questions(id),
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  confidence_score NUMERIC(3,2) DEFAULT 1.0,
  source TEXT DEFAULT 'user_input', -- user_input, ai_extracted, calculated
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, key)
);

-- =============================================================================
-- REGULATORY KNOWLEDGE BASE (RKB)
-- =============================================================================

-- Regulatory Sources
CREATE TABLE regulatory_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  authority TEXT NOT NULL, -- FCA, HM Treasury, PRA
  source_type TEXT NOT NULL, -- Handbook, Regulation, Guidance
  module TEXT NOT NULL, -- SYSC, COND, PSD, EMR
  reference TEXT NOT NULL UNIQUE, -- e.g., SYSC 3.1.1R
  title TEXT NOT NULL,
  full_text TEXT,
  effective_date DATE,
  version TEXT,
  url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Regulatory Statements (Atomic requirements)
CREATE TABLE regulatory_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES regulatory_sources(id) ON DELETE CASCADE,
  statement_text TEXT NOT NULL,
  obligation_category obligation_category NOT NULL,
  obligation_strength obligation_strength NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Licence Applicability
CREATE TABLE licence_applicability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regulatory_statement_id UUID NOT NULL REFERENCES regulatory_statements(id) ON DELETE CASCADE,
  licence_type licence_type NOT NULL,
  applicability TEXT NOT NULL, -- Required, Enhanced, Optional, N/A
  notes TEXT,
  UNIQUE(regulatory_statement_id, licence_type)
);

-- =============================================================================
-- POLICY MODULE LIBRARY
-- =============================================================================

-- Policy Modules
CREATE TABLE policy_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  risk_domain TEXT NOT NULL, -- Financial Crime, Operations, Conduct, etc.
  is_reusable BOOLEAN DEFAULT true,
  licence_types licence_type[],
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policy Module Sections
CREATE TABLE policy_module_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_module_id UUID NOT NULL REFERENCES policy_modules(id) ON DELETE CASCADE,
  section_title TEXT NOT NULL,
  base_text TEXT NOT NULL,
  configurable_fields JSONB DEFAULT '[]'::JSONB,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policy-Regulation Mapping (Critical traceability table)
CREATE TABLE policy_regulation_mapping (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_module_id UUID NOT NULL REFERENCES policy_modules(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES policy_module_sections(id) ON DELETE CASCADE,
  regulatory_statement_id UUID NOT NULL REFERENCES regulatory_statements(id) ON DELETE CASCADE,
  control_description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section_id, regulatory_statement_id)
);

-- =============================================================================
-- GENERATED DOCUMENTS
-- =============================================================================

-- Policies (Generated for applications)
CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  policy_module_id UUID REFERENCES policy_modules(id),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  status document_status DEFAULT 'draft',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB
);

-- Business Plans
CREATE TABLE business_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  financial_projections JSONB,
  sensitivity_analysis JSONB,
  risk_mitigation JSONB,
  version INTEGER DEFAULT 1,
  status document_status DEFAULT 'draft',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Diagrams
CREATE TABLE diagrams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- funds_flow, process_flow, org_chart
  name TEXT NOT NULL,
  source TEXT NOT NULL, -- Mermaid source
  svg_url TEXT,
  png_url TEXT,
  version INTEGER DEFAULT 1,
  status document_status DEFAULT 'draft',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- CONTROLS & EVIDENCE
-- =============================================================================

-- Controls
CREATE TABLE controls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_module_section_id UUID REFERENCES policy_module_sections(id) ON DELETE CASCADE,
  control_code TEXT NOT NULL UNIQUE,
  control_text TEXT NOT NULL,
  frequency TEXT, -- Ongoing, Daily, Weekly, Monthly, Annual
  owner_role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Process Steps
CREATE TABLE process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  control_id UUID NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evidence Requirements
CREATE TABLE evidence_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  control_id UUID NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL,
  description TEXT,
  retention_period TEXT, -- e.g., "5 years"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- FCA APPLICATION PACK
-- =============================================================================

-- FCA Form Mappings
CREATE TABLE fca_form_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  licence_type licence_type NOT NULL,
  form_name TEXT NOT NULL,
  field_reference TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL,
  fact_key TEXT, -- Maps to facts.key
  validation_rules JSONB,
  help_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FCA Form Answers
CREATE TABLE fca_form_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  form_mapping_id UUID NOT NULL REFERENCES fca_form_mappings(id),
  answer_value TEXT,
  ai_generated BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, form_mapping_id)
);

-- Bundle Packs
CREATE TABLE bundle_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  status document_status DEFAULT 'draft',
  contents JSONB NOT NULL, -- List of included documents
  zip_url TEXT,
  pdf_url TEXT,
  generated_at TIMESTAMPTZ,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- FCA CORRESPONDENCE
-- =============================================================================

-- FCA Correspondence
CREATE TABLE fca_correspondence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- incoming, outgoing
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::JSONB,
  received_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  fca_reference TEXT,
  requires_response BOOLEAN DEFAULT false,
  response_deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Draft Responses
CREATE TABLE draft_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  correspondence_id UUID NOT NULL REFERENCES fca_correspondence(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT true,
  citations JSONB DEFAULT '[]'::JSONB, -- References to regulatory_statements
  version INTEGER DEFAULT 1,
  status document_status DEFAULT 'draft',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- AUDIT LOG
-- =============================================================================

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  performed_by UUID REFERENCES users(id),
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for audit queries
CREATE INDEX idx_audit_log_entity ON audit_log(entity, entity_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp DESC);

-- =============================================================================
-- DOCUMENT UPLOADS
-- =============================================================================

CREATE TABLE document_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  fact_id UUID REFERENCES facts(id),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_applications_org ON applications(organisation_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_facts_application ON facts(application_id);
CREATE INDEX idx_policies_application ON policies(application_id);
CREATE INDEX idx_regulatory_statements_source ON regulatory_statements(source_id);
CREATE INDEX idx_regulatory_statements_category ON regulatory_statements(obligation_category);
CREATE INDEX idx_policy_regulation_mapping_statement ON policy_regulation_mapping(regulatory_statement_id);

-- =============================================================================
-- ROW LEVEL SECURITY (Multi-tenant isolation)
-- =============================================================================

ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE fca_form_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fca_correspondence ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies will be created based on auth setup

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_organisations_updated_at BEFORE UPDATE ON organisations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_facts_updated_at BEFORE UPDATE ON facts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Audit log trigger function
CREATE OR REPLACE FUNCTION audit_log_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (entity, entity_id, action, old_value, new_value, performed_by)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    COALESCE(current_setting('app.current_user_id', true)::UUID, NULL)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_applications AFTER INSERT OR UPDATE OR DELETE ON applications FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();
CREATE TRIGGER audit_policies AFTER INSERT OR UPDATE OR DELETE ON policies FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();
CREATE TRIGGER audit_fca_form_answers AFTER INSERT OR UPDATE OR DELETE ON fca_form_answers FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE organisations IS 'Multi-tenant organisations (clients)';
COMMENT ON TABLE applications IS 'FCA licence applications';
COMMENT ON TABLE facts IS 'Structured facts extracted from intake';
COMMENT ON TABLE regulatory_sources IS 'FCA Handbook modules, regulations, guidance';
COMMENT ON TABLE regulatory_statements IS 'Atomic regulatory requirements';
COMMENT ON TABLE policy_modules IS 'Reusable policy building blocks';
COMMENT ON TABLE policy_regulation_mapping IS 'Traceability: policy → regulation';
COMMENT ON TABLE audit_log IS 'Immutable audit trail for all changes';

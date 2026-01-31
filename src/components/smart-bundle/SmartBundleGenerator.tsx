// REG-VAULT Smart Bundle Generator
// Enhanced bundle generation with FCA compliance checking

import { useState, useMemo } from 'react';
import { useJourneyStore } from '@/lib/stores/journeyStore';
import { useFinancialStore } from '@/lib/stores/financialStore';
import { BundleChecklist } from './BundleChecklist';
import {
  Package,
  FileText,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Download,
  Eye,
  RefreshCw,
  ChevronRight,
  Shield,
  Scale,
  Users,
  TrendingUp,
  Settings,
  FileCheck,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export interface BundleDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  status: 'complete' | 'incomplete' | 'missing' | 'error';
  source: 'journey' | 'financial' | 'policy' | 'form' | 'manual';
  fcaRequired: boolean;
  fcaReference?: string;
  lastUpdated?: string;
  validationErrors?: string[];
  content?: string;
}

export type DocumentCategory =
  | 'application_forms'
  | 'business_plan'
  | 'financial_projections'
  | 'policies'
  | 'governance'
  | 'supporting_documents';

const CATEGORY_INFO: Record<DocumentCategory, { label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  application_forms: { label: 'Application Forms', icon: FileText },
  business_plan: { label: 'Business Plan', icon: TrendingUp },
  financial_projections: { label: 'Financial Projections', icon: Scale },
  policies: { label: 'Policies & Procedures', icon: Shield },
  governance: { label: 'Governance Documents', icon: Users },
  supporting_documents: { label: 'Supporting Documents', icon: FileCheck },
};

export function SmartBundleGenerator() {
  const journeyStore = useJourneyStore();
  const financialStore = useFinancialStore();

  const journeyData = journeyStore.getJourneyData();
  const statements = financialStore.getStatements();
  const capitalRequirement = financialStore.getCapitalRequirement();

  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Generate document list based on journey progress
  const documents = useMemo<BundleDocument[]>(() => {
    const licenceType = journeyData.recommendedLicence?.type || 'API';
    const docs: BundleDocument[] = [];

    // Application Forms
    docs.push({
      id: 'application_form',
      name: 'FCA Application Form',
      category: 'application_forms',
      status: journeyData.fcaForms?.length > 0 ? 'complete' : 'missing',
      source: 'form',
      fcaRequired: true,
      fcaReference: 'SUP 6 Annex 4',
    });

    docs.push({
      id: 'supplementary_form',
      name: 'Supplementary Information Form',
      category: 'application_forms',
      status: journeyData.fcaForms?.length > 1 ? 'complete' : 'incomplete',
      source: 'form',
      fcaRequired: true,
      fcaReference: 'SUP 6 Annex 4',
    });

    // Business Plan
    docs.push({
      id: 'business_plan',
      name: 'Business Plan',
      category: 'business_plan',
      status: journeyData.businessPlan?.progress >= 80 ? 'complete' :
              journeyData.businessPlan?.progress >= 30 ? 'incomplete' : 'missing',
      source: 'journey',
      fcaRequired: true,
      fcaReference: 'SYSC 4.1',
      lastUpdated: journeyData.businessPlan?.lastUpdated,
    });

    docs.push({
      id: 'regulatory_business_plan',
      name: 'Regulatory Business Plan',
      category: 'business_plan',
      status: journeyData.businessPlan?.sections?.some((s: { id: string }) => s.id === 'regulatory_strategy')
        ? 'complete' : 'incomplete',
      source: 'journey',
      fcaRequired: true,
      fcaReference: 'PERG 15.3',
    });

    // Financial Projections
    docs.push({
      id: 'financial_projections',
      name: '3-Year Financial Projections',
      category: 'financial_projections',
      status: statements ? 'complete' : 'missing',
      source: 'financial',
      fcaRequired: true,
      fcaReference: 'PSR 2017 Reg 18',
    });

    docs.push({
      id: 'capital_calculations',
      name: 'Capital Requirements Calculation',
      category: 'financial_projections',
      status: capitalRequirement ? 'complete' : 'missing',
      source: 'financial',
      fcaRequired: true,
      fcaReference: licenceType.includes('EMI') ? 'EMR 2011 Reg 6' : 'PSR 2017 Reg 18',
    });

    docs.push({
      id: 'sensitivity_analysis',
      name: 'Sensitivity Analysis',
      category: 'financial_projections',
      status: financialStore.getSensitivityScenarios().length > 0 ? 'complete' : 'incomplete',
      source: 'financial',
      fcaRequired: false,
    });

    // Policies
    const policyTypes = [
      { id: 'aml_policy', name: 'AML/CFT Policy', ref: 'MLR 2017 Reg 19' },
      { id: 'safeguarding_policy', name: 'Safeguarding Policy', ref: 'PSR 2017 Reg 23' },
      { id: 'complaints_policy', name: 'Complaints Handling Policy', ref: 'DISP 1' },
      { id: 'operational_resilience', name: 'Operational Resilience Policy', ref: 'SYSC 15A' },
      { id: 'outsourcing_policy', name: 'Outsourcing Policy', ref: 'SYSC 8' },
      { id: 'data_protection', name: 'Data Protection Policy', ref: 'UK GDPR' },
    ];

    policyTypes.forEach((policy) => {
      docs.push({
        id: policy.id,
        name: policy.name,
        category: 'policies',
        status: journeyData.policies?.[policy.id] ? 'complete' : 'missing',
        source: 'policy',
        fcaRequired: true,
        fcaReference: policy.ref,
      });
    });

    // Governance Documents
    docs.push({
      id: 'org_chart',
      name: 'Organisational Chart',
      category: 'governance',
      status: journeyData.diagrams?.find((d: { type: string }) => d.type === 'org-chart') ? 'complete' : 'missing',
      source: 'journey',
      fcaRequired: true,
      fcaReference: 'SYSC 4.3',
    });

    docs.push({
      id: 'governance_map',
      name: 'Governance Map',
      category: 'governance',
      status: journeyData.diagrams?.find((d: { type: string }) => d.type === 'governance') ? 'complete' : 'incomplete',
      source: 'journey',
      fcaRequired: false,
    });

    docs.push({
      id: 'cv_directors',
      name: 'Directors\' CVs',
      category: 'governance',
      status: journeyData.directors?.length > 0 ? 'complete' : 'missing',
      source: 'manual',
      fcaRequired: true,
      fcaReference: 'SUP 10C',
    });

    // Supporting Documents
    docs.push({
      id: 'payment_flow',
      name: 'Payment Flow Diagrams',
      category: 'supporting_documents',
      status: journeyData.diagrams?.find((d: { type: string }) => d.type === 'payment-flow') ? 'complete' : 'incomplete',
      source: 'journey',
      fcaRequired: false,
    });

    docs.push({
      id: 'technology_architecture',
      name: 'Technology Architecture',
      category: 'supporting_documents',
      status: journeyData.diagrams?.find((d: { type: string }) => d.type === 'technology') ? 'complete' : 'incomplete',
      source: 'journey',
      fcaRequired: false,
    });

    docs.push({
      id: 'proof_of_funds',
      name: 'Proof of Funds',
      category: 'supporting_documents',
      status: 'missing',
      source: 'manual',
      fcaRequired: true,
      fcaReference: 'PSR 2017 Reg 18',
    });

    return docs;
  }, [journeyData, statements, capitalRequirement, financialStore]);

  // Calculate readiness metrics
  const metrics = useMemo(() => {
    const total = documents.length;
    const complete = documents.filter((d) => d.status === 'complete').length;
    const required = documents.filter((d) => d.fcaRequired);
    const requiredComplete = required.filter((d) => d.status === 'complete').length;

    return {
      total,
      complete,
      incomplete: documents.filter((d) => d.status === 'incomplete').length,
      missing: documents.filter((d) => d.status === 'missing').length,
      progress: Math.round((complete / total) * 100),
      requiredProgress: Math.round((requiredComplete / required.length) * 100),
      isReady: requiredComplete === required.length,
    };
  }, [documents]);

  // Group documents by category
  const categorizedDocuments = useMemo(() => {
    const categories = new Map<DocumentCategory, BundleDocument[]>();
    documents.forEach((doc) => {
      const existing = categories.get(doc.category) || [];
      existing.push(doc);
      categories.set(doc.category, existing);
    });
    return categories;
  }, [documents]);

  const handleGenerateBundle = async () => {
    setIsGenerating(true);

    // Simulate bundle generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // In production, this would:
    // 1. Compile all documents
    // 2. Generate PDF versions
    // 3. Create cross-reference index
    // 4. Package into ZIP

    const bundleContent = generateBundleManifest(documents, journeyData);

    // Download manifest
    const blob = new Blob([bundleContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fca-application-bundle-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  const handleValidate = () => {
    // Run validation checks
    journeyStore.updateStageProgress('bundle_review', metrics.progress);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-photon-white">Smart Bundle Generator</h2>
          <p className="text-mist-gray mt-1">
            Compile and validate your FCA application package
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleValidate}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-mist-gray hover:text-photon-white transition-colors"
          >
            <RefreshCw size={16} />
            Validate
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-mist-gray hover:text-photon-white transition-colors"
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            onClick={handleGenerateBundle}
            disabled={isGenerating || !metrics.isReady}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              metrics.isReady
                ? 'bg-pellucid-cyan hover:bg-pellucid-cyan/80 text-void-black'
                : 'bg-white/10 text-mist-gray cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download size={16} />
                Generate Bundle
              </>
            )}
          </button>
        </div>
      </div>

      {/* Readiness Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-mist-gray">Overall Progress</span>
            <Package size={18} className="text-pellucid-cyan" />
          </div>
          <p className="text-3xl font-bold text-photon-white">{metrics.progress}%</p>
          <p className="text-xs text-mist-gray mt-1">
            {metrics.complete} of {metrics.total} documents
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-mist-gray">FCA Requirements</span>
            <Shield size={18} className="text-apex-amber" />
          </div>
          <p className="text-3xl font-bold text-photon-white">{metrics.requiredProgress}%</p>
          <p className="text-xs text-mist-gray mt-1">Mandatory documents ready</p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-mist-gray">Incomplete</span>
            <AlertTriangle size={18} className="text-apex-amber" />
          </div>
          <p className="text-3xl font-bold text-apex-amber">{metrics.incomplete}</p>
          <p className="text-xs text-mist-gray mt-1">Documents need attention</p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-mist-gray">Missing</span>
            <AlertCircle size={18} className="text-red-400" />
          </div>
          <p className="text-3xl font-bold text-red-400">{metrics.missing}</p>
          <p className="text-xs text-mist-gray mt-1">Documents to create</p>
        </div>
      </div>

      {/* Submission Readiness */}
      <div
        className={`rounded-lg p-4 ${
          metrics.isReady
            ? 'bg-deep-teal/10 border border-deep-teal/20'
            : 'bg-apex-amber/10 border border-apex-amber/20'
        }`}
      >
        <div className="flex items-start gap-3">
          {metrics.isReady ? (
            <CheckCircle size={24} className="text-deep-teal flex-shrink-0" />
          ) : (
            <AlertTriangle size={24} className="text-apex-amber flex-shrink-0" />
          )}
          <div>
            <h3
              className={`font-medium ${metrics.isReady ? 'text-deep-teal' : 'text-apex-amber'}`}
            >
              {metrics.isReady ? 'Ready for Submission' : 'Not Ready for Submission'}
            </h3>
            <p className="text-sm text-mist-gray mt-1">
              {metrics.isReady
                ? 'All mandatory FCA documents are complete. You can generate your application bundle.'
                : `${metrics.missing + metrics.incomplete} documents need to be completed before submission.`}
            </p>
          </div>
        </div>
      </div>

      {/* Document Categories */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category List */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-photon-white mb-3">Document Categories</h3>
          {Array.from(categorizedDocuments.entries()).map(([category, docs]) => {
            const info = CATEGORY_INFO[category];
            const Icon = info.icon;
            const complete = docs.filter((d) => d.status === 'complete').length;
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(isSelected ? null : category)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-pellucid-cyan/20 border border-pellucid-cyan/30'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={isSelected ? 'text-pellucid-cyan' : 'text-mist-gray'}
                  />
                  <span className={isSelected ? 'text-photon-white' : 'text-mist-gray'}>
                    {info.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-mist-gray">
                    {complete}/{docs.length}
                  </span>
                  {complete === docs.length ? (
                    <CheckCircle size={14} className="text-deep-teal" />
                  ) : (
                    <ChevronRight
                      size={14}
                      className={isSelected ? 'text-pellucid-cyan' : 'text-mist-gray'}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Document List */}
        <div className="lg:col-span-2">
          <BundleChecklist
            documents={
              selectedCategory
                ? documents.filter((d) => d.category === selectedCategory)
                : documents
            }
            onDocumentClick={(doc) => {
              // Navigate to relevant section based on source
              console.log('Navigate to:', doc);
            }}
          />
        </div>
      </div>

      {/* FCA Guidance */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-sm font-medium text-photon-white mb-3 flex items-center gap-2">
          <Shield size={16} className="text-pellucid-cyan" />
          FCA Application Guidance
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-mist-gray font-medium mb-2">Before Submission</h4>
            <ul className="space-y-1 text-mist-gray">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-deep-teal flex-shrink-0 mt-0.5" />
                Ensure all mandatory documents are complete
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-deep-teal flex-shrink-0 mt-0.5" />
                Review capital calculations are accurate
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-deep-teal flex-shrink-0 mt-0.5" />
                Cross-reference policies with business plan
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-mist-gray font-medium mb-2">Submission Process</h4>
            <ul className="space-y-1 text-mist-gray">
              <li className="flex items-start gap-2">
                <span className="text-pellucid-cyan">1.</span>
                Pay application fee via FCA Connect
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pellucid-cyan">2.</span>
                Upload all documents to Connect portal
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pellucid-cyan">3.</span>
                Submit and await case handler assignment
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10">
          <a
            href="https://www.fca.org.uk/firms/authorisation/how-to-apply"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-pellucid-cyan hover:underline text-sm"
          >
            <ExternalLink size={14} />
            FCA: How to Apply for Authorisation
          </a>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate bundle manifest
function generateBundleManifest(
  documents: BundleDocument[],
  journeyData: Record<string, unknown>
): string {
  let content = '# FCA Application Bundle Manifest\n\n';
  content += `**Generated:** ${new Date().toISOString()}\n`;
  content += `**Licence Type:** ${(journeyData.recommendedLicence as { type?: string })?.type || 'Payment Services'}\n\n`;
  content += '---\n\n';

  content += '## Document Checklist\n\n';

  const categories = new Map<DocumentCategory, BundleDocument[]>();
  documents.forEach((doc) => {
    const existing = categories.get(doc.category) || [];
    existing.push(doc);
    categories.set(doc.category, existing);
  });

  categories.forEach((docs, category) => {
    const info = CATEGORY_INFO[category];
    content += `### ${info.label}\n\n`;

    docs.forEach((doc) => {
      const statusIcon = doc.status === 'complete' ? '[x]' : '[ ]';
      const required = doc.fcaRequired ? ' **(Required)**' : '';
      const ref = doc.fcaReference ? ` (${doc.fcaReference})` : '';
      content += `- ${statusIcon} ${doc.name}${required}${ref}\n`;
    });

    content += '\n';
  });

  content += '---\n\n';
  content += '## Submission Notes\n\n';
  content += '- Upload all documents to FCA Connect\n';
  content += '- Ensure payment of application fee before submission\n';
  content += '- Keep copies of all submitted documents\n';

  return content;
}

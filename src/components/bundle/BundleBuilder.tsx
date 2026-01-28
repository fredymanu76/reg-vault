'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, Button } from '@/components/common';
import Badge from '@/components/common/Badge';
import Progress from '@/components/common/Progress';
import {
  Package,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Eye,
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  Upload,
  Sparkles,
  RefreshCw,
  Shield,
  Users,
  Building2,
  BarChart3,
  Scale,
  Lock,
} from 'lucide-react';

// Mock bundle structure
const BUNDLE_SECTIONS = [
  {
    id: 'application_forms',
    name: 'Application Forms',
    icon: FileText,
    documents: [
      { id: 'form_a', name: 'Form A - Application for Authorisation', status: 'complete', fcaForm: true, autoFilled: 85 },
      { id: 'form_c', name: 'Form C - Controller Details', status: 'complete', fcaForm: true, autoFilled: 100 },
      { id: 'form_d', name: 'Form D - Individual Details', status: 'pending', fcaForm: true, autoFilled: 65 },
    ],
  },
  {
    id: 'business_plan',
    name: 'Business Plan & Projections',
    icon: BarChart3,
    documents: [
      { id: 'business_plan', name: 'Business Plan Document', status: 'complete', fcaForm: false, autoFilled: 0 },
      { id: 'financial_projections', name: 'Financial Projections (3 Year)', status: 'complete', fcaForm: false, autoFilled: 0 },
      { id: 'capital_calculations', name: 'Capital Requirements Calculator', status: 'complete', fcaForm: false, autoFilled: 100 },
    ],
  },
  {
    id: 'governance',
    name: 'Governance & Control',
    icon: Scale,
    documents: [
      { id: 'org_chart', name: 'Organisational Chart', status: 'complete', fcaForm: false, autoFilled: 0 },
      { id: 'governance_map', name: 'Governance Map', status: 'pending', fcaForm: false, autoFilled: 0 },
      { id: 'smcr_statement', name: 'SMCR Statement of Responsibilities', status: 'draft', fcaForm: false, autoFilled: 0 },
    ],
  },
  {
    id: 'policies',
    name: 'Policies & Procedures',
    icon: Shield,
    documents: [
      { id: 'aml_policy', name: 'AML/CTF Policy', status: 'complete', fcaForm: false, autoFilled: 0 },
      { id: 'safeguarding_policy', name: 'Safeguarding Policy', status: 'complete', fcaForm: false, autoFilled: 0 },
      { id: 'complaints_policy', name: 'Complaints Handling Policy', status: 'draft', fcaForm: false, autoFilled: 0 },
      { id: 'outsourcing_policy', name: 'Outsourcing Policy', status: 'pending', fcaForm: false, autoFilled: 0 },
    ],
  },
  {
    id: 'personnel',
    name: 'Key Personnel',
    icon: Users,
    documents: [
      { id: 'cv_ceo', name: 'CV - Chief Executive Officer', status: 'complete', fcaForm: false, autoFilled: 0 },
      { id: 'cv_mlro', name: 'CV - MLRO', status: 'complete', fcaForm: false, autoFilled: 0 },
      { id: 'cv_cfo', name: 'CV - Finance Director', status: 'pending', fcaForm: false, autoFilled: 0 },
      { id: 'fit_proper', name: 'Fit & Proper Declarations', status: 'draft', fcaForm: false, autoFilled: 0 },
    ],
  },
  {
    id: 'company_docs',
    name: 'Company Documents',
    icon: Building2,
    documents: [
      { id: 'cert_incorporation', name: 'Certificate of Incorporation', status: 'complete', fcaForm: false, autoFilled: 0 },
      { id: 'articles', name: 'Articles of Association', status: 'complete', fcaForm: false, autoFilled: 0 },
      { id: 'shareholder_register', name: 'Shareholder Register', status: 'complete', fcaForm: false, autoFilled: 0 },
    ],
  },
  {
    id: 'diagrams',
    name: 'Process & Flow Diagrams',
    icon: Lock,
    documents: [
      { id: 'funds_flow', name: 'Funds Flow Diagram', status: 'complete', fcaForm: false, autoFilled: 0 },
      { id: 'process_flow', name: 'Payment Process Flow', status: 'complete', fcaForm: false, autoFilled: 0 },
      { id: 'it_architecture', name: 'IT Architecture Diagram', status: 'pending', fcaForm: false, autoFilled: 0 },
    ],
  },
];

export default function BundleBuilder() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['application_forms']);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const allDocuments = BUNDLE_SECTIONS.flatMap(s => s.documents);
  const completeCount = allDocuments.filter(d => d.status === 'complete').length;
  const totalCount = allDocuments.length;
  const completionPercentage = Math.round((completeCount / totalCount) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-[var(--color-text-muted)]" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge variant="success" size="sm">Complete</Badge>;
      case 'draft':
        return <Badge variant="warning" size="sm">Draft</Badge>;
      case 'pending':
        return <Badge variant="default" size="sm">Pending</Badge>;
      default:
        return null;
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsExporting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Bundle Pack Builder</h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            Compile and export your FCA submission bundle
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh Status
          </Button>
          <Button
            onClick={handleExport}
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Bundle
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Bundle Completion</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                {completeCount} of {totalCount} documents ready
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-[var(--color-gold)]">{completionPercentage}%</span>
            </div>
          </div>
          <Progress value={completionPercentage} />
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-emerald-500/10 rounded-lg">
              <p className="text-xl font-bold text-emerald-400">{allDocuments.filter(d => d.status === 'complete').length}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Complete</p>
            </div>
            <div className="text-center p-3 bg-amber-500/10 rounded-lg">
              <p className="text-xl font-bold text-amber-400">{allDocuments.filter(d => d.status === 'draft').length}</p>
              <p className="text-xs text-[var(--color-text-muted)]">In Draft</p>
            </div>
            <div className="text-center p-3 bg-[var(--color-surface)] rounded-lg">
              <p className="text-xl font-bold text-[var(--color-text-muted)]">{allDocuments.filter(d => d.status === 'pending').length}</p>
              <p className="text-xs text-[var(--color-text-muted)]">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Bundle Structure */}
        <div className="col-span-12 lg:col-span-7">
          <Card>
            <CardHeader
              title="Bundle Structure"
              description="FCA submission document checklist"
            />
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--color-border)]">
                {BUNDLE_SECTIONS.map(section => {
                  const Icon = section.icon;
                  const isExpanded = expandedSections.includes(section.id);
                  const sectionComplete = section.documents.filter(d => d.status === 'complete').length;
                  const sectionTotal = section.documents.length;

                  return (
                    <div key={section.id}>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-[var(--color-surface-hover)] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[var(--color-surface)] flex items-center justify-center">
                            <Icon className="w-5 h-5 text-[var(--color-gold)]" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-[var(--color-text)]">{section.name}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                              {sectionComplete}/{sectionTotal} documents complete
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={(sectionComplete / sectionTotal) * 100} size="sm" className="w-20" />
                          <ChevronDown
                            className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="bg-[var(--color-surface)]/50 border-t border-[var(--color-border)]">
                          {section.documents.map((doc, index) => (
                            <button
                              key={doc.id}
                              onClick={() => setSelectedDocument(doc.id)}
                              className={`w-full p-3 pl-16 flex items-center justify-between hover:bg-[var(--color-surface-hover)] transition-colors border-b border-[var(--color-border)] last:border-b-0 ${
                                selectedDocument === doc.id ? 'bg-[var(--color-gold)]/5' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {getStatusIcon(doc.status)}
                                <div className="text-left">
                                  <p className={`text-sm ${selectedDocument === doc.id ? 'text-[var(--color-gold)]' : 'text-[var(--color-text)]'}`}>
                                    {doc.name}
                                  </p>
                                  {doc.fcaForm && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="gold" size="sm">FCA Form</Badge>
                                      {doc.autoFilled > 0 && (
                                        <span className="text-xs text-[var(--color-text-muted)]">
                                          {doc.autoFilled}% auto-filled
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(doc.status)}
                                <ChevronRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Preview / Actions */}
        <div className="col-span-12 lg:col-span-5">
          {selectedDocument ? (
            <Card>
              {(() => {
                const doc = allDocuments.find(d => d.id === selectedDocument);
                if (!doc) return null;

                return (
                  <>
                    <CardHeader
                      title={doc.name}
                      description={doc.fcaForm ? 'FCA Official Form' : 'Supporting Document'}
                    />
                    <CardContent>
                      <div className="space-y-4">
                        {/* Status */}
                        <div className="flex items-center justify-between p-3 bg-[var(--color-surface)] rounded-lg">
                          <span className="text-sm text-[var(--color-text-muted)]">Status</span>
                          {getStatusBadge(doc.status)}
                        </div>

                        {/* Auto-fill Progress (for FCA forms) */}
                        {doc.fcaForm && (
                          <div className="p-4 bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-[var(--color-gold)]" />
                              <span className="text-sm font-medium text-[var(--color-gold)]">Auto-Fill Status</span>
                            </div>
                            <Progress value={doc.autoFilled} size="sm" showLabel />
                            <p className="text-xs text-[var(--color-text-muted)] mt-2">
                              Fields populated from your intake responses
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-2">
                          <Button variant="secondary" className="w-full justify-start">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Document
                          </Button>
                          {doc.status !== 'complete' && (
                            <Button variant="secondary" className="w-full justify-start">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Document
                            </Button>
                          )}
                          <Button variant="secondary" className="w-full justify-start">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>

                        {/* Help Text */}
                        <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {doc.fcaForm
                              ? 'This FCA form has been auto-populated with data from your intake questionnaire. Review and complete any missing fields before including in your submission.'
                              : 'Upload the required document or generate from your application data. All documents will be compiled into your final submission bundle.'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </>
                );
              })()}
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Package className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                  Select a Document
                </h3>
                <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
                  Choose a document from the bundle structure to view details, preview, or upload.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Export Info */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[var(--color-gold)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Export Options</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    Export your bundle as a single PDF package or ZIP archive with individual files.
                    All documents will be indexed and paginated for FCA submission.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      PDF Package
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Folder className="w-4 h-4 mr-1" />
                      ZIP Archive
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

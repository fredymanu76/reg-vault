'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, Button, Input } from '@/components/common';
import Badge from '@/components/common/Badge';
import Progress from '@/components/common/Progress';
import {
  FileText,
  Search,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Eye,
  Download,
  RefreshCw,
  Shield,
  Scale,
  Users,
  Landmark,
  Lock,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

// Mock policy modules from FCA requirements
const POLICY_MODULES = [
  {
    id: 'aml',
    name: 'Anti-Money Laundering Policy',
    abbreviation: 'AML',
    icon: Shield,
    status: 'approved',
    version: '2.1',
    lastUpdated: '2024-01-18',
    regulatoryMapping: ['MLR 2017', 'JMLSG Guidance', 'SYSC 6.3'],
    sections: 12,
    completionPercentage: 100,
  },
  {
    id: 'safeguarding',
    name: 'Safeguarding Policy',
    abbreviation: 'SAF',
    icon: Lock,
    status: 'review',
    version: '1.3',
    lastUpdated: '2024-01-20',
    regulatoryMapping: ['PSR 2017 Reg 21-23', 'FCA PERG 15'],
    sections: 8,
    completionPercentage: 85,
  },
  {
    id: 'complaints',
    name: 'Complaints Handling Policy',
    abbreviation: 'CHP',
    icon: Users,
    status: 'draft',
    version: '1.0',
    lastUpdated: '2024-01-19',
    regulatoryMapping: ['DISP 1.3', 'PSR 2017 Reg 101'],
    sections: 6,
    completionPercentage: 45,
  },
  {
    id: 'governance',
    name: 'Governance & Control Framework',
    abbreviation: 'GOV',
    icon: Scale,
    status: 'approved',
    version: '1.2',
    lastUpdated: '2024-01-15',
    regulatoryMapping: ['SYSC 4', 'SYSC 6', 'SUP 10A'],
    sections: 10,
    completionPercentage: 100,
  },
  {
    id: 'outsourcing',
    name: 'Outsourcing Policy',
    abbreviation: 'OUT',
    icon: ExternalLink,
    status: 'draft',
    version: '0.5',
    lastUpdated: '2024-01-21',
    regulatoryMapping: ['SYSC 8', 'EBA Guidelines'],
    sections: 7,
    completionPercentage: 30,
  },
  {
    id: 'operational_resilience',
    name: 'Operational Resilience Policy',
    abbreviation: 'ORP',
    icon: Landmark,
    status: 'pending',
    version: '0.1',
    lastUpdated: '2024-01-20',
    regulatoryMapping: ['SYSC 15A', 'FCA PS21/3'],
    sections: 9,
    completionPercentage: 0,
  },
];

// Mock policy content for detail view
const MOCK_POLICY_SECTIONS = [
  {
    id: 'aml-1',
    title: '1. Introduction and Purpose',
    content: `This Anti-Money Laundering (AML) Policy establishes the framework for [Organisation Name] ("the Firm") to prevent, detect, and report money laundering and terrorist financing activities in compliance with the Money Laundering, Terrorist Financing and Transfer of Funds (Information on the Payer) Regulations 2017 ("MLR 2017") and FCA requirements.`,
    regulatoryRef: 'MLR 2017 Reg 18-21',
    status: 'approved',
  },
  {
    id: 'aml-2',
    title: '2. Scope and Application',
    content: `This policy applies to all employees, directors, and third parties acting on behalf of the Firm. It covers all payment services provided under our FCA authorisation, including but not limited to money remittance, payment execution, and e-money issuance.`,
    regulatoryRef: 'MLR 2017 Reg 3',
    status: 'approved',
  },
  {
    id: 'aml-3',
    title: '3. Risk Assessment',
    content: `The Firm shall conduct and maintain a documented business-wide risk assessment that identifies and assesses the risks of money laundering and terrorist financing to which the business is subject. This assessment shall be reviewed at least annually or when there are material changes to the business.`,
    regulatoryRef: 'MLR 2017 Reg 18',
    status: 'approved',
  },
  {
    id: 'aml-4',
    title: '4. Customer Due Diligence (CDD)',
    content: `The Firm shall apply CDD measures when establishing a business relationship, carrying out an occasional transaction, or when there is a suspicion of money laundering or terrorist financing. CDD measures include: identifying and verifying the customer's identity; identifying beneficial owners; assessing the purpose and intended nature of the business relationship.`,
    regulatoryRef: 'MLR 2017 Reg 27-38',
    status: 'approved',
  },
  {
    id: 'aml-5',
    title: '5. Enhanced Due Diligence (EDD)',
    content: `Enhanced due diligence shall be applied in high-risk situations, including: customers from high-risk third countries; politically exposed persons (PEPs); complex or unusual transactions; correspondent relationships with third-country respondent institutions.`,
    regulatoryRef: 'MLR 2017 Reg 33-35',
    status: 'review',
  },
];

export default function PoliciesModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredPolicies = POLICY_MODULES.filter(policy =>
    policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'review':
        return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
      case 'draft':
        return <Badge variant="gold"><Edit className="w-3 h-3 mr-1" />Draft</Badge>;
      case 'pending':
        return <Badge variant="default"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleGeneratePolicy = async (policyId: string) => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const selectedPolicyData = POLICY_MODULES.find(p => p.id === selectedPolicy);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Policies & Procedures</h1>
          <p className="text-[var(--color-text-muted)] mt-1">
            AI-generated policies mapped to FCA regulations
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Create Policy
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--color-text)]">{POLICY_MODULES.length}</p>
                <p className="text-sm text-[var(--color-text-muted)]">Total Policies</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[var(--color-gold)]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-400">
                  {POLICY_MODULES.filter(p => p.status === 'approved').length}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">Approved</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-400">
                  {POLICY_MODULES.filter(p => p.status === 'review').length}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">Under Review</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--color-gold)]">
                  {POLICY_MODULES.filter(p => p.status === 'draft' || p.status === 'pending').length}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">In Progress</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[var(--color-gold)]/10 flex items-center justify-center">
                <Edit className="w-5 h-5 text-[var(--color-gold)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search policies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Policies List */}
        <div className="col-span-12 lg:col-span-5">
          <Card>
            <CardHeader title="Policy Modules" />
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--color-border)]">
                {filteredPolicies.map(policy => {
                  const Icon = policy.icon;
                  const isSelected = selectedPolicy === policy.id;

                  return (
                    <button
                      key={policy.id}
                      onClick={() => setSelectedPolicy(policy.id)}
                      className={`w-full p-4 text-left transition-all hover:bg-[var(--color-surface-hover)] ${
                        isSelected ? 'bg-[var(--color-gold)]/5 border-l-2 border-[var(--color-gold)]' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-[var(--color-gold)]/20 text-[var(--color-gold)]' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-semibold text-sm ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-text)]'}`}>
                              {policy.abbreviation}
                            </span>
                            {getStatusBadge(policy.status)}
                          </div>
                          <p className="text-sm text-[var(--color-text-muted)] truncate">
                            {policy.name}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-[var(--color-text-muted)]">
                              v{policy.version}
                            </span>
                            <span className="text-xs text-[var(--color-text-muted)]">
                              {policy.sections} sections
                            </span>
                          </div>
                          <div className="mt-2">
                            <Progress value={policy.completionPercentage} size="sm" showLabel />
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-[var(--color-text-muted)] ${isSelected ? 'text-[var(--color-gold)]' : ''}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policy Detail */}
        <div className="col-span-12 lg:col-span-7">
          {selectedPolicyData ? (
            <Card>
              <CardHeader
                title={selectedPolicyData.name}
                description={`Version ${selectedPolicyData.version} • Last updated ${selectedPolicyData.lastUpdated}`}
                action={
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleGeneratePolicy(selectedPolicyData.id)}
                      isLoading={isGenerating}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Regenerate
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                }
              />
              <CardContent>
                {/* Regulatory Mapping */}
                <div className="mb-6 p-4 bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-[var(--color-gold)]" />
                    <span className="text-sm font-medium text-[var(--color-gold)]">Regulatory Mapping</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPolicyData.regulatoryMapping.map((ref, index) => (
                      <Badge key={index} variant="gold" size="sm">
                        {ref}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Policy Sections */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                    Policy Sections
                  </h3>
                  {MOCK_POLICY_SECTIONS.map((section, index) => (
                    <div
                      key={section.id}
                      className="p-4 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] hover:border-[var(--color-gold)]/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="font-medium text-[var(--color-text)]">{section.title}</h4>
                        {section.status === 'approved' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
                        {section.content}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border)]">
                        <Badge variant="default" size="sm">
                          {section.regulatoryRef}
                        </Badge>
                        <button className="text-xs text-[var(--color-gold)] hover:underline flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          View Full Section
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Generation Notice */}
                <div className="mt-6 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[var(--color-gold)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">AI-Generated Content</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        This policy was generated using your intake responses and mapped to applicable FCA regulations.
                        All content has been verified for regulatory accuracy and requires human review before approval.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                  Select a Policy
                </h3>
                <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
                  Choose a policy from the list to view its content, regulatory mapping, and approval status.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

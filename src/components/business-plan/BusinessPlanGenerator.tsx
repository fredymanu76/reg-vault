// REG-VAULT Business Plan Generator
// AI-assisted business plan creation for FCA applications

import { useState } from 'react';
import { useJourneyStore } from '@/lib/stores/journeyStore';
import { SectionEditor } from './SectionEditor';
import { BusinessPlanPreview } from './BusinessPlanPreview';
import {
  FileText,
  Target,
  Users,
  TrendingUp,
  Settings,
  Shield,
  Briefcase,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Download,
  Eye,
  Edit3,
} from 'lucide-react';

export interface BusinessPlanSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  content: string;
  isComplete: boolean;
  regulatoryRelevance: 'high' | 'medium' | 'low';
  fcaRequirements: string[];
  suggestedLength: string;
  subsections?: {
    id: string;
    title: string;
    content: string;
    isComplete: boolean;
  }[];
}

const BUSINESS_PLAN_SECTIONS: BusinessPlanSection[] = [
  {
    id: 'executive_summary',
    title: 'Executive Summary',
    icon: FileText,
    description: 'High-level overview of your business, services, and strategic objectives.',
    content: '',
    isComplete: false,
    regulatoryRelevance: 'high',
    fcaRequirements: [
      'Clear description of payment services to be provided',
      'Target market and customer segments',
      'Key differentiators and competitive advantages',
    ],
    suggestedLength: '1-2 pages',
    subsections: [
      { id: 'company_overview', title: 'Company Overview', content: '', isComplete: false },
      { id: 'mission_vision', title: 'Mission & Vision', content: '', isComplete: false },
      { id: 'key_objectives', title: 'Key Objectives', content: '', isComplete: false },
    ],
  },
  {
    id: 'business_model',
    title: 'Business Model',
    icon: Target,
    description: 'Detailed explanation of how your business operates and generates revenue.',
    content: '',
    isComplete: false,
    regulatoryRelevance: 'high',
    fcaRequirements: [
      'Payment services to be provided (per PSR 2017 Schedule 1)',
      'Revenue model and pricing structure',
      'Customer acquisition and retention strategy',
      'Key partnerships and dependencies',
    ],
    suggestedLength: '3-5 pages',
    subsections: [
      { id: 'service_offering', title: 'Service Offering', content: '', isComplete: false },
      { id: 'revenue_streams', title: 'Revenue Streams', content: '', isComplete: false },
      { id: 'pricing_strategy', title: 'Pricing Strategy', content: '', isComplete: false },
      { id: 'partnerships', title: 'Key Partnerships', content: '', isComplete: false },
    ],
  },
  {
    id: 'market_analysis',
    title: 'Market Analysis',
    icon: TrendingUp,
    description: 'Analysis of target market, competition, and growth opportunities.',
    content: '',
    isComplete: false,
    regulatoryRelevance: 'medium',
    fcaRequirements: [
      'Target market size and demographics',
      'Competitive landscape analysis',
      'Market trends and growth projections',
    ],
    suggestedLength: '2-3 pages',
    subsections: [
      { id: 'target_market', title: 'Target Market', content: '', isComplete: false },
      { id: 'competitive_analysis', title: 'Competitive Analysis', content: '', isComplete: false },
      { id: 'market_trends', title: 'Market Trends', content: '', isComplete: false },
      { id: 'growth_opportunities', title: 'Growth Opportunities', content: '', isComplete: false },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    icon: Settings,
    description: 'Operational infrastructure, technology, and processes.',
    content: '',
    isComplete: false,
    regulatoryRelevance: 'high',
    fcaRequirements: [
      'Technical infrastructure and security measures',
      'Operational resilience arrangements',
      'Outsourcing arrangements and controls',
      'Business continuity planning',
    ],
    suggestedLength: '3-4 pages',
    subsections: [
      { id: 'technology_infrastructure', title: 'Technology Infrastructure', content: '', isComplete: false },
      { id: 'security_measures', title: 'Security Measures', content: '', isComplete: false },
      { id: 'operational_processes', title: 'Operational Processes', content: '', isComplete: false },
      { id: 'outsourcing', title: 'Outsourcing Arrangements', content: '', isComplete: false },
      { id: 'business_continuity', title: 'Business Continuity', content: '', isComplete: false },
    ],
  },
  {
    id: 'management_team',
    title: 'Management Team',
    icon: Users,
    description: 'Key personnel, governance structure, and organisational chart.',
    content: '',
    isComplete: false,
    regulatoryRelevance: 'high',
    fcaRequirements: [
      'Directors and senior management details',
      'Fitness and propriety assessments',
      'Governance arrangements and reporting lines',
      'Key function holders and responsibilities',
    ],
    suggestedLength: '2-3 pages',
    subsections: [
      { id: 'leadership_team', title: 'Leadership Team', content: '', isComplete: false },
      { id: 'governance_structure', title: 'Governance Structure', content: '', isComplete: false },
      { id: 'org_chart', title: 'Organisational Chart', content: '', isComplete: false },
      { id: 'key_functions', title: 'Key Function Holders', content: '', isComplete: false },
    ],
  },
  {
    id: 'regulatory_strategy',
    title: 'Regulatory Strategy',
    icon: Shield,
    description: 'Compliance framework and regulatory approach.',
    content: '',
    isComplete: false,
    regulatoryRelevance: 'high',
    fcaRequirements: [
      'Compliance monitoring arrangements',
      'AML/CFT policies and procedures',
      'Consumer protection measures',
      'Regulatory reporting capabilities',
    ],
    suggestedLength: '3-4 pages',
    subsections: [
      { id: 'compliance_framework', title: 'Compliance Framework', content: '', isComplete: false },
      { id: 'aml_cft', title: 'AML/CFT Arrangements', content: '', isComplete: false },
      { id: 'consumer_protection', title: 'Consumer Protection', content: '', isComplete: false },
      { id: 'regulatory_reporting', title: 'Regulatory Reporting', content: '', isComplete: false },
    ],
  },
  {
    id: 'financial_overview',
    title: 'Financial Overview',
    icon: Briefcase,
    description: 'Summary of financial projections and capital requirements.',
    content: '',
    isComplete: false,
    regulatoryRelevance: 'high',
    fcaRequirements: [
      'Three-year financial projections',
      'Capital requirements calculation',
      'Funding sources and capital adequacy',
      'Safeguarding arrangements (if applicable)',
    ],
    suggestedLength: '2-3 pages',
    subsections: [
      { id: 'financial_summary', title: 'Financial Summary', content: '', isComplete: false },
      { id: 'capital_requirements', title: 'Capital Requirements', content: '', isComplete: false },
      { id: 'funding_sources', title: 'Funding Sources', content: '', isComplete: false },
      { id: 'safeguarding', title: 'Safeguarding Arrangements', content: '', isComplete: false },
    ],
  },
];

export function BusinessPlanGenerator() {
  const journeyStore = useJourneyStore();
  const journeyData = journeyStore.getJourneyData();

  const [sections, setSections] = useState<BusinessPlanSection[]>(() => {
    // Load saved sections from journey data or use defaults
    const saved = journeyData.businessPlan?.sections;
    if (saved) {
      return BUSINESS_PLAN_SECTIONS.map((section) => {
        const savedSection = saved.find((s: BusinessPlanSection) => s.id === section.id);
        return savedSection || section;
      });
    }
    return BUSINESS_PLAN_SECTIONS;
  });

  const [activeSection, setActiveSection] = useState<string>('executive_summary');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['executive_summary']));
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [isGenerating, setIsGenerating] = useState(false);

  const completedSections = sections.filter((s) => s.isComplete).length;
  const totalSections = sections.length;
  const progress = Math.round((completedSections / totalSections) * 100);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const updateSectionContent = (sectionId: string, content: string, subsectionId?: string) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          if (subsectionId && section.subsections) {
            const updatedSubsections = section.subsections.map((sub) =>
              sub.id === subsectionId
                ? { ...sub, content, isComplete: content.trim().length > 50 }
                : sub
            );
            const allComplete = updatedSubsections.every((sub) => sub.isComplete);
            return { ...section, subsections: updatedSubsections, isComplete: allComplete };
          }
          return { ...section, content, isComplete: content.trim().length > 100 };
        }
        return section;
      })
    );
  };

  const saveProgress = () => {
    journeyStore.updateJourneyData({
      businessPlan: {
        sections,
        lastUpdated: new Date().toISOString(),
        progress,
      },
    });
    journeyStore.updateStageProgress('business_plan', progress);
  };

  const generateSectionContent = async (sectionId: string, subsectionId?: string) => {
    setIsGenerating(true);

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const section = sections.find((s) => s.id === sectionId);
    if (!section) {
      setIsGenerating(false);
      return;
    }

    // Generate contextual content based on journey data
    const licenceType = journeyData.recommendedLicence?.type || 'API';
    const content = generateContextualContent(sectionId, subsectionId, licenceType, journeyData);

    updateSectionContent(sectionId, content, subsectionId);
    setIsGenerating(false);
  };

  const exportBusinessPlan = () => {
    // Generate markdown content
    let markdown = '# Business Plan\n\n';
    markdown += `**Prepared for:** FCA ${journeyData.recommendedLicence?.type || 'Payment Services'} Application\n\n`;
    markdown += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
    markdown += '---\n\n';

    sections.forEach((section) => {
      markdown += `## ${section.title}\n\n`;
      if (section.subsections) {
        section.subsections.forEach((sub) => {
          markdown += `### ${sub.title}\n\n`;
          markdown += sub.content || '_Content pending_\n\n';
        });
      } else {
        markdown += section.content || '_Content pending_\n\n';
      }
      markdown += '\n';
    });

    // Download as markdown file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'business-plan.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-photon-white">Business Plan Generator</h2>
          <p className="text-mist-gray mt-1">
            Create a comprehensive business plan for your FCA application
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-pellucid-cyan transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-mist-gray">{progress}%</span>
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-mist-gray hover:text-photon-white transition-colors"
          >
            {viewMode === 'edit' ? <Eye size={16} /> : <Edit3 size={16} />}
            {viewMode === 'edit' ? 'Preview' : 'Edit'}
          </button>
          <button
            onClick={exportBusinessPlan}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-mist-gray hover:text-photon-white transition-colors"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={saveProgress}
            className="px-4 py-1.5 bg-pellucid-cyan hover:bg-pellucid-cyan/80 text-void-black font-medium rounded-lg transition-colors"
          >
            Save Progress
          </button>
        </div>
      </div>

      {viewMode === 'preview' ? (
        <BusinessPlanPreview sections={sections} journeyData={journeyData} />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sections Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-sm font-medium text-photon-white mb-3">Sections</h3>
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const isExpanded = expandedSections.has(section.id);

              return (
                <div key={section.id}>
                  <button
                    onClick={() => {
                      setActiveSection(section.id);
                      toggleSection(section.id);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-pellucid-cyan/20 border border-pellucid-cyan/30'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={isActive ? 'text-pellucid-cyan' : 'text-mist-gray'}
                      />
                      <span
                        className={`text-sm ${isActive ? 'text-photon-white' : 'text-mist-gray'}`}
                      >
                        {section.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {section.isComplete ? (
                        <CheckCircle size={16} className="text-deep-teal" />
                      ) : (
                        <span
                          className={`w-2 h-2 rounded-full ${
                            section.regulatoryRelevance === 'high'
                              ? 'bg-apex-amber'
                              : 'bg-mist-gray/50'
                          }`}
                        />
                      )}
                      {section.subsections && (
                        isExpanded ? (
                          <ChevronDown size={16} className="text-mist-gray" />
                        ) : (
                          <ChevronRight size={16} className="text-mist-gray" />
                        )
                      )}
                    </div>
                  </button>

                  {/* Subsections */}
                  {isExpanded && section.subsections && (
                    <div className="ml-6 mt-1 space-y-1">
                      {section.subsections.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setActiveSection(section.id)}
                          className="w-full flex items-center justify-between p-2 rounded text-left text-sm text-mist-gray hover:text-photon-white hover:bg-white/5 transition-colors"
                        >
                          <span>{sub.title}</span>
                          {sub.isComplete && (
                            <CheckCircle size={14} className="text-deep-teal" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Section Editor */}
          <div className="lg:col-span-2">
            {currentSection && (
              <SectionEditor
                section={currentSection}
                onUpdateContent={updateSectionContent}
                onGenerateContent={generateSectionContent}
                isGenerating={isGenerating}
                journeyData={journeyData}
              />
            )}
          </div>
        </div>
      )}

      {/* FCA Requirements Reminder */}
      <div className="bg-apex-amber/10 border border-apex-amber/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="text-apex-amber flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-apex-amber mb-1">
              FCA Business Plan Requirements
            </h4>
            <p className="text-sm text-mist-gray">
              The FCA requires a comprehensive business plan demonstrating the viability of your
              payment services business. Sections marked with an amber indicator are particularly
              important for your application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate contextual content
function generateContextualContent(
  sectionId: string,
  subsectionId: string | undefined,
  licenceType: string,
  journeyData: Record<string, unknown>
): string {
  // This would typically call an AI service - for now, return template content
  const templates: Record<string, Record<string, string>> = {
    executive_summary: {
      company_overview: `[Company Name] is a UK-based fintech company seeking authorisation as a ${licenceType} under the Payment Services Regulations 2017.

Our company was established to address the growing demand for innovative payment solutions in the UK market. We aim to provide secure, efficient, and user-friendly payment services to our target customers.

Key highlights:
- Experienced management team with backgrounds in financial services and technology
- Robust technology infrastructure designed for scalability and security
- Clear path to profitability with conservative financial projections
- Strong focus on regulatory compliance and consumer protection`,
      mission_vision: `**Mission Statement**
To provide accessible, secure, and innovative payment solutions that empower businesses and consumers to transact with confidence.

**Vision**
To become a trusted leader in the UK payment services market, known for our commitment to customer service, regulatory excellence, and technological innovation.

**Core Values**
- **Integrity**: We operate with transparency and honesty in all our dealings
- **Security**: We prioritise the protection of customer funds and data
- **Innovation**: We continuously improve our services to meet evolving market needs
- **Compliance**: We maintain the highest standards of regulatory compliance`,
      key_objectives: `**Year 1 Objectives**
- Obtain FCA authorisation as a ${licenceType}
- Launch core payment services to initial customer segment
- Establish key banking and technology partnerships
- Achieve operational break-even by month 12

**Year 2-3 Objectives**
- Expand service offering to additional customer segments
- Scale operations to handle increased transaction volumes
- Develop additional revenue streams
- Build brand recognition in target market

**Key Performance Indicators**
- Customer acquisition and retention rates
- Transaction volume and value growth
- Regulatory compliance metrics
- Customer satisfaction scores`,
    },
    business_model: {
      service_offering: `**Payment Services to be Provided**

Under our ${licenceType} authorisation, we will provide the following payment services as defined in Schedule 1 of the Payment Services Regulations 2017:

${licenceType === 'EMI' || licenceType === 'SEMI' ? `
**E-money Services**
- Issuance of electronic money
- E-money account services
- Electronic money transfers
` : ''}

**Payment Services**
- Execution of payment transactions
- Payment account services
- Money remittance services (if applicable)

**Service Delivery**
Our services will be delivered through:
- Mobile application (iOS and Android)
- Web-based platform
- API integrations for business customers`,
      revenue_streams: `**Primary Revenue Streams**

1. **Transaction Fees**
   - Percentage-based fees on payment transactions
   - Fixed fees for specific transaction types
   - Tiered pricing based on volume

2. **Account Fees**
   - Monthly/annual account maintenance fees
   - Premium account tier subscriptions
   - Business account packages

3. **Foreign Exchange**
   - FX margin on currency conversions
   - Competitive rates for high-volume customers

4. **Value-Added Services**
   - Premium features and integrations
   - Analytics and reporting tools
   - API access for business customers`,
      pricing_strategy: `**Pricing Strategy**

Our pricing strategy is designed to be competitive while ensuring sustainable profitability:

**Consumer Pricing**
- Free basic accounts with standard features
- Premium accounts at £X/month with enhanced features
- Transparent transaction fees with no hidden charges

**Business Pricing**
- Tiered pricing based on transaction volume
- Custom pricing for high-volume merchants
- Integration and setup fees where applicable

**Competitive Positioning**
We have analysed competitor pricing and positioned ourselves to offer:
- Lower fees than traditional banks
- Competitive rates with other fintechs
- Better value through superior service and features`,
      partnerships: `**Key Strategic Partnerships**

1. **Banking Partner**
   - [Bank Name] - Safeguarding accounts and banking services
   - Established relationship for operational banking needs

2. **Technology Partners**
   - [Payment Processor] - Core payment processing infrastructure
   - [Cloud Provider] - Secure hosting and infrastructure
   - [KYC Provider] - Identity verification and AML screening

3. **Distribution Partners**
   - Strategic partnerships for customer acquisition
   - White-label opportunities with established brands

4. **Professional Services**
   - [Law Firm] - Regulatory and legal advice
   - [Accountancy Firm] - Audit and financial services
   - [Compliance Consultant] - Ongoing regulatory support`,
    },
    // Additional sections would follow the same pattern...
  };

  const sectionTemplates = templates[sectionId];
  if (sectionTemplates && subsectionId && sectionTemplates[subsectionId]) {
    return sectionTemplates[subsectionId];
  }

  return `This section requires content about ${sectionId.replace('_', ' ')}${subsectionId ? ` - specifically ${subsectionId.replace('_', ' ')}` : ''}.

Please add detailed information relevant to your FCA ${licenceType} application.`;
}

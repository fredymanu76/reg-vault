// REG-VAULT Business Plan Preview
// Full preview of the business plan document

import { BusinessPlanSection } from './BusinessPlanGenerator';
import {
  FileText,
  Calendar,
  Building,
  CheckCircle,
  AlertCircle,
  Printer,
} from 'lucide-react';

interface BusinessPlanPreviewProps {
  sections: BusinessPlanSection[];
  journeyData: Record<string, unknown>;
}

export function BusinessPlanPreview({ sections, journeyData }: BusinessPlanPreviewProps) {
  const completedSections = sections.filter((s) => s.isComplete).length;
  const totalSections = sections.length;

  // Parse markdown-like content to HTML
  const parseContent = (content: string): string => {
    if (!content) return '<p class="text-mist-gray italic">Content pending...</p>';

    let html = content
      // Headers
      .replace(/^### (.+)$/gm, '<h4 class="text-lg font-medium text-photon-white mt-4 mb-2">$1</h4>')
      .replace(/^## (.+)$/gm, '<h3 class="text-xl font-semibold text-photon-white mt-6 mb-3">$1</h3>')
      .replace(/^# (.+)$/gm, '<h2 class="text-2xl font-bold text-photon-white mt-8 mb-4">$1</h2>')
      // Bold and italic
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-photon-white">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$2</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="text-mist-gray mb-3">')
      // Line breaks
      .replace(/\n/g, '<br />');

    // Wrap in paragraph if not already structured
    if (!html.startsWith('<')) {
      html = `<p class="text-mist-gray mb-3">${html}</p>`;
    }

    return html;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white/5 rounded-lg border border-white/10">
      {/* Document Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-pellucid-cyan/10 to-transparent">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-pellucid-cyan/20 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-pellucid-cyan" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-photon-white">Business Plan</h1>
                <p className="text-mist-gray">
                  FCA {(journeyData.recommendedLicence as { type?: string })?.type || 'Payment Services'} Application
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-mist-gray hover:text-photon-white transition-colors print:hidden"
          >
            <Printer size={16} />
            Print
          </button>
        </div>

        <div className="flex items-center gap-6 mt-4 text-sm text-mist-gray">
          <div className="flex items-center gap-2">
            <Building size={14} />
            <span>{(journeyData.companyName as string) || '[Company Name]'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            {completedSections === totalSections ? (
              <CheckCircle size={14} className="text-deep-teal" />
            ) : (
              <AlertCircle size={14} className="text-apex-amber" />
            )}
            <span>
              {completedSections}/{totalSections} sections complete
            </span>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="p-6 border-b border-white/10 print:break-after-page">
        <h2 className="text-xl font-bold text-photon-white mb-4">Table of Contents</h2>
        <nav className="space-y-2">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="flex items-center gap-3">
                <span className="text-mist-gray w-6">{index + 1}.</span>
                <Icon size={16} className="text-mist-gray" />
                <a
                  href={`#section-${section.id}`}
                  className="text-photon-white hover:text-pellucid-cyan transition-colors"
                >
                  {section.title}
                </a>
                <span className="flex-1 border-b border-dotted border-white/20" />
                {section.isComplete ? (
                  <CheckCircle size={14} className="text-deep-teal" />
                ) : (
                  <span className="text-xs text-mist-gray">Draft</span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="p-6 space-y-8">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <section
              key={section.id}
              id={`section-${section.id}`}
              className="print:break-before-page"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                <div className="w-8 h-8 bg-pellucid-cyan/20 rounded flex items-center justify-center">
                  <Icon size={18} className="text-pellucid-cyan" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-photon-white">
                    {index + 1}. {section.title}
                  </h2>
                  {section.regulatoryRelevance === 'high' && (
                    <span className="text-xs text-apex-amber">FCA Priority Section</span>
                  )}
                </div>
              </div>

              {/* Section Content */}
              {section.subsections ? (
                <div className="space-y-6">
                  {section.subsections.map((sub, subIndex) => (
                    <div key={sub.id}>
                      <h3 className="text-lg font-semibold text-photon-white mb-3">
                        {index + 1}.{subIndex + 1} {sub.title}
                      </h3>
                      <div
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: parseContent(sub.content) }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: parseContent(section.content) }}
                />
              )}

              {/* FCA Requirements Checklist */}
              {!section.isComplete && section.fcaRequirements.length > 0 && (
                <div className="mt-6 p-4 bg-apex-amber/10 border border-apex-amber/20 rounded-lg print:hidden">
                  <h4 className="text-sm font-medium text-apex-amber mb-2">
                    Pending FCA Requirements
                  </h4>
                  <ul className="space-y-1">
                    {section.fcaRequirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-mist-gray">
                        <AlertCircle size={14} className="text-apex-amber flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Document Footer */}
      <div className="p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-between text-sm text-mist-gray">
          <div>
            <p>Prepared using REG-VAULT Business Plan Generator</p>
            <p className="text-xs">
              This document is intended to support an FCA authorisation application.
            </p>
          </div>
          <div className="text-right">
            <p>Generated: {new Date().toLocaleDateString('en-GB')}</p>
            <p className="text-xs">
              Document ID: BP-{Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .prose {
            color: black !important;
          }
          .text-photon-white {
            color: black !important;
          }
          .text-mist-gray {
            color: #666 !important;
          }
          .text-pellucid-cyan {
            color: #0066cc !important;
          }
          .text-apex-amber {
            color: #cc6600 !important;
          }
          .text-deep-teal {
            color: #006666 !important;
          }
          .bg-white\\/5,
          .bg-white\\/10,
          .bg-pellucid-cyan\\/10,
          .bg-pellucid-cyan\\/20,
          .bg-apex-amber\\/10 {
            background: transparent !important;
          }
          .border-white\\/10,
          .border-white\\/20,
          .border-apex-amber\\/20 {
            border-color: #ccc !important;
          }
        }
      `}</style>
    </div>
  );
}

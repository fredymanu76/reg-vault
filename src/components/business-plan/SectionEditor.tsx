// REG-VAULT Section Editor
// Rich text editing for business plan sections

import { useState } from 'react';
import { BusinessPlanSection } from './BusinessPlanGenerator';
import {
  Sparkles,
  Info,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Heading1,
  Heading2,
} from 'lucide-react';

interface SectionEditorProps {
  section: BusinessPlanSection;
  onUpdateContent: (sectionId: string, content: string, subsectionId?: string) => void;
  onGenerateContent: (sectionId: string, subsectionId?: string) => Promise<void>;
  isGenerating: boolean;
  journeyData: Record<string, unknown>;
}

export function SectionEditor({
  section,
  onUpdateContent,
  onGenerateContent,
  isGenerating,
  journeyData,
}: SectionEditorProps) {
  const [activeSubsection, setActiveSubsection] = useState<string | null>(
    section.subsections?.[0]?.id || null
  );
  const [showRequirements, setShowRequirements] = useState(true);

  const Icon = section.icon;

  const handleTextFormat = (format: string) => {
    // Simple text formatting helper - in production, use a proper rich text editor
    const textarea = document.activeElement as HTMLTextAreaElement;
    if (!textarea || textarea.tagName !== 'TEXTAREA') return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText = selectedText;
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'bullet':
        formattedText = `- ${selectedText}`;
        break;
      case 'numbered':
        formattedText = `1. ${selectedText}`;
        break;
    }

    const newValue =
      textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);

    // Update the content
    if (activeSubsection) {
      onUpdateContent(section.id, newValue, activeSubsection);
    } else {
      onUpdateContent(section.id, newValue);
    }
  };

  const getCurrentContent = () => {
    if (section.subsections && activeSubsection) {
      return section.subsections.find((s) => s.id === activeSubsection)?.content || '';
    }
    return section.content;
  };

  const handleContentChange = (content: string) => {
    if (activeSubsection) {
      onUpdateContent(section.id, content, activeSubsection);
    } else {
      onUpdateContent(section.id, content);
    }
  };

  const getCompletionStatus = () => {
    if (section.subsections) {
      const completed = section.subsections.filter((s) => s.isComplete).length;
      return { completed, total: section.subsections.length };
    }
    return { completed: section.isComplete ? 1 : 0, total: 1 };
  };

  const status = getCompletionStatus();

  return (
    <div className="bg-white/5 rounded-lg border border-white/10">
      {/* Section Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                section.isComplete ? 'bg-deep-teal/20' : 'bg-pellucid-cyan/20'
              }`}
            >
              <Icon
                size={20}
                className={section.isComplete ? 'text-deep-teal' : 'text-pellucid-cyan'}
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-photon-white">{section.title}</h3>
              <p className="text-sm text-mist-gray">{section.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                section.regulatoryRelevance === 'high'
                  ? 'bg-apex-amber/20 text-apex-amber'
                  : section.regulatoryRelevance === 'medium'
                  ? 'bg-pellucid-cyan/20 text-pellucid-cyan'
                  : 'bg-white/10 text-mist-gray'
              }`}
            >
              {section.regulatoryRelevance === 'high' ? 'FCA Priority' : 'Supporting'}
            </span>
            <span className="text-sm text-mist-gray">
              {status.completed}/{status.total} complete
            </span>
          </div>
        </div>

        {/* FCA Requirements */}
        <div className="mt-4">
          <button
            onClick={() => setShowRequirements(!showRequirements)}
            className="flex items-center gap-2 text-sm text-mist-gray hover:text-photon-white transition-colors"
          >
            <Info size={14} />
            FCA Requirements
            {showRequirements ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showRequirements && (
            <ul className="mt-2 space-y-1 ml-5">
              {section.fcaRequirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-mist-gray">
                  <CheckCircle size={14} className="text-deep-teal flex-shrink-0 mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Subsection Tabs */}
      {section.subsections && (
        <div className="flex overflow-x-auto border-b border-white/10">
          {section.subsections.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSubsection(sub.id)}
              className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeSubsection === sub.id
                  ? 'border-pellucid-cyan text-pellucid-cyan'
                  : 'border-transparent text-mist-gray hover:text-photon-white'
              }`}
            >
              <span className="flex items-center gap-2">
                {sub.title}
                {sub.isComplete && <CheckCircle size={12} className="text-deep-teal" />}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Editor Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-white/5">
        <button
          onClick={() => handleTextFormat('bold')}
          className="p-1.5 rounded hover:bg-white/10 text-mist-gray hover:text-photon-white transition-colors"
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => handleTextFormat('italic')}
          className="p-1.5 rounded hover:bg-white/10 text-mist-gray hover:text-photon-white transition-colors"
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button
          onClick={() => handleTextFormat('h1')}
          className="p-1.5 rounded hover:bg-white/10 text-mist-gray hover:text-photon-white transition-colors"
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => handleTextFormat('h2')}
          className="p-1.5 rounded hover:bg-white/10 text-mist-gray hover:text-photon-white transition-colors"
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button
          onClick={() => handleTextFormat('bullet')}
          className="p-1.5 rounded hover:bg-white/10 text-mist-gray hover:text-photon-white transition-colors"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => handleTextFormat('numbered')}
          className="p-1.5 rounded hover:bg-white/10 text-mist-gray hover:text-photon-white transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => onGenerateContent(section.id, activeSubsection || undefined)}
          disabled={isGenerating}
          className="flex items-center gap-2 px-3 py-1.5 bg-pellucid-cyan/20 hover:bg-pellucid-cyan/30 text-pellucid-cyan rounded transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              AI Generate
            </>
          )}
        </button>
      </div>

      {/* Text Area */}
      <div className="p-4">
        <textarea
          value={getCurrentContent()}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={`Write your ${
            activeSubsection
              ? section.subsections?.find((s) => s.id === activeSubsection)?.title
              : section.title
          } content here...

Use markdown formatting:
- **bold** for emphasis
- *italic* for subtle emphasis
- # Heading 1, ## Heading 2 for sections
- - bullet points
- 1. numbered lists`}
          className="w-full h-80 bg-void-black/50 border border-white/10 rounded-lg p-4 text-photon-white placeholder-mist-gray/50 resize-none focus:outline-none focus:border-pellucid-cyan/50"
        />

        {/* Word Count & Suggestions */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-xs text-mist-gray">
            <span>
              {getCurrentContent().split(/\s+/).filter(Boolean).length} words
            </span>
            <span>Suggested length: {section.suggestedLength}</span>
          </div>
          {getCurrentContent().length < 100 && (
            <div className="flex items-center gap-2 text-xs text-apex-amber">
              <AlertCircle size={12} />
              Add more detail for a complete section
            </div>
          )}
        </div>
      </div>

      {/* Contextual Suggestions */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <h4 className="text-sm font-medium text-photon-white mb-3 flex items-center gap-2">
          <Sparkles size={14} className="text-pellucid-cyan" />
          AI Suggestions
        </h4>
        <div className="grid md:grid-cols-2 gap-3">
          <SuggestionCard
            title="Use Data from Journey"
            description="Pull in details from your intake questionnaire and licence recommendation"
            onClick={() => onGenerateContent(section.id, activeSubsection || undefined)}
          />
          <SuggestionCard
            title="Add Regulatory References"
            description="Include relevant FCA handbook references and regulatory citations"
            onClick={() => onGenerateContent(section.id, activeSubsection || undefined)}
          />
          <SuggestionCard
            title="Expand Current Content"
            description="Enhance existing content with more detail and professional language"
            onClick={() => onGenerateContent(section.id, activeSubsection || undefined)}
          />
          <SuggestionCard
            title="Review Compliance"
            description="Check content against FCA requirements and suggest improvements"
            onClick={() => onGenerateContent(section.id, activeSubsection || undefined)}
          />
        </div>
      </div>
    </div>
  );
}

interface SuggestionCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

function SuggestionCard({ title, description, onClick }: SuggestionCardProps) {
  return (
    <button
      onClick={onClick}
      className="text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-pellucid-cyan/30 transition-all"
    >
      <p className="text-sm font-medium text-photon-white">{title}</p>
      <p className="text-xs text-mist-gray mt-1">{description}</p>
    </button>
  );
}

// REG-VAULT Suggestion Chips
// Quick action chips for AI Assistant

import { Suggestion } from '@/types/journey';
import {
  HelpCircle,
  Wand2,
  FileCheck,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

interface SuggestionChipsProps {
  suggestions: Suggestion[];
  onSelect?: (action: string) => void;
  compact?: boolean;
}

export function SuggestionChips({
  suggestions,
  onSelect,
  compact = false,
}: SuggestionChipsProps) {
  const getIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'quick_action':
        return HelpCircle;
      case 'autofill':
        return Wand2;
      case 'guidance':
        return BookOpen;
      default:
        return ArrowRight;
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect?.(suggestion.action)}
            className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10
              text-mist-gray hover:text-photon-white hover:bg-white/10 hover:border-white/20
              transition-colors"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-mist-gray uppercase tracking-wider">
        Suggested Actions
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => {
          const Icon = getIcon(suggestion.type);
          return (
            <button
              key={suggestion.id}
              onClick={() => onSelect?.(suggestion.action)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm
                ${suggestion.type === 'autofill'
                  ? 'bg-pellucid-cyan/10 border border-pellucid-cyan/30 text-pellucid-cyan hover:bg-pellucid-cyan/20'
                  : 'bg-white/5 border border-white/10 text-mist-gray hover:text-photon-white hover:bg-white/10'
                }
              `}
            >
              <Icon size={14} />
              {suggestion.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Predefined suggestion sets for each stage
export const STAGE_SUGGESTIONS: Record<string, Suggestion[]> = {
  'licence-advisor': [
    { id: '1', type: 'quick_action', label: 'What licence do I need?', action: 'explain_licences' },
    { id: '2', type: 'guidance', label: 'Compare PI vs EMI', action: 'compare_licences' },
    { id: '3', type: 'quick_action', label: 'Capital requirements', action: 'explain_capital' },
  ],
  intake: [
    { id: '1', type: 'quick_action', label: 'Help with this question', action: 'help_question' },
    { id: '2', type: 'autofill', label: 'Auto-fill from Companies House', action: 'autofill_company' },
    { id: '3', type: 'guidance', label: 'FCA requirements', action: 'fca_requirements' },
  ],
  'fca-forms': [
    { id: '1', type: 'autofill', label: 'Auto-fill from intake', action: 'autofill_forms' },
    { id: '2', type: 'quick_action', label: 'Validate answers', action: 'validate_forms' },
    { id: '3', type: 'guidance', label: 'Form guidance', action: 'form_help' },
  ],
  'business-plan': [
    { id: '1', type: 'autofill', label: 'Generate this section', action: 'generate_section' },
    { id: '2', type: 'guidance', label: 'What to include', action: 'section_guidance' },
    { id: '3', type: 'quick_action', label: 'Check alignment', action: 'check_alignment' },
  ],
  'financial-projections': [
    { id: '1', type: 'quick_action', label: 'Suggest assumptions', action: 'suggest_assumptions' },
    { id: '2', type: 'guidance', label: 'Capital methods', action: 'explain_capital_methods' },
    { id: '3', type: 'quick_action', label: 'Check calculations', action: 'validate_calculations' },
  ],
  policies: [
    { id: '1', type: 'autofill', label: 'Generate policy', action: 'generate_policy' },
    { id: '2', type: 'quick_action', label: 'Customize', action: 'customize_policy' },
    { id: '3', type: 'guidance', label: 'Map to regulations', action: 'map_regulations' },
  ],
  diagrams: [
    { id: '1', type: 'autofill', label: 'Generate diagram', action: 'generate_diagram' },
    { id: '2', type: 'guidance', label: 'Required diagrams', action: 'diagram_requirements' },
    { id: '3', type: 'quick_action', label: 'Review diagram', action: 'review_diagram' },
  ],
  'bundle-review': [
    { id: '1', type: 'quick_action', label: 'Check completeness', action: 'check_bundle' },
    { id: '2', type: 'guidance', label: 'FCA checklist', action: 'fca_checklist' },
    { id: '3', type: 'quick_action', label: 'Cross-reference', action: 'cross_reference' },
  ],
  submission: [
    { id: '1', type: 'quick_action', label: 'Final validation', action: 'final_validation' },
    { id: '2', type: 'guidance', label: 'What happens next', action: 'next_steps' },
    { id: '3', type: 'autofill', label: 'Generate cover letter', action: 'generate_cover_letter' },
  ],
};

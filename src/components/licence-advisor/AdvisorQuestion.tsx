// REG-VAULT Advisor Question Component
// Renders individual questions with appropriate input types

import { useState } from 'react';
import { AdvisorQuestion as QuestionType } from '@/data/licence-advisor-questions';
import { QuestionAnswer } from '@/lib/services/licenceAdvisorService';
import { HelpCircle, Check, ExternalLink } from 'lucide-react';

interface AdvisorQuestionProps {
  question: QuestionType;
  value: QuestionAnswer | undefined;
  onChange: (value: QuestionAnswer) => void;
  questionNumber: number;
}

export function AdvisorQuestion({
  question,
  value,
  onChange,
  questionNumber,
}: AdvisorQuestionProps) {
  const [showHelp, setShowHelp] = useState(false);

  const renderInput = () => {
    switch (question.type) {
      case 'single':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => onChange(option.value)}
                className={`
                  w-full flex items-start gap-3 p-4 rounded-lg border transition-all text-left
                  ${value === option.value
                    ? 'border-pellucid-cyan bg-pellucid-cyan/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }
                `}
              >
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                    ${value === option.value
                      ? 'border-pellucid-cyan bg-pellucid-cyan'
                      : 'border-white/30'
                    }
                  `}
                >
                  {value === option.value && (
                    <div className="w-2 h-2 rounded-full bg-void-black" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      value === option.value ? 'text-pellucid-cyan' : 'text-photon-white'
                    }`}
                  >
                    {option.label}
                  </p>
                  {option.helpText && (
                    <p className="text-sm text-mist-gray mt-1">{option.helpText}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'multiple':
        const selectedValues = (value as string[]) || [];
        return (
          <div className="space-y-2">
            {question.options?.map((option) => {
              const isSelected = selectedValues.includes(option.value as string);
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    let newValues: string[];
                    if (option.value === 'none') {
                      // "None" option clears others
                      newValues = isSelected ? [] : ['none'];
                    } else {
                      // Regular option
                      if (isSelected) {
                        newValues = selectedValues.filter((v) => v !== option.value);
                      } else {
                        newValues = [...selectedValues.filter((v) => v !== 'none'), option.value as string];
                      }
                    }
                    onChange(newValues);
                  }}
                  className={`
                    w-full flex items-start gap-3 p-4 rounded-lg border transition-all text-left
                    ${isSelected
                      ? 'border-pellucid-cyan bg-pellucid-cyan/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }
                  `}
                >
                  <div
                    className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                      ${isSelected
                        ? 'border-pellucid-cyan bg-pellucid-cyan'
                        : 'border-white/30'
                      }
                    `}
                  >
                    {isSelected && <Check size={14} className="text-void-black" />}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        isSelected ? 'text-pellucid-cyan' : 'text-photon-white'
                      }`}
                    >
                      {option.label}
                    </p>
                    {option.helpText && (
                      <p className="text-sm text-mist-gray mt-1">{option.helpText}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        );

      case 'boolean':
        return (
          <div className="flex gap-4">
            {question.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => onChange(option.value)}
                className={`
                  flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-all
                  ${value === option.value
                    ? 'border-pellucid-cyan bg-pellucid-cyan/10 text-pellucid-cyan'
                    : 'border-white/10 bg-white/5 text-photon-white hover:bg-white/10 hover:border-white/20'
                  }
                `}
              >
                {value === option.value && <Check size={18} />}
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={(value as number) || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            min={question.validation?.min}
            max={question.validation?.max}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-photon-white
              placeholder-mist-gray focus:outline-none focus:ring-2 focus:ring-pellucid-cyan/50 focus:border-pellucid-cyan"
            placeholder="Enter a number..."
          />
        );

      case 'text':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-photon-white
              placeholder-mist-gray focus:outline-none focus:ring-2 focus:ring-pellucid-cyan/50 focus:border-pellucid-cyan resize-none"
            placeholder="Enter your answer..."
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Question Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium text-mist-gray">
            {questionNumber}
          </span>
          <div>
            <h4 className="text-photon-white font-medium">{question.question}</h4>
            {value !== undefined && value !== null && (
              <p className="text-sm text-deep-teal mt-1 flex items-center gap-1">
                <Check size={14} />
                Answered
              </p>
            )}
          </div>
        </div>
        {(question.helpText || question.regulatoryReference) && (
          <button
            onClick={() => setShowHelp(!showHelp)}
            className={`p-2 rounded-lg transition-colors ${
              showHelp
                ? 'bg-pellucid-cyan/20 text-pellucid-cyan'
                : 'text-mist-gray hover:text-photon-white hover:bg-white/5'
            }`}
          >
            <HelpCircle size={18} />
          </button>
        )}
      </div>

      {/* Help Text */}
      {showHelp && (question.helpText || question.regulatoryReference) && (
        <div className="bg-pellucid-cyan/10 border border-pellucid-cyan/20 rounded-lg p-4 ml-10">
          {question.helpText && (
            <p className="text-sm text-mist-gray mb-2">{question.helpText}</p>
          )}
          {question.regulatoryReference && (
            <p className="text-xs text-pellucid-cyan flex items-center gap-1">
              <ExternalLink size={12} />
              {question.regulatoryReference}
            </p>
          )}
        </div>
      )}

      {/* Input */}
      <div className="ml-10">{renderInput()}</div>
    </div>
  );
}

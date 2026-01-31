// REG-VAULT Licence Advisor
// Interactive questionnaire to determine the right FCA licence type

import { useState, useMemo } from 'react';
import { AdvisorQuestion } from './AdvisorQuestion';
import { LicenceRecommendation } from './LicenceRecommendation';
import { LicenceComparison } from './LicenceComparison';
import {
  LICENCE_ADVISOR_QUESTIONS,
  QUESTION_CATEGORIES,
} from '@/data/licence-advisor-questions';
import {
  generateRecommendation,
  calculateProgress,
  AdvisorAnswers,
  QuestionAnswer,
} from '@/lib/services/licenceAdvisorService';
import { LicenceRecommendation as LicenceRecommendationType } from '@/types/journey';
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
} from 'lucide-react';

interface LicenceAdvisorProps {
  onComplete: (recommendation: LicenceRecommendationType) => void;
  initialAnswers?: AdvisorAnswers;
}

export function LicenceAdvisor({ onComplete, initialAnswers = {} }: LicenceAdvisorProps) {
  const [answers, setAnswers] = useState<AdvisorAnswers>(initialAnswers);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Get questions for current category
  const currentCategory = QUESTION_CATEGORIES[currentCategoryIndex];
  const categoryQuestions = LICENCE_ADVISOR_QUESTIONS.filter(
    (q) => q.category === currentCategory.id
  );

  // Calculate progress
  const progress = useMemo(() => calculateProgress(answers), [answers]);

  // Check if current category is complete
  const isCategoryComplete = categoryQuestions.every(
    (q) => answers[q.id] !== undefined && answers[q.id] !== null
  );

  // Check if all questions answered
  const isComplete = LICENCE_ADVISOR_QUESTIONS.every(
    (q) => answers[q.id] !== undefined && answers[q.id] !== null
  );

  // Generate recommendation when showing results
  const recommendation = useMemo(() => {
    if (showResults && Object.keys(answers).length > 0) {
      return generateRecommendation(answers);
    }
    return null;
  }, [showResults, answers]);

  const handleAnswer = (questionId: string, value: QuestionAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentCategoryIndex < QUESTION_CATEGORIES.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
    } else if (isComplete) {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
    }
  };

  const handleCategoryClick = (index: number) => {
    setShowResults(false);
    setCurrentCategoryIndex(index);
  };

  const handleConfirmRecommendation = () => {
    if (recommendation) {
      onComplete(recommendation);
    }
  };

  const handleViewResults = () => {
    setShowResults(true);
  };

  // Show results view
  if (showResults && recommendation) {
    if (showComparison) {
      return (
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setShowComparison(false)}
            className="flex items-center gap-2 text-mist-gray hover:text-photon-white mb-6 transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Recommendation
          </button>
          <LicenceComparison
            recommendation={recommendation}
            onSelect={(licence) => {
              // Allow user to override recommendation
              const overriddenRecommendation = {
                ...recommendation,
                recommended: licence,
              };
              onComplete(overriddenRecommendation);
            }}
          />
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handlePrevious}
          className="flex items-center gap-2 text-mist-gray hover:text-photon-white mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Review Answers
        </button>
        <LicenceRecommendation
          recommendation={recommendation}
          onConfirm={handleConfirmRecommendation}
          onCompare={() => setShowComparison(true)}
          onEditAnswers={() => setShowResults(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-photon-white mb-2">
          Licence Type Advisor
        </h2>
        <p className="text-mist-gray">
          Answer these questions to determine the most suitable FCA licence for your business.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-mist-gray">Progress</span>
          <span className="text-sm font-medium text-photon-white">{progress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-pellucid-cyan transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress >= 50 && !isComplete && (
          <button
            onClick={handleViewResults}
            className="mt-3 flex items-center gap-2 text-sm text-pellucid-cyan hover:text-pellucid-cyan/80 transition-colors"
          >
            <Sparkles size={16} />
            View preliminary recommendation
          </button>
        )}
      </div>

      {/* Category Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {QUESTION_CATEGORIES.map((category, index) => {
          const categoryQs = LICENCE_ADVISOR_QUESTIONS.filter(
            (q) => q.category === category.id
          );
          const answered = categoryQs.filter(
            (q) => answers[q.id] !== undefined
          ).length;
          const total = categoryQs.length;
          const isCurrentCategory = index === currentCategoryIndex;
          const isCategoryDone = answered === total;

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(index)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all
                ${isCurrentCategory ? 'bg-pellucid-cyan/20 text-pellucid-cyan' : ''}
                ${isCategoryDone && !isCurrentCategory ? 'bg-deep-teal/20 text-deep-teal' : ''}
                ${!isCategoryDone && !isCurrentCategory ? 'bg-white/5 text-mist-gray hover:bg-white/10' : ''}
              `}
            >
              {isCategoryDone ? (
                <CheckCircle size={16} />
              ) : (
                <span className="text-xs">{answered}/{total}</span>
              )}
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Current Category */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-photon-white mb-1">
              {currentCategory.label}
            </h3>
            <p className="text-sm text-mist-gray">{currentCategory.description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-mist-gray">
            <Info size={16} />
            {categoryQuestions.filter((q) => answers[q.id] !== undefined).length} / {categoryQuestions.length}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {categoryQuestions.map((question, index) => (
            <AdvisorQuestion
              key={question.id}
              question={question}
              value={answers[question.id]}
              onChange={(value) => handleAnswer(question.id, value)}
              questionNumber={
                LICENCE_ADVISOR_QUESTIONS.findIndex((q) => q.id === question.id) + 1
              }
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentCategoryIndex === 0}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
            ${currentCategoryIndex === 0
              ? 'text-white/30 cursor-not-allowed'
              : 'text-mist-gray hover:text-photon-white hover:bg-white/5'
            }
          `}
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <div className="flex items-center gap-3">
          {isComplete && (
            <button
              onClick={handleViewResults}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-photon-white hover:bg-white/20 transition-colors"
            >
              <BarChart3 size={18} />
              View Results
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!isCategoryComplete && currentCategoryIndex < QUESTION_CATEGORIES.length - 1}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors
              ${isCategoryComplete || currentCategoryIndex === QUESTION_CATEGORIES.length - 1
                ? 'bg-pellucid-cyan text-void-black hover:bg-pellucid-cyan/90'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
              }
            `}
          >
            {currentCategoryIndex === QUESTION_CATEGORIES.length - 1
              ? isComplete
                ? 'See Recommendation'
                : 'Complete Questions'
              : 'Next'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Incomplete Warning */}
      {!isCategoryComplete && (
        <div className="mt-4 flex items-start gap-2 text-sm text-apex-amber">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>
            Please answer all questions in this section before continuing.
          </span>
        </div>
      )}
    </div>
  );
}

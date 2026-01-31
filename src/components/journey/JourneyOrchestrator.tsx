// REG-VAULT Journey Orchestrator
// Main container that wraps the entire journey experience

import { useEffect, useState } from 'react';
import { JourneyMap } from './JourneyMap';
import { JourneyStageCard } from './JourneyStageCard';
import { JourneyNavigation } from './JourneyNavigation';
import { useJourneyStore } from '@/lib/stores/journeyStore';
import {
  JourneyStage,
  JOURNEY_STAGES,
} from '@/types/journey';
import { AIAssistant } from '@/components/ai-assistant/AIAssistant';
import { LicenceAdvisor } from '@/components/licence-advisor/LicenceAdvisor';
import { FinancialProjectionsModule } from '@/components/financial-projections/FinancialProjectionsModule';
import { BusinessPlanGenerator } from '@/components/business-plan/BusinessPlanGenerator';
import { SmartBundleGenerator } from '@/components/smart-bundle/SmartBundleGenerator';
import {
  ArrowLeft,
  Save,
  Download,
  Upload,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

interface JourneyOrchestratorProps {
  onExit?: () => void;
}

export function JourneyOrchestrator({ onExit }: JourneyOrchestratorProps) {
  const journeyStore = useJourneyStore();
  const journeyState = journeyStore.getJourneyState();
  const journeyData = journeyStore.getJourneyData();
  const aiState = journeyStore.getAIState();

  const [showOverview, setShowOverview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    journeyStore.loadFromLocalStorage();
  }, []);

  // Auto-save periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      journeyStore.saveToLocalStorage();
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [journeyStore]);

  const handleSave = async () => {
    setIsSaving(true);
    journeyStore.saveToLocalStorage();
    await new Promise((resolve) => setTimeout(resolve, 500)); // Brief visual feedback
    setIsSaving(false);
  };

  const handleExport = () => {
    const data = journeyStore.exportJourney();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `regvault-journey-${journeyState.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (journeyStore.importJourney(content)) {
            setShowOverview(false);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset? All progress will be lost.')) {
      journeyStore.resetJourney();
      journeyStore.clearLocalStorage();
    }
  };

  const handleStageSelect = (stage: JourneyStage) => {
    const stageProgress = journeyStore.getStageProgress(stage);
    if (stageProgress.status !== 'locked') {
      journeyStore.setCurrentStage(stage);
      setShowOverview(false);
    }
  };

  const handleStageComplete = () => {
    journeyStore.completeStage(journeyState.currentStage);

    // Move to next available stage
    const stagesOrder = Object.values(JourneyStage);
    const currentIndex = stagesOrder.indexOf(journeyState.currentStage);

    for (let i = currentIndex + 1; i < stagesOrder.length; i++) {
      const nextStage = stagesOrder[i];
      const nextProgress = journeyStore.getStageProgress(nextStage);
      if (nextProgress.status === 'available' || nextProgress.status === 'in_progress') {
        journeyStore.setCurrentStage(nextStage);
        break;
      }
    }
  };

  const renderCurrentStage = () => {
    switch (journeyState.currentStage) {
      case JourneyStage.LICENCE_ADVISOR:
        return (
          <LicenceAdvisor
            onComplete={(recommendation) => {
              journeyStore.setLicenceRecommendation(recommendation);
              handleStageComplete();
            }}
          />
        );

      case JourneyStage.INTAKE:
        return (
          <IntakePlaceholder
            onComplete={handleStageComplete}
            journeyData={journeyData}
          />
        );

      case JourneyStage.FCA_FORMS:
        return (
          <FCAFormsPlaceholder
            onComplete={handleStageComplete}
            journeyData={journeyData}
          />
        );

      case JourneyStage.BUSINESS_PLAN:
        return (
          <div>
            <BusinessPlanGenerator />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleStageComplete}
                className="px-6 py-3 bg-pellucid-cyan text-void-black font-medium rounded-lg hover:bg-pellucid-cyan/90 transition-colors"
              >
                Complete & Continue
              </button>
            </div>
          </div>
        );

      case JourneyStage.FINANCIAL_PROJECTIONS:
        return (
          <div>
            <FinancialProjectionsModule />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleStageComplete}
                className="px-6 py-3 bg-pellucid-cyan text-void-black font-medium rounded-lg hover:bg-pellucid-cyan/90 transition-colors"
              >
                Complete & Continue
              </button>
            </div>
          </div>
        );

      case JourneyStage.POLICIES:
        return (
          <PoliciesPlaceholder
            onComplete={handleStageComplete}
            licenceType={journeyData.licenceType}
          />
        );

      case JourneyStage.DIAGRAMS:
        return (
          <DiagramsPlaceholder
            onComplete={handleStageComplete}
          />
        );

      case JourneyStage.BUNDLE_REVIEW:
        return (
          <div>
            <SmartBundleGenerator />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleStageComplete}
                className="px-6 py-3 bg-pellucid-cyan text-void-black font-medium rounded-lg hover:bg-pellucid-cyan/90 transition-colors"
              >
                Complete & Continue to Submission
              </button>
            </div>
          </div>
        );

      case JourneyStage.SUBMISSION:
        return (
          <SubmissionPlaceholder
            onComplete={handleStageComplete}
          />
        );

      default:
        return <div>Unknown stage</div>;
    }
  };

  const overallProgress = journeyStore.getOverallProgress();
  const currentStageInfo = JOURNEY_STAGES[journeyState.currentStage];

  return (
    <div className="min-h-screen bg-void-black">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-void-black/95 backdrop-blur border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Back & Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={onExit}
                className="p-2 rounded-lg text-mist-gray hover:text-photon-white hover:bg-white/5 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-photon-white">
                  {journeyState.applicationName}
                </h1>
                <p className="text-sm text-mist-gray">
                  {overallProgress}% complete
                </p>
              </div>
            </div>

            {/* Center - Journey Map Toggle */}
            <button
              onClick={() => setShowOverview(!showOverview)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-photon-white transition-colors"
            >
              {showOverview ? (
                <>
                  <ChevronLeft size={16} />
                  Continue Working
                </>
              ) : (
                <>
                  View Journey Map
                  <ChevronRight size={16} />
                </>
              )}
            </button>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-2 rounded-lg text-mist-gray hover:text-photon-white hover:bg-white/5 transition-colors disabled:opacity-50"
                title="Save Progress"
              >
                <Save size={20} className={isSaving ? 'animate-pulse' : ''} />
              </button>
              <button
                onClick={handleExport}
                className="p-2 rounded-lg text-mist-gray hover:text-photon-white hover:bg-white/5 transition-colors"
                title="Export Journey"
              >
                <Download size={20} />
              </button>
              <button
                onClick={handleImport}
                className="p-2 rounded-lg text-mist-gray hover:text-photon-white hover:bg-white/5 transition-colors"
                title="Import Journey"
              >
                <Upload size={20} />
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg text-mist-gray hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Reset Journey"
              >
                <RotateCcw size={20} />
              </button>
              <button
                onClick={() => journeyStore.toggleAIAssistant()}
                className={`p-2 rounded-lg transition-colors ${
                  aiState.isOpen
                    ? 'bg-pellucid-cyan/20 text-pellucid-cyan'
                    : 'text-mist-gray hover:text-photon-white hover:bg-white/5'
                }`}
                title="AI Assistant"
              >
                <Sparkles size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-pellucid-cyan transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex">
        {/* Journey Map Sidebar (Overview Mode) */}
        {showOverview && (
          <div className="w-80 border-r border-white/10 bg-deep-space/50 p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
            <h2 className="text-lg font-semibold text-photon-white mb-6">
              Journey Overview
            </h2>
            <div className="space-y-4">
              {Object.values(JourneyStage).map((stage) => (
                <JourneyStageCard
                  key={stage}
                  stage={stage}
                  progress={journeyStore.getStageProgress(stage)}
                  isActive={stage === journeyState.currentStage}
                  onClick={() => handleStageSelect(stage)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Stage Content */}
        <div className={`flex-1 ${aiState.isOpen ? 'mr-96' : ''} transition-all duration-300`}>
          {/* Stage Header */}
          <div className="px-6 py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pellucid-cyan/20 flex items-center justify-center text-pellucid-cyan">
                  <span className="font-bold">{currentStageInfo.order}</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-photon-white">
                    {currentStageInfo.name}
                  </h2>
                  <p className="text-sm text-mist-gray">
                    {currentStageInfo.description}
                  </p>
                </div>
              </div>
              <JourneyNavigation
                currentStage={journeyState.currentStage}
                onNavigate={handleStageSelect}
              />
            </div>
          </div>

          {/* Inline Journey Map */}
          {!showOverview && (
            <div className="px-6 py-4 border-b border-white/10 bg-deep-space/30">
              <JourneyMap
                currentStage={journeyState.currentStage}
                stages={journeyState.stages}
                onStageClick={handleStageSelect}
              />
            </div>
          )}

          {/* Stage Content */}
          <div className="p-6">
            {renderCurrentStage()}
          </div>
        </div>

        {/* AI Assistant Panel */}
        <AIAssistant />
      </div>
    </div>
  );
}

// Placeholder components for stages not yet implemented
function IntakePlaceholder({ onComplete, journeyData }: { onComplete: () => void; journeyData: unknown }) {
  return (
    <div className="glass-card p-8 text-center">
      <h3 className="text-xl font-semibold text-photon-white mb-4">
        Intake Questionnaire
      </h3>
      <p className="text-mist-gray mb-6">
        This module will integrate with the existing intake questionnaire functionality.
      </p>
      <button
        onClick={onComplete}
        className="px-6 py-3 bg-pellucid-cyan text-void-black font-medium rounded-lg hover:bg-pellucid-cyan/90 transition-colors"
      >
        Mark as Complete (Demo)
      </button>
    </div>
  );
}

function FCAFormsPlaceholder({ onComplete, journeyData }: { onComplete: () => void; journeyData: unknown }) {
  return (
    <div className="glass-card p-8 text-center">
      <h3 className="text-xl font-semibold text-photon-white mb-4">
        FCA Application Forms
      </h3>
      <p className="text-mist-gray mb-6">
        This module will integrate with the existing FCA forms functionality.
      </p>
      <button
        onClick={onComplete}
        className="px-6 py-3 bg-pellucid-cyan text-void-black font-medium rounded-lg hover:bg-pellucid-cyan/90 transition-colors"
      >
        Mark as Complete (Demo)
      </button>
    </div>
  );
}

function PoliciesPlaceholder({ onComplete, licenceType }: { onComplete: () => void; licenceType?: string }) {
  return (
    <div className="glass-card p-8 text-center">
      <h3 className="text-xl font-semibold text-photon-white mb-4">
        Policies & Procedures
      </h3>
      <p className="text-mist-gray mb-6">
        Generate compliance policies tailored to your {licenceType || 'licence'} type.
      </p>
      <button
        onClick={onComplete}
        className="px-6 py-3 bg-pellucid-cyan text-void-black font-medium rounded-lg hover:bg-pellucid-cyan/90 transition-colors"
      >
        Mark as Complete (Demo)
      </button>
    </div>
  );
}

function DiagramsPlaceholder({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="glass-card p-8 text-center">
      <h3 className="text-xl font-semibold text-photon-white mb-4">
        System Diagrams
      </h3>
      <p className="text-mist-gray mb-6">
        This module will integrate with the existing diagrams functionality.
      </p>
      <button
        onClick={onComplete}
        className="px-6 py-3 bg-pellucid-cyan text-void-black font-medium rounded-lg hover:bg-pellucid-cyan/90 transition-colors"
      >
        Mark as Complete (Demo)
      </button>
    </div>
  );
}

function SubmissionPlaceholder({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="glass-card p-8 text-center">
      <h3 className="text-xl font-semibold text-photon-white mb-4">
        Application Submission
      </h3>
      <p className="text-mist-gray mb-6">
        Review your complete application bundle and submit to the FCA.
      </p>
      <button
        onClick={onComplete}
        className="px-6 py-3 bg-pellucid-cyan text-void-black font-medium rounded-lg hover:bg-pellucid-cyan/90 transition-colors"
      >
        Submit Application
      </button>
    </div>
  );
}

// REG-VAULT Journey Navigation
// Navigation helpers for moving between stages

import { useJourneyStore } from '@/lib/stores/journeyStore';
import { JourneyStage, JOURNEY_STAGES } from '@/types/journey';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface JourneyNavigationProps {
  currentStage: JourneyStage;
  onNavigate: (stage: JourneyStage) => void;
}

export function JourneyNavigation({ currentStage, onNavigate }: JourneyNavigationProps) {
  const journeyStore = useJourneyStore();
  const stagesArray = Object.values(JourneyStage);
  const currentIndex = stagesArray.indexOf(currentStage);

  // Find previous available stage
  const findPreviousStage = (): JourneyStage | null => {
    for (let i = currentIndex - 1; i >= 0; i--) {
      const stage = stagesArray[i];
      const progress = journeyStore.getStageProgress(stage);
      if (progress.status !== 'locked') {
        return stage;
      }
    }
    return null;
  };

  // Find next available stage
  const findNextStage = (): JourneyStage | null => {
    for (let i = currentIndex + 1; i < stagesArray.length; i++) {
      const stage = stagesArray[i];
      const progress = journeyStore.getStageProgress(stage);
      if (progress.status !== 'locked') {
        return stage;
      }
    }
    return null;
  };

  const previousStage = findPreviousStage();
  const nextStage = findNextStage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => previousStage && onNavigate(previousStage)}
        disabled={!previousStage}
        className={`
          flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors
          ${
            previousStage
              ? 'text-mist-gray hover:text-photon-white hover:bg-white/5'
              : 'text-white/20 cursor-not-allowed'
          }
        `}
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">
          {previousStage ? JOURNEY_STAGES[previousStage].name : 'Previous'}
        </span>
      </button>

      <div className="w-px h-6 bg-white/10" />

      <button
        onClick={() => nextStage && onNavigate(nextStage)}
        disabled={!nextStage}
        className={`
          flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors
          ${
            nextStage
              ? 'text-mist-gray hover:text-photon-white hover:bg-white/5'
              : 'text-white/20 cursor-not-allowed'
          }
        `}
      >
        <span className="hidden sm:inline">
          {nextStage ? JOURNEY_STAGES[nextStage].name : 'Next'}
        </span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// Stage breadcrumb for showing current position
interface JourneyBreadcrumbProps {
  currentStage: JourneyStage;
  onNavigate?: (stage: JourneyStage) => void;
}

export function JourneyBreadcrumb({ currentStage, onNavigate }: JourneyBreadcrumbProps) {
  const journeyStore = useJourneyStore();
  const stagesArray = Object.values(JourneyStage);
  const currentIndex = stagesArray.indexOf(currentStage);

  // Show current and completed stages leading up to it
  const visibleStages = stagesArray.slice(0, currentIndex + 1).filter((stage) => {
    const progress = journeyStore.getStageProgress(stage);
    return progress.status !== 'locked';
  });

  return (
    <nav className="flex items-center gap-1 text-sm">
      {visibleStages.map((stage, index) => {
        const stageInfo = JOURNEY_STAGES[stage];
        const isCurrent = stage === currentStage;

        return (
          <div key={stage} className="flex items-center gap-1">
            {index > 0 && <ChevronRight size={14} className="text-white/30" />}
            {onNavigate && !isCurrent ? (
              <button
                onClick={() => onNavigate(stage)}
                className="text-mist-gray hover:text-photon-white transition-colors"
              >
                {stageInfo.name}
              </button>
            ) : (
              <span className={isCurrent ? 'text-pellucid-cyan font-medium' : 'text-mist-gray'}>
                {stageInfo.name}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// Quick jump dropdown
interface JourneyQuickJumpProps {
  currentStage: JourneyStage;
  onNavigate: (stage: JourneyStage) => void;
}

export function JourneyQuickJump({ currentStage, onNavigate }: JourneyQuickJumpProps) {
  const journeyStore = useJourneyStore();
  const stagesArray = Object.values(JourneyStage);

  return (
    <select
      value={currentStage}
      onChange={(e) => onNavigate(e.target.value as JourneyStage)}
      className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-photon-white text-sm focus:outline-none focus:ring-2 focus:ring-pellucid-cyan/50"
    >
      {stagesArray.map((stage) => {
        const stageInfo = JOURNEY_STAGES[stage];
        const progress = journeyStore.getStageProgress(stage);
        const isLocked = progress.status === 'locked';

        return (
          <option
            key={stage}
            value={stage}
            disabled={isLocked}
            className="bg-void-black"
          >
            {stageInfo.order}. {stageInfo.name}
            {progress.status === 'completed' && ' ✓'}
            {isLocked && ' 🔒'}
          </option>
        );
      })}
    </select>
  );
}

// Progress summary
interface JourneyProgressSummaryProps {
  showDetails?: boolean;
}

export function JourneyProgressSummary({ showDetails = false }: JourneyProgressSummaryProps) {
  const journeyStore = useJourneyStore();
  const completedStages = journeyStore.getCompletedStages();
  const totalStages = Object.values(JourneyStage).length;
  const overallProgress = journeyStore.getOverallProgress();

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-mist-gray">Overall Progress</span>
          <span className="text-photon-white font-medium">{overallProgress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-pellucid-cyan transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {showDetails && (
        <div className="text-sm text-mist-gray">
          {completedStages.length}/{totalStages} stages
        </div>
      )}
    </div>
  );
}

// Stage status indicator
interface StageStatusIndicatorProps {
  stage: JourneyStage;
  size?: 'sm' | 'md' | 'lg';
}

export function StageStatusIndicator({ stage, size = 'md' }: StageStatusIndicatorProps) {
  const journeyStore = useJourneyStore();
  const progress = journeyStore.getStageProgress(stage);

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const getColorClass = () => {
    switch (progress.status) {
      case 'completed':
        return 'bg-deep-teal';
      case 'in_progress':
        return 'bg-pellucid-cyan animate-pulse';
      case 'available':
        return 'bg-apex-amber';
      case 'locked':
      default:
        return 'bg-white/20';
    }
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${getColorClass()}`}
      title={`${JOURNEY_STAGES[stage].name}: ${progress.status}`}
    />
  );
}

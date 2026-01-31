// REG-VAULT Journey Stage Card
// Card component for each stage showing progress and details

import {
  JourneyStage,
  StageProgress,
  JOURNEY_STAGES,
} from '@/types/journey';
import {
  Compass,
  ClipboardList,
  FileText,
  FileEdit,
  Calculator,
  Shield,
  GitBranch,
  Package,
  Send,
  Check,
  Lock,
  ChevronRight,
  Clock,
  AlertCircle,
} from 'lucide-react';

const STAGE_ICONS: Record<JourneyStage, React.ComponentType<{ size?: number; className?: string }>> = {
  [JourneyStage.LICENCE_ADVISOR]: Compass,
  [JourneyStage.INTAKE]: ClipboardList,
  [JourneyStage.FCA_FORMS]: FileText,
  [JourneyStage.BUSINESS_PLAN]: FileEdit,
  [JourneyStage.FINANCIAL_PROJECTIONS]: Calculator,
  [JourneyStage.POLICIES]: Shield,
  [JourneyStage.DIAGRAMS]: GitBranch,
  [JourneyStage.BUNDLE_REVIEW]: Package,
  [JourneyStage.SUBMISSION]: Send,
};

interface JourneyStageCardProps {
  stage: JourneyStage;
  progress: StageProgress;
  isActive?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
}

export function JourneyStageCard({
  stage,
  progress,
  isActive = false,
  onClick,
  showDetails = false,
}: JourneyStageCardProps) {
  const stageInfo = JOURNEY_STAGES[stage];
  const Icon = STAGE_ICONS[stage];

  const isCompleted = progress.status === 'completed';
  const isLocked = progress.status === 'locked';
  const isInProgress = progress.status === 'in_progress';
  const isAvailable = progress.status === 'available';

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <span className="flex items-center gap-1 text-xs bg-deep-teal/20 text-deep-teal px-2 py-0.5 rounded-full">
          <Check size={12} />
          Completed
        </span>
      );
    }
    if (isInProgress) {
      return (
        <span className="flex items-center gap-1 text-xs bg-pellucid-cyan/20 text-pellucid-cyan px-2 py-0.5 rounded-full">
          <Clock size={12} />
          In Progress
        </span>
      );
    }
    if (isLocked) {
      return (
        <span className="flex items-center gap-1 text-xs bg-white/10 text-mist-gray px-2 py-0.5 rounded-full">
          <Lock size={12} />
          Locked
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs bg-white/10 text-mist-gray px-2 py-0.5 rounded-full">
        Ready
      </span>
    );
  };

  const getDependencyText = () => {
    if (!isLocked) return null;

    const dependencies = stageInfo.dependencies;
    if (dependencies.length === 0) return null;

    const dependencyNames = dependencies.map((dep) => JOURNEY_STAGES[dep].name);
    return `Complete: ${dependencyNames.join(', ')}`;
  };

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        w-full text-left rounded-xl transition-all duration-200
        ${isActive ? 'ring-2 ring-pellucid-cyan bg-pellucid-cyan/10' : ''}
        ${!isActive && !isLocked ? 'hover:bg-white/5' : ''}
        ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${isCompleted && !isActive ? 'bg-deep-teal/5' : ''}
        ${!isActive && !isCompleted ? 'bg-white/5' : ''}
        p-4
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
            ${isCompleted ? 'bg-deep-teal/20 text-deep-teal' : ''}
            ${isActive ? 'bg-pellucid-cyan/20 text-pellucid-cyan' : ''}
            ${isInProgress && !isActive ? 'bg-pellucid-cyan/10 text-pellucid-cyan' : ''}
            ${isAvailable && !isActive ? 'bg-white/10 text-mist-gray' : ''}
            ${isLocked ? 'bg-white/5 text-white/30' : ''}
          `}
        >
          {isCompleted ? <Check size={20} /> : isLocked ? <Lock size={18} /> : <Icon size={20} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                className={`font-medium ${
                  isActive
                    ? 'text-pellucid-cyan'
                    : isCompleted
                    ? 'text-deep-teal'
                    : isLocked
                    ? 'text-white/50'
                    : 'text-photon-white'
                }`}
              >
                {stageInfo.name}
              </h3>
              <p
                className={`text-sm mt-0.5 ${
                  isLocked ? 'text-white/30' : 'text-mist-gray'
                }`}
              >
                {stageInfo.description}
              </p>
            </div>
            {getStatusBadge()}
          </div>

          {/* Progress Bar */}
          {(isInProgress || progress.progress > 0) && progress.progress < 100 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-mist-gray mb-1">
                <span>Progress</span>
                <span>{progress.progress}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pellucid-cyan transition-all"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Completed Items */}
          {showDetails && progress.completedItems.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-mist-gray mb-2">
                {progress.completedItems.length} / {progress.totalItems} items completed
              </p>
              <div className="space-y-1">
                {progress.completedItems.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs text-deep-teal"
                  >
                    <Check size={12} />
                    <span>{item}</span>
                  </div>
                ))}
                {progress.completedItems.length > 3 && (
                  <p className="text-xs text-mist-gray">
                    +{progress.completedItems.length - 3} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Locked Dependency Message */}
          {isLocked && getDependencyText() && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-apex-amber">
              <AlertCircle size={12} />
              {getDependencyText()}
            </div>
          )}

          {/* Estimated Time */}
          {!isCompleted && !isLocked && stageInfo.estimatedTime && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-mist-gray">
              <Clock size={12} />
              Est. {stageInfo.estimatedTime}
            </div>
          )}

          {/* Action Button */}
          {!isLocked && !showDetails && (
            <div className="mt-3 flex items-center justify-between">
              <span
                className={`text-sm font-medium ${
                  isActive ? 'text-pellucid-cyan' : 'text-mist-gray'
                }`}
              >
                {isCompleted ? 'Review' : isInProgress ? 'Continue' : 'Start'}
              </span>
              <ChevronRight
                size={16}
                className={isActive ? 'text-pellucid-cyan' : 'text-mist-gray'}
              />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// Compact variant for inline use
interface JourneyStageChipProps {
  stage: JourneyStage;
  progress: StageProgress;
  onClick?: () => void;
}

export function JourneyStageChip({ stage, progress, onClick }: JourneyStageChipProps) {
  const stageInfo = JOURNEY_STAGES[stage];
  const Icon = STAGE_ICONS[stage];

  const isCompleted = progress.status === 'completed';
  const isLocked = progress.status === 'locked';

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all
        ${isCompleted ? 'bg-deep-teal/20 text-deep-teal' : ''}
        ${!isCompleted && !isLocked ? 'bg-white/10 text-mist-gray hover:bg-white/20 hover:text-photon-white' : ''}
        ${isLocked ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {isCompleted ? <Check size={14} /> : <Icon size={14} />}
      {stageInfo.name}
      {progress.progress > 0 && progress.progress < 100 && (
        <span className="text-xs opacity-60">({progress.progress}%)</span>
      )}
    </button>
  );
}

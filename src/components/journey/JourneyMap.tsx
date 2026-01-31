// REG-VAULT Journey Map
// Visual progress tracker showing all 9 stages

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
  Loader2,
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

interface JourneyMapProps {
  currentStage: JourneyStage;
  stages: Record<JourneyStage, StageProgress>;
  onStageClick: (stage: JourneyStage) => void;
  compact?: boolean;
}

export function JourneyMap({
  currentStage,
  stages,
  onStageClick,
  compact = false,
}: JourneyMapProps) {
  const stagesArray = Object.values(JourneyStage);

  if (compact) {
    return (
      <div className="flex items-center justify-center gap-1">
        {stagesArray.map((stage, index) => {
          const progress = stages[stage];
          const isCurrent = stage === currentStage;
          const isCompleted = progress.status === 'completed';
          const isLocked = progress.status === 'locked';

          return (
            <div key={stage} className="flex items-center">
              <button
                onClick={() => !isLocked && onStageClick(stage)}
                disabled={isLocked}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all
                  ${isCompleted ? 'bg-deep-teal text-photon-white' : ''}
                  ${isCurrent ? 'bg-pellucid-cyan text-void-black ring-2 ring-pellucid-cyan/50' : ''}
                  ${!isCompleted && !isCurrent && !isLocked ? 'bg-white/10 text-mist-gray hover:bg-white/20' : ''}
                  ${isLocked ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'cursor-pointer'}
                `}
                title={JOURNEY_STAGES[stage].name}
              >
                {isCompleted ? (
                  <Check size={14} />
                ) : isLocked ? (
                  <Lock size={12} />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </button>
              {index < stagesArray.length - 1 && (
                <div
                  className={`w-6 h-0.5 ${
                    stages[stagesArray[index + 1]].status !== 'locked'
                      ? 'bg-pellucid-cyan/50'
                      : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-start justify-between min-w-max px-4">
        {stagesArray.map((stage, index) => {
          const progress = stages[stage];
          const stageInfo = JOURNEY_STAGES[stage];
          const Icon = STAGE_ICONS[stage];
          const isCurrent = stage === currentStage;
          const isCompleted = progress.status === 'completed';
          const isInProgress = progress.status === 'in_progress';
          const isLocked = progress.status === 'locked';

          return (
            <div key={stage} className="flex items-start flex-1">
              {/* Stage Node */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => !isLocked && onStageClick(stage)}
                  disabled={isLocked}
                  className={`
                    relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                    ${isCompleted ? 'bg-deep-teal text-photon-white' : ''}
                    ${isCurrent ? 'bg-pellucid-cyan text-void-black ring-4 ring-pellucid-cyan/30 scale-110' : ''}
                    ${isInProgress && !isCurrent ? 'bg-pellucid-cyan/20 text-pellucid-cyan' : ''}
                    ${!isCompleted && !isCurrent && !isInProgress && !isLocked ? 'bg-white/10 text-mist-gray hover:bg-white/20' : ''}
                    ${isLocked ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {isCompleted ? (
                    <Check size={24} />
                  ) : isInProgress && !isCurrent ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : isLocked ? (
                    <Lock size={20} />
                  ) : (
                    <Icon size={24} />
                  )}

                  {/* Progress indicator */}
                  {isInProgress && progress.progress > 0 && progress.progress < 100 && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pellucid-cyan transition-all"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  )}
                </button>

                {/* Stage Label */}
                <div className="mt-3 text-center max-w-[80px]">
                  <p
                    className={`text-xs font-medium leading-tight ${
                      isCurrent
                        ? 'text-pellucid-cyan'
                        : isCompleted
                        ? 'text-deep-teal'
                        : isLocked
                        ? 'text-white/30'
                        : 'text-mist-gray'
                    }`}
                  >
                    {stageInfo.name}
                  </p>
                  {progress.progress > 0 && progress.progress < 100 && (
                    <p className="text-[10px] text-mist-gray mt-0.5">
                      {progress.progress}%
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < stagesArray.length - 1 && (
                <div className="flex-1 flex items-center pt-6 px-2">
                  <div
                    className={`h-0.5 w-full rounded-full transition-colors ${
                      isCompleted || (isInProgress && progress.progress === 100)
                        ? 'bg-deep-teal'
                        : stages[stagesArray[index + 1]].status !== 'locked'
                        ? 'bg-pellucid-cyan/30'
                        : 'bg-white/10'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Vertical variant for sidebar
interface JourneyMapVerticalProps {
  currentStage: JourneyStage;
  stages: Record<JourneyStage, StageProgress>;
  onStageClick: (stage: JourneyStage) => void;
}

export function JourneyMapVertical({
  currentStage,
  stages,
  onStageClick,
}: JourneyMapVerticalProps) {
  const stagesArray = Object.values(JourneyStage);

  return (
    <div className="space-y-1">
      {stagesArray.map((stage, index) => {
        const progress = stages[stage];
        const stageInfo = JOURNEY_STAGES[stage];
        const Icon = STAGE_ICONS[stage];
        const isCurrent = stage === currentStage;
        const isCompleted = progress.status === 'completed';
        const isInProgress = progress.status === 'in_progress';
        const isLocked = progress.status === 'locked';

        return (
          <div key={stage}>
            <button
              onClick={() => !isLocked && onStageClick(stage)}
              disabled={isLocked}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                ${isCurrent ? 'bg-pellucid-cyan/20 text-pellucid-cyan' : ''}
                ${isCompleted && !isCurrent ? 'text-deep-teal' : ''}
                ${!isCompleted && !isCurrent && !isLocked ? 'text-mist-gray hover:bg-white/5 hover:text-photon-white' : ''}
                ${isLocked ? 'text-white/30 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  ${isCompleted ? 'bg-deep-teal/20' : ''}
                  ${isCurrent ? 'bg-pellucid-cyan/20' : ''}
                  ${!isCompleted && !isCurrent && !isLocked ? 'bg-white/5' : ''}
                  ${isLocked ? 'bg-white/5' : ''}
                `}
              >
                {isCompleted ? (
                  <Check size={16} />
                ) : isLocked ? (
                  <Lock size={14} />
                ) : (
                  <Icon size={16} />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{stageInfo.name}</p>
                {progress.progress > 0 && progress.progress < 100 && (
                  <div className="mt-1 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pellucid-cyan transition-all"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                )}
              </div>
              {isCompleted && (
                <span className="text-xs bg-deep-teal/20 px-2 py-0.5 rounded-full">
                  Done
                </span>
              )}
            </button>

            {/* Vertical connector */}
            {index < stagesArray.length - 1 && (
              <div className="ml-[22px] my-1">
                <div
                  className={`w-0.5 h-4 ${
                    isCompleted ? 'bg-deep-teal/50' : 'bg-white/10'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

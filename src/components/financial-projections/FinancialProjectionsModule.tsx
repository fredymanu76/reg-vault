// REG-VAULT Financial Projections Module
// Main container with tabbed interface for financial planning

import { useState } from 'react';
import { AssumptionsEditor } from './AssumptionsEditor';
import { RevenueModeler } from './RevenueModeler';
import { CostStructureEditor } from './CostStructureEditor';
import { StatementViewer } from './StatementViewer';
import { CapitalCalculator } from './CapitalCalculator';
import { SensitivityAnalysis } from './SensitivityAnalysis';
import { FinancialCharts } from './FinancialCharts';
import { useFinancialStore } from '@/lib/stores/financialStore';
import { useJourneyStore } from '@/lib/stores/journeyStore';
import {
  Calculator,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  Scale,
  BarChart3,
  PieChart,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  RefreshCw,
} from 'lucide-react';

type TabId = 'assumptions' | 'revenue' | 'costs' | 'statements' | 'capital' | 'sensitivity' | 'charts';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

const TABS: Tab[] = [
  { id: 'assumptions', label: 'Assumptions', icon: Calculator, description: 'Set projection parameters' },
  { id: 'revenue', label: 'Revenue', icon: TrendingUp, description: 'Model revenue streams' },
  { id: 'costs', label: 'Costs', icon: Receipt, description: 'Define cost structure' },
  { id: 'statements', label: 'Statements', icon: FileSpreadsheet, description: 'View financial statements' },
  { id: 'capital', label: 'Capital', icon: Scale, description: 'FCA capital requirements' },
  { id: 'sensitivity', label: 'Sensitivity', icon: BarChart3, description: 'Scenario analysis' },
  { id: 'charts', label: 'Charts', icon: PieChart, description: 'Visual analytics' },
];

interface FinancialProjectionsModuleProps {
  onComplete?: () => void;
}

export function FinancialProjectionsModule({ onComplete }: FinancialProjectionsModuleProps) {
  const [activeTab, setActiveTab] = useState<TabId>('assumptions');
  const financialStore = useFinancialStore();
  const journeyStore = useJourneyStore();

  const projections = financialStore.getProjections();
  const assumptions = financialStore.getAssumptions();
  const revenueStreams = financialStore.getRevenueStreams();
  const costs = financialStore.getCosts();
  const capitalRequirement = financialStore.getCapitalRequirement();

  // Calculate completion status
  const isAssumptionsComplete = assumptions.projectionYears > 0;
  const isRevenueComplete = revenueStreams.length > 0;
  const isCostsComplete = costs.length > 0;
  const isStatementsGenerated = projections !== null;
  const isCapitalCalculated = capitalRequirement !== null;

  const completionPercentage = [
    isAssumptionsComplete,
    isRevenueComplete,
    isCostsComplete,
    isStatementsGenerated,
    isCapitalCalculated,
  ].filter(Boolean).length * 20;

  const handleExport = () => {
    const data = projections;
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-projections.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm('Reset all financial projections? This cannot be undone.')) {
      financialStore.reset();
    }
  };

  const handleComplete = () => {
    if (completionPercentage >= 80) {
      // Update journey progress
      journeyStore.updateStageProgress('financial-projections' as any, 100);
      onComplete?.();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'assumptions':
        return <AssumptionsEditor />;
      case 'revenue':
        return <RevenueModeler />;
      case 'costs':
        return <CostStructureEditor />;
      case 'statements':
        return <StatementViewer />;
      case 'capital':
        return <CapitalCalculator />;
      case 'sensitivity':
        return <SensitivityAnalysis />;
      case 'charts':
        return <FinancialCharts />;
      default:
        return null;
    }
  };

  const getTabStatus = (tabId: TabId): 'complete' | 'in_progress' | 'pending' => {
    switch (tabId) {
      case 'assumptions':
        return isAssumptionsComplete ? 'complete' : 'in_progress';
      case 'revenue':
        return isRevenueComplete ? 'complete' : isAssumptionsComplete ? 'in_progress' : 'pending';
      case 'costs':
        return isCostsComplete ? 'complete' : isRevenueComplete ? 'in_progress' : 'pending';
      case 'statements':
        return isStatementsGenerated ? 'complete' : isCostsComplete ? 'in_progress' : 'pending';
      case 'capital':
        return isCapitalCalculated ? 'complete' : isStatementsGenerated ? 'in_progress' : 'pending';
      case 'sensitivity':
      case 'charts':
        return isStatementsGenerated ? 'in_progress' : 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-photon-white mb-2">
            Financial Projections
          </h2>
          <p className="text-mist-gray">
            Create 3-5 year financial forecasts and calculate FCA capital requirements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={!projections}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-mist-gray
              hover:bg-white/10 hover:text-photon-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-mist-gray
              hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-mist-gray">Module Progress</span>
          <span className="text-sm font-medium text-photon-white">{completionPercentage}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-pellucid-cyan transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        {completionPercentage >= 80 && (
          <button
            onClick={handleComplete}
            className="mt-3 flex items-center gap-2 text-sm text-deep-teal"
          >
            <CheckCircle size={16} />
            Mark as complete
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const status = getTabStatus(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-all
                ${isActive ? 'bg-pellucid-cyan/20 text-pellucid-cyan' : ''}
                ${status === 'complete' && !isActive ? 'bg-deep-teal/10 text-deep-teal' : ''}
                ${status !== 'complete' && !isActive ? 'bg-white/5 text-mist-gray hover:bg-white/10' : ''}
              `}
            >
              {status === 'complete' ? (
                <CheckCircle size={16} />
              ) : (
                <tab.icon size={16} />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Description */}
      <div className="flex items-center gap-2 px-1">
        <AlertCircle size={16} className="text-pellucid-cyan" />
        <span className="text-sm text-mist-gray">
          {TABS.find((t) => t.id === activeTab)?.description}
        </span>
      </div>

      {/* Tab Content */}
      <div className="glass-card p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}

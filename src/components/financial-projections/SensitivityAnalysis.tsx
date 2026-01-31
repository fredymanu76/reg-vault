// REG-VAULT Sensitivity Analysis
// Best/worst case scenarios and stress testing

import { useFinancialStore } from '@/lib/stores/financialStore';
import { SensitivityScenario } from '@/types/journey';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

export function SensitivityAnalysis() {
  const financialStore = useFinancialStore();
  const scenarios = financialStore.getSensitivityScenarios();
  const capitalRequirement = financialStore.getCapitalRequirement();

  if (scenarios.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 size={48} className="mx-auto text-mist-gray mb-4" />
        <h3 className="text-lg font-medium text-photon-white mb-2">Sensitivity Analysis</h3>
        <p className="text-mist-gray">
          Complete your financial projections to view scenario analysis.
        </p>
      </div>
    );
  }

  const baseScenario = scenarios.find((s) => s.name === 'base');
  const optimisticScenario = scenarios.find((s) => s.name === 'optimistic');
  const pessimisticScenario = scenarios.find((s) => s.name === 'pessimistic');

  return (
    <div className="space-y-6">
      {/* Scenario Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        {pessimisticScenario && (
          <ScenarioCard
            scenario={pessimisticScenario}
            icon={TrendingDown}
            color="red"
            capitalRequirement={capitalRequirement?.minimumCapital || 0}
          />
        )}
        {baseScenario && (
          <ScenarioCard
            scenario={baseScenario}
            icon={Minus}
            color="cyan"
            capitalRequirement={capitalRequirement?.minimumCapital || 0}
          />
        )}
        {optimisticScenario && (
          <ScenarioCard
            scenario={optimisticScenario}
            icon={TrendingUp}
            color="green"
            capitalRequirement={capitalRequirement?.minimumCapital || 0}
          />
        )}
      </div>

      {/* Detailed Comparison */}
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="text-sm font-medium text-photon-white mb-4">Scenario Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-3 text-mist-gray text-sm">Metric</th>
                <th className="text-right py-2 px-3 text-red-400 text-sm">Pessimistic</th>
                <th className="text-right py-2 px-3 text-pellucid-cyan text-sm">Base</th>
                <th className="text-right py-2 px-3 text-deep-teal text-sm">Optimistic</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3 text-mist-gray">Revenue Assumption</td>
                <td className="text-right py-2 px-3 text-red-400">
                  {((pessimisticScenario?.revenueMultiplier || 1) * 100).toFixed(0)}%
                </td>
                <td className="text-right py-2 px-3 text-pellucid-cyan">100%</td>
                <td className="text-right py-2 px-3 text-deep-teal">
                  {((optimisticScenario?.revenueMultiplier || 1) * 100).toFixed(0)}%
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3 text-mist-gray">Cost Assumption</td>
                <td className="text-right py-2 px-3 text-red-400">
                  {((pessimisticScenario?.costMultiplier || 1) * 100).toFixed(0)}%
                </td>
                <td className="text-right py-2 px-3 text-pellucid-cyan">100%</td>
                <td className="text-right py-2 px-3 text-deep-teal">
                  {((optimisticScenario?.costMultiplier || 1) * 100).toFixed(0)}%
                </td>
              </tr>

              {/* Year 1 Results */}
              <tr className="bg-white/5">
                <td className="py-2 px-3 text-photon-white font-medium" colSpan={4}>
                  Year 1 Results
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3 text-mist-gray">Revenue</td>
                <td className="text-right py-2 px-3 text-red-400">
                  £{pessimisticScenario?.projections.pnl[0]?.revenue.total.toLocaleString()}
                </td>
                <td className="text-right py-2 px-3 text-pellucid-cyan">
                  £{baseScenario?.projections.pnl[0]?.revenue.total.toLocaleString()}
                </td>
                <td className="text-right py-2 px-3 text-deep-teal">
                  £{optimisticScenario?.projections.pnl[0]?.revenue.total.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3 text-mist-gray">Net Profit</td>
                <td className="text-right py-2 px-3 text-red-400">
                  £{pessimisticScenario?.projections.pnl[0]?.netProfit.toLocaleString()}
                </td>
                <td className="text-right py-2 px-3 text-pellucid-cyan">
                  £{baseScenario?.projections.pnl[0]?.netProfit.toLocaleString()}
                </td>
                <td className="text-right py-2 px-3 text-deep-teal">
                  £{optimisticScenario?.projections.pnl[0]?.netProfit.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3 text-mist-gray">Cash Position</td>
                <td className="text-right py-2 px-3 text-red-400">
                  £{pessimisticScenario?.projections.cashFlow[0]?.closingBalance.toLocaleString()}
                </td>
                <td className="text-right py-2 px-3 text-pellucid-cyan">
                  £{baseScenario?.projections.cashFlow[0]?.closingBalance.toLocaleString()}
                </td>
                <td className="text-right py-2 px-3 text-deep-teal">
                  £{optimisticScenario?.projections.cashFlow[0]?.closingBalance.toLocaleString()}
                </td>
              </tr>

              {/* Final Year Results */}
              <tr className="bg-white/5">
                <td className="py-2 px-3 text-photon-white font-medium" colSpan={4}>
                  Final Year Results
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3 text-mist-gray">Revenue</td>
                <td className="text-right py-2 px-3 text-red-400">
                  £{pessimisticScenario?.projections.pnl.slice(-1)[0]?.revenue.total.toLocaleString()}
                </td>
                <td className="text-right py-2 px-3 text-pellucid-cyan">
                  £{baseScenario?.projections.pnl.slice(-1)[0]?.revenue.total.toLocaleString()}
                </td>
                <td className="text-right py-2 px-3 text-deep-teal">
                  £{optimisticScenario?.projections.pnl.slice(-1)[0]?.revenue.total.toLocaleString()}
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-3 text-mist-gray">Net Profit</td>
                <td className="text-right py-2 px-3 text-red-400">
                  £{pessimisticScenario?.projections.pnl.slice(-1)[0]?.netProfit.toLocaleString()}
                </td>
                <td className="text-right py-2 px-3 text-pellucid-cyan">
                  £{baseScenario?.projections.pnl.slice(-1)[0]?.netProfit.toLocaleString()}
                </td>
                <td className="text-right py-2 px-3 text-deep-teal">
                  £{optimisticScenario?.projections.pnl.slice(-1)[0]?.netProfit.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Capital Adequacy Under Stress */}
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="text-sm font-medium text-photon-white mb-4">Capital Adequacy Under Stress</h4>
        <div className="space-y-3">
          {scenarios.map((scenario) => {
            const allAdequate = scenario.projections.capitalAdequacy.every(Boolean);
            const anyInadequate = scenario.projections.capitalAdequacy.some((v) => !v);

            return (
              <div
                key={scenario.name}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  scenario.name === 'pessimistic'
                    ? 'bg-red-500/10'
                    : scenario.name === 'optimistic'
                    ? 'bg-deep-teal/10'
                    : 'bg-pellucid-cyan/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  {scenario.name === 'pessimistic' ? (
                    <TrendingDown className="text-red-400" size={20} />
                  ) : scenario.name === 'optimistic' ? (
                    <TrendingUp className="text-deep-teal" size={20} />
                  ) : (
                    <Minus className="text-pellucid-cyan" size={20} />
                  )}
                  <span className="text-photon-white capitalize">{scenario.name} Case</span>
                </div>
                <div className="flex items-center gap-2">
                  {scenario.projections.capitalAdequacy.map((adequate, i) => (
                    <span
                      key={i}
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                        adequate
                          ? 'bg-deep-teal/20 text-deep-teal'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                      title={`Year ${i + 1}`}
                    >
                      Y{i + 1}
                    </span>
                  ))}
                  {allAdequate ? (
                    <CheckCircle className="text-deep-teal ml-2" size={20} />
                  ) : (
                    <AlertTriangle className="text-red-400 ml-2" size={20} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-mist-gray mt-3">
          Green indicates capital adequacy maintained; red indicates potential shortfall.
        </p>
      </div>

      {/* Key Insights */}
      <div className="bg-apex-amber/10 border border-apex-amber/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-apex-amber flex items-center gap-2 mb-3">
          <AlertTriangle size={16} />
          Key Insights
        </h4>
        <ul className="space-y-2 text-sm text-mist-gray">
          {pessimisticScenario && (
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              In the pessimistic scenario, {
                pessimisticScenario.projections.pnl[0]?.netProfit < 0
                  ? 'the business may be loss-making in Year 1'
                  : 'the business remains profitable but with reduced margins'
              }.
            </li>
          )}
          {pessimisticScenario && !pessimisticScenario.projections.capitalAdequacy.every(Boolean) && (
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              Capital requirements may not be met under stress - consider increasing initial capital.
            </li>
          )}
          {baseScenario && (
            <li className="flex items-start gap-2">
              <span className="text-pellucid-cyan">•</span>
              Base case shows breakeven by Year {
                baseScenario.projections.pnl.findIndex((p) => p.netProfit > 0) + 1 || 'N/A'
              }.
            </li>
          )}
          {optimisticScenario && (
            <li className="flex items-start gap-2">
              <span className="text-deep-teal">•</span>
              Optimistic scenario shows strong growth potential with adequate capital throughout.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

// Scenario Card Component
interface ScenarioCardProps {
  scenario: SensitivityScenario;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: 'red' | 'cyan' | 'green';
  capitalRequirement: number;
}

function ScenarioCard({ scenario, icon: Icon, color, capitalRequirement }: ScenarioCardProps) {
  const colors = {
    red: 'border-red-500/30 bg-red-500/10',
    cyan: 'border-pellucid-cyan/30 bg-pellucid-cyan/10',
    green: 'border-deep-teal/30 bg-deep-teal/10',
  };

  const textColors = {
    red: 'text-red-400',
    cyan: 'text-pellucid-cyan',
    green: 'text-deep-teal',
  };

  const finalYear = scenario.projections.pnl.slice(-1)[0];
  const finalCashFlow = scenario.projections.cashFlow.slice(-1)[0];
  const allYearsAdequate = scenario.projections.capitalAdequacy.every(Boolean);

  return (
    <div className={`border rounded-lg p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className={textColors[color]} size={20} />
          <h4 className={`font-medium capitalize ${textColors[color]}`}>{scenario.name} Case</h4>
        </div>
        {allYearsAdequate ? (
          <CheckCircle className="text-deep-teal" size={18} />
        ) : (
          <AlertTriangle className="text-red-400" size={18} />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-mist-gray">Final Year Revenue</p>
          <p className="text-lg font-bold text-photon-white">
            £{finalYear?.revenue.total.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-mist-gray">Final Year Net Profit</p>
          <p
            className={`text-lg font-bold ${
              (finalYear?.netProfit || 0) >= 0 ? textColors[color] : 'text-red-400'
            }`}
          >
            £{finalYear?.netProfit.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-mist-gray">Final Cash Position</p>
          <p className="text-lg font-bold text-photon-white">
            £{finalCashFlow?.closingBalance.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// REG-VAULT Assumptions Editor
// Configure growth rates, tax, inflation, and working capital assumptions

import { useState } from 'react';
import { useFinancialStore } from '@/lib/stores/financialStore';
import { DEFAULT_ASSUMPTIONS, EXTENDED_ASSUMPTIONS } from '@/data/financial-templates';
import { Info, RefreshCw } from 'lucide-react';

export function AssumptionsEditor() {
  const financialStore = useFinancialStore();
  const assumptions = financialStore.getAssumptions();

  const [localAssumptions, setLocalAssumptions] = useState(assumptions);

  const handleChange = (field: string, value: number | number[]) => {
    const updated = { ...localAssumptions, [field]: value };
    setLocalAssumptions(updated);
    financialStore.setAssumptions(updated);
  };

  const handleGrowthRateChange = (index: number, value: number) => {
    const newRates = [...localAssumptions.revenueGrowthRate];
    newRates[index] = value / 100; // Convert percentage to decimal
    handleChange('revenueGrowthRate', newRates);
  };

  const handleReset = (template: 'default' | 'extended') => {
    const newAssumptions = template === 'default' ? DEFAULT_ASSUMPTIONS : EXTENDED_ASSUMPTIONS;
    setLocalAssumptions(newAssumptions);
    financialStore.setAssumptions(newAssumptions);
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleReset('default')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-mist-gray
            hover:bg-white/10 hover:text-photon-white transition-colors"
        >
          <RefreshCw size={16} />
          Load 3-Year Template
        </button>
        <button
          onClick={() => handleReset('extended')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-mist-gray
            hover:bg-white/10 hover:text-photon-white transition-colors"
        >
          <RefreshCw size={16} />
          Load 5-Year Template
        </button>
      </div>

      {/* Projection Period */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-photon-white mb-2">
            Projection Period (Years)
          </label>
          <select
            value={localAssumptions.projectionYears}
            onChange={(e) => {
              const years = Number(e.target.value);
              handleChange('projectionYears', years);
              // Adjust growth rates array length
              const currentRates = localAssumptions.revenueGrowthRate;
              const newRates = Array(years).fill(0).map((_, i) => currentRates[i] || 0.2);
              handleChange('revenueGrowthRate', newRates);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-photon-white
              focus:outline-none focus:ring-2 focus:ring-pellucid-cyan/50"
          >
            <option value={3}>3 Years</option>
            <option value={5}>5 Years</option>
          </select>
          <p className="text-xs text-mist-gray mt-1 flex items-center gap-1">
            <Info size={12} />
            FCA typically requires 3-year projections minimum
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-photon-white mb-2">
            Start Year
          </label>
          <select
            value={localAssumptions.startYear}
            onChange={(e) => handleChange('startYear', Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-photon-white
              focus:outline-none focus:ring-2 focus:ring-pellucid-cyan/50"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Revenue Growth Rates */}
      <div>
        <label className="block text-sm font-medium text-photon-white mb-4">
          Revenue Growth Rate by Year
        </label>
        <div className="grid gap-4">
          {Array.from({ length: localAssumptions.projectionYears }, (_, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-20 text-sm text-mist-gray">Year {i + 1}:</span>
              <input
                type="range"
                min={-50}
                max={200}
                value={(localAssumptions.revenueGrowthRate[i] || 0) * 100}
                onChange={(e) => handleGrowthRateChange(i, Number(e.target.value))}
                className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:bg-pellucid-cyan [&::-webkit-slider-thumb]:rounded-full"
              />
              <div className="w-24 flex items-center gap-2">
                <input
                  type="number"
                  value={Math.round((localAssumptions.revenueGrowthRate[i] || 0) * 100)}
                  onChange={(e) => handleGrowthRateChange(i, Number(e.target.value))}
                  className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-photon-white text-sm text-center
                    focus:outline-none focus:ring-1 focus:ring-pellucid-cyan/50"
                />
                <span className="text-mist-gray">%</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-mist-gray mt-2">
          Year 1 is your base year. Growth rates apply from Year 2 onwards.
        </p>
      </div>

      {/* Tax & Inflation */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-photon-white mb-2">
            Corporation Tax Rate
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step={0.5}
              value={localAssumptions.taxRate * 100}
              onChange={(e) => handleChange('taxRate', Number(e.target.value) / 100)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-photon-white
                focus:outline-none focus:ring-2 focus:ring-pellucid-cyan/50"
            />
            <span className="text-mist-gray">%</span>
          </div>
          <p className="text-xs text-mist-gray mt-1">
            UK: 19% small profits, 25% main rate
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-photon-white mb-2">
            Annual Inflation Rate
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step={0.1}
              value={localAssumptions.inflationRate * 100}
              onChange={(e) => handleChange('inflationRate', Number(e.target.value) / 100)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-photon-white
                focus:outline-none focus:ring-2 focus:ring-pellucid-cyan/50"
            />
            <span className="text-mist-gray">%</span>
          </div>
          <p className="text-xs text-mist-gray mt-1">
            Applied to fixed costs year-on-year
          </p>
        </div>
      </div>

      {/* Working Capital */}
      <div>
        <h4 className="text-sm font-medium text-photon-white mb-4">Working Capital Assumptions</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-mist-gray mb-2">
              Receivables Days
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={localAssumptions.workingCapitalDays.receivables}
                onChange={(e) =>
                  handleChange('workingCapitalDays', {
                    ...localAssumptions.workingCapitalDays,
                    receivables: Number(e.target.value),
                  })
                }
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-photon-white
                  focus:outline-none focus:ring-2 focus:ring-pellucid-cyan/50"
              />
              <span className="text-mist-gray">days</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-mist-gray mb-2">
              Payables Days
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={localAssumptions.workingCapitalDays.payables}
                onChange={(e) =>
                  handleChange('workingCapitalDays', {
                    ...localAssumptions.workingCapitalDays,
                    payables: Number(e.target.value),
                  })
                }
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-photon-white
                  focus:outline-none focus:ring-2 focus:ring-pellucid-cyan/50"
              />
              <span className="text-mist-gray">days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-pellucid-cyan/10 border border-pellucid-cyan/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-pellucid-cyan mb-2">Assumptions Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-mist-gray">Period</p>
            <p className="text-photon-white font-medium">
              {localAssumptions.startYear} - {localAssumptions.startYear + localAssumptions.projectionYears - 1}
            </p>
          </div>
          <div>
            <p className="text-mist-gray">Avg Growth</p>
            <p className="text-photon-white font-medium">
              {Math.round(
                (localAssumptions.revenueGrowthRate.reduce((a, b) => a + b, 0) /
                  localAssumptions.projectionYears) *
                  100
              )}%
            </p>
          </div>
          <div>
            <p className="text-mist-gray">Tax Rate</p>
            <p className="text-photon-white font-medium">{(localAssumptions.taxRate * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-mist-gray">Inflation</p>
            <p className="text-photon-white font-medium">{(localAssumptions.inflationRate * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

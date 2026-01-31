// REG-VAULT Capital Calculator
// FCA capital requirements calculation (Methods A/B/C/D)

import { useFinancialStore } from '@/lib/stores/financialStore';
import { useJourneyStore } from '@/lib/stores/journeyStore';
import { LICENCE_REQUIREMENTS, CAPITAL_METHODS } from '@/data/licence-requirements';
import { Scale, CheckCircle, AlertTriangle, Info, ExternalLink } from 'lucide-react';

export function CapitalCalculator() {
  const financialStore = useFinancialStore();
  const journeyStore = useJourneyStore();

  const capitalRequirement = financialStore.getCapitalRequirement();
  const statements = financialStore.getStatements();
  const licenceType = journeyStore.getJourneyData().licenceType || financialStore.getLicenceType();
  const licenceInfo = LICENCE_REQUIREMENTS[licenceType];

  if (!capitalRequirement || !statements) {
    return (
      <div className="text-center py-12">
        <Scale size={48} className="mx-auto text-mist-gray mb-4" />
        <h3 className="text-lg font-medium text-photon-white mb-2">Capital Calculator</h3>
        <p className="text-mist-gray">
          Complete your financial projections to calculate capital requirements.
        </p>
      </div>
    );
  }

  const methods = [
    { id: 'A', value: capitalRequirement.ongoingCapital.methodA, info: CAPITAL_METHODS.A },
    { id: 'B', value: capitalRequirement.ongoingCapital.methodB, info: CAPITAL_METHODS.B },
    { id: 'C', value: capitalRequirement.ongoingCapital.methodC, info: CAPITAL_METHODS.C },
    { id: 'D', value: capitalRequirement.ongoingCapital.methodD, info: CAPITAL_METHODS.D },
  ].filter((m) => m.value !== undefined);

  const isCapitalAdequate =
    capitalRequirement.totalRequired <= (statements.balanceSheet[0]?.equity.totalEquity || 0);

  return (
    <div className="space-y-6">
      {/* Licence Type */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-medium text-photon-white">{licenceInfo.fullName}</h4>
          <p className="text-sm text-mist-gray">{licenceInfo.regulation}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            isCapitalAdequate
              ? 'bg-deep-teal/20 text-deep-teal'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {isCapitalAdequate ? 'Capital Adequate' : 'Capital Shortfall'}
        </span>
      </div>

      {/* Capital Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-sm text-mist-gray mb-1">Initial Capital Required</p>
          <p className="text-2xl font-bold text-photon-white">
            €{capitalRequirement.initialCapital.toLocaleString()}
          </p>
          <p className="text-xs text-mist-gray mt-1">
            {capitalRequirement.initialCapital === 0 ? 'No minimum requirement' : 'Minimum at authorisation'}
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-sm text-mist-gray mb-1">Ongoing Capital Required</p>
          <p className="text-2xl font-bold text-pellucid-cyan">
            €{capitalRequirement.minimumCapital.toLocaleString()}
          </p>
          <p className="text-xs text-pellucid-cyan mt-1">
            Using {capitalRequirement.recommendedMethod}
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-sm text-mist-gray mb-1">Recommended Total (inc. buffer)</p>
          <p className="text-2xl font-bold text-apex-amber">
            €{capitalRequirement.totalRequired.toLocaleString()}
          </p>
          <p className="text-xs text-mist-gray mt-1">
            Includes 25% buffer (€{capitalRequirement.buffer.toLocaleString()})
          </p>
        </div>
      </div>

      {/* Method Comparison */}
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="text-sm font-medium text-photon-white mb-4 flex items-center gap-2">
          <Info size={16} className="text-pellucid-cyan" />
          Capital Calculation Methods
        </h4>

        <div className="space-y-4">
          {methods.map((method) => {
            const isRecommended = capitalRequirement.recommendedMethod === method.id;
            return (
              <div
                key={method.id}
                className={`p-4 rounded-lg border ${
                  isRecommended
                    ? 'border-pellucid-cyan bg-pellucid-cyan/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                        isRecommended
                          ? 'bg-pellucid-cyan text-void-black'
                          : 'bg-white/10 text-mist-gray'
                      }`}
                    >
                      {method.id}
                    </span>
                    <span className={isRecommended ? 'text-pellucid-cyan font-medium' : 'text-photon-white'}>
                      {method.info.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${isRecommended ? 'text-pellucid-cyan' : 'text-photon-white'}`}>
                      €{method.value?.toLocaleString()}
                    </p>
                    {isRecommended && (
                      <span className="text-xs text-deep-teal flex items-center gap-1 justify-end">
                        <CheckCircle size={12} />
                        Recommended
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-mist-gray mb-2">{method.info.description}</p>
                <p className="text-xs text-mist-gray font-mono bg-black/20 p-2 rounded">
                  {method.info.calculation.split('\n')[0]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safeguarding */}
      {capitalRequirement.safeguardingRequired > 0 && (
        <div className="bg-apex-amber/10 border border-apex-amber/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-apex-amber flex items-center gap-2 mb-2">
            <AlertTriangle size={16} />
            Safeguarding Requirements
          </h4>
          <p className="text-mist-gray text-sm mb-2">
            You must safeguard customer funds of approximately:
          </p>
          <p className="text-xl font-bold text-photon-white">
            €{capitalRequirement.safeguardingRequired.toLocaleString()}
          </p>
          <p className="text-xs text-mist-gray mt-2">
            This is separate from capital requirements and can be achieved through segregated accounts,
            insurance, or qualifying investments.
          </p>
        </div>
      )}

      {/* Capital Adequacy Check */}
      <div
        className={`rounded-lg p-4 ${
          isCapitalAdequate ? 'bg-deep-teal/10 border border-deep-teal/20' : 'bg-red-500/10 border border-red-500/20'
        }`}
      >
        <div className="flex items-start gap-3">
          {isCapitalAdequate ? (
            <CheckCircle size={24} className="text-deep-teal flex-shrink-0" />
          ) : (
            <AlertTriangle size={24} className="text-red-400 flex-shrink-0" />
          )}
          <div>
            <h4
              className={`font-medium mb-1 ${isCapitalAdequate ? 'text-deep-teal' : 'text-red-400'}`}
            >
              {isCapitalAdequate ? 'Capital Requirements Met' : 'Capital Shortfall Detected'}
            </h4>
            <p className="text-sm text-mist-gray">
              {isCapitalAdequate
                ? `Your projected equity of €${statements.balanceSheet[0]?.equity.totalEquity.toLocaleString()} exceeds the required €${capitalRequirement.totalRequired.toLocaleString()}.`
                : `You need an additional €${(capitalRequirement.totalRequired - (statements.balanceSheet[0]?.equity.totalEquity || 0)).toLocaleString()} to meet capital requirements.`}
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Adequacy */}
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="text-sm font-medium text-photon-white mb-4">Capital Adequacy by Year</h4>
        <div className="space-y-2">
          {statements.balanceSheet.map((bs, index) => {
            const equity = bs.equity.totalEquity;
            const adequate = equity >= capitalRequirement.minimumCapital;
            const ratio = (equity / capitalRequirement.minimumCapital) * 100;

            return (
              <div key={bs.year} className="flex items-center gap-4">
                <span className="w-16 text-sm text-mist-gray">{bs.year}</span>
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      adequate ? 'bg-deep-teal' : 'bg-red-400'
                    }`}
                    style={{ width: `${Math.min(100, ratio)}%` }}
                  />
                </div>
                <span className={`w-20 text-sm text-right ${adequate ? 'text-deep-teal' : 'text-red-400'}`}>
                  {ratio.toFixed(0)}%
                </span>
                {adequate ? (
                  <CheckCircle size={16} className="text-deep-teal" />
                ) : (
                  <AlertTriangle size={16} className="text-red-400" />
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-mist-gray mt-2">
          100% = meets minimum requirement; 125%+ recommended
        </p>
      </div>

      {/* Regulatory References */}
      <div className="text-sm text-mist-gray space-y-1">
        <p className="font-medium text-photon-white">Regulatory References:</p>
        <a
          href="https://www.legislation.gov.uk/uksi/2017/752"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-pellucid-cyan hover:underline"
        >
          <ExternalLink size={12} />
          {licenceInfo.regulation === 'PSR2017'
            ? 'PSR 2017, Regulation 18 - Own Funds'
            : 'EMR 2011, Regulation 6 - Capital Requirements'}
        </a>
      </div>
    </div>
  );
}

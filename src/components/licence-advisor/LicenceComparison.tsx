// REG-VAULT Licence Comparison Table
// Side-by-side comparison of all licence types

import { LicenceRecommendation } from '@/types/journey';
import {
  LICENCE_REQUIREMENTS,
  LICENCE_COMPARISON,
  APPLICATION_FEES,
  PROCESSING_TIMES,
} from '@/data/licence-requirements';
import { Check, X, Star, ArrowRight } from 'lucide-react';

interface LicenceComparisonProps {
  recommendation: LicenceRecommendation;
  onSelect: (licence: 'SPI' | 'API' | 'SEMI' | 'EMI' | 'RAISP') => void;
}

export function LicenceComparison({ recommendation, onSelect }: LicenceComparisonProps) {
  const licenceTypes: ('SPI' | 'API' | 'SEMI' | 'EMI' | 'RAISP')[] = ['SPI', 'API', 'SEMI', 'EMI', 'RAISP'];

  // Group comparison rows by category
  const categories = [...new Set(LICENCE_COMPARISON.map((row) => row.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-photon-white">
            Licence Comparison
          </h2>
          <p className="text-mist-gray mt-1">
            Compare all FCA payment services licence types
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="text-left p-4 border-b border-white/10 text-mist-gray font-medium">
                Feature
              </th>
              {licenceTypes.map((licence) => {
                const isRecommended = licence === recommendation.recommended;
                const isAlternative = recommendation.alternatives.includes(licence);
                return (
                  <th
                    key={licence}
                    className={`
                      p-4 border-b text-center
                      ${isRecommended ? 'border-pellucid-cyan bg-pellucid-cyan/10' : 'border-white/10'}
                    `}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {isRecommended && (
                        <span className="flex items-center gap-1 text-xs text-pellucid-cyan bg-pellucid-cyan/20 px-2 py-0.5 rounded-full">
                          <Star size={12} />
                          Recommended
                        </span>
                      )}
                      {isAlternative && (
                        <span className="text-xs text-mist-gray bg-white/10 px-2 py-0.5 rounded-full">
                          Alternative
                        </span>
                      )}
                      <span className={`font-semibold ${isRecommended ? 'text-pellucid-cyan' : 'text-photon-white'}`}>
                        {licence}
                      </span>
                      <span className="text-xs text-mist-gray">
                        {LICENCE_REQUIREMENTS[licence].fullName}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const categoryRows = LICENCE_COMPARISON.filter((row) => row.category === category);
              return (
                <>
                  <tr key={`category-${category}`}>
                    <td
                      colSpan={6}
                      className="px-4 py-3 bg-white/5 text-sm font-medium text-pellucid-cyan uppercase tracking-wider"
                    >
                      {category}
                    </td>
                  </tr>
                  {categoryRows.map((row, index) => (
                    <tr
                      key={`${category}-${index}`}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 text-mist-gray">{row.feature}</td>
                      {licenceTypes.map((licence) => {
                        const value = row[licence];
                        const isRecommended = licence === recommendation.recommended;
                        return (
                          <td
                            key={licence}
                            className={`
                              p-4 text-center
                              ${isRecommended ? 'bg-pellucid-cyan/5' : ''}
                            `}
                          >
                            {renderValue(value)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              );
            })}

            {/* Activities Row */}
            <tr>
              <td
                colSpan={6}
                className="px-4 py-3 bg-white/5 text-sm font-medium text-pellucid-cyan uppercase tracking-wider"
              >
                Permitted Activities
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-4 text-mist-gray">Services Allowed</td>
              {licenceTypes.map((licence) => {
                const isRecommended = licence === recommendation.recommended;
                const activities = LICENCE_REQUIREMENTS[licence].activities;
                return (
                  <td
                    key={licence}
                    className={`
                      p-4 text-left
                      ${isRecommended ? 'bg-pellucid-cyan/5' : ''}
                    `}
                  >
                    <ul className="text-xs text-mist-gray space-y-1">
                      {activities.slice(0, 4).map((activity, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <Check size={12} className="text-deep-teal flex-shrink-0 mt-0.5" />
                          {activity}
                        </li>
                      ))}
                      {activities.length > 4 && (
                        <li className="text-pellucid-cyan">+{activities.length - 4} more</li>
                      )}
                    </ul>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Selection Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        {licenceTypes.map((licence) => {
          const info = LICENCE_REQUIREMENTS[licence];
          const isRecommended = licence === recommendation.recommended;
          const isAlternative = recommendation.alternatives.includes(licence);

          return (
            <button
              key={licence}
              onClick={() => onSelect(licence)}
              className={`
                p-4 rounded-xl border text-left transition-all
                ${isRecommended
                  ? 'border-pellucid-cyan bg-pellucid-cyan/10 ring-2 ring-pellucid-cyan/30'
                  : isAlternative
                  ? 'border-white/20 bg-white/5 hover:border-pellucid-cyan/50'
                  : 'border-white/10 bg-white/5 hover:border-white/20 opacity-60 hover:opacity-100'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-lg font-bold ${
                    isRecommended ? 'text-pellucid-cyan' : 'text-photon-white'
                  }`}
                >
                  {licence}
                </span>
                {isRecommended && <Star size={16} className="text-pellucid-cyan" />}
              </div>
              <p className="text-xs text-mist-gray mb-3">{info.fullName}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-mist-gray">Capital:</span>
                  <span className="text-photon-white">€{info.initialCapital.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist-gray">Fee:</span>
                  <span className="text-photon-white">£{APPLICATION_FEES[licence]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist-gray">Time:</span>
                  <span className="text-photon-white">
                    {PROCESSING_TIMES[licence].min}-{PROCESSING_TIMES[licence].max}m
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-pellucid-cyan">
                Select {licence}
                <ArrowRight size={12} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Helper to render cell values
function renderValue(value: string): React.ReactNode {
  if (value === 'Yes') {
    return <Check size={18} className="text-deep-teal mx-auto" />;
  }
  if (value === 'No') {
    return <X size={18} className="text-red-400/60 mx-auto" />;
  }
  if (value === 'Required') {
    return (
      <span className="text-xs text-deep-teal bg-deep-teal/20 px-2 py-0.5 rounded-full">
        Required
      </span>
    );
  }
  if (value === 'Not required') {
    return (
      <span className="text-xs text-mist-gray bg-white/10 px-2 py-0.5 rounded-full">
        Not required
      </span>
    );
  }
  if (value.includes('€') || value.includes('£')) {
    return <span className="text-sm font-medium text-photon-white">{value}</span>;
  }
  return <span className="text-sm text-mist-gray">{value}</span>;
}

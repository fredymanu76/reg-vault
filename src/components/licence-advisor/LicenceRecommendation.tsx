// REG-VAULT Licence Recommendation Display
// Shows the recommended licence type with details

import { LicenceRecommendation as RecommendationType } from '@/types/journey';
import { LICENCE_REQUIREMENTS } from '@/data/licence-requirements';
import {
  Check,
  AlertTriangle,
  Info,
  ArrowRight,
  ExternalLink,
  Award,
  PoundSterling,
  Scale,
  ChevronRight,
  Edit3,
} from 'lucide-react';

interface LicenceRecommendationProps {
  recommendation: RecommendationType;
  onConfirm: () => void;
  onCompare: () => void;
  onEditAnswers: () => void;
}

export function LicenceRecommendation({
  recommendation,
  onConfirm,
  onCompare,
  onEditAnswers,
}: LicenceRecommendationProps) {
  const licenceInfo = LICENCE_REQUIREMENTS[recommendation.recommended];

  const getConfidenceColor = () => {
    switch (recommendation.confidence) {
      case 'high':
        return 'text-deep-teal bg-deep-teal/20';
      case 'medium':
        return 'text-apex-amber bg-apex-amber/20';
      case 'low':
        return 'text-red-400 bg-red-400/20';
    }
  };

  const getConfidenceText = () => {
    switch (recommendation.confidence) {
      case 'high':
        return 'High confidence';
      case 'medium':
        return 'Medium confidence';
      case 'low':
        return 'Low confidence - review recommended';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Recommendation Card */}
      <div className="glass-card p-6 border-2 border-pellucid-cyan/30">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-pellucid-cyan/20 flex items-center justify-center">
              <Award className="text-pellucid-cyan" size={24} />
            </div>
            <div>
              <p className="text-sm text-mist-gray">Recommended Licence</p>
              <h2 className="text-2xl font-bold text-pellucid-cyan">
                {licenceInfo.fullName}
              </h2>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor()}`}
          >
            {getConfidenceText()}
          </span>
        </div>

        <p className="text-mist-gray mb-6">{licenceInfo.description}</p>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <PoundSterling size={18} className="text-pellucid-cyan" />
              <h4 className="font-medium text-photon-white">Initial Capital</h4>
            </div>
            <p className="text-2xl font-bold text-photon-white">
              €{recommendation.capitalRequirement.initial.toLocaleString()}
            </p>
            {recommendation.capitalRequirement.initial === 0 && (
              <p className="text-sm text-deep-teal mt-1">No minimum requirement</p>
            )}
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scale size={18} className="text-pellucid-cyan" />
              <h4 className="font-medium text-photon-white">Ongoing Capital</h4>
            </div>
            <p className="text-2xl font-bold text-photon-white">
              €{recommendation.capitalRequirement.ongoing.toLocaleString()}
            </p>
            <p className="text-sm text-mist-gray mt-1">
              {recommendation.capitalRequirement.method}
            </p>
          </div>
        </div>

        {/* Reasoning */}
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-photon-white flex items-center gap-2">
            <Info size={18} className="text-pellucid-cyan" />
            Why This Licence?
          </h4>
          <ul className="space-y-2">
            {recommendation.reasoning.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-mist-gray">
                <Check size={16} className="text-deep-teal flex-shrink-0 mt-0.5" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Key Features of the Licence */}
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-photon-white">Key Features</h4>
          <div className="grid gap-2">
            {licenceInfo.keyFeatures.slice(0, 5).map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-mist-gray"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-pellucid-cyan" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {recommendation.warnings.length > 0 && (
          <div className="bg-apex-amber/10 border border-apex-amber/20 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-apex-amber flex items-center gap-2 mb-3">
              <AlertTriangle size={18} />
              Things to Consider
            </h4>
            <ul className="space-y-2">
              {recommendation.warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-mist-gray">
                  <AlertTriangle size={14} className="text-apex-amber flex-shrink-0 mt-0.5" />
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-pellucid-cyan text-void-black font-medium rounded-lg hover:bg-pellucid-cyan/90 transition-colors"
          >
            Proceed with {recommendation.recommended}
            <ArrowRight size={18} />
          </button>
          <button
            onClick={onCompare}
            className="flex items-center gap-2 px-4 py-3 bg-white/10 text-photon-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Compare Alternatives
            <ChevronRight size={18} />
          </button>
          <button
            onClick={onEditAnswers}
            className="flex items-center gap-2 px-4 py-3 text-mist-gray hover:text-photon-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Edit3 size={18} />
            Edit Answers
          </button>
        </div>
      </div>

      {/* Alternatives */}
      {recommendation.alternatives.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium text-photon-white mb-4">
            Alternative Options
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendation.alternatives.map((alt) => {
              const altInfo = LICENCE_REQUIREMENTS[alt];
              return (
                <div
                  key={alt}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-photon-white">
                      {altInfo.fullName}
                    </h4>
                    <span className="text-xs text-mist-gray px-2 py-0.5 bg-white/10 rounded-full">
                      {alt}
                    </span>
                  </div>
                  <p className="text-sm text-mist-gray mb-3">{altInfo.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-mist-gray">Initial Capital:</span>
                    <span className="text-photon-white font-medium">
                      €{altInfo.initialCapital.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regulatory References */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-medium text-photon-white mb-4">
          Regulatory References
        </h3>
        <div className="space-y-2">
          {recommendation.regulatoryReferences.map((ref, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-mist-gray"
            >
              <ExternalLink size={14} className="text-pellucid-cyan" />
              {ref}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

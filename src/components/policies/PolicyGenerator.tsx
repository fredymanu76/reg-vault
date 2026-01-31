'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  X,
} from 'lucide-react';
import { policyGenerationService, PolicyGenerationResult } from '@/services/policyService';
import { PolicyTemplate } from '@/data/policy-templates';
import { cn } from '@/lib/utils';

interface PolicyGeneratorProps {
  applicationId: string;
  companyName: string;
  licenceType: string;
  templates: PolicyTemplate[];
  selectedTemplateIds: string[];
  onComplete: (results: PolicyGenerationResult[]) => void;
  onClose: () => void;
}

interface GenerationStatus {
  templateId: string;
  templateName: string;
  status: 'pending' | 'generating' | 'success' | 'error';
  error?: string;
}

export function PolicyGenerator({
  applicationId,
  companyName,
  licenceType,
  templates,
  selectedTemplateIds,
  onComplete,
  onClose,
}: PolicyGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statuses, setStatuses] = useState<GenerationStatus[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<PolicyGenerationResult[]>([]);

  const selectedTemplates = templates.filter(t => selectedTemplateIds.includes(t.id));

  const startGeneration = async () => {
    setIsGenerating(true);
    setStatuses(
      selectedTemplates.map(t => ({
        templateId: t.id,
        templateName: t.name,
        status: 'pending',
      }))
    );

    const generationResults: PolicyGenerationResult[] = [];

    for (let i = 0; i < selectedTemplates.length; i++) {
      const template = selectedTemplates[i];
      setCurrentIndex(i);

      // Update status to generating
      setStatuses(prev =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: 'generating' } : s
        )
      );

      try {
        const result = await policyGenerationService.generateFromTemplate({
          applicationId,
          policyTemplateId: template.id,
          companyName,
          licenceType,
        });

        generationResults.push(result);

        // Update status based on result
        setStatuses(prev =>
          prev.map((s, idx) =>
            idx === i
              ? {
                  ...s,
                  status: result.success ? 'success' : 'error',
                  error: result.error,
                }
              : s
          )
        );
      } catch (error) {
        const errorResult: PolicyGenerationResult = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        generationResults.push(errorResult);

        setStatuses(prev =>
          prev.map((s, idx) =>
            idx === i
              ? { ...s, status: 'error', error: errorResult.error }
              : s
          )
        );
      }

      // Small delay between generations
      if (i < selectedTemplates.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setResults(generationResults);
    setIsGenerating(false);
  };

  const successCount = statuses.filter(s => s.status === 'success').length;
  const errorCount = statuses.filter(s => s.status === 'error').length;
  const isComplete = statuses.length > 0 && !isGenerating;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-2xl bg-gray-900 border border-white/10 rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Policy Generation
              </h2>
              <p className="text-sm text-gray-400">
                {selectedTemplates.length} policies selected
              </p>
            </div>
          </div>
          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {!isGenerating && statuses.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Ready to Generate
              </h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Generate {selectedTemplates.length} customized policies for{' '}
                <span className="text-white font-medium">{companyName}</span>{' '}
                based on {licenceType} requirements.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {selectedTemplates.slice(0, 5).map(t => (
                  <span
                    key={t.id}
                    className="px-3 py-1 text-sm bg-white/5 text-gray-300 rounded-full"
                  >
                    {t.name}
                  </span>
                ))}
                {selectedTemplates.length > 5 && (
                  <span className="px-3 py-1 text-sm bg-white/5 text-gray-400 rounded-full">
                    +{selectedTemplates.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {(isGenerating || statuses.length > 0) && (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {statuses.map((status, index) => (
                  <motion.div
                    key={status.templateId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                      status.status === 'generating' &&
                        'border-gold-500/30 bg-gold-500/5',
                      status.status === 'success' &&
                        'border-green-500/30 bg-green-500/5',
                      status.status === 'error' &&
                        'border-red-500/30 bg-red-500/5',
                      status.status === 'pending' &&
                        'border-white/10 bg-white/5'
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                      {status.status === 'pending' && (
                        <FileText className="w-4 h-4 text-gray-500" />
                      )}
                      {status.status === 'generating' && (
                        <Loader2 className="w-4 h-4 text-gold-500 animate-spin" />
                      )}
                      {status.status === 'success' && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                      {status.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium truncate',
                          status.status === 'pending' && 'text-gray-500',
                          status.status === 'generating' && 'text-gold-500',
                          status.status === 'success' && 'text-green-400',
                          status.status === 'error' && 'text-red-400'
                        )}
                      >
                        {status.templateName}
                      </p>
                      {status.error && (
                        <p className="text-xs text-red-400 mt-0.5">{status.error}</p>
                      )}
                    </div>
                    {status.status === 'generating' && (
                      <span className="text-xs text-gold-500">Generating...</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10"
            >
              <h4 className="text-sm font-medium text-white mb-2">
                Generation Complete
              </h4>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  {successCount} successful
                </span>
                {errorCount > 0 && (
                  <span className="flex items-center gap-1 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    {errorCount} failed
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-white/10 bg-black/20">
          {!isGenerating && statuses.length === 0 && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={startGeneration}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gold-500 text-black hover:bg-gold-400 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Start Generation
              </button>
            </>
          )}
          {isComplete && (
            <button
              onClick={() => onComplete(results)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gold-500 text-black hover:bg-gold-400 rounded-lg transition-colors"
            >
              View Policies
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PolicyGenerator;

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  AlertCircle,
  Save,
  Download,
  Eye,
  Settings,
  HelpCircle,
  Maximize2,
  Minimize2,
  CheckCircle,
  Circle,
  Loader2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { FCAForm, FormPage, FormSection, calculateFormCompletion } from '@/data/fca-forms';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface FormCockpitProps {
  form: FCAForm;
  applicationId: string;
  intakeData?: Record<string, unknown>;
  initialAnswers?: Record<string, unknown>;
  onSave?: (answers: Record<string, unknown>) => Promise<void>;
  onSubmit?: (answers: Record<string, unknown>) => Promise<void>;
  onClose?: () => void;
}

export function FormCockpit({
  form,
  applicationId,
  intakeData = {},
  initialAnswers = {},
  onSave,
  onSubmit,
  onClose,
}: FormCockpitProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialAnswers);
  const [pageCompletionStatus, setPageCompletionStatus] = useState<Record<string, 'complete' | 'partial' | 'empty'>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPageList, setShowPageList] = useState(true);
  const [autoPopulatedFields, setAutoPopulatedFields] = useState<Set<string>>(new Set());

  const currentPage = form.pages[currentPageIndex];
  const completionPercentage = calculateFormCompletion(form, answers);

  // Auto-populate from intake data
  useEffect(() => {
    const populated = new Set<string>();
    const newAnswers = { ...answers };

    form.pages.forEach(page => {
      page.sections.forEach(section => {
        section.fields.forEach(field => {
          if (field.intakeMapping && intakeData) {
            const mappedValue = getNestedValue(intakeData, field.intakeMapping);
            if (mappedValue !== undefined && !answers[field.id]) {
              newAnswers[field.id] = mappedValue;
              populated.add(field.id);
            }
          }
        });
      });
    });

    if (populated.size > 0) {
      setAnswers(newAnswers);
      setAutoPopulatedFields(populated);
    }
  }, [form, intakeData]);

  // Calculate page completion status
  useEffect(() => {
    const status: Record<string, 'complete' | 'partial' | 'empty'> = {};

    form.pages.forEach(page => {
      let totalRequired = 0;
      let completedRequired = 0;

      page.sections.forEach(section => {
        section.fields.forEach(field => {
          if (field.required) {
            totalRequired++;
            if (answers[field.id] !== undefined && answers[field.id] !== '' &&
                !(Array.isArray(answers[field.id]) && (answers[field.id] as unknown[]).length === 0)) {
              completedRequired++;
            }
          }
        });
      });

      if (totalRequired === 0 || completedRequired === totalRequired) {
        status[page.id] = 'complete';
      } else if (completedRequired > 0) {
        status[page.id] = 'partial';
      } else {
        status[page.id] = 'empty';
      }
    });

    setPageCompletionStatus(status);
  }, [form, answers]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (onSave && Object.keys(answers).length > 0) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [answers, onSave]);

  const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
    return path.split('.').reduce((acc: unknown, part) => {
      if (acc && typeof acc === 'object') {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  };

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
    // Remove from auto-populated if manually changed
    if (autoPopulatedFields.has(fieldId)) {
      setAutoPopulatedFields(prev => {
        const next = new Set(prev);
        next.delete(fieldId);
        return next;
      });
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(answers);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving form:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    await onSubmit(answers);
  };

  const goToPage = (index: number) => {
    setCurrentPageIndex(index);
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPageIndex < form.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const getPageStatusIcon = (status: 'complete' | 'partial' | 'empty') => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'partial':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  const estimatedTimeRemaining = form.pages
    .slice(currentPageIndex)
    .reduce((acc, page) => {
      return acc + page.sections.reduce((sAcc, s) => sAcc + (s.estimatedTime || 5), 0);
    }, 0);

  return (
    <div
      className={cn(
        'flex flex-col bg-gray-950 transition-all duration-300',
        isFullscreen ? 'fixed inset-0 z-50' : 'rounded-2xl border border-white/10 overflow-hidden'
      )}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/50 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-gold-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">{form.title}</h1>
            <p className="text-sm text-gray-400">{form.fcaReference}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Progress Ring */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="rgb(212, 175, 55)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${completionPercentage * 1.26} 126`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {completionPercentage}%
              </span>
            </div>
            <div className="text-sm">
              <p className="text-white font-medium">Progress</p>
              <p className="text-gray-400">{estimatedTimeRemaining} min left</p>
            </div>
          </div>

          {/* Save Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 text-gold-500 animate-spin" />
                <span className="text-sm text-gray-400">Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-400">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-400">Not saved</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Page Navigation */}
        <AnimatePresence>
          {showPageList && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-white/10 bg-black/30 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Form Pages
                  </h2>
                  <span className="text-xs text-gray-500">
                    {currentPageIndex + 1} of {form.pages.length}
                  </span>
                </div>

                <div className="space-y-1">
                  {form.pages.map((page, index) => {
                    const status = pageCompletionStatus[page.id] || 'empty';
                    const isActive = index === currentPageIndex;

                    return (
                      <button
                        key={page.id}
                        onClick={() => goToPage(index)}
                        className={cn(
                          'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all',
                          isActive
                            ? 'bg-gold-500/10 border border-gold-500/30'
                            : 'hover:bg-white/5 border border-transparent'
                        )}
                      >
                        <div className="flex-shrink-0">
                          {getPageStatusIcon(status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'text-xs font-bold px-2 py-0.5 rounded',
                                isActive
                                  ? 'bg-gold-500 text-black'
                                  : 'bg-white/10 text-gray-400'
                              )}
                            >
                              {page.number}
                            </span>
                            <span
                              className={cn(
                                'text-sm font-medium truncate',
                                isActive ? 'text-gold-500' : 'text-white'
                              )}
                            >
                              {page.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {page.sections.length} section{page.sections.length !== 1 ? 's' : ''}
                            </span>
                            {status === 'complete' && (
                              <span className="text-xs text-green-400">Complete</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight
                          className={cn(
                            'w-4 h-4 flex-shrink-0 transition-colors',
                            isActive ? 'text-gold-500' : 'text-gray-600'
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-white/10">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Sparkles className="w-4 h-4" />
                    Auto-fill from Intake
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    Preview Form
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setShowPageList(!showPageList)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-gray-800 border border-white/10 rounded-r-lg hover:bg-gray-700 transition-colors"
          style={{ left: showPageList ? '320px' : '0' }}
        >
          {showPageList ? (
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Main Form Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 text-sm font-bold bg-gold-500 text-black rounded-lg">
                  Page {currentPage.number}
                </span>
                {pageCompletionStatus[currentPage.id] === 'complete' && (
                  <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-lg">
                    <Check className="w-3 h-3" />
                    Complete
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-white">{currentPage.title}</h2>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {currentPage.sections.map((section, sectionIndex) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
                >
                  {/* Section Header */}
                  <div className="p-6 border-b border-white/10 bg-black/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gold-500">
                            Section {section.number}
                          </span>
                          {section.isRequired && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                        {section.description && (
                          <p className="text-sm text-gray-400 mt-1">{section.description}</p>
                        )}
                      </div>
                      {section.estimatedTime && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          ~{section.estimatedTime} min
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section Fields */}
                  <div className="p-6 space-y-6">
                    {section.fields.map(field => {
                      // Check conditional display
                      if (field.conditionalOn) {
                        const conditionValue = answers[field.conditionalOn.field];
                        if (conditionValue !== field.conditionalOn.value) {
                          return null;
                        }
                      }

                      return (
                        <FormField
                          key={field.id}
                          field={field}
                          value={answers[field.id]}
                          onChange={value => handleFieldChange(field.id, value)}
                          isAutoPopulated={autoPopulatedFields.has(field.id)}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/10">
              <button
                onClick={goToPrevPage}
                disabled={currentPageIndex === 0}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all',
                  currentPageIndex === 0
                    ? 'text-gray-600 cursor-not-allowed'
                    : 'text-white bg-white/10 hover:bg-white/20'
                )}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous Page
              </button>

              <div className="flex items-center gap-2">
                {form.pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all',
                      index === currentPageIndex
                        ? 'bg-gold-500 w-8'
                        : pageCompletionStatus[form.pages[index].id] === 'complete'
                        ? 'bg-green-500'
                        : 'bg-white/20 hover:bg-white/40'
                    )}
                  />
                ))}
              </div>

              {currentPageIndex === form.pages.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-black font-medium rounded-xl hover:bg-gold-400 transition-all"
                >
                  Submit Application
                  <Check className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={goToNextPage}
                  className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-black font-medium rounded-xl hover:bg-gold-400 transition-all"
                >
                  Next Page
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormCockpit;

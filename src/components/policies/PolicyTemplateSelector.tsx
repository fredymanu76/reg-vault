'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Shield,
  Building2,
  AlertTriangle,
  Scale,
  Users,
  Server,
  Lock,
  CheckCircle,
  ChevronRight,
} from 'lucide-react';
import { PolicyTemplate, policyCategories } from '@/data/policy-templates';
import { policyTemplateService } from '@/services/policyService';
import { cn } from '@/lib/utils';

interface PolicyTemplateSelectorProps {
  licenceType: string;
  selectedTemplates: string[];
  onSelectionChange: (templateIds: string[]) => void;
  onGenerate: (templateIds: string[]) => void;
  isGenerating?: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
  governance: Building2,
  financial_crime: Shield,
  safeguarding: Lock,
  conduct: Users,
  systems_controls: Server,
  reporting: FileText,
  capital: Scale,
};

export function PolicyTemplateSelector({
  licenceType,
  selectedTemplates,
  onSelectionChange,
  onGenerate,
  isGenerating = false,
}: PolicyTemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const templates = policyTemplateService.getForLicenceType(licenceType);

  const handleToggleTemplate = (templateId: string) => {
    if (selectedTemplates.includes(templateId)) {
      onSelectionChange(selectedTemplates.filter(id => id !== templateId));
    } else {
      onSelectionChange([...selectedTemplates, templateId]);
    }
  };

  const handleSelectAll = () => {
    const allIds = templates.map(t => t.id);
    onSelectionChange(allIds);
  };

  const handleSelectNone = () => {
    onSelectionChange([]);
  };

  const getTemplatesByCategory = (categoryId: string) => {
    return templates.filter(t => t.category === categoryId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Select Policy Templates</h3>
          <p className="text-sm text-gray-400 mt-1">
            Choose policies to generate for your {licenceType} application
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="px-3 py-1.5 text-sm text-gold-500 hover:text-gold-400 transition-colors"
          >
            Select All
          </button>
          <button
            onClick={handleSelectNone}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policyCategories.map(category => {
          const Icon = categoryIcons[category.id] || FileText;
          const categoryTemplates = getTemplatesByCategory(category.id);
          const selectedCount = categoryTemplates.filter(t =>
            selectedTemplates.includes(t.id)
          ).length;

          if (categoryTemplates.length === 0) return null;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'relative p-4 rounded-xl border cursor-pointer transition-all duration-200',
                activeCategory === category.id
                  ? 'border-gold-500/50 bg-gold-500/5'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              )}
              onClick={() =>
                setActiveCategory(activeCategory === category.id ? null : category.id)
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      activeCategory === category.id
                        ? 'bg-gold-500/20'
                        : 'bg-white/10'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5',
                        activeCategory === category.id
                          ? 'text-gold-500'
                          : 'text-gray-400'
                      )}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{category.name}</h4>
                    <p className="text-xs text-gray-400">
                      {categoryTemplates.length} policies
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-gold-500/20 text-gold-500 rounded-full">
                      {selectedCount}
                    </span>
                  )}
                  <ChevronRight
                    className={cn(
                      'w-4 h-4 text-gray-400 transition-transform',
                      activeCategory === category.id && 'rotate-90'
                    )}
                  />
                </div>
              </div>

              {/* Expanded Templates */}
              {activeCategory === category.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2"
                  onClick={e => e.stopPropagation()}
                >
                  {categoryTemplates.map(template => (
                    <label
                      key={template.id}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                        selectedTemplates.includes(template.id)
                          ? 'bg-gold-500/10 border border-gold-500/30'
                          : 'bg-white/5 border border-transparent hover:bg-white/10'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTemplates.includes(template.id)}
                        onChange={() => handleToggleTemplate(template.id)}
                        className="mt-1 w-4 h-4 rounded border-gray-600 text-gold-500 focus:ring-gold-500 bg-transparent"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {template.name}
                          </span>
                          {template.isRequired && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-red-500/20 text-red-400 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.fcaReference.slice(0, 2).map(ref => (
                            <span
                              key={ref}
                              className="px-1.5 py-0.5 text-[10px] bg-white/5 text-gray-400 rounded"
                            >
                              {ref}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>
                  ))}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Generate Button */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="text-sm text-gray-400">
          {selectedTemplates.length} of {templates.length} policies selected
        </div>
        <button
          onClick={() => onGenerate(selectedTemplates)}
          disabled={selectedTemplates.length === 0 || isGenerating}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all',
            selectedTemplates.length > 0 && !isGenerating
              ? 'bg-gold-500 text-black hover:bg-gold-400'
              : 'bg-white/10 text-gray-500 cursor-not-allowed'
          )}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Generate {selectedTemplates.length} Policies
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default PolicyTemplateSelector;

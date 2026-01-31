'use client';

import { useState } from 'react';
import { FormField as FormFieldType } from '@/data/fca-forms';
import { cn } from '@/lib/utils';
import { HelpCircle, Check, AlertCircle } from 'lucide-react';

interface FormFieldProps {
  field: FormFieldType;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  isAutoPopulated?: boolean;
}

export function FormField({ field, value, onChange, error, isAutoPopulated }: FormFieldProps) {
  const [showHelp, setShowHelp] = useState(false);

  const baseInputClass = cn(
    'w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500',
    'focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50',
    'transition-all duration-200',
    error ? 'border-red-500/50' : 'border-white/10',
    isAutoPopulated && 'border-green-500/30 bg-green-500/5'
  );

  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={field.type === 'phone' ? 'tel' : field.type}
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={(value as number) || ''}
            onChange={e => onChange(e.target.valueAsNumber || '')}
            placeholder={field.placeholder}
            className={baseInputClass}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">£</span>
            <input
              type="number"
              value={(value as number) || ''}
              onChange={e => onChange(e.target.valueAsNumber || '')}
              placeholder={field.placeholder || '0.00'}
              className={cn(baseInputClass, 'pl-8')}
              required={field.required}
              step="0.01"
            />
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            className={baseInputClass}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={cn(baseInputClass, 'min-h-[120px] resize-y')}
            required={field.required}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
          />
        );

      case 'select':
        return (
          <select
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            className={baseInputClass}
            required={field.required}
          >
            <option value="">Select an option...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label
                key={option.value}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                  value === option.value
                    ? 'border-gold-500/50 bg-gold-500/10'
                    : 'border-white/10 hover:border-white/20'
                )}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={e => onChange(e.target.value)}
                  className="w-4 h-4 text-gold-500 border-gray-600 focus:ring-gold-500"
                />
                <span className="text-white">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const checkboxValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label
                key={option.value}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                  checkboxValues.includes(option.value)
                    ? 'border-gold-500/50 bg-gold-500/10'
                    : 'border-white/10 hover:border-white/20'
                )}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={checkboxValues.includes(option.value)}
                  onChange={e => {
                    if (e.target.checked) {
                      onChange([...checkboxValues, option.value]);
                    } else {
                      onChange(checkboxValues.filter((v: string) => v !== option.value));
                    }
                  }}
                  className="mt-1 w-4 h-4 text-gold-500 border-gray-600 rounded focus:ring-gold-500"
                />
                <span className="text-white text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'address':
        const addressValue = (value as Record<string, string>) || {};
        return (
          <div className="space-y-3">
            {field.subFields?.map(subField => (
              <div key={subField.id}>
                <label className="block text-sm text-gray-400 mb-1">
                  {subField.label}
                  {subField.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <input
                  type="text"
                  value={addressValue[subField.id] || ''}
                  onChange={e =>
                    onChange({ ...addressValue, [subField.id]: e.target.value })
                  }
                  className={baseInputClass}
                  required={subField.required}
                />
              </div>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className="relative">
            <input
              type="file"
              onChange={e => onChange(e.target.files?.[0])}
              className="hidden"
              id={field.id}
            />
            <label
              htmlFor={field.id}
              className={cn(
                baseInputClass,
                'flex items-center justify-center gap-2 cursor-pointer text-center py-8'
              )}
            >
              <span className="text-gray-400">
                {value ? (value as File).name : 'Click to upload file...'}
              </span>
            </label>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={(value as string) || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <label className="block text-sm font-medium text-white">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
          {isAutoPopulated && (
            <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
              <Check className="w-3 h-3" />
              Auto-populated
            </span>
          )}
        </label>
        {field.helpText && (
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {showHelp && field.helpText && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
          {field.helpText}
        </div>
      )}

      {renderInput()}

      {error && (
        <div className="flex items-center gap-1 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {field.validation?.maxLength && field.type === 'textarea' && (
        <div className="text-xs text-gray-500 text-right">
          {((value as string) || '').length} / {field.validation.maxLength}
        </div>
      )}
    </div>
  );
}

export default FormField;

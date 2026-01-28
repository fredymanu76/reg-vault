'use client';

import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'danger';
  className?: string;
}

export default function Progress({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  variant = 'gold',
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-[var(--color-text-muted)]',
    gold: 'bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-dark)]',
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    warning: 'bg-gradient-to-r from-amber-500 to-amber-600',
    danger: 'bg-gradient-to-r from-red-500 to-red-600',
  };

  const glowColors = {
    default: '',
    gold: 'shadow-[0_0_10px_rgba(212,175,55,0.5)]',
    success: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    warning: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    danger: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[var(--color-text-muted)]">Progress</span>
          <span className="text-sm font-semibold text-[var(--color-gold)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-[var(--color-surface)] rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variants[variant],
            glowColors[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

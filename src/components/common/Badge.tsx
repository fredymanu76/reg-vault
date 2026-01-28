'use client';

import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold';
  size?: 'sm' | 'md';
}

export default function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
    success: 'bg-[rgba(16,185,129,0.15)] text-emerald-400 border-emerald-500/30',
    warning: 'bg-[rgba(245,158,11,0.15)] text-amber-400 border-amber-500/30',
    danger: 'bg-[rgba(239,68,68,0.15)] text-red-400 border-red-500/30',
    info: 'bg-[rgba(59,130,246,0.15)] text-blue-400 border-blue-500/30',
    gold: 'bg-[rgba(212,175,55,0.15)] text-[var(--color-gold)] border-[var(--color-gold)]/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border uppercase tracking-wide',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

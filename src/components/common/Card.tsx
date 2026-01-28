'use client';

import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  glow?: boolean;
}

export function Card({
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  glow = false,
  children,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-xl border transition-all duration-300';

  const variants = {
    default: 'bg-[var(--glass-bg)] backdrop-blur-[20px] border-[var(--glass-border)]',
    elevated: 'bg-[var(--glass-bg-elevated)] backdrop-blur-[20px] border-[var(--glass-border)]',
    bordered: 'bg-transparent border-[var(--color-border)]',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover
    ? 'hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-lg)]'
    : '';

  const glowStyles = glow ? 'shadow-[var(--shadow-glow)]' : '';

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        glowStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  description,
  action,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn('flex items-start justify-between mb-4', className)}
      {...props}
    >
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--color-text-muted)] mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[var(--color-border)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

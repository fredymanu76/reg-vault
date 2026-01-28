import { type ClassValue, clsx } from 'clsx';

// Classname utility (lightweight alternative to clsx + twMerge)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

// Format date with time
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

// Generate reference number
export function generateReferenceNumber(prefix: string = 'RV'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Calculate progress percentage
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Capitalize first letter
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Format licence type for display
export function formatLicenceType(type: string): string {
  const mapping: Record<string, string> = {
    SPI: 'Small Payment Institution',
    SMALL_EMI: 'Small E-Money Institution',
    API: 'Authorised Payment Institution',
    EMI: 'E-Money Institution',
    AISP: 'Account Information Service Provider',
    PISP: 'Payment Initiation Service Provider',
    RAISP: 'Registered AISP',
  };
  return mapping[type] || type;
}

// Format status for display
export function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
}

// Get status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'text-gray-400',
    intake_in_progress: 'text-yellow-500',
    intake_complete: 'text-blue-500',
    documents_generating: 'text-purple-500',
    review_pending: 'text-orange-500',
    review_in_progress: 'text-orange-400',
    approved: 'text-green-500',
    submitted_to_fca: 'text-blue-400',
    fca_queries: 'text-yellow-400',
    authorised: 'text-green-400',
    rejected: 'text-red-500',
    withdrawn: 'text-gray-500',
  };
  return colors[status] || 'text-gray-400';
}

// Get risk rating color
export function getRiskColor(rating: string): string {
  const colors: Record<string, string> = {
    low: 'text-green-500 bg-green-500/10',
    medium: 'text-yellow-500 bg-yellow-500/10',
    high: 'text-orange-500 bg-orange-500/10',
    critical: 'text-red-500 bg-red-500/10',
  };
  return colors[rating] || 'text-gray-500 bg-gray-500/10';
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 7) return formatDate(dateString);
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMinutes > 0) return `${diffMinutes}m ago`;
  return 'Just now';
}

export function getSentimentColor(sentiment: string): string {
  const colors: Record<string, string> = {
    very_negative: 'text-danger-600 bg-danger-50',
    negative: 'text-danger-600 bg-danger-50',
    neutral: 'text-secondary-600 bg-secondary-100',
    positive: 'text-success-600 bg-success-50',
    very_positive: 'text-success-600 bg-success-50',
  };
  return colors[sentiment] || colors.neutral;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    high: 'text-danger-600 bg-danger-50 border-danger-200',
    investigate: 'text-warning-600 bg-warning-50 border-warning-200',
    low: 'text-success-600 bg-success-50 border-success-200',
  };
  return colors[priority] || colors.low;
}

export function getThemeColor(theme: string): string {
  const colors: Record<string, string> = {
    performance: 'bg-primary-100 text-primary-700',
    ux_usability: 'bg-secondary-100 text-secondary-700',
    pricing: 'bg-warning-100 text-warning-700',
    reliability: 'bg-danger-100 text-danger-700',
    missing_features: 'bg-success-100 text-success-700',
    onboarding: 'bg-primary-100 text-primary-700',
    integrations: 'bg-secondary-100 text-secondary-700',
    mobile_experience: 'bg-warning-100 text-warning-700',
    security_privacy: 'bg-danger-100 text-danger-700',
    customer_support: 'bg-success-100 text-success-700',
    billing: 'bg-warning-100 text-warning-700',
  };
  return colors[theme] || colors.secondary;
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T | ((item: T) => number | string), direction: 'asc' | 'desc' = 'desc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function uniqueBy<T>(array: T[], key: keyof T | ((item: T) => string)): T[] {
  const seen = new Set<string>();
  return array.filter(item => {
    const k = typeof key === 'function' ? key(item) : String(item[key]);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
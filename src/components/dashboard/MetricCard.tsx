import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive?: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantStyles = {
  default: {
    icon: 'bg-primary/20 text-primary',
    border: 'border-border hover:border-primary/30',
  },
  success: {
    icon: 'bg-success/20 text-success',
    border: 'border-border hover:border-success/30',
  },
  warning: {
    icon: 'bg-warning/20 text-warning',
    border: 'border-border hover:border-warning/30',
  },
  danger: {
    icon: 'bg-destructive/20 text-destructive',
    border: 'border-border hover:border-destructive/30',
  },
  info: {
    icon: 'bg-info/20 text-info',
    border: 'border-border hover:border-info/30',
  },
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: MetricCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 metric-card',
        styles.border,
        className
      )}
    >
      {/* Glow effect for danger variant */}
      {variant === 'danger' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive/50 via-destructive to-destructive/50" />
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold tracking-tight animate-count-up">{value}</p>
            {trend && (
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.positive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', styles.icon)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning';
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusIndicator({ status, label, size = 'md' }: StatusIndicatorProps) {
  const statusStyles = {
    online: 'bg-success text-success',
    offline: 'bg-destructive text-destructive',
    warning: 'bg-warning text-warning',
  };

  const sizeStyles = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'rounded-full',
          sizeStyles[size],
          statusStyles[status].split(' ')[0],
          status === 'online' && 'pulse-live'
        )}
      />
      {label && (
        <span className={cn('text-xs capitalize', statusStyles[status].split(' ')[1])}>
          {label || status}
        </span>
      )}
    </div>
  );
}

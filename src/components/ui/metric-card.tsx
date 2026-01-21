import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  accentColor?: 'primary' | 'accent' | 'gpu' | 'tpu' | 'npu';
  className?: string;
}

const accentColors = {
  primary: 'from-primary/20 to-transparent border-primary/30',
  accent: 'from-accent/20 to-transparent border-accent/30',
  gpu: 'from-gpu/20 to-transparent border-gpu/30',
  tpu: 'from-tpu/20 to-transparent border-tpu/30',
  npu: 'from-npu/20 to-transparent border-npu/30',
};

const iconColors = {
  primary: 'text-primary bg-primary/10',
  accent: 'text-accent bg-accent/10',
  gpu: 'text-gpu bg-gpu/10',
  tpu: 'text-tpu bg-tpu/10',
  npu: 'text-npu bg-npu/10',
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'primary',
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-card p-5 metric-card card-glow',
        'bg-gradient-to-br',
        accentColors[accentColor],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            {trend && (
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.direction === 'up' ? 'text-status-healthy' : 'text-status-critical'
                )}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'rounded-lg p-2.5',
              iconColors[accentColor]
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

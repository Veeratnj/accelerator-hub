import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'Active' | 'Idle' | 'Offline' | 'Running' | 'Queued' | 'Completed' | 'Failed' | 'Healthy' | 'Warning' | 'Critical';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

const statusConfig = {
  Active: { bg: 'bg-status-healthy/20', text: 'text-status-healthy', dot: 'bg-status-healthy' },
  Running: { bg: 'bg-status-healthy/20', text: 'text-status-healthy', dot: 'bg-status-healthy' },
  Healthy: { bg: 'bg-status-healthy/20', text: 'text-status-healthy', dot: 'bg-status-healthy' },
  Completed: { bg: 'bg-status-healthy/20', text: 'text-status-healthy', dot: 'bg-status-healthy' },
  Idle: { bg: 'bg-status-warning/20', text: 'text-status-warning', dot: 'bg-status-warning' },
  Queued: { bg: 'bg-status-warning/20', text: 'text-status-warning', dot: 'bg-status-warning' },
  Warning: { bg: 'bg-status-warning/20', text: 'text-status-warning', dot: 'bg-status-warning' },
  Offline: { bg: 'bg-status-critical/20', text: 'text-status-critical', dot: 'bg-status-critical' },
  Failed: { bg: 'bg-status-critical/20', text: 'text-status-critical', dot: 'bg-status-critical' },
  Critical: { bg: 'bg-status-critical/20', text: 'text-status-critical', dot: 'bg-status-critical' },
};

const sizeConfig = {
  sm: { badge: 'px-2 py-0.5 text-xs', dot: 'w-1.5 h-1.5' },
  md: { badge: 'px-2.5 py-1 text-xs', dot: 'w-2 h-2' },
  lg: { badge: 'px-3 py-1.5 text-sm', dot: 'w-2.5 h-2.5' },
};

export function StatusBadge({ status, size = 'md', pulse = false }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        config.bg,
        config.text,
        sizeClass.badge
      )}
    >
      <span
        className={cn(
          'rounded-full',
          config.dot,
          sizeClass.dot,
          pulse && 'animate-pulse-glow'
        )}
      />
      {status}
    </span>
  );
}

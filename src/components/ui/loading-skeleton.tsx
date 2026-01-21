import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'chart' | 'table-row';
}

export function LoadingSkeleton({ className, variant = 'text' }: LoadingSkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded',
    card: 'h-32 w-full rounded-xl',
    chart: 'h-64 w-full rounded-xl',
    'table-row': 'h-12 w-full rounded',
  };

  return (
    <div
      className={cn(
        'skeleton-shimmer bg-muted',
        variants[variant],
        className
      )}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <LoadingSkeleton className="h-4 w-24" />
          <LoadingSkeleton className="h-8 w-32" />
          <LoadingSkeleton className="h-3 w-20" />
        </div>
        <LoadingSkeleton className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <LoadingSkeleton className="h-5 w-40 mb-4" />
      <LoadingSkeleton variant="chart" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <LoadingSkeleton className="h-5 w-32" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4">
            <LoadingSkeleton variant="table-row" />
          </div>
        ))}
      </div>
    </div>
  );
}

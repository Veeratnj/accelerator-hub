import { cn } from "@/lib/utils";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function ChartContainer({
  title,
  subtitle,
  children,
  className,
  action,
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5 card-glow animate-fade-in',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}

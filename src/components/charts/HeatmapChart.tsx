import { ChartContainer } from '@/components/ui/chart-container';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeatmapChartProps {
  data: Array<{
    id: string;
    utilization: number;
    temperature: number;
    power: number;
  }>;
}

const getColor = (value: number) => {
  if (value >= 90) return 'bg-status-critical';
  if (value >= 70) return 'bg-status-warning';
  return 'bg-status-healthy';
};

const getOpacity = (value: number) => {
  if (value >= 80) return 'opacity-100';
  if (value >= 60) return 'opacity-80';
  if (value >= 40) return 'opacity-60';
  return 'opacity-40';
};

export function HeatmapChart({ data }: HeatmapChartProps) {
  const metrics = ['utilization', 'temperature', 'power'] as const;

  return (
    <ChartContainer
      title="Accelerator Health Matrix"
      subtitle="Real-time health indicators"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">
                Accelerator
              </th>
              {metrics.map((metric) => (
                <th
                  key={metric}
                  className="text-center text-xs font-medium text-muted-foreground pb-3 px-2 capitalize"
                >
                  {metric}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t border-border/50">
                <td className="py-2 pr-4">
                  <span className="text-sm font-medium text-foreground">{row.id}</span>
                </td>
                {metrics.map((metric) => {
                  const value = row[metric];
                  return (
                    <td key={metric} className="py-2 px-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              'w-full h-8 rounded flex items-center justify-center cursor-pointer transition-all hover:scale-105',
                              getColor(value),
                              getOpacity(value)
                            )}
                          >
                            <span className="text-xs font-medium text-white">
                              {value}
                              {metric === 'temperature' ? '°C' : '%'}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">
                            {row.id} - {metric}: {value}
                            {metric === 'temperature' ? '°C' : '%'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-status-healthy" />
          <span className="text-xs text-muted-foreground">Healthy (&lt;70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-status-warning" />
          <span className="text-xs text-muted-foreground">Warning (70-90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-status-critical" />
          <span className="text-xs text-muted-foreground">Critical (&gt;90%)</span>
        </div>
      </div>
    </ChartContainer>
  );
}

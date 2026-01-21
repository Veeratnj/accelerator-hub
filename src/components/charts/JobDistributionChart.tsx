import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart-container';

interface JobDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  totalJobs: number;
  activeJobs: number;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="text-foreground font-medium">{data.name}</span>
        </div>
        <p className="text-lg font-bold text-foreground mt-1">{data.value} jobs</p>
      </div>
    );
  }
  return null;
};

export function JobDistributionChart({ data, totalJobs, activeJobs }: JobDistributionChartProps) {
  return (
    <ChartContainer
      title="Job Distribution"
      subtitle="By accelerator type"
    >
      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-3xl font-bold text-foreground">{totalJobs}</p>
          <p className="text-xs text-muted-foreground">Total Jobs</p>
          <p className="text-sm font-medium text-status-healthy mt-1">{activeJobs} Active</p>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </ChartContainer>
  );
}

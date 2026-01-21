import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart-container';

interface UtilizationBarChartProps {
  data: Array<{
    type: string;
    utilization: number;
    memory: number;
    power: number;
  }>;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="text-foreground font-medium">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function UtilizationBarChart({ data }: UtilizationBarChartProps) {
  return (
    <ChartContainer
      title="Accelerator Utilization Overview"
      subtitle="Compare GPU, TPU, and NPU metrics"
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.5}
          />
          <XAxis
            dataKey="type"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground capitalize">{value}</span>
            )}
          />
          <Bar
            dataKey="utilization"
            name="Utilization"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="memory"
            name="Memory"
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="power"
            name="Power"
            fill="hsl(var(--chart-3))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

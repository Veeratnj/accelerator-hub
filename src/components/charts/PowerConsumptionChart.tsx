import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart-container';

interface PowerConsumptionChartProps {
  data: Array<{
    time: string;
    gpu: number;
    tpu: number;
    npu: number;
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
            <span className="text-muted-foreground uppercase">{entry.name}:</span>
            <span className="text-foreground font-medium">{entry.value} kW</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function PowerConsumptionChart({ data }: PowerConsumptionChartProps) {
  return (
    <ChartContainer
      title="Power Consumption"
      subtitle="Energy usage by accelerator type (kW)"
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="gpuPowerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--gpu-color))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--gpu-color))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.5}
          />
          <XAxis
            dataKey="time"
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
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground uppercase">{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="gpu"
            name="GPU"
            stroke="hsl(var(--gpu-color))"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2 }}
            activeDot={{ r: 5, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="tpu"
            name="TPU"
            stroke="hsl(var(--tpu-color))"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2 }}
            activeDot={{ r: 5, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="npu"
            name="NPU"
            stroke="hsl(var(--npu-color))"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2 }}
            activeDot={{ r: 5, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

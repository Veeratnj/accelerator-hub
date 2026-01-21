import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  ZAxis,
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart-container';

interface CostPerformanceChartProps {
  data: Array<{
    type: string;
    cost: number;
    performance: number;
    name: string;
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-foreground">{data.name}</p>
        <p className="text-xs text-muted-foreground mt-1">Type: {data.type}</p>
        <div className="flex gap-4 mt-2">
          <div>
            <p className="text-xs text-muted-foreground">Cost/hr</p>
            <p className="text-sm font-medium text-foreground">${data.cost}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Performance</p>
            <p className="text-sm font-medium text-foreground">{data.performance}%</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function CostPerformanceChart({ data }: CostPerformanceChartProps) {
  const gpuData = data.filter((d) => d.type === 'GPU');
  const tpuData = data.filter((d) => d.type === 'TPU');
  const npuData = data.filter((d) => d.type === 'NPU');

  return (
    <ChartContainer
      title="Cost vs Performance"
      subtitle="Optimization insights by accelerator type"
    >
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.5}
          />
          <XAxis
            dataKey="cost"
            type="number"
            name="Cost"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 5]}
            tickFormatter={(value) => `$${value}`}
            label={{
              value: 'Cost/hour',
              position: 'bottom',
              offset: 0,
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 11,
            }}
          />
          <YAxis
            dataKey="performance"
            type="number"
            name="Performance"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[50, 100]}
            tickFormatter={(value) => `${value}%`}
            label={{
              value: 'Performance Score',
              angle: -90,
              position: 'insideLeft',
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 11,
            }}
          />
          <ZAxis range={[100, 200]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            name="GPU"
            data={gpuData}
            fill="hsl(var(--gpu-color))"
          />
          <Scatter
            name="TPU"
            data={tpuData}
            fill="hsl(var(--tpu-color))"
          />
          <Scatter
            name="NPU"
            data={npuData}
            fill="hsl(var(--npu-color))"
          />
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gpu" />
          <span className="text-xs text-muted-foreground">GPU</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-tpu" />
          <span className="text-xs text-muted-foreground">TPU</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-npu" />
          <span className="text-xs text-muted-foreground">NPU</span>
        </div>
      </div>
    </ChartContainer>
  );
}

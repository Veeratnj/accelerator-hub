import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCardSkeleton } from '@/components/ui/loading-skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchData, simulateAction } from '@/services/api';
import type { Accelerator, AcceleratorPools as AcceleratorPoolsType } from '@/types/accelerator';
import { toast } from 'sonner';
import {
  Cpu,
  Server,
  Zap,
  ChevronUp,
  ChevronDown,
  PlayCircle,
  StopCircle,
  Thermometer,
  Battery,
  MemoryStick,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AcceleratorCardProps {
  accelerator: Accelerator;
  type: 'gpu' | 'tpu' | 'npu';
  onAction: (action: string, id: string) => void;
}

function AcceleratorCard({ accelerator, type, onAction }: AcceleratorCardProps) {
  const colorClass = type === 'gpu' ? 'gpu' : type === 'tpu' ? 'tpu' : 'npu';
  const Icon = type === 'gpu' ? Cpu : type === 'tpu' ? Server : Zap;

  return (
    <div className="rounded-xl border border-border bg-card p-5 card-glow hover:shadow-glow transition-shadow animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', `bg-${colorClass}/20`)}>
            <Icon className={cn('w-5 h-5', `text-${colorClass}`)} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{accelerator.id}</h3>
            <p className="text-xs text-muted-foreground">{accelerator.model}</p>
          </div>
        </div>
        <StatusBadge status={accelerator.status} size="sm" pulse={accelerator.status === 'Active'} />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Activity className="w-3.5 h-3.5" />
                <span className="text-xs">Utilization</span>
              </div>
              <p className="text-lg font-semibold text-foreground">{accelerator.utilization}%</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>Current compute utilization</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <MemoryStick className="w-3.5 h-3.5" />
                <span className="text-xs">Memory</span>
              </div>
              <p className="text-lg font-semibold text-foreground">{accelerator.memory}%</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>Memory usage percentage</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Battery className="w-3.5 h-3.5" />
                <span className="text-xs">Power</span>
              </div>
              <p className="text-lg font-semibold text-foreground">{accelerator.power}%</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>Power state percentage</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Thermometer className="w-3.5 h-3.5" />
                <span className="text-xs">Temp</span>
              </div>
              <p className={cn(
                'text-lg font-semibold',
                accelerator.temperature >= 70 ? 'text-status-critical' :
                accelerator.temperature >= 50 ? 'text-status-warning' : 'text-foreground'
              )}>
                {accelerator.temperature}°C
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent>Operating temperature</TooltipContent>
        </Tooltip>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onAction('Scale Up', accelerator.id)}
        >
          <ChevronUp className="w-3.5 h-3.5 mr-1" />
          Scale Up
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onAction('Scale Down', accelerator.id)}
        >
          <ChevronDown className="w-3.5 h-3.5 mr-1" />
          Scale Down
        </Button>
      </div>
      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onAction('Drain', accelerator.id)}
        >
          <StopCircle className="w-3.5 h-3.5 mr-1" />
          Drain
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onAction('Assign Job', accelerator.id)}
        >
          <PlayCircle className="w-3.5 h-3.5 mr-1" />
          Assign Job
        </Button>
      </div>
    </div>
  );
}

// Need to import Activity icon
import { Activity } from 'lucide-react';

export default function AcceleratorPools() {
  const [pools, setPools] = useState<AcceleratorPoolsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData();
        setPools(result.accelerators);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAction = async (action: string, targetId: string) => {
    const result = await simulateAction(action, targetId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error('Action failed');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Accelerator Pool Management</h1>
            <p className="text-sm text-muted-foreground">View and manage hardware resources</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!pools) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Failed to load accelerator data</p>
        </div>
      </DashboardLayout>
    );
  }

  const getPoolSummary = (accelerators: Accelerator[]) => {
    const active = accelerators.filter(a => a.status === 'Active').length;
    const idle = accelerators.filter(a => a.status === 'Idle').length;
    const offline = accelerators.filter(a => a.status === 'Offline').length;
    return { active, idle, offline, total: accelerators.length };
  };

  const gpuSummary = getPoolSummary(pools.gpu);
  const tpuSummary = getPoolSummary(pools.tpu);
  const npuSummary = getPoolSummary(pools.npu);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Accelerator Pool Management</h1>
          <p className="text-sm text-muted-foreground">View and manage hardware resources</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="gpu" className="w-full">
          <TabsList className="bg-secondary border border-border mb-6">
            <TabsTrigger value="gpu" className="data-[state=active]:bg-gpu/20 data-[state=active]:text-gpu">
              <Cpu className="w-4 h-4 mr-2" />
              GPU Pool
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                {gpuSummary.active}/{gpuSummary.total}
              </span>
            </TabsTrigger>
            <TabsTrigger value="tpu" className="data-[state=active]:bg-tpu/20 data-[state=active]:text-tpu">
              <Server className="w-4 h-4 mr-2" />
              TPU Pool
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                {tpuSummary.active}/{tpuSummary.total}
              </span>
            </TabsTrigger>
            <TabsTrigger value="npu" className="data-[state=active]:bg-npu/20 data-[state=active]:text-npu">
              <Zap className="w-4 h-4 mr-2" />
              NPU Pool
              <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">
                {npuSummary.active}/{npuSummary.total}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gpu">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pools.gpu.map((acc) => (
                <AcceleratorCard
                  key={acc.id}
                  accelerator={acc}
                  type="gpu"
                  onAction={handleAction}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tpu">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pools.tpu.map((acc) => (
                <AcceleratorCard
                  key={acc.id}
                  accelerator={acc}
                  type="tpu"
                  onAction={handleAction}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="npu">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pools.npu.map((acc) => (
                <AcceleratorCard
                  key={acc.id}
                  accelerator={acc}
                  type="npu"
                  onAction={handleAction}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

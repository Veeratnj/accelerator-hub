import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/ui/metric-card';
import { MetricCardSkeleton, ChartSkeleton, TableSkeleton } from '@/components/ui/loading-skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { UtilizationBarChart } from '@/components/charts/UtilizationBarChart';
import { TimelineChart } from '@/components/charts/TimelineChart';
import { JobDistributionChart } from '@/components/charts/JobDistributionChart';
import { ResourcePressureChart } from '@/components/charts/ResourcePressureChart';
import { HeatmapChart } from '@/components/charts/HeatmapChart';
import { CostPerformanceChart } from '@/components/charts/CostPerformanceChart';
import { fetchData } from '@/services/api';
import { FakeData, Job } from '@/types/accelerator';
import { Cpu, Server, Zap, Activity, TrendingDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Dashboard() {
  const [data, setData] = useState<FakeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Global infrastructure overview</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
          
          <ChartSkeleton />
          <TableSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </DashboardLayout>
    );
  }

  const { dashboard, metrics, jobs } = data;
  const recentJobs = jobs.slice(0, 8);
  const activeJobsCount = jobs.filter((j: Job) => j.status === 'Running').length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Global infrastructure overview</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Total GPUs"
            value={dashboard.gpuCount}
            subtitle="Active clusters"
            icon={<Cpu className="w-5 h-5" />}
            accentColor="gpu"
            trend={{ value: 8, direction: 'up' }}
          />
          <MetricCard
            title="Total TPUs"
            value={dashboard.tpuCount}
            subtitle="Pod instances"
            icon={<Server className="w-5 h-5" />}
            accentColor="tpu"
            trend={{ value: 12, direction: 'up' }}
          />
          <MetricCard
            title="Total NPUs"
            value={dashboard.npuCount}
            subtitle="Edge devices"
            icon={<Zap className="w-5 h-5" />}
            accentColor="npu"
            trend={{ value: 5, direction: 'up' }}
          />
          <MetricCard
            title="Active Jobs"
            value={dashboard.activeJobs}
            subtitle="Running workloads"
            icon={<Activity className="w-5 h-5" />}
            accentColor="primary"
          />
          <MetricCard
            title="Idle Capacity"
            value={`${dashboard.idleCapacity}%`}
            subtitle="Available resources"
            icon={<TrendingDown className="w-5 h-5" />}
            accentColor="accent"
          />
        </div>

        {/* Utilization Bar Chart */}
        <UtilizationBarChart data={metrics.utilizationByType} />

        {/* Timeline and Donut Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TimelineChart data={dashboard.utilizationHistory} />
          <JobDistributionChart
            data={metrics.jobDistribution}
            totalJobs={dashboard.activeJobs}
            activeJobs={activeJobsCount}
          />
        </div>

        {/* Resource Pressure Chart */}
        <ResourcePressureChart data={dashboard.resourcePressure} />

        {/* Heatmap and Cost Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HeatmapChart data={metrics.healthMatrix} />
          <CostPerformanceChart data={metrics.costPerformance} />
        </div>

        {/* Recent Jobs Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden card-glow">
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Recent Jobs</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Latest workload activity</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Job ID</TableHead>
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Accelerator</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Utilization</TableHead>
                <TableHead className="text-muted-foreground">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentJobs.map((job: Job) => (
                <TableRow key={job.id} className="border-border hover:bg-muted/30">
                  <TableCell className="font-mono text-sm text-foreground">{job.id}</TableCell>
                  <TableCell className="text-foreground">{job.name}</TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${
                      job.accelerator === 'GPU' ? 'text-gpu' :
                      job.accelerator === 'TPU' ? 'text-tpu' : 'text-npu'
                    }`}>
                      {job.accelerator}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={job.status as any} size="sm" pulse={job.status === 'Running'} />
                  </TableCell>
                  <TableCell className="text-right font-mono text-foreground">
                    {job.utilization}%
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      job.priority === 'High' ? 'bg-status-critical/20 text-status-critical' :
                      job.priority === 'Medium' ? 'bg-status-warning/20 text-status-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {job.priority}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}

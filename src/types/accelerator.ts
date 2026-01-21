export interface DashboardData {
  gpuCount: number;
  tpuCount: number;
  npuCount: number;
  activeJobs: number;
  idleCapacity: number;
  totalCompute: number;
  utilizationHistory: UtilizationPoint[];
  resourcePressure: ResourcePressurePoint[];
}

export interface UtilizationPoint {
  time: string;
  gpu: number;
  tpu: number;
  npu: number;
}

export interface ResourcePressurePoint {
  time: string;
  compute: number;
  memory: number;
  idle: number;
}

export interface Accelerator {
  id: string;
  model: string;
  status: 'Active' | 'Idle' | 'Offline';
  utilization: number;
  memory: number;
  power: number;
  temperature: number;
}

export interface AcceleratorPools {
  gpu: Accelerator[];
  tpu: Accelerator[];
  npu: Accelerator[];
}

export interface Job {
  id: string;
  name: string;
  accelerator: 'GPU' | 'TPU' | 'NPU';
  acceleratorId: string;
  status: 'Running' | 'Queued' | 'Completed' | 'Failed';
  utilization: number;
  startTime: string | null;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High';
  source: string;
}

export interface UtilizationMetric {
  type: string;
  utilization: number;
  memory: number;
  power: number;
}

export interface JobDistribution {
  name: string;
  value: number;
  color: string;
}

export interface HealthMatrixItem {
  id: string;
  utilization: number;
  temperature: number;
  power: number;
}

export interface CostPerformanceItem {
  type: string;
  cost: number;
  performance: number;
  name: string;
}

export interface PowerConsumptionPoint {
  time: string;
  gpu: number;
  tpu: number;
  npu: number;
}

export interface Metrics {
  utilizationByType: UtilizationMetric[];
  jobDistribution: JobDistribution[];
  healthMatrix: HealthMatrixItem[];
  costPerformance: CostPerformanceItem[];
  powerConsumption: PowerConsumptionPoint[];
}

export interface LogEntry {
  timestamp: string;
  event: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface RoutingRule {
  condition: string;
  recommendation: string;
  reason: string;
}

export interface WorkloadRouting {
  rules: RoutingRule[];
}

export interface FakeData {
  dashboard: DashboardData;
  accelerators: AcceleratorPools;
  jobs: Job[];
  alerts: Alert[];
  metrics: Metrics;
  logs: LogEntry[];
  workloadRouting: WorkloadRouting;
}

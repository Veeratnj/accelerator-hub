import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchData } from '@/services/api';
import { WorkloadRouting } from '@/types/accelerator';
import { toast } from 'sonner';
import {
  Workflow,
  Cpu,
  Server,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeploymentResult {
  accelerator: string;
  reason: string;
  icon: React.ReactNode;
}

export default function WorkloadOrchestration() {
  const [jobName, setJobName] = useState('');
  const [workloadType, setWorkloadType] = useState('');
  const [preferredAccelerator, setPreferredAccelerator] = useState('');
  const [priority, setPriority] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [result, setResult] = useState<DeploymentResult | null>(null);
  const [routingRules, setRoutingRules] = useState<WorkloadRouting | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData();
        setRoutingRules(data.workloadRouting);
      } catch (error) {
        console.error('Failed to fetch routing rules:', error);
      }
    };
    loadData();
  }, []);

  const getAIRecommendation = (): DeploymentResult => {
    // Simulated AI routing logic
    if (workloadType === 'training') {
      if (jobName.toLowerCase().includes('llm') || jobName.toLowerCase().includes('transformer')) {
        return {
          accelerator: 'GPU',
          reason: 'Large language model training → A100/H100 optimized for transformer architectures with high memory bandwidth',
          icon: <Cpu className="w-6 h-6 text-gpu" />,
        };
      }
      return {
        accelerator: 'GPU',
        reason: 'General training workload → GPUs offer balanced compute for diverse training tasks',
        icon: <Cpu className="w-6 h-6 text-gpu" />,
      };
    }

    if (workloadType === 'inference') {
      if (priority === 'high') {
        return {
          accelerator: 'NPU',
          reason: 'Low latency inference required → NPUs provide sub-millisecond inference latency for real-time applications',
          icon: <Zap className="w-6 h-6 text-npu" />,
        };
      }
      return {
        accelerator: 'TPU',
        reason: 'Batch inference workload → TPU v5e pods deliver optimal throughput for batch processing',
        icon: <Server className="w-6 h-6 text-tpu" />,
      };
    }

    if (workloadType === 'batch') {
      return {
        accelerator: 'TPU',
        reason: 'High matrix operations detected → TPUs excel at matrix multiplication with 3x throughput advantage',
        icon: <Server className="w-6 h-6 text-tpu" />,
      };
    }

    // Default fallback
    return {
      accelerator: 'GPU',
      reason: 'General purpose workload → Balanced GPU allocation for optimal flexibility',
      icon: <Cpu className="w-6 h-6 text-gpu" />,
    };
  };

  const handleDeploy = async () => {
    if (!jobName || !workloadType || !preferredAccelerator || !priority) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsDeploying(true);
    setResult(null);

    // Simulate deployment delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let deploymentResult: DeploymentResult;

    if (preferredAccelerator === 'auto') {
      deploymentResult = getAIRecommendation();
    } else {
      const iconMap = {
        GPU: <Cpu className="w-6 h-6 text-gpu" />,
        TPU: <Server className="w-6 h-6 text-tpu" />,
        NPU: <Zap className="w-6 h-6 text-npu" />,
      };
      deploymentResult = {
        accelerator: preferredAccelerator,
        reason: `User preference applied → Workload scheduled on ${preferredAccelerator} cluster as requested`,
        icon: iconMap[preferredAccelerator as keyof typeof iconMap],
      };
    }

    setResult(deploymentResult);
    setIsDeploying(false);
    toast.success(`Workload deployed to ${deploymentResult.accelerator}`);
  };

  const resetForm = () => {
    setJobName('');
    setWorkloadType('');
    setPreferredAccelerator('');
    setPriority('');
    setResult(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workload Orchestration</h1>
          <p className="text-sm text-muted-foreground">Intelligent workload placement with AI-powered routing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="rounded-xl border border-border bg-card p-6 card-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Workflow className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Deploy Workload</h2>
                <p className="text-xs text-muted-foreground">Configure job parameters</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="jobName" className="text-sm font-medium text-foreground">
                  Job Name
                </Label>
                <Input
                  id="jobName"
                  placeholder="e.g., LLM-Training-v2"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Workload Type
                </Label>
                <Select value={workloadType} onValueChange={setWorkloadType}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select workload type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="inference">Inference</SelectItem>
                    <SelectItem value="batch">Batch Processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Preferred Accelerator
                </Label>
                <Select value={preferredAccelerator} onValueChange={setPreferredAccelerator}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select accelerator preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        Auto (AI Decision)
                      </span>
                    </SelectItem>
                    <SelectItem value="GPU">
                      <span className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-gpu" />
                        GPU
                      </span>
                    </SelectItem>
                    <SelectItem value="TPU">
                      <span className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-tpu" />
                        TPU
                      </span>
                    </SelectItem>
                    <SelectItem value="NPU">
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-npu" />
                        NPU
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Priority
                </Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="flex-1 bg-gradient-primary hover:opacity-90 text-white btn-glow"
                >
                  {isDeploying ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deploying...
                    </span>
                  ) : (
                    <>
                      Deploy Workload
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Result Panel */}
          <div className="space-y-6">
            {/* Deployment Result */}
            <div className={cn(
              'rounded-xl border bg-card p-6 transition-all duration-300',
              result ? 'border-status-healthy card-glow' : 'border-border'
            )}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  result ? 'bg-status-healthy/20' : 'bg-muted'
                )}>
                  {result ? (
                    <CheckCircle2 className="w-5 h-5 text-status-healthy" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {result ? 'Deployment Result' : 'Awaiting Deployment'}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {result ? 'AI-optimized placement' : 'Configure and deploy to see result'}
                  </p>
                </div>
              </div>

              {result ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-card flex items-center justify-center">
                      {result.icon}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Selected Accelerator</p>
                      <p className="text-xl font-bold text-foreground">{result.accelerator}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Routing Reason</p>
                        <p className="text-sm text-foreground">{result.reason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                  Deploy a workload to see AI recommendations
                </div>
              )}
            </div>

            {/* Routing Rules */}
            {routingRules && (
              <div className="rounded-xl border border-border bg-card p-6 card-glow">
                <h3 className="text-sm font-semibold text-foreground mb-4">AI Routing Intelligence</h3>
                <div className="space-y-3">
                  {routingRules.rules.slice(0, 4).map((rule, index) => (
                    <div key={index} className="flex items-start gap-3 text-xs">
                      <span className={cn(
                        'px-2 py-1 rounded font-medium',
                        rule.recommendation === 'GPU' ? 'bg-gpu/20 text-gpu' :
                        rule.recommendation === 'TPU' ? 'bg-tpu/20 text-tpu' :
                        'bg-npu/20 text-npu'
                      )}>
                        {rule.recommendation}
                      </span>
                      <div>
                        <p className="text-foreground font-medium">{rule.condition}</p>
                        <p className="text-muted-foreground mt-0.5">{rule.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

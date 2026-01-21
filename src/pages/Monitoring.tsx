import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ChartSkeleton, TableSkeleton } from '@/components/ui/loading-skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { TimelineChart } from '@/components/charts/TimelineChart';
import { PowerConsumptionChart } from '@/components/charts/PowerConsumptionChart';
import { fetchData } from '@/services/api';
import { Alert as AlertType, LogEntry, FakeData } from '@/types/accelerator';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Activity,
  Bell,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const alertIcons = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertCircle,
};

const alertColors = {
  info: 'border-l-primary bg-primary/5',
  warning: 'border-l-status-warning bg-status-warning/5',
  critical: 'border-l-status-critical bg-status-critical/5',
};

const alertIconColors = {
  info: 'text-primary',
  warning: 'text-status-warning',
  critical: 'text-status-critical',
};

const logSeverityColors = {
  info: 'text-muted-foreground',
  warning: 'text-status-warning',
  critical: 'text-status-critical',
};

export default function Monitoring() {
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

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'HH:mm:ss');
    } catch {
      return timestamp;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Monitoring & Alerts</h1>
            <p className="text-sm text-muted-foreground">Operations and reliability dashboard</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
          <TableSkeleton />
          <TableSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Failed to load monitoring data</p>
        </div>
      </DashboardLayout>
    );
  }

  const { dashboard, metrics, alerts, logs } = data;
  
  const criticalAlerts = alerts.filter((a: AlertType) => a.type === 'critical').length;
  const warningAlerts = alerts.filter((a: AlertType) => a.type === 'warning').length;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Monitoring & Alerts</h1>
            <p className="text-sm text-muted-foreground">Operations and reliability dashboard</p>
          </div>
          <div className="flex gap-2">
            {criticalAlerts > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-critical/20 border border-status-critical/30">
                <AlertCircle className="w-4 h-4 text-status-critical" />
                <span className="text-sm font-medium text-status-critical">{criticalAlerts} Critical</span>
              </div>
            )}
            {warningAlerts > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-warning/20 border border-status-warning/30">
                <AlertTriangle className="w-4 h-4 text-status-warning" />
                <span className="text-sm font-medium text-status-warning">{warningAlerts} Warnings</span>
              </div>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TimelineChart data={dashboard.utilizationHistory} />
          <PowerConsumptionChart data={metrics.powerConsumption} />
        </div>

        {/* Alerts Panel */}
        <div className="rounded-xl border border-border bg-card overflow-hidden card-glow">
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-status-warning/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-status-warning" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Active Alerts</h3>
              <p className="text-xs text-muted-foreground">{alerts.length} alerts in the last 24 hours</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            {alerts.map((alert: AlertType) => {
              const AlertIcon = alertIcons[alert.type];
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 border-l-4 flex items-start gap-4',
                    alertColors[alert.type]
                  )}
                >
                  <AlertIcon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', alertIconColors[alert.type])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(alert.timestamp)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Source: {alert.source}
                      </span>
                      <StatusBadge 
                        status={
                          alert.severity === 'High' ? 'Critical' :
                          alert.severity === 'Medium' ? 'Warning' : 'Healthy'
                        } 
                        size="sm" 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Logs Panel */}
        <div className="rounded-xl border border-border bg-card overflow-hidden card-glow">
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">System Logs</h3>
              <p className="text-xs text-muted-foreground">Recent infrastructure events</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            {logs.map((log: LogEntry, index: number) => (
              <div key={index} className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors">
                <div className="flex-shrink-0 w-20">
                  <span className="text-xs font-mono text-muted-foreground">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', logSeverityColors[log.severity])}>
                    {log.event}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded uppercase',
                    log.severity === 'critical' ? 'bg-status-critical/20 text-status-critical' :
                    log.severity === 'warning' ? 'bg-status-warning/20 text-status-warning' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {log.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

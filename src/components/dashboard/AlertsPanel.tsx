import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { SecurityAlert, Incident } from '@/hooks/useMockData';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle,
  Shield,
  Bug,
  Wifi,
  Lock,
  FileWarning,
  Activity,
} from 'lucide-react';

interface AlertItemProps {
  alert: SecurityAlert;
  onClick?: () => void;
}

const alertTypeIcons = {
  intrusion: Shield,
  malware: Bug,
  ddos: Wifi,
  unauthorized_access: Lock,
  policy_violation: FileWarning,
  anomaly: Activity,
};

const severityStyles = {
  critical: 'status-critical',
  high: 'status-high',
  medium: 'status-medium',
  low: 'status-low',
};

export function AlertItem({ alert, onClick }: AlertItemProps) {
  const Icon = alertTypeIcons[alert.type];

  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex items-start gap-4 rounded-lg border border-border bg-card/50 p-4 transition-all hover:bg-card hover:border-primary/30 cursor-pointer',
        alert.severity === 'critical' && 'border-l-2 border-l-destructive'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          alert.severity === 'critical'
            ? 'bg-destructive/20 text-destructive'
            : alert.severity === 'high'
            ? 'bg-orange-500/20 text-orange-400'
            : alert.severity === 'medium'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-green-500/20 text-green-400'
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-sm truncate">{alert.title}</h4>
          <Badge variant="outline" className={cn('shrink-0 text-[10px]', severityStyles[alert.severity])}>
            {alert.severity}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
          <span className="font-mono">{alert.id}</span>
          <span>•</span>
          <span>{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
}

interface IncidentItemProps {
  incident: Incident;
  onClick?: () => void;
}

const statusStyles = {
  open: 'bg-destructive/20 text-destructive border-destructive/30',
  in_progress: 'bg-warning/20 text-warning border-warning/30',
  resolved: 'bg-success/20 text-success border-success/30',
  closed: 'bg-muted text-muted-foreground border-muted',
};

export function IncidentItem({ incident, onClick }: IncidentItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group flex items-start gap-4 rounded-lg border border-border bg-card/50 p-4 transition-all hover:bg-card hover:border-primary/30 cursor-pointer',
        incident.severity === 'critical' && 'border-l-2 border-l-destructive'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          incident.severity === 'critical'
            ? 'bg-destructive/20 text-destructive'
            : incident.severity === 'high'
            ? 'bg-orange-500/20 text-orange-400'
            : incident.severity === 'medium'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-green-500/20 text-green-400'
        )}
      >
        <AlertTriangle className="h-5 w-5" />
      </div>

      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-sm truncate">{incident.title}</h4>
          <Badge variant="outline" className={cn('shrink-0 text-[10px]', statusStyles[incident.status])}>
            {incident.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{incident.description}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
          <span className="font-mono">{incident.id}</span>
          <span>•</span>
          <span>{incident.category}</span>
          {incident.assignee && (
            <>
              <span>•</span>
              <span>{incident.assignee}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface RecentActivityProps {
  alerts: SecurityAlert[];
  incidents: Incident[];
}

export function RecentActivity({ alerts, incidents }: RecentActivityProps) {
  // Combine and sort by timestamp
  const activities = [
    ...alerts.slice(0, 3).map(a => ({ type: 'alert' as const, data: a, timestamp: a.timestamp })),
    ...incidents.slice(0, 3).map(i => ({ type: 'incident' as const, data: i, timestamp: i.createdAt })),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5);

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={index}>
          {activity.type === 'alert' ? (
            <AlertItem alert={activity.data as SecurityAlert} />
          ) : (
            <IncidentItem incident={activity.data as Incident} />
          )}
        </div>
      ))}
    </div>
  );
}

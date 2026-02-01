import { useState } from 'react';
import { useMockData, SecurityAlert } from '@/hooks/useMockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  AlertTriangle,
  Shield,
  Bug,
  Wifi,
  Lock,
  FileWarning,
  Activity,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';

const alertTypeIcons = {
  intrusion: Shield,
  malware: Bug,
  ddos: Wifi,
  unauthorized_access: Lock,
  policy_violation: FileWarning,
  anomaly: Activity,
};

const alertTypeLabels = {
  intrusion: 'Intrusion Attempt',
  malware: 'Malware Detection',
  ddos: 'DDoS Attack',
  unauthorized_access: 'Unauthorized Access',
  policy_violation: 'Policy Violation',
  anomaly: 'Traffic Anomaly',
};

const severityStyles = {
  critical: 'status-critical',
  high: 'status-high',
  medium: 'status-medium',
  low: 'status-low',
};

const statusStyles = {
  new: 'bg-destructive/20 text-destructive border-destructive/30',
  investigating: 'bg-warning/20 text-warning border-warning/30',
  resolved: 'bg-success/20 text-success border-success/30',
  false_positive: 'bg-muted text-muted-foreground border-muted',
};

export default function AlertsPage() {
  const { alerts, updateAlertStatus, isLoading } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    return matchesSearch && matchesStatus && matchesSeverity && matchesType;
  });

  const stats = {
    total: alerts.length,
    new: alerts.filter((a) => a.status === 'new').length,
    investigating: alerts.filter((a) => a.status === 'investigating').length,
    critical: alerts.filter((a) => a.severity === 'critical' && a.status === 'new').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-muted-foreground">Loading alerts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-muted-foreground/50" />
          </div>
        </div>
        <div className="rounded-xl border border-destructive/30 bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New (Unreviewed)</p>
              <p className="text-2xl font-bold text-destructive">{stats.new}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-warning/30 bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Investigating</p>
              <p className="text-2xl font-bold text-warning">{stats.investigating}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20">
              <Clock className="h-5 w-5 text-warning" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-critical/30 bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical New</p>
              <p className="text-2xl font-bold text-critical">{stats.critical}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-critical/20 animate-pulse">
              <Shield className="h-5 w-5 text-critical" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full lg:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="false_positive">False Positive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full lg:w-[150px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full lg:w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="intrusion">Intrusion</SelectItem>
            <SelectItem value="malware">Malware</SelectItem>
            <SelectItem value="ddos">DDoS</SelectItem>
            <SelectItem value="unauthorized_access">Unauthorized Access</SelectItem>
            <SelectItem value="policy_violation">Policy Violation</SelectItem>
            <SelectItem value="anomaly">Anomaly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAlerts.map((alert) => {
          const Icon = alertTypeIcons[alert.type];
          return (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={cn(
                'group rounded-xl border bg-card p-5 cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg',
                alert.severity === 'critical' && alert.status === 'new' && 'border-l-4 border-l-destructive',
                alert.severity === 'critical' && 'hover:shadow-destructive/10'
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
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
                <div className="flex gap-2">
                  <Badge variant="outline" className={cn('text-[10px]', severityStyles[alert.severity])}>
                    {alert.severity}
                  </Badge>
                  <Badge variant="outline" className={cn('text-[10px]', statusStyles[alert.status])}>
                    {alert.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">
                {alert.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                {alert.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                <span className="font-mono">{alert.id}</span>
                <span>{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Detail Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAlert && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-muted-foreground">{selectedAlert.id}</span>
                  <Badge variant="outline" className={cn('text-xs', severityStyles[selectedAlert.severity])}>
                    {selectedAlert.severity}
                  </Badge>
                  <Badge variant="outline" className={cn('text-xs', statusStyles[selectedAlert.status])}>
                    {selectedAlert.status.replace('_', ' ')}
                  </Badge>
                </div>
                <DialogTitle>{selectedAlert.title}</DialogTitle>
                <DialogDescription>{selectedAlert.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Alert Type</p>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const Icon = alertTypeIcons[selectedAlert.type];
                        return <Icon className="h-4 w-4 text-primary" />;
                      })()}
                      <span className="text-sm">{alertTypeLabels[selectedAlert.type]}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Select
                      value={selectedAlert.status}
                      onValueChange={(value: SecurityAlert['status']) => {
                        updateAlertStatus(selectedAlert.id, value);
                        setSelectedAlert({ ...selectedAlert, status: value });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="false_positive">False Positive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Source IP</p>
                    <p className="text-sm font-mono">{selectedAlert.source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Target IP</p>
                    <p className="text-sm font-mono">{selectedAlert.target}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Timestamp</p>
                  <p className="text-sm">{format(selectedAlert.timestamp, 'PPpp')}</p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View in SIEM
                  </Button>
                  <Button className="gap-2">
                    Create Incident
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

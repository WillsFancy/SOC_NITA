import { useState } from 'react';
import { useMockData, Incident } from '@/hooks/useMockData';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Clock,
  User,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';

const severityStyles = {
  critical: 'status-critical',
  high: 'status-high',
  medium: 'status-medium',
  low: 'status-low',
};

const statusStyles = {
  open: 'bg-destructive/20 text-destructive border-destructive/30',
  in_progress: 'bg-warning/20 text-warning border-warning/30',
  resolved: 'bg-success/20 text-success border-success/30',
  closed: 'bg-muted text-muted-foreground border-muted',
};

export default function IncidentsPage() {
  const { incidents, updateIncidentStatus, isLoading } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const stats = {
    open: incidents.filter((i) => i.status === 'open').length,
    inProgress: incidents.filter((i) => i.status === 'in_progress').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
    critical: incidents.filter((i) => i.severity === 'critical' && i.status !== 'resolved' && i.status !== 'closed').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-muted-foreground">Loading incidents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-2xl font-bold">{stats.open}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20 text-warning">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20 text-success">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold">{stats.resolved}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-critical/20 text-critical">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical Active</p>
              <p className="text-2xl font-bold">{stats.critical}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Incident
        </Button>
      </div>

      {/* Incidents Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[100px]">Severity</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[140px]">Category</TableHead>
              <TableHead className="w-[140px]">Assignee</TableHead>
              <TableHead className="w-[160px]">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIncidents.map((incident) => (
              <TableRow
                key={incident.id}
                className="cursor-pointer"
                onClick={() => setSelectedIncident(incident)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {incident.id}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{incident.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {incident.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('text-xs', severityStyles[incident.severity])}>
                    {incident.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('text-xs', statusStyles[incident.status])}>
                    {incident.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{incident.category}</TableCell>
                <TableCell>
                  {incident.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-medium">
                        {incident.assignee.charAt(0)}
                      </div>
                      <span className="text-sm">{incident.assignee}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(incident.createdAt, { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Incident Detail Dialog */}
      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-2xl">
          {selectedIncident && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{selectedIncident.id}</span>
                  <Badge variant="outline" className={cn('text-xs', severityStyles[selectedIncident.severity])}>
                    {selectedIncident.severity}
                  </Badge>
                </div>
                <DialogTitle>{selectedIncident.title}</DialogTitle>
                <DialogDescription>{selectedIncident.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <Select
                      value={selectedIncident.status}
                      onValueChange={(value: Incident['status']) => {
                        updateIncidentStatus(selectedIncident.id, value);
                        setSelectedIncident({ ...selectedIncident, status: value });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Assignee</p>
                    <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-border bg-muted/50">
                      {selectedIncident.assignee ? (
                        <>
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-medium">
                            {selectedIncident.assignee.charAt(0)}
                          </div>
                          <span className="text-sm">{selectedIncident.assignee}</span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="text-sm">{selectedIncident.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Created</p>
                    <p className="text-sm">{format(selectedIncident.createdAt, 'PPpp')}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Related Alerts ({selectedIncident.relatedAlerts.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.relatedAlerts.map((alertId) => (
                      <Badge key={alertId} variant="outline" className="font-mono text-xs">
                        {alertId}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

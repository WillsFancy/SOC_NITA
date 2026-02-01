import { useState } from 'react';
import { useMockData, NetworkDevice } from '@/hooks/useMockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Server,
  Router,
  Shield,
  Monitor,
  HardDrive,
  RefreshCw,
  Activity,
  Cpu,
  MemoryStick,
  Wifi,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { StatusIndicator } from '@/components/dashboard/MetricCard';

const deviceTypeIcons = {
  router: Router,
  switch: HardDrive,
  firewall: Shield,
  server: Server,
  endpoint: Monitor,
};

export default function NetworkPage() {
  const { devices, networkMetrics, isLoading } = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);

  const locations = [...new Set(devices.map((d) => d.location))];

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.ip.includes(searchQuery) ||
      device.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesType = typeFilter === 'all' || device.type === typeFilter;
    const matchesLocation = locationFilter === 'all' || device.location === locationFilter;
    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-muted-foreground">Loading network devices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Devices</p>
              <p className="text-2xl font-bold">{networkMetrics.totalDevices}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-success/30 bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20 text-success">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Online</p>
              <p className="text-2xl font-bold text-success">{networkMetrics.onlineDevices}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-destructive/30 bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20 text-destructive">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Offline</p>
              <p className="text-2xl font-bold text-destructive">{networkMetrics.offlineDevices}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-warning/30 bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20 text-warning">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Warning</p>
              <p className="text-2xl font-bold text-warning">{networkMetrics.warningDevices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, IP, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full lg:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full lg:w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="router">Router</SelectItem>
            <SelectItem value="switch">Switch</SelectItem>
            <SelectItem value="firewall">Firewall</SelectItem>
            <SelectItem value="server">Server</SelectItem>
            <SelectItem value="endpoint">Endpoint</SelectItem>
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full lg:w-[200px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Devices Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[60px]">Status</TableHead>
              <TableHead>Device</TableHead>
              <TableHead className="w-[130px]">IP Address</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[180px]">Location</TableHead>
              <TableHead className="w-[100px]">CPU</TableHead>
              <TableHead className="w-[100px]">Memory</TableHead>
              <TableHead className="w-[140px]">Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.map((device) => {
              const Icon = deviceTypeIcons[device.type];
              return (
                <TableRow
                  key={device.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedDevice(device)}
                >
                  <TableCell>
                    <StatusIndicator status={device.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{device.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{device.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{device.ip}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-xs">
                      {device.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{device.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={device.cpu}
                        className={cn(
                          'h-2 w-16',
                          device.cpu > 80 ? '[&>div]:bg-destructive' : device.cpu > 60 ? '[&>div]:bg-warning' : '[&>div]:bg-success'
                        )}
                      />
                      <span className="text-xs text-muted-foreground w-8">{Math.round(device.cpu)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={device.memory}
                        className={cn(
                          'h-2 w-16',
                          device.memory > 80 ? '[&>div]:bg-destructive' : device.memory > 60 ? '[&>div]:bg-warning' : '[&>div]:bg-success'
                        )}
                      />
                      <span className="text-xs text-muted-foreground w-8">{Math.round(device.memory)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(device.lastSeen, { addSuffix: true })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Device Detail Dialog */}
      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent className="max-w-2xl">
          {selectedDevice && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    {(() => {
                      const Icon = deviceTypeIcons[selectedDevice.type];
                      return <Icon className="h-6 w-6 text-muted-foreground" />;
                    })()}
                  </div>
                  <div>
                    <DialogTitle>{selectedDevice.name}</DialogTitle>
                    <DialogDescription className="font-mono">{selectedDevice.ip}</DialogDescription>
                  </div>
                  <div className="ml-auto">
                    <StatusIndicator status={selectedDevice.status} label={selectedDevice.status} />
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Device ID</p>
                    <p className="text-sm font-mono">{selectedDevice.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Type</p>
                    <Badge variant="outline" className="capitalize">{selectedDevice.type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <p className="text-sm">{selectedDevice.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Uptime</p>
                    <p className="text-sm">{selectedDevice.uptime} hours</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Resource Usage</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-muted-foreground" />
                          CPU Usage
                        </span>
                        <span>{Math.round(selectedDevice.cpu)}%</span>
                      </div>
                      <Progress
                        value={selectedDevice.cpu}
                        className={cn(
                          'h-3',
                          selectedDevice.cpu > 80 ? '[&>div]:bg-destructive' : selectedDevice.cpu > 60 ? '[&>div]:bg-warning' : '[&>div]:bg-success'
                        )}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <MemoryStick className="h-4 w-4 text-muted-foreground" />
                          Memory Usage
                        </span>
                        <span>{Math.round(selectedDevice.memory)}%</span>
                      </div>
                      <Progress
                        value={selectedDevice.memory}
                        className={cn(
                          'h-3',
                          selectedDevice.memory > 80 ? '[&>div]:bg-destructive' : selectedDevice.memory > 60 ? '[&>div]:bg-warning' : '[&>div]:bg-success'
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Bandwidth</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Wifi className="h-4 w-4" />
                        Inbound
                      </div>
                      <p className="text-xl font-bold">{Math.round(selectedDevice.bandwidth.in)} <span className="text-sm font-normal text-muted-foreground">Mbps</span></p>
                    </div>
                    <div className="rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Wifi className="h-4 w-4" />
                        Outbound
                      </div>
                      <p className="text-xl font-bold">{Math.round(selectedDevice.bandwidth.out)} <span className="text-sm font-normal text-muted-foreground">Mbps</span></p>
                    </div>
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

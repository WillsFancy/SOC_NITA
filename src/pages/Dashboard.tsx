import { useMockData, getTrafficChartData, getAlertTrendData } from '@/hooks/useMockData';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RecentActivity, AlertItem } from '@/components/dashboard/AlertsPanel';
import {
  Server,
  Shield,
  AlertTriangle,
  Activity,
  Wifi,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

const COLORS = ['hsl(0, 72%, 51%)', 'hsl(25, 95%, 53%)', 'hsl(45, 93%, 47%)', 'hsl(142, 72%, 45%)'];

export default function DashboardPage() {
  const { user } = useAuth();
  const { devices, alerts, incidents, networkMetrics, securityMetrics, isLoading } = useMockData();
  const trafficData = getTrafficChartData();
  const alertTrendData = getAlertTrendData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Shield className="h-12 w-12 text-primary animate-pulse-glow" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const alertsByStatus = [
    { name: 'Critical', value: securityMetrics.criticalAlerts },
    { name: 'High', value: securityMetrics.highAlerts },
    { name: 'Medium', value: securityMetrics.mediumAlerts },
    { name: 'Low', value: securityMetrics.lowAlerts },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {user?.name}</h2>
          <p className="text-muted-foreground">Here's what's happening across your network</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Last scan:</span>
          <span className="font-mono text-primary">2 min ago</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Devices"
          value={networkMetrics.totalDevices}
          subtitle={`${networkMetrics.onlineDevices} online, ${networkMetrics.offlineDevices} offline`}
          icon={Server}
          variant="info"
        />
        <MetricCard
          title="Active Alerts"
          value={securityMetrics.criticalAlerts + securityMetrics.highAlerts}
          subtitle={`${securityMetrics.criticalAlerts} critical, ${securityMetrics.highAlerts} high`}
          icon={AlertTriangle}
          variant={securityMetrics.criticalAlerts > 0 ? 'danger' : 'warning'}
        />
        <MetricCard
          title="Threats Blocked"
          value={securityMetrics.threatsBlocked.toLocaleString()}
          subtitle="Last 24 hours"
          icon={Shield}
          variant="success"
          trend={{ value: 12, positive: false }}
        />
        <MetricCard
          title="Avg Response Time"
          value={`${Math.round(securityMetrics.avgResponseTime)}m`}
          subtitle="Incident response"
          icon={Clock}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Network Traffic Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Network Traffic</h3>
              <p className="text-sm text-muted-foreground">Bandwidth utilization (24h)</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Inbound</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Outbound</span>
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(187, 72%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(187, 72%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 72%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 72%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 20%)" />
                <XAxis
                  dataKey="time"
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={11}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => `${v}Mb`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 11%)',
                    border: '1px solid hsl(222, 30%, 20%)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="inbound"
                  stroke="hsl(187, 72%, 50%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorInbound)"
                />
                <Area
                  type="monotone"
                  dataKey="outbound"
                  stroke="hsl(142, 72%, 45%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOutbound)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Distribution */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6">
            <h3 className="font-semibold">Alert Distribution</h3>
            <p className="text-sm text-muted-foreground">By severity level</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alertsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {alertsByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 11%)',
                    border: '1px solid hsl(222, 30%, 20%)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {alertsByStatus.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
                <span className="text-xs font-medium ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Trend & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alert Trend */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Alert Trend</h3>
              <p className="text-sm text-muted-foreground">Last 7 days</p>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 20%)" />
                <XAxis dataKey="day" stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 11%)',
                    border: '1px solid hsl(222, 30%, 20%)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="critical" stackId="a" fill="hsl(0, 72%, 51%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" stackId="a" fill="hsl(25, 95%, 53%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" stackId="a" fill="hsl(45, 93%, 47%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="low" stackId="a" fill="hsl(142, 72%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">Latest alerts and incidents</p>
            </div>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {alerts.slice(0, 5).map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20 text-success">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg CPU Load</p>
              <p className="text-xl font-bold">{Math.round(networkMetrics.averageCpu)}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/20 text-info">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Memory</p>
              <p className="text-xl font-bold">{Math.round(networkMetrics.averageMemory)}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20 text-warning">
              <Wifi className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Packet Loss</p>
              <p className="text-xl font-bold">{(networkMetrics.packetLoss * 100).toFixed(2)}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Latency</p>
              <p className="text-xl font-bold">{Math.round(networkMetrics.latency)}ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

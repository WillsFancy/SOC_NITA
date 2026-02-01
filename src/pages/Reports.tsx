import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  Shield,
  Server,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const monthlyData = [
  { month: 'Jan', incidents: 45, resolved: 42, alerts: 234 },
  { month: 'Feb', incidents: 52, resolved: 48, alerts: 287 },
  { month: 'Mar', incidents: 38, resolved: 35, alerts: 198 },
  { month: 'Apr', incidents: 61, resolved: 55, alerts: 312 },
  { month: 'May', incidents: 47, resolved: 44, alerts: 256 },
  { month: 'Jun', incidents: 55, resolved: 51, alerts: 289 },
];

const categoryData = [
  { name: 'Network Security', value: 35 },
  { name: 'Access Control', value: 25 },
  { name: 'Malware', value: 20 },
  { name: 'Policy Violation', value: 12 },
  { name: 'Other', value: 8 },
];

const COLORS = ['hsl(187, 72%, 50%)', 'hsl(142, 72%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(262, 83%, 58%)'];

const uptimeData = [
  { day: 'Mon', uptime: 99.9 },
  { day: 'Tue', uptime: 99.8 },
  { day: 'Wed', uptime: 100 },
  { day: 'Thu', uptime: 99.7 },
  { day: 'Fri', uptime: 99.9 },
  { day: 'Sat', uptime: 100 },
  { day: 'Sun', uptime: 99.95 },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState('security');
  const [timePeriod, setTimePeriod] = useState('month');

  const reports = [
    {
      id: 1,
      name: 'Monthly Security Summary',
      type: 'Security',
      date: 'January 2024',
      status: 'ready',
    },
    {
      id: 2,
      name: 'Network Performance Report',
      type: 'Network',
      date: 'January 2024',
      status: 'ready',
    },
    {
      id: 3,
      name: 'Incident Response Analysis',
      type: 'Incidents',
      date: 'Q4 2023',
      status: 'ready',
    },
    {
      id: 4,
      name: 'Compliance Audit Report',
      type: 'Compliance',
      date: '2023 Annual',
      status: 'ready',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Generate Report</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="security">Security Summary</SelectItem>
              <SelectItem value="network">Network Performance</SelectItem>
              <SelectItem value="incidents">Incident Analysis</SelectItem>
              <SelectItem value="compliance">Compliance Report</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Incidents Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Incidents Overview</h3>
              <p className="text-sm text-muted-foreground">Monthly incident trends</p>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 20%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={11} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 11%)',
                    border: '1px solid hsl(222, 30%, 20%)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="incidents" fill="hsl(187, 72%, 50%)" radius={[4, 4, 0, 0]} name="Total" />
                <Bar dataKey="resolved" fill="hsl(142, 72%, 45%)" radius={[4, 4, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Incident Categories</h3>
              <p className="text-sm text-muted-foreground">Distribution by type</p>
            </div>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
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
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                <span className="text-xs font-medium ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Uptime */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold">Network Uptime</h3>
            <p className="text-sm text-muted-foreground">Weekly availability percentage</p>
          </div>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold text-success">99.9%</span>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={uptimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 20%)" />
              <XAxis dataKey="day" stroke="hsl(215, 20%, 55%)" fontSize={11} />
              <YAxis domain={[99, 100.5]} stroke="hsl(215, 20%, 55%)" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222, 47%, 11%)',
                  border: '1px solid hsl(222, 30%, 20%)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`${value}%`, 'Uptime']}
              />
              <Line
                type="monotone"
                dataKey="uptime"
                stroke="hsl(142, 72%, 45%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(142, 72%, 45%)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Available Reports */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-semibold mb-4">Available Reports</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">{report.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {report.type} • {report.date}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth, getRoleName, getRoleColor } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Shield,
  AlertTriangle,
  Server,
  FileText,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  Activity,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['network_admin', 'cybersecurity_analyst', 'system_admin'] },
  { name: 'Incidents', href: '/incidents', icon: Shield, roles: ['cybersecurity_analyst', 'system_admin'] },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle, roles: ['network_admin', 'cybersecurity_analyst', 'system_admin'] },
  { name: 'Network', href: '/network', icon: Server, roles: ['network_admin', 'system_admin'] },
  { name: 'Reports', href: '/reports', icon: FileText, roles: ['system_admin'] },
  { name: 'Users', href: '/users', icon: Users, roles: ['system_admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['system_admin'] },
];

export function DashboardLayout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredNavigation = navigation.filter(
    item => user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-sidebar-foreground">NITA SOC</span>
                <span className="text-[10px] text-muted-foreground">Security Operations</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                  {item.name}
                  {item.name === 'Alerts' && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      5
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* System Status */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Activity className="h-3 w-3" />
              <span>System Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-sidebar-foreground">All Systems</span>
                <span className="flex items-center gap-1 text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success pulse-live" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-sidebar-foreground">Threat Level</span>
                <span className="text-warning">Elevated</span>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="border-t border-sidebar-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent/50 transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-sidebar-foreground">{user?.name}</p>
                    <p className={cn('text-xs', getRoleColor(user?.role || 'network_admin'))}>
                      {getRoleName(user?.role || 'network_admin')}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {filteredNavigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
            <span className="h-2 w-2 rounded-full bg-success pulse-live" />
            Live Monitoring
          </div>

          {/* Current time */}
          <div className="hidden sm:block text-sm text-muted-foreground font-mono">
            {new Date().toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

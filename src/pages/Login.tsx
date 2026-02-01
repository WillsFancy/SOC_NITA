import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole, getRoleName } from '@/contexts/AuthContext';
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
import { Shield, Lock, Mail, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('network_admin');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password, role);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  const demoAccounts = [
    { email: 'network@nita.gov', role: 'network_admin' as UserRole, label: 'Network Admin' },
    { email: 'security@nita.gov', role: 'cybersecurity_analyst' as UserRole, label: 'Security Analyst' },
    { email: 'admin@nita.gov', role: 'system_admin' as UserRole, label: 'System Admin' },
  ];

  const quickLogin = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setRole(account.role);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-background">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">NITA SOC</h1>
              <p className="text-sm text-muted-foreground">Security Operations Center</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Integrated Network<br />
            <span className="text-primary">Monitoring & Security</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            Centrally monitor, detect, analyze, and respond to network and cybersecurity incidents across government ICT infrastructure.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20 text-success">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Real-time Threat Detection</p>
                <p className="text-sm text-muted-foreground">Automatic detection and alerting</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/20 text-info">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Centralized Incident Management</p>
                <p className="text-sm text-muted-foreground">Track and resolve incidents efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20 text-warning">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Compliance Reporting</p>
                <p className="text-sm text-muted-foreground">Generate audit-ready reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">NITA SOC</h1>
              <p className="text-xs text-muted-foreground">Security Operations Center</p>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to access the SOC dashboard</p>
          </div>

          {/* Demo Account Quick Access */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2">Quick access (Demo)</p>
            <div className="flex flex-wrap gap-2">
              {demoAccounts.map((account) => (
                <Button
                  key={account.email}
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin(account)}
                  className="text-xs"
                >
                  <User className="h-3 w-3 mr-1" />
                  {account.label}
                </Button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="network_admin">Network Administrator</SelectItem>
                  <SelectItem value="cybersecurity_analyst">Cybersecurity Analyst</SelectItem>
                  <SelectItem value="system_admin">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            National Information Technology Agency (NITA)<br />
            Secure Government ICT Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}

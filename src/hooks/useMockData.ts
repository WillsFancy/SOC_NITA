import { useState, useEffect, useCallback } from 'react';

export interface NetworkDevice {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'firewall' | 'server' | 'endpoint';
  ip: string;
  status: 'online' | 'offline' | 'warning';
  location: string;
  uptime: number;
  cpu: number;
  memory: number;
  bandwidth: { in: number; out: number };
  lastSeen: Date;
}

export interface SecurityAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'intrusion' | 'malware' | 'ddos' | 'unauthorized_access' | 'policy_violation' | 'anomaly';
  source: string;
  target: string;
  timestamp: Date;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  relatedAlerts: string[];
  category: string;
}

export interface NetworkMetrics {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  warningDevices: number;
  totalBandwidth: { in: number; out: number };
  averageCpu: number;
  averageMemory: number;
  packetLoss: number;
  latency: number;
}

export interface SecurityMetrics {
  totalAlerts: number;
  criticalAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
  lowAlerts: number;
  resolvedToday: number;
  avgResponseTime: number;
  threatsBlocked: number;
}

// Generate mock network devices
const generateDevices = (): NetworkDevice[] => {
  const types: NetworkDevice['type'][] = ['router', 'switch', 'firewall', 'server', 'endpoint'];
  const locations = ['Data Center A', 'Data Center B', 'Ministry of Finance', 'Ministry of Health', 'Regional Office - Lusaka', 'Regional Office - Ndola'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `DEV-${String(i + 1).padStart(4, '0')}`,
    name: `${types[i % types.length].toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
    type: types[i % types.length],
    ip: `192.168.${Math.floor(i / 255)}.${i % 255 + 1}`,
    status: Math.random() > 0.15 ? (Math.random() > 0.1 ? 'online' : 'warning') : 'offline',
    location: locations[i % locations.length],
    uptime: Math.floor(Math.random() * 720) + 24,
    cpu: Math.floor(Math.random() * 80) + 10,
    memory: Math.floor(Math.random() * 70) + 20,
    bandwidth: { in: Math.floor(Math.random() * 1000), out: Math.floor(Math.random() * 500) },
    lastSeen: new Date(Date.now() - Math.random() * 3600000),
  }));
};

// Generate mock security alerts
const generateAlerts = (): SecurityAlert[] => {
  const alertTypes: { title: string; type: SecurityAlert['type']; description: string }[] = [
    { title: 'Brute Force Attack Detected', type: 'intrusion', description: 'Multiple failed login attempts detected from external IP' },
    { title: 'Suspicious Malware Signature', type: 'malware', description: 'Known malware signature detected in network traffic' },
    { title: 'DDoS Attack Mitigation', type: 'ddos', description: 'Volumetric attack detected and automatically mitigated' },
    { title: 'Unauthorized Access Attempt', type: 'unauthorized_access', description: 'Access attempt to restricted resource without proper credentials' },
    { title: 'Policy Violation', type: 'policy_violation', description: 'User attempted to access blocked category website' },
    { title: 'Traffic Anomaly Detected', type: 'anomaly', description: 'Unusual traffic pattern detected on network segment' },
    { title: 'Port Scan Detected', type: 'intrusion', description: 'Sequential port scanning detected from external source' },
    { title: 'Phishing Attempt Blocked', type: 'malware', description: 'Email with phishing link intercepted and quarantined' },
  ];

  const severities: SecurityAlert['severity'][] = ['critical', 'high', 'medium', 'low'];
  const statuses: SecurityAlert['status'][] = ['new', 'investigating', 'resolved', 'false_positive'];

  return Array.from({ length: 25 }, (_, i) => {
    const alertTemplate = alertTypes[i % alertTypes.length];
    return {
      id: `ALT-${String(i + 1).padStart(5, '0')}`,
      title: alertTemplate.title,
      description: alertTemplate.description,
      severity: severities[Math.floor(Math.random() * severities.length)],
      type: alertTemplate.type,
      source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      target: `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 3),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Generate mock incidents
const generateIncidents = (): Incident[] => {
  const categories = ['Network Security', 'Access Control', 'Data Breach', 'System Compromise', 'Policy Violation'];
  const assignees = ['John Mwale', 'Sarah Banda', 'David Phiri', 'Grace Tembo', 'Michael Zulu'];

  const incidentTemplates = [
    { title: 'Critical Server Compromise Investigation', description: 'Investigation into potential compromise of production server' },
    { title: 'DDoS Attack Response', description: 'Coordinated response to distributed denial of service attack' },
    { title: 'Data Exfiltration Alert', description: 'Investigation of unusual data transfer patterns' },
    { title: 'Ransomware Containment', description: 'Containment and remediation of ransomware infection' },
    { title: 'Insider Threat Investigation', description: 'Investigation of suspicious internal user activity' },
    { title: 'Firewall Rule Violation', description: 'Analysis of unauthorized firewall rule changes' },
    { title: 'Authentication System Failure', description: 'Investigation of authentication service anomalies' },
    { title: 'Network Segmentation Breach', description: 'Analysis of traffic crossing security boundaries' },
  ];

  const severities: Incident['severity'][] = ['critical', 'high', 'medium', 'low'];
  const statuses: Incident['status'][] = ['open', 'in_progress', 'resolved', 'closed'];

  return Array.from({ length: 15 }, (_, i) => {
    const template = incidentTemplates[i % incidentTemplates.length];
    const createdAt = new Date(Date.now() - Math.random() * 86400000 * 7);
    return {
      id: `INC-${String(2024001 + i)}`,
      title: template.title,
      description: template.description,
      severity: severities[Math.floor(Math.random() * severities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      assignee: Math.random() > 0.2 ? assignees[Math.floor(Math.random() * assignees.length)] : undefined,
      createdAt,
      updatedAt: new Date(createdAt.getTime() + Math.random() * 86400000),
      relatedAlerts: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => `ALT-${String(j + 1).padStart(5, '0')}`),
      category: categories[Math.floor(Math.random() * categories.length)],
    };
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export function useMockData() {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data load
    setTimeout(() => {
      setDevices(generateDevices());
      setAlerts(generateAlerts());
      setIncidents(generateIncidents());
      setIsLoading(false);
    }, 500);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => ({
        ...device,
        cpu: Math.min(100, Math.max(5, device.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.min(100, Math.max(10, device.memory + (Math.random() - 0.5) * 5)),
        bandwidth: {
          in: Math.max(0, device.bandwidth.in + (Math.random() - 0.5) * 100),
          out: Math.max(0, device.bandwidth.out + (Math.random() - 0.5) * 50),
        },
        lastSeen: device.status === 'online' ? new Date() : device.lastSeen,
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const networkMetrics: NetworkMetrics = {
    totalDevices: devices.length,
    onlineDevices: devices.filter(d => d.status === 'online').length,
    offlineDevices: devices.filter(d => d.status === 'offline').length,
    warningDevices: devices.filter(d => d.status === 'warning').length,
    totalBandwidth: devices.reduce((acc, d) => ({
      in: acc.in + d.bandwidth.in,
      out: acc.out + d.bandwidth.out,
    }), { in: 0, out: 0 }),
    averageCpu: devices.length > 0 ? devices.reduce((acc, d) => acc + d.cpu, 0) / devices.length : 0,
    averageMemory: devices.length > 0 ? devices.reduce((acc, d) => acc + d.memory, 0) / devices.length : 0,
    packetLoss: 0.02 + Math.random() * 0.03,
    latency: 12 + Math.random() * 8,
  };

  const securityMetrics: SecurityMetrics = {
    totalAlerts: alerts.length,
    criticalAlerts: alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length,
    highAlerts: alerts.filter(a => a.severity === 'high' && a.status !== 'resolved').length,
    mediumAlerts: alerts.filter(a => a.severity === 'medium' && a.status !== 'resolved').length,
    lowAlerts: alerts.filter(a => a.severity === 'low' && a.status !== 'resolved').length,
    resolvedToday: alerts.filter(a => a.status === 'resolved' && a.timestamp > new Date(Date.now() - 86400000)).length,
    avgResponseTime: 15 + Math.random() * 30,
    threatsBlocked: 1247 + Math.floor(Math.random() * 100),
  };

  const updateIncidentStatus = useCallback((id: string, status: Incident['status']) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === id ? { ...inc, status, updatedAt: new Date() } : inc
    ));
  }, []);

  const updateAlertStatus = useCallback((id: string, status: SecurityAlert['status']) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status } : alert
    ));
  }, []);

  return {
    devices,
    alerts,
    incidents,
    networkMetrics,
    securityMetrics,
    isLoading,
    updateIncidentStatus,
    updateAlertStatus,
  };
}

// Chart data helpers
export function getTrafficChartData() {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - (23 - i));
    return hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  });

  return hours.map((time, i) => ({
    time,
    inbound: Math.floor(500 + Math.sin(i / 3) * 200 + Math.random() * 100),
    outbound: Math.floor(300 + Math.cos(i / 3) * 150 + Math.random() * 80),
  }));
}

export function getAlertTrendData() {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  return days.map(day => ({
    day,
    critical: Math.floor(Math.random() * 5),
    high: Math.floor(Math.random() * 10) + 2,
    medium: Math.floor(Math.random() * 15) + 5,
    low: Math.floor(Math.random() * 20) + 10,
  }));
}

export function getIncidentCategoryData(incidents: Incident[]) {
  const categories = incidents.reduce((acc, inc) => {
    acc[inc.category] = (acc[inc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categories).map(([name, value]) => ({ name, value }));
}

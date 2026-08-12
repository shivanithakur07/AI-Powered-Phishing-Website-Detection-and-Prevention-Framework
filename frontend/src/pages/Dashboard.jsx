import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Activity, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full text-primary font-mono"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div> Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-danger bg-danger/10 p-4 rounded-lg border border-danger/20">Failed to load dashboard data. Ensure backend is running.</div>;
  }

  const distData = [
    { name: 'Phishing', value: stats.distribution.PHISHING, color: '#EF4444' },
    { name: 'Suspicious', value: stats.distribution.SUSPICIOUS, color: '#F59E0B' },
    { name: 'Legitimate', value: stats.distribution.LEGITIMATE, color: '#10B981' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-textPrimary tracking-tight">System Dashboard</h2>
        <p className="text-textSecondary mt-1">Aggregate threat intelligence and system performance metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-textSecondary mb-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Total Scans</h3>
          </div>
          <p className="text-3xl font-bold font-mono">{stats.total_checks}</p>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-textSecondary mb-2">
            <ShieldAlert className="w-5 h-5 text-danger" />
            <h3 className="font-medium">Phishing Rate</h3>
          </div>
          <p className="text-3xl font-bold font-mono text-danger">{stats.phishing_percentage}%</p>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-textSecondary mb-2">
            <ShieldCheck className="w-5 h-5 text-success" />
            <h3 className="font-medium">Legit Rate</h3>
          </div>
          <p className="text-3xl font-bold font-mono text-success">{stats.legitimate_percentage}%</p>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 text-textSecondary mb-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-medium">Suspicious</h3>
          </div>
          <p className="text-3xl font-bold font-mono text-warning">{stats.distribution.SUSPICIOUS}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Recent Risk Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E3B4E" vertical={false} />
                <XAxis dataKey="date" stroke="#94A3B8" tickFormatter={(val) => new Date(val).toLocaleTimeString()} />
                <YAxis stroke="#94A3B8" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151A22', borderColor: '#2E3B4E', color: '#E2E8F0' }}
                  itemStyle={{ color: '#06B6D4' }}
                />
                <Line type="monotone" dataKey="score" stroke="#06B6D4" strokeWidth={3} dot={{ fill: '#0B0E14', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Verdict Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E3B4E" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" />
                <Tooltip 
                  cursor={{ fill: '#1C232E' }}
                  contentStyle={{ backgroundColor: '#151A22', borderColor: '#2E3B4E', color: '#E2E8F0' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {distData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

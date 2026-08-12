import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Shield, History, Activity, Database } from 'lucide-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import HistoryPage from './pages/HistoryPage';

function Sidebar() {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Scanner', icon: <Shield size={20} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/history', label: 'History', icon: <History size={20} /> },
    { path: '/batch', label: 'Batch Scan', icon: <Database size={20} /> },
    { path: '/insights', label: 'Model Insights', icon: <Activity size={20} /> },
  ];

  return (
    <div className="w-64 bg-surface border-r border-border h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <Shield className="text-primary w-8 h-8" />
        <h1 className="font-bold text-lg tracking-tight">PhishGuard<span className="text-primary">.ai</span></h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              location.pathname === item.path 
                ? 'bg-primary/10 text-primary border border-primary/20' 
                : 'text-textSecondary hover:bg-surfaceHover hover:text-textPrimary'
            }`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="text-xs text-textSecondary text-center">
          Engine v2.1.0-fusion
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 ml-64 overflow-auto">
          <div className="max-w-6xl mx-auto p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<HistoryPage />} />
              {/* Add empty placeholder routes for batch and insights */}
              <Route path="/batch" element={<div className="text-textSecondary">Batch Scan Module coming soon.</div>} />
              <Route path="/insights" element={<div className="text-textSecondary">Model Insights coming soon.</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;

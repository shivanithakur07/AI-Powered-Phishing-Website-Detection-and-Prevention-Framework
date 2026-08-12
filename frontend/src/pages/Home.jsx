import { useState } from 'react';
import axios from 'axios';
import { Search, AlertTriangle, ShieldCheck, Info, CheckCircle2, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const loadingSteps = [
    "Resolving domain...",
    "Extracting HTML features...",
    "Checking SSL certificate...",
    "Querying reputation API...",
    "Running ML models...",
    "Scoring..."
  ];

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setResult(null);
    setError('');
    
    // Simulate loading steps for UX
    let stepIndex = 0;
    setLoadingText(loadingSteps[0]);
    const stepInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < loadingSteps.length) {
        setLoadingText(loadingSteps[stepIndex]);
      }
    }, 600);

    try {
      // Adding http:// if missing for better user experience
      let targetUrl = url;
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'http://' + targetUrl;
        setUrl(targetUrl);
      }

      const response = await axios.post('http://127.0.0.1:5000/api/check', { url: targetUrl });
      clearInterval(stepInterval);
      setResult(response.data);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.response?.data?.error || 'Failed to scan URL. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict) => {
    switch(verdict) {
      case 'PHISHING': return '#EF4444'; // danger
      case 'SUSPICIOUS': return '#F59E0B'; // warning
      case 'LEGITIMATE': return '#10B981'; // success
      default: return '#06B6D4'; // primary
    }
  };
  
  const getVerdictIcon = (verdict) => {
    switch(verdict) {
      case 'PHISHING': return <XCircle className="w-8 h-8 text-danger" />;
      case 'SUSPICIOUS': return <AlertTriangle className="w-8 h-8 text-warning" />;
      case 'LEGITIMATE': return <CheckCircle2 className="w-8 h-8 text-success" />;
      default: return <Info className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-textPrimary tracking-tight">URL Risk Analyzer</h2>
        <p className="text-textSecondary mt-1">Real-time threat detection using hybrid ML and reputation scoring.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <form onSubmit={handleScan} className="flex gap-4 relative">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary w-5 h-5" />
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-background border border-border rounded-lg py-3 pl-12 pr-4 text-textPrimary placeholder:text-textSecondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-cyan-400 text-background font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                Scanning
              </span>
            ) : 'Analyze'}
          </button>
        </form>
        
        {loading && (
          <div className="mt-4 flex items-center gap-3 text-sm text-primary font-mono">
             <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
             {loadingText}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-danger/10 border border-danger/20 rounded-lg flex items-start gap-3 text-danger">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <h4 className="font-semibold">Analysis Failed</h4>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Main Verdict Card */}
          <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: getVerdictColor(result.verdict) }}></div>
            
            <div className="w-32 h-32 relative mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { value: result.risk_score },
                      { value: 100 - result.risk_score }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    startAngle={180}
                    endAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={getVerdictColor(result.verdict)} />
                    <Cell fill="#2E3B4E" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pb-6">
                <span className="text-3xl font-bold font-mono" style={{ color: getVerdictColor(result.verdict) }}>
                  {result.risk_score}
                </span>
                <span className="text-xs text-textSecondary uppercase tracking-widest">Risk</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-1">
              {getVerdictIcon(result.verdict)}
              <h3 className="text-2xl font-bold tracking-tight" style={{ color: getVerdictColor(result.verdict) }}>
                {result.verdict}
              </h3>
            </div>
            <p className="text-textSecondary text-sm">
              Confidence: <span className="font-mono text-textPrimary">{(result.confidence * 100).toFixed(1)}%</span>
            </p>
          </div>

          {/* Features Panel */}
          <div className="md:col-span-2 bg-surface border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <ShieldCheck className="text-primary w-5 h-5" />
              <h3 className="text-lg font-semibold">Diagnostic Insights</h3>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-textSecondary uppercase tracking-wider">Top Contributing Factors</h4>
              <ul className="space-y-3">
                {result.top_features && result.top_features.length > 0 ? (
                  result.top_features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-background border border-border rounded-lg p-3">
                      <div className="mt-0.5">
                        {result.verdict === 'LEGITIMATE' ? (
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-warning" />
                        )}
                      </div>
                      <span className="text-sm text-textPrimary">{feature}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-textSecondary italic">No prominent features flagged.</li>
                )}
              </ul>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4">
               <div>
                  <div className="text-xs text-textSecondary mb-1 uppercase tracking-wider">Module A</div>
                  <div className="font-mono text-sm">{result.details?.module_a?.available ? (result.details.module_a.score.toFixed(2)) : 'N/A'}</div>
               </div>
               <div>
                  <div className="text-xs text-textSecondary mb-1 uppercase tracking-wider">Module B</div>
                  <div className="font-mono text-sm">{result.details?.module_b?.available ? (result.details.module_b.score.toFixed(2)) : 'N/A'}</div>
               </div>
               <div>
                  <div className="text-xs text-textSecondary mb-1 uppercase tracking-wider">Analysis Time</div>
                  <div className="font-mono text-sm">{result.details?.elapsed_seconds}s</div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

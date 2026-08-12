import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, ExternalLink, ChevronLeft, ChevronRight, Flag } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState({ items: [], total: 0, pages: 1, current_page: 1 });
  const [loading, setLoading] = useState(true);

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/history?page=${page}&per_page=15`);
      setHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleReportFeedback = async (id, url, verdict) => {
    const reportType = verdict === 'PHISHING' ? 'LEGITIMATE' : 'PHISHING';
    if(window.confirm(`Report ${url} as a false ${verdict === 'PHISHING' ? 'positive' : 'negative'}?`)) {
      try {
        await axios.post('http://127.0.0.1:5000/api/report-feedback', {
          url: url,
          original_verdict: verdict,
          reported_as: reportType
        });
        alert('Feedback submitted. Model will be retrained on this data later.');
      } catch (err) {
        alert('Failed to submit feedback.');
      }
    }
  };

  const getVerdictStyle = (verdict) => {
    switch(verdict) {
      case 'PHISHING': return 'bg-danger/10 text-danger border-danger/20';
      case 'SUSPICIOUS': return 'bg-warning/10 text-warning border-warning/20';
      case 'LEGITIMATE': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary tracking-tight">Scan Log</h2>
          <p className="text-textSecondary mt-1">Historical record of all analyzed domains.</p>
        </div>
        <div className="flex items-center gap-2 text-textSecondary text-sm">
          <Clock className="w-4 h-4" />
          <span>Total Scans: <span className="font-mono text-textPrimary">{history.total}</span></span>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surfaceHover border-b border-border">
                <th className="py-4 px-6 font-medium text-textSecondary text-sm uppercase tracking-wider">Timestamp</th>
                <th className="py-4 px-6 font-medium text-textSecondary text-sm uppercase tracking-wider">Target URL</th>
                <th className="py-4 px-6 font-medium text-textSecondary text-sm uppercase tracking-wider">Verdict</th>
                <th className="py-4 px-6 font-medium text-textSecondary text-sm uppercase tracking-wider">Score</th>
                <th className="py-4 px-6 font-medium text-textSecondary text-sm uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading && history.items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-textSecondary">
                    <div className="flex items-center justify-center gap-2">
                       <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                       Loading logs...
                    </div>
                  </td>
                </tr>
              ) : history.items.length === 0 ? (
                <tr><td colSpan="5" className="py-8 text-center text-textSecondary">No history found.</td></tr>
              ) : (
                history.items.map((item) => (
                  <tr key={item.id} className="hover:bg-surfaceHover/50 transition-colors">
                    <td className="py-4 px-6 text-sm text-textSecondary whitespace-nowrap">
                      {new Date(item.checked_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-mono text-sm max-w-xs truncate text-textPrimary" title={item.url}>
                      {item.url}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getVerdictStyle(item.verdict)}`}>
                        {item.verdict}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-sm">
                      {item.score}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3 text-textSecondary">
                        <button 
                          onClick={() => handleReportFeedback(item.id, item.url, item.verdict)}
                          className="hover:text-primary transition-colors flex items-center gap-1 text-xs"
                          title="Report False Positive/Negative"
                        >
                          <Flag className="w-4 h-4" />
                          Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-surfaceHover/30">
          <span className="text-sm text-textSecondary">
            Page {history.current_page} of {Math.max(history.pages, 1)}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => fetchHistory(history.current_page - 1)}
              disabled={history.current_page <= 1 || loading}
              className="p-2 bg-surface border border-border rounded-lg hover:bg-surfaceHover disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => fetchHistory(history.current_page + 1)}
              disabled={history.current_page >= history.pages || loading}
              className="p-2 bg-surface border border-border rounded-lg hover:bg-surfaceHover disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

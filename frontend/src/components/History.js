import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, AlertCircle } from 'lucide-react';
import Loader from './Loader';

const History = ({ token }) => {
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [historyRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/detection/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/detection/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!historyRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const historyData = await historyRes.json();
      const statsData = await statsRes.json();

      setAnalyses(historyData);
      setStats(statsData);
    } catch (err) {
      setError('Error loading history. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`http://localhost:5000/api/detection/history/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete');

      setAnalyses(analyses.filter(a => a._id !== id));
      setStats(prev => ({
        ...prev,
        total: prev.total - 1
      }));
    } catch (err) {
      alert('Error deleting analysis: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'LIKELY REAL':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30';
      case 'LIKELY FAKE':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30';
      default:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30';
    }
  };

  if (!token) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center p-12 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <p className="text-slate-600 dark:text-slate-400">Please sign in to view your analysis history.</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <Loader size={32} className="mx-auto mb-4" />
            <p>Loading analysis history...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Analysis History</h2>
        <p className="text-slate-600 dark:text-slate-400">View all previous fake news detections</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200 mb-6">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Analyses</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
            <p className="text-xs text-green-600 dark:text-green-400 mb-1">Likely Real</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.realNews}</p>
          </div>
          <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
            <p className="text-xs text-red-600 dark:text-red-400 mb-1">Likely Fake</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.fakeNews}</p>
          </div>
          <div className="p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30">
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Uncertain</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats.uncertain}</p>
          </div>
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Score</p>
            <p className="text-2xl font-bold">{Math.round(stats.averageScore)}%</p>
          </div>
        </div>
      )}

      {/* Analyses List */}
      {analyses.length === 0 ? (
        <div className="text-center p-12 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <p className="text-slate-600 dark:text-slate-400">No analyses yet. Start by detecting some news!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <div
              key={analysis._id}
              className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold truncate">{analysis.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded font-medium whitespace-nowrap ${getVerdictColor(analysis.verdict)}`}>
                      {analysis.verdict}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                    {analysis.text || 'No preview available'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                    <span>Score: {analysis.credibilityScore}%</span>
                    <span>Content: {analysis.contentLength} chars</span>
                    <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <div className="text-center">
                    <p className="text-lg font-bold">{analysis.credibilityScore}</p>
                    <p className="text-xs text-slate-500">%</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(analysis._id)}
                  disabled={deleting === analysis._id}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-600 dark:text-red-400 disabled:opacity-50"
                  title="Delete analysis"
                >
                  {deleting === analysis._id ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default History;

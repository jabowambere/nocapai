import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Activity,
  Database,
  Zap
} from 'lucide-react';
import Loader from './Loader';

const AdminDashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        fetch('http://localhost:5000/api/detection/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/detection/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (statsRes.ok && historyRes.ok) {
        const statsData = await statsRes.json();
        const historyData = await historyRes.json();
        
        setStats(statsData);
        setRecentAnalyses(historyData.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = "blue" }) => (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
              <TrendingUp size={14} />
              {trend}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-900/20 flex items-center justify-center`}>
          <Icon className={`text-gray-600 dark:text-gray-400`} size={24} />
        </div>
      </div>
    </div>
  );

  const getVerdictBadge = (verdict) => {
    const configs = {
      'LIKELY REAL': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      'LIKELY FAKE': 'bg-gray-200 text-gray-900 dark:bg-gray-800/20 dark:text-gray-300',
      'UNCERTAIN': 'bg-gray-150 text-gray-700 dark:bg-gray-850/20 dark:text-gray-350'
    };
    return configs[verdict] || configs['UNCERTAIN'];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader size={48} className="text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Monitor system performance and analytics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900/20 rounded-xl">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-400">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Analyses"
            value={stats.total}
            icon={BarChart3}
            trend="+12% this week"
            color="gray"
          />
          <StatCard
            title="Verified Real"
            value={stats.realNews}
            icon={CheckCircle}
            trend={`${Math.round((stats.realNews / stats.total) * 100)}% accuracy`}
            color="gray"
          />
          <StatCard
            title="Detected Fake"
            value={stats.fakeNews}
            icon={AlertTriangle}
            trend={`${Math.round((stats.fakeNews / stats.total) * 100)}% flagged`}
            color="gray"
          />
          <StatCard
            title="Avg Confidence"
            value={`${Math.round(stats.averageScore)}%`}
            icon={TrendingUp}
            trend="+5% improvement"
            color="gray"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Activity className="text-blue-600 dark:text-blue-400" size={20} />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent Analyses</h2>
              </div>
            </div>
            <div className="p-6">
              {recentAnalyses.length > 0 ? (
                <div className="space-y-4">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis._id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                          {analysis.title || 'Untitled Analysis'}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {new Date(analysis.createdAt).toLocaleDateString()} • {analysis.contentLength} chars
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {analysis.credibilityScore}%
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVerdictBadge(analysis.verdict)}`}>
                          {analysis.verdict}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="mx-auto text-slate-400 mb-3" size={48} />
                  <p className="text-slate-500 dark:text-slate-400">No analyses yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-6">
          {/* AI Status */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <Zap className="text-gray-600 dark:text-gray-400" size={20} />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">AI System</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Detection Engine</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Pattern Analysis</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Source Verification</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full px-4 py-3 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="text-gray-600 dark:text-gray-400" size={16} />
                  <span className="text-sm font-medium">Run System Check</span>
                </div>
              </button>
              <button className="w-full px-4 py-3 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Database className="text-gray-600 dark:text-gray-400" size={16} />
                  <span className="text-sm font-medium">Export Data</span>
                </div>
              </button>
              <button className="w-full px-4 py-3 text-left rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Clock className="text-gray-600 dark:text-gray-400" size={16} />
                  <span className="text-sm font-medium">View Logs</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

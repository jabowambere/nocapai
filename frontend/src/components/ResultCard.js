import React from 'react';
import { Check, AlertTriangle, AlertCircle, Brain, Target, TrendingUp } from 'lucide-react';

const ResultCard = ({ result }) => {
  const getVerdictConfig = () => {
    switch (result.verdict) {
      case 'LIKELY REAL':
        return {
          icon: Check,
          color: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
          textColor: 'text-green-900 dark:text-green-200',
          badgeColor: 'bg-green-100 dark:bg-green-900/50 text-green-900 dark:text-green-200'
        };
      case 'LIKELY FAKE':
        return {
          icon: AlertTriangle,
          color: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
          textColor: 'text-red-900 dark:text-red-200',
          badgeColor: 'bg-red-100 dark:bg-red-900/50 text-red-900 dark:text-red-200'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-900 dark:text-yellow-200',
          badgeColor: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-200'
        };
    }
  };

  const config = getVerdictConfig();
  const Icon = config.icon;

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Verdict Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className={`p-8 ${config.color.replace('bg-', 'bg-gradient-to-r from-').replace('dark:bg-', 'dark:from-')} border-none`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon size={32} className="text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wide">Verification Result</p>
              <p className="text-3xl font-bold text-white">{result.verdict}</p>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed">{result.analysis}</p>
        </div>
      </div>

      {/* Score Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Credibility Score</p>
          <div className="text-6xl font-bold mb-4">
            <span className={`${
              result.credibilityScore >= 70
                ? 'text-green-500'
                : result.credibilityScore >= 50
                ? 'text-yellow-500'
                : 'text-red-500'
            }`}>{result.credibilityScore}</span>
            <span className="text-2xl text-slate-400">%</span>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full h-6 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1500 ease-out rounded-full ${
                result.credibilityScore >= 70
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : result.credibilityScore >= 50
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                  : 'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${result.credibilityScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-3">
            <span>0% Fake</span>
            <span>50% Uncertain</span>
            <span>100% Real</span>
          </div>
        </div>
      </div>

      {/* Key Indicators */}
      {result.indicators.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">Key Indicators Found</p>
          <div className="space-y-2">
            {result.indicators.map((indicator, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm"
              >
                <span className="text-slate-400 dark:text-slate-600 flex-shrink-0 mt-0.5">•</span>
                <span className="text-slate-700 dark:text-slate-300">{indicator}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      {result.sources.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">Source Analysis</p>
          <div className="space-y-2">
            {result.sources.map((source, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm"
              >
                <span className="text-slate-400 dark:text-slate-600 flex-shrink-0 mt-0.5">•</span>
                <span className="text-slate-700 dark:text-slate-300">{source}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Content Length</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{result.contentLength} chars</p>
        </div>
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Analysis Date</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;

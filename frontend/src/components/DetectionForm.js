import React, { useState } from 'react';
import { Send, Loader2, X, Zap, Brain, Link, ExternalLink } from 'lucide-react';
import ResultCard from './ResultCard';

const DetectionForm = ({ token, isAuthenticated, onShowAuth }) => {
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const recommendedSources = [
    { name: 'Reuters', url: 'https://reuters.com', category: 'News Agency' },
    { name: 'AP News', url: 'https://apnews.com', category: 'News Agency' },
    { name: 'BBC News', url: 'https://bbc.com/news', category: 'International' },
    { name: 'NPR', url: 'https://npr.org', category: 'Public Radio' },
    { name: 'Snopes', url: 'https://snopes.com', category: 'Fact Check' },
    { name: 'FactCheck.org', url: 'https://factcheck.org', category: 'Fact Check' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!content.trim()) {
      setError('Please enter news content to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/detection/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: content.trim(),
          sourceUrl: sourceUrl.trim()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze content');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Error analyzing content. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Analysis Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-black p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Analyze News Content</h2>
              <p className="text-gray-100">Paste any news article or claim to verify its credibility</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste news article, headline, or any content you want to verify..."
                  rows={12}
                  className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all resize-none text-sm leading-relaxed"
                />
              </div>

              <div>
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="Source URL (optional)"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200">
                  <X size={20} className="flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="w-full py-4 px-6 bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap size={24} />
                    <span>Verify Content</span>
                  </>
                )}
              </button>
              
              {!isAuthenticated && (
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                  <button onClick={onShowAuth} className="text-gray-600 hover:text-gray-700 underline">
                    Sign in as admin
                  </button> to access dashboard and history
                </p>
              )}
            </form>
          </div>

          {result && <ResultCard result={result} />}
        </div>

        {/* Recommended Sources Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden sticky top-24">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6">
              <h3 className="text-xl font-bold text-white mb-2">Trusted Sources</h3>
              <p className="text-gray-100 text-sm">Verify with reliable news outlets</p>
            </div>
            
            <div className="p-6 space-y-4">
              {recommendedSources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-gray-600 dark:group-hover:text-gray-400">{source.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{source.category}</p>
                  </div>
                  <ExternalLink size={16} className="text-slate-400 group-hover:text-gray-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionForm;

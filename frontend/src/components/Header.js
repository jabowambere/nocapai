import React from 'react';
import { Moon, Sun, History as HistoryIcon, Shield, LogIn, LogOut, User } from 'lucide-react';

const Header = ({ isDark, setIsDark, currentPath, navigate, isAuthenticated, onShowAuth, onLogout }) => {
  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">Nocap AI</h1>
              <span className="text-xs text-slate-500 dark:text-slate-400">{isAuthenticated ? 'Admin Dashboard' : 'Truth Verification'}</span>
            </div>
          </div>

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="flex gap-2">
              <button
                onClick={() => navigate('/admin')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  currentPath === '/admin'
                    ? 'bg-gradient-to-r from-gray-800 to-black text-white shadow-lg'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/history')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  currentPath === '/history'
                    ? 'bg-gradient-to-r from-gray-800 to-black text-white shadow-lg'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <HistoryIcon size={16} />
                History
              </button>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          ) : (
            <button
              onClick={onShowAuth}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl font-semibold hover:from-gray-900 hover:to-gray-800 transition-all"
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}
          
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

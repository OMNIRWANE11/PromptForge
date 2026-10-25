import React, { useState } from 'react';
import { 
  Sparkles, Lock, Mail, User, ShieldCheck, ArrowRight, 
  Terminal, Database, CheckCircle2, Zap, AlertCircle
} from 'lucide-react';
import PromptForgeLogo from './PromptForgeLogo';

export default function AuthScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
    const payload = isSignUp
      ? { username, email, password, fullName }
      : { usernameOrEmail: username || email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || data.detail || 'Authentication failed');
      }

      // Persist in localStorage and transition to main app
      localStorage.setItem('promptforge_user', JSON.stringify(data.user));
      localStorage.setItem('promptforge_token', data.token);
      onLoginSuccess(data.user);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('fetch')) {
        setErrorMsg('Backend server on port 8000 is not reachable. Please start it with "python run.py" or "start.bat".');
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.detail || 'Demo login failed');

      localStorage.setItem('promptforge_user', JSON.stringify(data.user));
      localStorage.setItem('promptforge_token', data.token);
      onLoginSuccess(data.user);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('fetch')) {
        setErrorMsg('Backend server on port 8000 is not reachable. Please start it with "python run.py" or "start.bat".');
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf2f9] flex flex-col justify-center items-center p-4 sm:p-6 font-sans selection:bg-blue-600/20 selection:text-blue-800">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header with Professional Logo Badge */}
        <div className="text-center space-y-3">
          <PromptForgeLogo size="lg" variant="badge" showTagline={true} />
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Multi-LLM Prompt Optimization &amp; PostgreSQL Token-Efficiency Engine
          </p>
        </div>

        {/* Auth Card Container Matching Main Workspace */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_10px_25px_-5px_rgba(203,213,225,0.45),0_8px_10px_-6px_rgba(203,213,225,0.35)] p-6 sm:p-7 space-y-5">
          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                !isSignUp
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                isSignUp
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-slate-700 font-bold text-[11px] block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Patel"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-slate-700 font-bold text-[11px] block">
                {isSignUp ? 'Username' : 'Username or Email'}
              </label>
              <div className="relative">
                <Terminal className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isSignUp ? 'e.g. priya_patel' : 'priya or priya@civixminds.ai'}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-1">
                <label className="text-slate-700 font-bold text-[11px] block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-slate-700 font-bold text-[11px] block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating with Database...</span>
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account & Proceed' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold">
              <span className="bg-white px-2 text-slate-400">Fast Evaluator Access</span>
            </div>
          </div>

          {/* Quick Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600 fill-current" />
            <span>1-Click Demo Login: Priya Patel (AI Lead)</span>
          </button>
        </div>

        {/* Database & Security Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 text-blue-600">
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL Database Connected</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}


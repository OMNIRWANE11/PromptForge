import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, X, Shield, RefreshCw } from 'lucide-react';
import PromptForgeLogo from './PromptForgeLogo';

export default function DatabaseModal({ isOpen, onClose, onDbUpdated, onConnectionSuccess }) {
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('5432');
  const [user, setUser] = useState('postgres');
  const [password, setPassword] = useState('');
  const [dbname, setDbname] = useState('promptforge');
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/database/status');
      const data = await res.json();
      setDbStatus(data);
      if (data.host) setHost(data.host);
      if (data.port) setPort(data.port);
      if (data.user) setUser(data.user);
      if (data.database) setDbname(data.database);
    } catch (e) {
      console.error(e);
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/database/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host, port, user, password, dbname })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Failed to connect to PostgreSQL');
      }

      setMessage(data.message || 'Successfully connected to PostgreSQL!');
      fetchStatus();
      if (onDbUpdated) onDbUpdated(data);
      if (onConnectionSuccess) onConnectionSuccess(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 backdrop-blur-md">
        {/* Modal Header with PromptForge Brand */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <PromptForgeLogo size="sm" variant="icon" />
            <div>
              <h3 className="text-base font-semibold text-white font-mono flex items-center gap-1.5">
                <span className="text-blue-400">&gt;_</span> PostgreSQL Database
              </h3>
              <p className="text-xs text-slate-400">Connect PromptForge to local pgAdmin / PostgreSQL</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Banner */}
        <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
          dbStatus?.isPostgres 
            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300' 
            : 'bg-blue-950/30 border-blue-800/60 text-blue-300'
        }`}>
          {dbStatus?.isPostgres ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
          )}
          <div>
            <div className="font-semibold font-mono">
              {dbStatus?.isPostgres ? 'PostgreSQL Connected' : 'Local Fallback Storage Active'}
            </div>
            <div className="text-[11px] text-slate-400">
              {dbStatus?.isPostgres 
                ? `Saving all prompts to PostgreSQL (${dbStatus.host}/${dbStatus.database})` 
                : 'Enter your pgAdmin password below to connect to PostgreSQL.'}
            </div>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleConnect} className="space-y-3 text-xs font-mono">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2 space-y-1">
              <label className="text-slate-400 font-medium text-[11px] block">HOST</label>
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="localhost"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 shadow-inner"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 font-medium text-[11px] block">PORT</label>
              <input
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="5432"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium text-[11px] block">USERNAME</label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="postgres"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 shadow-inner"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-400 font-medium text-[11px] block">DATABASE NAME</label>
              <input
                type="text"
                value={dbname}
                onChange={(e) => setDbname(e.target.value)}
                placeholder="promptforge"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium text-[11px] block">
              PGADMIN / POSTGRESQL PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your PostgreSQL password"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-slate-200 focus:outline-none focus:border-blue-500 shadow-inner"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Connecting...' : 'Save & Connect'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Eye,
  EyeOff,
  Lock,
  Wifi,
  FileCode,
  Plus
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    security,
    toggleHideFinancialAmounts,
    lockApp,
    setActiveTab,
    setIsQuickActionOpen,
    projects,
    selectedProjectId,
    setSelectedProjectId
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">كهرباني</span>
                <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  المقاول الكهربائي
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>يعمل دون اتصال (Offline-First)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Selector Quick Filter */}
        <div className="hidden md:flex items-center gap-2">
          <label className="text-xs text-slate-400">المشروع الحالي:</label>
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value || null)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value="">جميع المشاريع</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectNumber} — {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2">
          {/* Quick Add Button */}
          <button
            onClick={() => setIsQuickActionOpen(true)}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-md shadow-amber-500/15 transition-all"
            title="إجراء سريع"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">إجراء سريع</span>
          </button>

          {/* Android Codebase Studio Tab Button */}
          <button
            onClick={() => setActiveTab('android_code')}
            className="flex items-center gap-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs px-2.5 py-1.5 rounded-lg transition-colors"
            title="مشروع كود Android Studio Native"
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline font-mono">Android Studio Code</span>
          </button>

          {/* Privacy Toggle: Hide/Show Financial Amounts */}
          <button
            onClick={toggleHideFinancialAmounts}
            className={`p-2 rounded-lg border transition-colors ${
              security.hideFinancialAmounts
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={security.hideFinancialAmounts ? 'إظهار المبالغ المالية' : 'حجب المبالغ المالية (وضع الخصوصية)'}
          >
            {security.hideFinancialAmounts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          {/* PIN Lock Button */}
          {security.isPinEnabled && (
            <button
              onClick={lockApp}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="قفل التطبيق الآن"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

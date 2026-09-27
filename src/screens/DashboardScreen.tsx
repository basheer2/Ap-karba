import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatMoney, calculateProjectProfit } from '../domain/financials';
import {
  HardHat,
  DollarSign,
  TrendingUp,
  Receipt,
  Users2,
  AlertTriangle,
  CalendarCheck2,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Briefcase,
  FileCode
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const {
    projects,
    stages,
    clients,
    persons,
    invoices,
    receipts,
    expenses,
    personPayments,
    defects,
    workLogs,
    attendance,
    security,
    setActiveTab,
    setIsQuickActionOpen,
    setSelectedProjectId
  } = useApp();

  // Financial KPI calculations
  const totalContractValue = projects.reduce((sum, p) => sum + p.totalValue, 0);
  const totalReceipts = receipts.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalWorkerWagesEarned = attendance.reduce((sum, a) => sum + a.earnedWage, 0);
  const totalWorkerPayments = personPayments.reduce((sum, p) => sum + p.amount, 0);

  const profitResult = calculateProjectProfit(totalReceipts, totalWorkerWagesEarned, totalExpenses);

  // Receivables (مبالغ مستحقة للتحصيل)
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalRemainingInvoices = invoices.reduce((sum, i) => sum + i.remainingAmount, 0);

  // Project statuses
  const activeProjectsCount = projects.filter(p => p.status === 'ACTIVE').length;
  const completedProjectsCount = projects.filter(p => p.status === 'COMPLETED').length;
  const openDefectsCount = defects.filter(d => d.status === 'OPEN' || d.status === 'IN_PROGRESS').length;

  // Today's attendance
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayAttendanceCount = attendance.filter(a => a.date === todayDateStr && a.status !== 'ABSENT').length;

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
      {/* Top Banner / Welcome & Quick Stats */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-amber-400 font-semibold text-xs tracking-wider">لوحة القيادة والمؤشرات الحية</span>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">نظام المقاول الكهربائي — كهرباني</h1>
            <p className="text-xs text-slate-400 mt-1">
              متابعة الإنجاز اليومي، تدفق السيولة النقدية، تكاليف العمال، وأرباح المشاريع لحظة بلحظة
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('android_code')}
              className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3.5 py-2.5 rounded-xl font-bold transition-all"
              title="تحميل كود المشروع وملفات التطبيق"
            >
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>تحميل كود المشروع</span>
            </button>
            <button
              onClick={() => setIsQuickActionOpen(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إجراء سريع</span>
            </button>
            <button
              onClick={() => setActiveTab('daily_work')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition-colors"
            >
              <CalendarCheck2 className="w-4 h-4 text-amber-400" />
              <span>عمل اليوم</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Receipts / Inflow */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">إجمالي المقبوضات (التحصيل)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-white font-mono">
            {formatMoney(totalReceipts, security.hideFinancialAmounts)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2 font-medium">
            <span>من {receipts.length} دفعات وسندات قبض</span>
          </div>
        </div>

        {/* Total Expenses + Worker Costs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">إجمالي التكاليف (مواد + عمال)</span>
            <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-white font-mono">
            {formatMoney(profitResult.totalCost, security.hideFinancialAmounts)}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
            <span>مواد: {formatMoney(totalExpenses, security.hideFinancialAmounts)}</span>
            <span>·</span>
            <span>عمال: {formatMoney(totalWorkerWagesEarned, security.hideFinancialAmounts)}</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">صافي الربح التقديري</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-lg sm:text-xl font-black font-mono ${profitResult.netProfit >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
            {formatMoney(profitResult.netProfit, security.hideFinancialAmounts)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
            <span>هامش الربح:</span>
            <span className="font-bold text-white font-mono">%{profitResult.profitMarginPercent}</span>
          </div>
        </div>

        {/* Receivables Due from Clients */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">فواتير ومستحقات لم تُحصّل</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-purple-300 font-mono">
            {formatMoney(totalRemainingInvoices, security.hideFinancialAmounts)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>متبقي من {invoices.filter(i => i.remainingAmount > 0).length} فاتورة</span>
            <button
              onClick={() => setActiveTab('invoices')}
              className="text-amber-400 hover:underline"
            >
              عرض الفواتير
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Operational Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab('projects')}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-850 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <HardHat className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white font-mono">{activeProjectsCount} / {projects.length}</div>
            <div className="text-[11px] text-slate-400">مشاريع نشطة حالياً</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('workers')}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-850 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white font-mono">{persons.length} فنيين</div>
            <div className="text-[11px] text-slate-400">فريق العمل المسجل</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('daily_work')}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-850 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white font-mono">{todayAttendanceCount} حاضر اليوم</div>
            <div className="text-[11px] text-slate-400">سجل حضور الموقع</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('defects')}
          className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-850 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white font-mono">{openDefectsCount} ملاحظة</div>
            <div className="text-[11px] text-slate-400">عيوب وملاحظات مفتوحة</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Projects Snapshot & Recent Daily Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects Overview (2 columns) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h2 className="font-bold text-white text-base">المشاريع الجارية والإنجاز</h2>
              <p className="text-xs text-slate-400">نسبة تقدم كل مرحلة من التأسيس إلى التشطيب</p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>جميع المشاريع</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => {
              const projectStages = stages.filter(s => s.projectId === project.id);
              const avgProgress = projectStages.length > 0
                ? Math.round(projectStages.reduce((acc, s) => acc + s.progressPercent, 0) / projectStages.length)
                : 0;

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setActiveTab('projects');
                  }}
                  className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">{project.projectNumber}</span>
                        <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                          {project.name}
                        </h3>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span>العميل: {project.clientName || 'غير محدد'}</span>
                        <span>·</span>
                        <span>{project.location}</span>
                      </div>
                    </div>

                    <div className="text-left font-mono">
                      <div className="text-xs font-bold text-white">
                        {formatMoney(project.totalValue, security.hideFinancialAmounts)}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {project.status === 'ACTIVE' ? 'نشط' : 'مكتمل'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">إجمالي الإنجاز العام</span>
                      <span className="font-mono font-bold text-amber-400">%{avgProgress}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${avgProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stages Pills */}
                  {projectStages.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                      {projectStages.map(stg => (
                        <div
                          key={stg.id}
                          className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            stg.status === 'COMPLETED' ? 'bg-emerald-400' :
                            stg.status === 'IN_PROGRESS' ? 'bg-amber-400' : 'bg-slate-500'
                          }`} />
                          <span>{stg.name}</span>
                          <span className="font-mono text-slate-400">%{stg.progressPercent}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Operations Feed (1 column) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h2 className="font-bold text-white text-base">سجل الأعمال الأخيرة</h2>
              <p className="text-xs text-slate-400">آخر بنود الإنجاز المسجلة في المواقع</p>
            </div>
            <button
              onClick={() => setActiveTab('daily_work')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              تسجيل جديد
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px] scrollbar-none">
            {workLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-white">{log.workType}</div>
                  <span className="text-[10px] text-slate-400 font-mono">{log.date}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>العامل: {log.personName || 'فني'}</span>
                  <span className="font-mono font-bold text-amber-400">{log.quantity} وحدة</span>
                </div>
                {log.notes && (
                  <div className="text-[10px] text-slate-500 mt-1 italic">
                    «{log.notes}»
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Shortcuts */}
          <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('handovers')}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700/80 text-center transition-colors"
            >
              محاضر التسليم
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700/80 text-center transition-colors"
            >
              كشوفات الحساب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

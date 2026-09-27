import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatMoney, calculateProjectProfit } from '../domain/financials';
import {
  HardHat,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Project, ProjectStage, ProjectStatus, StageStatus } from '../types';

export const ProjectsScreen: React.FC = () => {
  const {
    projects,
    stages,
    clients,
    receipts,
    expenses,
    attendance,
    security,
    addProject,
    updateProject,
    deleteProject,
    addStage,
    updateStage,
    deleteStage,
    selectedProjectId,
    setSelectedProjectId
  } = useApp();

  const [activeTabStatus, setActiveTabStatus] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddStageModalOpen, setIsAddStageModalOpen] = useState(false);

  // New Project Form
  const [name, setName] = useState('');
  const [clientId, setClientId] = useState(clients[0]?.id || '');
  const [phone, setPhone] = useState('770000000');
  const [location, setLocation] = useState('صنعاء');
  const [description, setDescription] = useState('');
  const [totalValue, setTotalValue] = useState('3000000');
  const [contractType, setContractType] = useState<'UNIT_ITEMS' | 'LUMP_SUM'>('UNIT_ITEMS');

  // New Stage Form
  const [stageName, setStageName] = useState('');
  const [stageDescription, setStageDescription] = useState('');
  const [stageValue, setStageValue] = useState('500000');
  const [stageProgress, setStageProgress] = useState('0');
  const [stageStatus, setStageStatus] = useState<StageStatus>('NOT_STARTED');

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const filteredProjects = projects.filter(p => {
    if (activeTabStatus === 'ALL') return true;
    return p.status === activeTabStatus;
  });

  // Calculate detailed financial profitability for the active project
  const projectReceipts = receipts.filter(r => r.projectId === activeProject?.id);
  const projectExpenses = expenses.filter(e => e.projectId === activeProject?.id);
  const projectAttendance = attendance.filter(a => a.projectId === activeProject?.id);

  const totalRevenue = projectReceipts.reduce((sum, r) => sum + r.amount, 0) || activeProject?.totalValue || 0;
  const laborCost = projectAttendance.reduce((sum, a) => sum + a.earnedWage, 0);
  const expensesCost = projectExpenses.reduce((sum, e) => sum + e.amount, 0);

  const profit = calculateProjectProfit(totalRevenue, laborCost, expensesCost);
  const projectStages = stages.filter(s => s.projectId === activeProject?.id);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const client = clients.find(c => c.id === clientId);

    addProject({
      name,
      clientId,
      clientName: client?.name || 'عميل',
      phone,
      location,
      description,
      notes: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
      status: 'ACTIVE',
      contractType,
      totalValue: parseInt(totalValue) || 0,
      isArchived: false
    });

    setName('');
    setIsAddModalOpen(false);
  };

  const handleCreateStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !stageName.trim()) return;

    addStage({
      projectId: activeProject.id,
      name: stageName,
      orderIndex: projectStages.length + 1,
      description: stageDescription,
      progressPercent: parseInt(stageProgress) || 0,
      status: stageStatus,
      stageValue: parseInt(stageValue) || 0
    });

    setStageName('');
    setStageDescription('');
    setIsAddStageModalOpen(false);
  };

  const handleUpdateStageProgress = (stage: ProjectStage, percent: number) => {
    const updatedStatus: StageStatus = percent >= 100 ? 'COMPLETED' : percent > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
    updateStage({
      ...stage,
      progressPercent: percent,
      status: updatedStatus
    });
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-400" />
            <span>إدارة المشاريع والمراحل الكهربائية</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            متابعة خطة التنفيذ المخطط مقابل الفعلي، مراحل التأسيس وسحب الأسلاك، والربحية
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>مشروع جديد</span>
        </button>
      </div>

      {/* Projects List Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ALL', label: 'كافة المشاريع' },
          { id: 'ACTIVE', label: 'المشاريع النشطة' },
          { id: 'COMPLETED', label: 'المكتملة' },
          { id: 'PAUSED', label: 'المتوقفة' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTabStatus === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Projects Selector & Active Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Projects List (1 col) */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            قائمة المشاريع ({filteredProjects.length})
          </h2>

          <div className="space-y-2.5">
            {filteredProjects.map((p) => {
              const isSelected = activeProject?.id === p.id;
              const pStages = stages.filter(s => s.projectId === p.id);
              const progress = pStages.length > 0
                ? Math.round(pStages.reduce((acc, s) => acc + s.progressPercent, 0) / pStages.length)
                : 0;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-amber-400">{p.projectNumber}</span>
                      <h3 className="font-bold text-sm text-white">{p.name}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">{p.clientName}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      p.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {p.status === 'ACTIVE' ? 'نشط' : 'مكتمل'}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">القيمة:</span>
                    <span className="font-bold text-white">
                      {formatMoney(p.totalValue, security.hideFinancialAmounts)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Project Deep Dive (2 cols) */}
        {activeProject ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      {activeProject.projectNumber}
                    </span>
                    <h2 className="text-lg font-bold text-white">{activeProject.name}</h2>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>العميل: {activeProject.clientName}</span>
                    <span>·</span>
                    <span>الهاتف: {activeProject.phone}</span>
                    <span>·</span>
                    <span>الموقع: {activeProject.location}</span>
                  </div>
                </div>

                <div className="text-left font-mono">
                  <span className="text-xs text-slate-400">قيمة العقد:</span>
                  <div className="text-base sm:text-lg font-black text-amber-400">
                    {formatMoney(activeProject.totalValue, security.hideFinancialAmounts)}
                  </div>
                </div>
              </div>

              {/* Profitability Calculation Box (Section 29) */}
              <div className="mt-4 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span>تحليل ربحية المشروع (Domain Financials)</span>
                  </span>
                  <span>المعادلة: الإيراد − (أجور العمال + المصروفات) = صافي الربح</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[11px] text-slate-400">الإيراد المحصل</span>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                      {formatMoney(profit.totalRevenue, security.hideFinancialAmounts)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[11px] text-slate-400">أجور العمال</span>
                    <div className="text-sm font-bold text-red-400 font-mono mt-0.5">
                      {formatMoney(profit.laborCost, security.hideFinancialAmounts)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[11px] text-slate-400">المصروفات والمواد</span>
                    <div className="text-sm font-bold text-red-400 font-mono mt-0.5">
                      {formatMoney(profit.expensesCost, security.hideFinancialAmounts)}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <span className="text-[11px] text-amber-300 font-semibold">صافي الربح (%{profit.profitMarginPercent})</span>
                    <div className="text-sm font-black text-amber-400 font-mono mt-0.5">
                      {formatMoney(profit.netProfit, security.hideFinancialAmounts)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Stages Section (Section 10 & 30) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-white">مراحل التنفيذ (Project Stages)</h3>
                  <p className="text-xs text-slate-400">التأسيس، سحب الأسلاك، التشطيب مع مقارنة المخطط والفعلي</p>
                </div>
                <button
                  onClick={() => setIsAddStageModalOpen(true)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة مرحلة</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {projectStages.map((stage) => (
                  <div
                    key={stage.id}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 text-[10px] font-bold flex items-center justify-center border border-slate-700">
                            {stage.orderIndex}
                          </span>
                          <h4 className="font-bold text-sm text-white">{stage.name}</h4>
                        </div>
                        {stage.description && (
                          <p className="text-xs text-slate-400 mt-1">{stage.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-xs font-bold text-amber-400">
                          {formatMoney(stage.stageValue, security.hideFinancialAmounts)}
                        </span>
                        <button
                          onClick={() => deleteStage(stage.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                          title="حذف المرحلة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Slider */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">نسبة الإنجاز الفعلي:</span>
                        <span className="font-mono font-bold text-amber-400">%{stage.progressPercent}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={stage.progressPercent}
                        onChange={(e) => handleUpdateStageProgress(stage, parseInt(e.target.value))}
                        className="w-full accent-amber-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Add Project Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">إنشاء مشروع كهربائي جديد</h3>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المشروع</label>
                <input
                  type="text"
                  placeholder="مثال: فيلا حي الروضة — دورين وملحق"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">العميل</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">نوع الاتفاق</label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="UNIT_ITEMS">حسب البنود</option>
                    <option value="LUMP_SUM">مبلغ إجمالي (مقطوع)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">قيمة المشروع (ريال يمني)</label>
                <input
                  type="number"
                  value={totalValue}
                  onChange={(e) => setTotalValue(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الموقع الجغرافي</label>
                <input
                  type="text"
                  placeholder="صنعاء — شارع حدة"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md shadow-amber-500/20"
                >
                  حفظ وإنشاء المراحل تلقائياً
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stage Modal */}
      {isAddStageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">إضافة مرحلة جديدة للمشروع</h3>

            <form onSubmit={handleCreateStage} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المرحلة</label>
                <input
                  type="text"
                  placeholder="مثال: فحص التأريض وتركيب الكاميرات"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">القيمة التقديرية للمرحلة</label>
                <input
                  type="number"
                  value={stageValue}
                  onChange={(e) => setStageValue(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الوصف</label>
                <input
                  type="text"
                  placeholder="وصف تفصيلي لأعمال المرحلة"
                  value={stageDescription}
                  onChange={(e) => setStageDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  إضافة المرحلة
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddStageModalOpen(false)}
                  className="px-4 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

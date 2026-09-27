import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SignaturePad } from '../components/SignaturePad';
import {
  ClipboardCheck,
  Plus,
  CheckCircle2,
  Calendar,
  User,
  Printer,
  FileCheck
} from 'lucide-react';
import { Handover, HandoverType, HandoverChecklistItem } from '../types';

export const HandoversScreen: React.FC = () => {
  const {
    handovers,
    projects,
    addHandover,
    updateHandover
  } = useApp();

  const [selectedHandoverId, setSelectedHandoverId] = useState<string>(handovers[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Handover State
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [type, setType] = useState<HandoverType>('PRELIMINARY');
  const [recipientName, setRecipientName] = useState('المهندس / كمال الوجيه');
  const [recipientRole, setRecipientRole] = useState('استشاري المالك');
  const [completedWorkSummary, setCompletedWorkSummary] = useState('تم تسليم أعمال التأسيس وسحب الأسلاك وتجميع اللوحة');
  const [pendingWorkSummary, setPendingWorkSummary] = useState('التشطيب وتركيب الثريات والسبوت');

  const activeHandover = handovers.find(h => h.id === selectedHandoverId) || handovers[0];

  const handleToggleChecklist = (handover: Handover, checkId: string) => {
    const updatedChecklists = handover.checklists.map(c => {
      if (c.id === checkId) return { ...c, isChecked: !c.isChecked };
      return c;
    });
    updateHandover({
      ...handover,
      checklists: updatedChecklists
    });
  };

  const handleSaveContractorSignature = (dataUrl: string) => {
    if (!activeHandover) return;
    updateHandover({
      ...activeHandover,
      contractorSignature: dataUrl
    });
  };

  const handleSaveClientSignature = (dataUrl: string) => {
    if (!activeHandover) return;
    updateHandover({
      ...activeHandover,
      clientSignature: dataUrl
    });
  };

  const handleCreateHandover = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === projectId);

    const defaultChecklists: HandoverChecklistItem[] = [
      { id: '1', itemTitle: 'فحص استقامة ونظافة مواسير السقف والجدران', isChecked: true, notes: 'سليمة' },
      { id: '2', itemTitle: 'فحص عزل الأسلاك وعدم وجود أي شورت سيركت (Short Circuit)', isChecked: true, notes: 'تم الاختبار بالميجر' },
      { id: '3', itemTitle: 'تأريض اللوحة الرئيسية وقضيب الأرضي (Earth Rod)', isChecked: true, notes: 'أقل من 5 أوم' },
      { id: '4', itemTitle: 'توازن الأحمال بين الفازات الثلاثة (Load Balancing)', isChecked: false, notes: 'تحت الفحص' }
    ];

    addHandover({
      projectId,
      projectName: prj?.name || '',
      date: new Date().toISOString().split('T')[0],
      type,
      recipientName,
      recipientRole,
      completedWorkSummary,
      pendingWorkSummary,
      checklists: defaultChecklists,
      status: 'ACCEPTED',
      notes: ''
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-amber-400" />
            <span>محاضر التسليم والتوقيع الحي (Handovers)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            محاضر تسليم مبدئية ونهائية، قوائم تدقيق السلامة (Checklist)، وتوقيع باللمس
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>محضر تسليم جديد</span>
        </button>
      </div>

      {/* Main Grid: Handover List (1 col) + Active Handover Details & Signatures (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Handovers List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            سجل محاضر التسليم ({handovers.length})
          </h2>

          <div className="space-y-2.5">
            {handovers.map((h) => {
              const isSelected = activeHandover?.id === h.id;
              return (
                <div
                  key={h.id}
                  onClick={() => setSelectedHandoverId(h.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-400">{h.handoverNumber}</span>
                      <h3 className="font-bold text-sm text-white mt-0.5">{h.projectName}</h3>
                      <div className="text-xs text-slate-400 mt-1">المستلم: {h.recipientName}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {h.type === 'PRELIMINARY' ? 'تسليم مبدئي' : 'تسليم نهائي'}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 text-xs text-slate-400 font-mono">
                    التاريخ: {h.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Handover View */}
        {activeHandover ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      {activeHandover.handoverNumber}
                    </span>
                    <h2 className="text-lg font-bold text-white">{activeHandover.projectName}</h2>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    المستلم: {activeHandover.recipientName} ({activeHandover.recipientRole}) · التاريخ: {activeHandover.date}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم الفحص والموافقة</span>
                  </span>
                </div>
              </div>

              {/* Scope & Work Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="font-bold text-slate-300 block mb-1">الأعمال المنجزة والمسلّمة:</span>
                  <p className="text-slate-400">{activeHandover.completedWorkSummary}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="font-bold text-slate-300 block mb-1">الأعمال المتبقية للمراحل التالية:</span>
                  <p className="text-slate-400">{activeHandover.pendingWorkSummary || 'لا توجد أعمال متبقية'}</p>
                </div>
              </div>

              {/* Checklist Section (Section 40) */}
              <div className="space-y-2">
                <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider">
                  قائمة تدقيق الجودة والسلامة الكهربائية (Electrical Inspection Checklist)
                </h3>

                <div className="space-y-2">
                  {activeHandover.checklists.map((chk) => (
                    <div
                      key={chk.id}
                      onClick={() => handleToggleChecklist(activeHandover, chk.id)}
                      className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          chk.isChecked ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold' : 'border-slate-600 bg-slate-900'
                        }`}>
                          {chk.isChecked && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                        </div>
                        <span className={`text-xs ${chk.isChecked ? 'text-white font-medium' : 'text-slate-400'}`}>
                          {chk.itemTitle}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{chk.notes}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Touch Signatures Section (Section 41: التوقيع باللمس) */}
              <div className="border-t border-slate-800 pt-4">
                <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider mb-3">
                  التوقيعات الرقمية المعتمدة (Digital Touch Signatures)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SignaturePad
                    label="توقيع المقاول المنفذ"
                    initialSignature={activeHandover.contractorSignature}
                    onSave={handleSaveContractorSignature}
                  />

                  <SignaturePad
                    label={`توقيع المستلم (${activeHandover.recipientName})`}
                    initialSignature={activeHandover.clientSignature}
                    onSave={handleSaveClientSignature}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Add Handover Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">إنشاء محضر تسليم جديد</h3>

            <form onSubmit={handleCreateHandover} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المشروع</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">نوع التسليم</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="PRELIMINARY">تسليم مبدئي</option>
                    <option value="FINAL">تسليم نهائي</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">صفة المستلم</label>
                  <input
                    type="text"
                    value={recipientRole}
                    onChange={(e) => setRecipientRole(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المهندس أو المالك المستلم</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ملخص الأعمال المنجزة</label>
                <textarea
                  rows={2}
                  value={completedWorkSummary}
                  onChange={(e) => setCompletedWorkSummary(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  إنشاء المحضر وقائمة الفحص
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
    </div>
  );
};

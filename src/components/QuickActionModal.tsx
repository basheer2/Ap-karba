import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  HardHat,
  CalendarCheck2,
  DollarSign,
  Receipt,
  AlertTriangle,
  Users2,
  FileText
} from 'lucide-react';

export const QuickActionModal: React.FC = () => {
  const {
    isQuickActionOpen,
    setIsQuickActionOpen,
    quickActionType,
    setQuickActionType,
    projects,
    stages,
    persons,
    clients,
    items,
    addWorkLog,
    recordAttendance,
    addPersonPayment,
    addReceipt,
    addExpense,
    addProject,
    addDefect
  } = useApp();

  const [activeForm, setActiveForm] = useState<string | null>(quickActionType || null);

  // Form states
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [stageId, setStageId] = useState('');
  const [personId, setPersonId] = useState(persons[0]?.id || '');
  const [itemId, setItemId] = useState(items[0]?.id || '');
  const [workType, setWorkType] = useState('تمديدات وسحب أسلاك');
  const [quantity, setQuantity] = useState('10');
  const [amount, setAmount] = useState('15000');
  const [notes, setNotes] = useState('');
  const [defectTitle, setDefectTitle] = useState('');
  const [defectPriority, setDefectPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');

  // New Project State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLocation, setNewProjectLocation] = useState('');
  const [newProjectValue, setNewProjectValue] = useState('2000000');
  const [newProjectClientId, setNewProjectClientId] = useState(clients[0]?.id || '');

  if (!isQuickActionOpen) return null;

  const currentProjectStages = stages.filter(s => s.projectId === projectId);

  const handleClose = () => {
    setIsQuickActionOpen(false);
    setActiveForm(null);
    setQuickActionType(null);
  };

  const handleSaveWorkLog = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === projectId);
    const stg = stages.find(s => s.id === stageId);
    const person = persons.find(p => p.id === personId);
    const item = items.find(i => i.id === itemId);
    const q = parseFloat(quantity) || 1;
    const price = item ? item.defaultPrice : 3000;

    addWorkLog({
      projectId,
      projectName: prj?.name || '',
      stageId: stageId || undefined,
      stageName: stg?.name || '',
      personId: personId || undefined,
      personName: person?.name || '',
      itemId: itemId || undefined,
      itemName: item?.name || '',
      date: new Date().toISOString().split('T')[0],
      workType: workType || item?.name || 'عمل كهربائي',
      quantity: q,
      unitPrice: price,
      total: q * price,
      durationMinutes: 480,
      notes
    });
    handleClose();
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === projectId);
    const stg = stages.find(s => s.id === stageId);
    const amt = parseInt(amount) || 0;

    addExpense({
      projectId: projectId || undefined,
      projectName: prj?.name || '',
      stageId: stageId || undefined,
      stageName: stg?.name || '',
      category: 'مواد',
      amount: amt,
      date: new Date().toISOString().split('T')[0],
      recipient: notes || 'محل الكهرباء',
      notes
    });
    handleClose();
  };

  const handleSaveReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === projectId);
    const client = clients.find(c => c.id === (prj?.clientId || clients[0]?.id));
    const amt = parseInt(amount) || 0;

    addReceipt({
      clientId: client?.id || clients[0]?.id || '',
      clientName: client?.name || clients[0]?.name || '',
      projectId: projectId || undefined,
      projectName: prj?.name || '',
      amount: amt,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'CASH',
      notes
    });
    handleClose();
  };

  const handleSaveWorkerPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const person = persons.find(p => p.id === personId);
    const prj = projects.find(p => p.id === projectId);
    const amt = parseInt(amount) || 0;

    addPersonPayment({
      personId,
      personName: person?.name || '',
      projectId: projectId || undefined,
      projectName: prj?.name || '',
      date: new Date().toISOString().split('T')[0],
      amount: amt,
      type: 'ADVANCE',
      paymentMethod: 'CASH',
      notes
    });
    handleClose();
  };

  const handleSaveNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const client = clients.find(c => c.id === newProjectClientId);
    const val = parseInt(newProjectValue) || 0;

    addProject({
      name: newProjectName,
      clientId: newProjectClientId || clients[0]?.id || '',
      clientName: client?.name || clients[0]?.name || '',
      phone: client?.phone || '770000000',
      location: newProjectLocation || 'صنعاء',
      description: 'مشروع تمديدات كهربائية وتشطيب',
      notes,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 60).toISOString().split('T')[0],
      status: 'ACTIVE',
      contractType: 'UNIT_ITEMS',
      totalValue: val,
      isArchived: false
    });
    handleClose();
  };

  const handleSaveDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defectTitle.trim()) return;
    const prj = projects.find(p => p.id === projectId);
    const person = persons.find(p => p.id === personId);

    addDefect({
      projectId,
      projectName: prj?.name || '',
      title: defectTitle,
      description: notes || defectTitle,
      date: new Date().toISOString().split('T')[0],
      priority: defectPriority,
      assignedPersonId: personId || undefined,
      assignedPersonName: person?.name || '',
      status: 'OPEN'
    });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="font-bold text-white text-base">
            {activeForm ? 'تسجيل العملية' : 'الإجراءات السريعة (Speed Actions)'}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Selection Grid */}
        {!activeForm && (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveForm('work_log')}
              className="flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-white">تسجيل عمل اليوم</span>
              <span className="text-[10px] text-slate-400 mt-0.5">إنجاز البنود والكميات</span>
            </button>

            <button
              onClick={() => setActiveForm('expense')}
              className="flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-white">تسجيل مصروف</span>
              <span className="text-[10px] text-slate-400 mt-0.5">شراء مواد أو نقل</span>
            </button>

            <button
              onClick={() => setActiveForm('receipt')}
              className="flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-white">سند قبض (دفعة)</span>
              <span className="text-[10px] text-slate-400 mt-0.5">تحصيل من عميل</span>
            </button>

            <button
              onClick={() => setActiveForm('worker_payment')}
              className="flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Users2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-white">سند صرف لعامل</span>
              <span className="text-[10px] text-slate-400 mt-0.5">سلفة أو دفعة أسبوعية</span>
            </button>

            <button
              onClick={() => setActiveForm('new_project')}
              className="flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <HardHat className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-white">مشروع جديد</span>
              <span className="text-[10px] text-slate-400 mt-0.5">فيلا، عمارة، شقة</span>
            </button>

            <button
              onClick={() => setActiveForm('defect')}
              className="flex flex-col items-center text-center p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-white">تسجيل عيب / ملاحظة</span>
              <span className="text-[10px] text-slate-400 mt-0.5">تتبع الملاحظات والموقع</span>
            </button>
          </div>
        )}

        {/* Work Log Form */}
        {activeForm === 'work_log' && (
          <form onSubmit={handleSaveWorkLog} className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المشروع</label>
              <select
                value={projectId}
                onChange={e => {
                  setProjectId(e.target.value);
                  setStageId('');
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-amber-500"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {currentProjectStages.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المرحلة</label>
                <select
                  value={stageId}
                  onChange={e => setStageId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-amber-500"
                >
                  <option value="">-- اختر المرحلة --</option>
                  {currentProjectStages.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">البند الكهربائي</label>
                <select
                  value={itemId}
                  onChange={e => setItemId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-amber-500"
                >
                  {items.map(it => (
                    <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الكمية المنجزة</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">العامل المنفذ</label>
              <select
                value={personId}
                onChange={e => setPersonId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-amber-500"
              >
                {persons.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.role === 'MASTER_TECHNICIAN' ? 'معلم' : 'فني'})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">ملاحظات العمل</label>
              <input
                type="text"
                placeholder="مثال: تم إنجاز الصالة والمجلس بالكامل"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-lg shadow-sm"
              >
                حفظ الإنجاز
              </button>
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="px-4 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-lg"
              >
                رجوع
              </button>
            </div>
          </form>
        )}

        {/* Expense Form */}
        {activeForm === 'expense' && (
          <form onSubmit={handleSaveExpense} className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المشروع</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المبلغ (ريال يمني)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">الجهة / المستلم / البيان</label>
              <input
                type="text"
                placeholder="مثال: شراء لفات أسلاك من محلات النور"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold text-xs py-2.5 rounded-lg"
              >
                حفظ المصروف
              </button>
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="px-4 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-lg"
              >
                رجوع
              </button>
            </div>
          </form>
        )}

        {/* Receipt Form */}
        {activeForm === 'receipt' && (
          <form onSubmit={handleSaveReceipt} className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المشروع</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المبلغ المقبوض (ريال يمني)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">ملاحظات السند / طريقة الدفع</label>
              <input
                type="text"
                placeholder="مثال: دفعة ثانية نقداً بعد إتمام سحب الأسلاك"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs py-2.5 rounded-lg"
              >
                حفظ سند القبض
              </button>
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="px-4 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-lg"
              >
                رجوع
              </button>
            </div>
          </form>
        )}

        {/* Worker Payment Form */}
        {activeForm === 'worker_payment' && (
          <form onSubmit={handleSaveWorkerPayment} className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">العامل / الفني</label>
              <select
                value={personId}
                onChange={e => setPersonId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              >
                {persons.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (أجر اليوم: {p.dailyWage} ر.ي)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المبلغ المنصرف (ريال يمني)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">البيان</label>
              <input
                type="text"
                placeholder="سلفة على الحساب"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs py-2.5 rounded-lg"
              >
                إصدار سند الصرف
              </button>
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="px-4 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-lg"
              >
                رجوع
              </button>
            </div>
          </form>
        )}

        {/* New Project Form */}
        {activeForm === 'new_project' && (
          <form onSubmit={handleSaveNewProject} className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المشروع</label>
              <input
                type="text"
                placeholder="مثال: فيلا المهندس خالد — بيت بوس"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">العميل</label>
                <select
                  value={newProjectClientId}
                  onChange={e => setNewProjectClientId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">قيمة المشروع التقديرية</label>
                <input
                  type="number"
                  value={newProjectValue}
                  onChange={e => setNewProjectValue(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">الموقع</label>
              <input
                type="text"
                placeholder="صنعاء — شارع حدة"
                value={newProjectLocation}
                onChange={e => setNewProjectLocation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs py-2.5 rounded-lg"
              >
                إنشاء المشروع مع مراحله
              </button>
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="px-4 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-lg"
              >
                رجوع
              </button>
            </div>
          </form>
        )}

        {/* Defect Form */}
        {activeForm === 'defect' && (
          <form onSubmit={handleSaveDefect} className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المشروع</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">عنوان الملاحظة / العيب</label>
              <input
                type="text"
                placeholder="مثال: ماسورة مسدودة أو سلك مقطوع"
                value={defectTitle}
                onChange={e => setDefectTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">مستوى الأولوية</label>
                <select
                  value={defectPriority}
                  onChange={e => setDefectPriority(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                >
                  <option value="LOW">منخفضة</option>
                  <option value="MEDIUM">متوسطة</option>
                  <option value="HIGH">عالية</option>
                  <option value="CRITICAL">حرجة جداً</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الفني المكلف بالمعالجة</label>
                <select
                  value={personId}
                  onChange={e => setPersonId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                >
                  {persons.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-lg"
              >
                حفظ الملاحظة
              </button>
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="px-4 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-lg"
              >
                رجوع
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

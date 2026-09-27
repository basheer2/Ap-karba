import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../domain/financials';
import {
  CalendarCheck2,
  Users2,
  HardHat,
  Plus,
  Trash2,
  Check,
  X,
  Clock,
  Briefcase
} from 'lucide-react';
import { AttendanceStatus } from '../types';

export const DailyWorkScreen: React.FC = () => {
  const {
    projects,
    stages,
    items,
    persons,
    workLogs,
    attendance,
    addWorkLog,
    deleteWorkLog,
    recordAttendance,
    security
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');
  const [selectedPersonId, setSelectedPersonId] = useState<string>(persons[0]?.id || '');
  const [quantity, setQuantity] = useState<string>('20');
  const [workNotes, setWorkNotes] = useState<string>('');

  const currentProjectStages = stages.filter(s => s.projectId === selectedProjectId);
  const selectedItem = items.find(i => i.id === selectedItemId);
  const currentUnitPrice = selectedItem?.defaultPrice || 2500;
  const currentTotal = (parseFloat(quantity) || 0) * currentUnitPrice;

  // Work logs for selected date
  const filteredWorkLogs = workLogs.filter(w => w.date === selectedDate);
  const totalQuantityToday = filteredWorkLogs.reduce((acc, w) => acc + w.quantity, 0);
  const totalValueToday = filteredWorkLogs.reduce((acc, w) => acc + w.total, 0);

  // Fast Attendance Handler
  const handleSetAttendance = (personId: string, status: AttendanceStatus, ratio: number) => {
    const person = persons.find(p => p.id === personId);
    if (!person) return;
    const earned = Math.round(person.dailyWage * ratio);
    const prj = projects.find(p => p.id === selectedProjectId);

    recordAttendance({
      personId,
      personName: person.name,
      projectId: selectedProjectId || undefined,
      projectName: prj?.name || '',
      date: selectedDate,
      status,
      ratio,
      earnedWage: earned,
      notes: status === 'HALF_DAY' ? 'نصف يوم' : status === 'PRESENT' ? 'يوم كامل' : 'غياب'
    });
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === selectedProjectId);
    const stg = stages.find(s => s.id === selectedStageId);
    const person = persons.find(p => p.id === selectedPersonId);
    const q = parseFloat(quantity) || 1;

    addWorkLog({
      projectId: selectedProjectId,
      projectName: prj?.name || '',
      stageId: selectedStageId || undefined,
      stageName: stg?.name || '',
      personId: selectedPersonId || undefined,
      personName: person?.name || '',
      itemId: selectedItemId,
      itemName: selectedItem?.name || '',
      date: selectedDate,
      workType: selectedItem?.name || 'عمل كهربائي',
      quantity: q,
      unitPrice: currentUnitPrice,
      total: q * currentUnitPrice,
      durationMinutes: 480,
      notes: workNotes
    });

    setWorkNotes('');
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
      {/* Header & Date Picker */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">سجل عمل اليوم وإنجاز المواقع</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            تسجيل سريع لحضور الفنيين وبنود الإنجاز الكهربائي بنقرات معدودة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold">تاريخ العمل:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Quick Attendance Section (حضور الفنيين اليوم بنقرة واحدة) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-white">تسجيل حضور الفنيين ليوم ({selectedDate})</h2>
          </div>
          <span className="text-xs text-slate-400">
            الحساب: الأجر المستحق = أجر اليوم × نسبة العمل
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {persons.map((person) => {
            const currentAtt = attendance.find(a => a.personId === person.id && a.date === selectedDate);
            const status = currentAtt?.status || 'ABSENT';

            return (
              <div
                key={person.id}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-white">{person.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      الأجر اليومي: {formatMoney(person.dailyWage, security.hideFinancialAmounts)}
                    </div>
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-[10px] text-slate-400">المستحق اليوم:</span>
                    <div className="text-xs font-bold text-emerald-400">
                      {formatMoney(currentAtt?.earnedWage || 0, security.hideFinancialAmounts)}
                    </div>
                  </div>
                </div>

                {/* 3 Quick Tap Buttons */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => handleSetAttendance(person.id, 'PRESENT', 1.0)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      status === 'PRESENT'
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>حاضر (1)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetAttendance(person.id, 'HALF_DAY', 0.5)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      status === 'HALF_DAY'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>نصف يوم</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetAttendance(person.id, 'ABSENT', 0.0)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      status === 'ABSENT'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>غائب (0)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Work Log Form & Today's Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fast Work Logging Form (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
            <Plus className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-white">تسجيل بند إنجاز جديد</h2>
          </div>

          <form onSubmit={handleAddLog} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المشروع</label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setSelectedStageId('');
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-amber-500"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.projectNumber} — {p.name}</option>
                ))}
              </select>
            </div>

            {currentProjectStages.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">مرحلة المشروع</label>
                <select
                  value={selectedStageId}
                  onChange={(e) => setSelectedStageId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-amber-500"
                >
                  <option value="">-- اختر المرحلة --</option>
                  {currentProjectStages.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (%{s.progressPercent})</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">البند الكهربائي</label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-amber-500"
              >
                {items.map(it => (
                  <option key={it.id} value={it.id}>
                    {it.name} ({it.unit}) — {it.defaultPrice} ر.ي
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الكمية المنفذة</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الفني المسؤول</label>
                <select
                  value={selectedPersonId}
                  onChange={(e) => setSelectedPersonId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-amber-500"
                >
                  {persons.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculated Value Preview */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <span className="text-xs text-amber-300 font-semibold">إجمالي القيمة:</span>
              <span className="text-sm font-black text-amber-400 font-mono">
                {formatMoney(currentTotal, security.hideFinancialAmounts)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">ملاحظات العمل الميداني</label>
              <input
                type="text"
                placeholder="مثال: تم إنجاز الدور الأول ومطابقة المخطط"
                value={workNotes}
                onChange={(e) => setWorkNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إضافة الإنجاز للسجل</span>
            </button>
          </form>
        </div>

        {/* Today's Logged Items Table (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h2 className="font-bold text-sm text-white">إنجازات يوم ({selectedDate})</h2>
                <p className="text-xs text-slate-400">
                  مجموع الكميات: <span className="font-mono text-amber-400 font-bold">{totalQuantityToday}</span> وحدة · القيمة: <span className="font-mono text-emerald-400 font-bold">{formatMoney(totalValueToday, security.hideFinancialAmounts)}</span>
                </p>
              </div>
            </div>

            {filteredWorkLogs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                لم يتم تسجيل بنود إنجاز في هذا التاريخ بعد.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto scrollbar-none">
                {filteredWorkLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{log.workType}</span>
                        {log.stageName && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                            {log.stageName}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>المشروع: {log.projectName || 'عام'}</span>
                        <span>·</span>
                        <span>الفني: {log.personName || 'فني'}</span>
                      </div>
                      {log.notes && (
                        <div className="text-[10px] text-slate-400 italic mt-0.5">
                          «{log.notes}»
                        </div>
                      )}
                    </div>

                    <div className="text-left font-mono">
                      <div className="text-xs font-bold text-amber-400">
                        {log.quantity} وحدة × {log.unitPrice.toLocaleString()}
                      </div>
                      <div className="text-sm font-black text-white mt-0.5">
                        {formatMoney(log.total, security.hideFinancialAmounts)}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteWorkLog(log.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700/60 transition-colors"
                      title="حذف السجل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

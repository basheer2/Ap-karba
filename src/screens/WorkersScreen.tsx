import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../domain/financials';
import {
  Users2,
  Plus,
  DollarSign,
  Receipt,
  Calendar,
  CheckCircle2,
  Trash2,
  FileText
} from 'lucide-react';
import { Person, PersonRole, PaymentType, PaymentMethod } from '../types';

export const WorkersScreen: React.FC = () => {
  const {
    persons,
    attendance,
    personPayments,
    projects,
    addPerson,
    updatePerson,
    deletePerson,
    addPersonPayment,
    security
  } = useApp();

  const [selectedPersonId, setSelectedPersonId] = useState<string>(persons[0]?.id || '');
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // New Worker State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('77');
  const [role, setRole] = useState<PersonRole>('WORKER');
  const [dailyWage, setDailyWage] = useState('8000');
  const [notes, setNotes] = useState('');

  // New Payment / Advance State
  const [payAmount, setPayAmount] = useState('25000');
  const [payType, setPayType] = useState<PaymentType>('ADVANCE');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('CASH');
  const [payNotes, setPayNotes] = useState('سلفة نقدية على الحساب');
  const [payProjectId, setPayProjectId] = useState(projects[0]?.id || '');

  const activePerson = persons.find(p => p.id === selectedPersonId) || persons[0];

  // Calculations for selected person (كشف حساب العامل)
  const workerAttendance = attendance.filter(a => a.personId === activePerson?.id);
  const workerPayments = personPayments.filter(p => p.personId === activePerson?.id);

  const totalEarnedWages = workerAttendance.reduce((sum, a) => sum + a.earnedWage, 0);
  const totalPaid = workerPayments.reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance = totalEarnedWages - totalPaid;

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addPerson({
      name,
      phone,
      role,
      dailyWage: parseInt(dailyWage) || 0,
      notes,
      isActive: true
    });

    setName('');
    setIsAddWorkerOpen(false);
  };

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePerson) return;
    const prj = projects.find(p => p.id === payProjectId);

    addPersonPayment({
      personId: activePerson.id,
      personName: activePerson.name,
      projectId: payProjectId || undefined,
      projectName: prj?.name || '',
      date: new Date().toISOString().split('T')[0],
      amount: parseInt(payAmount) || 0,
      type: payType,
      paymentMethod: payMethod,
      notes: payNotes
    });

    setIsPaymentModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users2 className="w-5 h-5 text-amber-400" />
            <span>إدارة فريق العمل وحسابات الفنيين</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            متابعة أيام الحضور، المستحقات اليومية، السلف، وإصدار سندات الصرف
          </p>
        </div>

        <button
          onClick={() => setIsAddWorkerOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة فني / عامل جديد</span>
        </button>
      </div>

      {/* Main Grid: Workers List (1 col) + Worker Account Statement (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workers List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            الفنيون والعمال ({persons.length})
          </h2>

          <div className="space-y-2.5">
            {persons.map((person) => {
              const isSelected = activePerson?.id === person.id;
              const pAtt = attendance.filter(a => a.personId === person.id);
              const pPay = personPayments.filter(p => p.personId === person.id);
              const earned = pAtt.reduce((sum, a) => sum + a.earnedWage, 0);
              const paid = pPay.reduce((sum, p) => sum + p.amount, 0);
              const bal = earned - paid;

              return (
                <div
                  key={person.id}
                  onClick={() => setSelectedPersonId(person.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-white">{person.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 mt-1 inline-block">
                        {person.role === 'MASTER_TECHNICIAN' ? 'معلم تمديدات' : person.role === 'OWNER' ? 'صاحب العمل' : 'فني كهربائي'}
                      </span>
                    </div>

                    <div className="text-left font-mono">
                      <span className="text-[10px] text-slate-400">الأجر اليومي:</span>
                      <div className="text-xs font-bold text-amber-400">
                        {formatMoney(person.dailyWage, security.hideFinancialAmounts)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">الرصيد المتبقي:</span>
                    <span className={`font-bold ${bal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatMoney(bal, security.hideFinancialAmounts)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Worker Statement of Account (كشف الحساب) */}
        {activePerson ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Account Summary Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">{activePerson.name}</h2>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                    <span>الهاتف: {activePerson.phone}</span>
                    <span>·</span>
                    <span>الأجر اليومي: {formatMoney(activePerson.dailyWage, security.hideFinancialAmounts)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all self-start sm:self-auto"
                >
                  <DollarSign className="w-4 h-4 stroke-[2.5]" />
                  <span>صرف سلفة / دفعة (سند صرف)</span>
                </button>
              </div>

              {/* Financial Balance Overview */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <span className="text-[11px] text-slate-400">إجمالي الأجور المستحقة</span>
                  <div className="text-sm sm:text-base font-black text-amber-400 font-mono mt-1">
                    {formatMoney(totalEarnedWages, security.hideFinancialAmounts)}
                  </div>
                  <span className="text-[10px] text-slate-400">من {workerAttendance.length} يوم عمل</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <span className="text-[11px] text-slate-400">إجمالي المدفوع (سلف ودفعات)</span>
                  <div className="text-sm sm:text-base font-black text-red-400 font-mono mt-1">
                    {formatMoney(totalPaid, security.hideFinancialAmounts)}
                  </div>
                  <span className="text-[10px] text-slate-400">من {workerPayments.length} سندات صرف</span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <span className="text-[11px] text-amber-300 font-semibold">الرصيد المتبقي للعامل</span>
                  <div className={`text-sm sm:text-base font-black font-mono mt-1 ${
                    remainingBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {formatMoney(remainingBalance, security.hideFinancialAmounts)}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {remainingBalance >= 0 ? 'مستحق للعامل' : 'سلف زائدة على العامل'}
                  </span>
                </div>
              </div>
            </div>

            {/* Attendance & Payment Vouchers Tabs / Logs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment Vouchers History */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
                  <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-amber-400" />
                    <span>سندات الصرف والسلف</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">{workerPayments.length} سندات</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none">
                  {workerPayments.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">لا توجد سلف أو دفعات مسجلة.</div>
                  ) : (
                    workerPayments.map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs font-mono"
                      >
                        <div>
                          <div className="font-bold text-white">{p.voucherNumber}</div>
                          <div className="text-[10px] text-slate-400">{p.date} · {p.notes}</div>
                        </div>
                        <div className="text-red-400 font-bold">
                          −{formatMoney(p.amount, security.hideFinancialAmounts)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Attendance Records History */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
                  <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>سجل أيام الحضور</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">{workerAttendance.length} يوم</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-none">
                  {workerAttendance.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">لا يوجد حضور مسجل بعد.</div>
                  ) : (
                    workerAttendance.map((a) => (
                      <div
                        key={a.id}
                        className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs font-mono"
                      >
                        <div>
                          <div className="font-bold text-white">{a.date}</div>
                          <div className="text-[10px] text-slate-400">{a.status === 'HALF_DAY' ? 'نصف يوم (0.5)' : 'يوم كامل (1.0)'}</div>
                        </div>
                        <div className="text-emerald-400 font-bold">
                          +{formatMoney(a.earnedWage, security.hideFinancialAmounts)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Add Worker Modal */}
      {isAddWorkerOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">إضافة فني أو عامل جديد</h3>

            <form onSubmit={handleCreateWorker} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الاسم الثلاثي</label>
                <input
                  type="text"
                  placeholder="مثال: المعلم ياسر الحميري"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الدور الوظيفي</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="MASTER_TECHNICIAN">معلم تمديدات رئيسي</option>
                    <option value="WORKER">فني / عامل كهربائي</option>
                    <option value="OWNER">صاحب العمل / مشرف</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الأجر اليومي (ريال يمني)</label>
                  <input
                    type="number"
                    value={dailyWage}
                    onChange={(e) => setDailyWage(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  إضافة لفريق العمل
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddWorkerOpen(false)}
                  className="px-4 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Voucher Modal */}
      {isPaymentModalOpen && activePerson && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">إصدار سند صرف للعامل ({activePerson.name})</h3>

            <form onSubmit={handleCreatePayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المبلغ المنصرف (ريال يمني)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">نوع الدفعة</label>
                  <select
                    value={payType}
                    onChange={(e) => setPayType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="ADVANCE">سلفة</option>
                    <option value="WEEKLY_PAYMENT">دفعة أسبوعية</option>
                    <option value="FINAL_PAYMENT">دفعة تصفية نهائية</option>
                    <option value="CUSTOM">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">طريقة الدفع</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="CASH">نقداً</option>
                    <option value="BANK_TRANSFER">حوالة مصرفية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المشروع المرتبط بالصرف</label>
                <select
                  value={payProjectId}
                  onChange={(e) => setPayProjectId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="">-- بدون تحديد مشروع --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">البيان / ملاحظات الصرف</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  إصدار وحفظ سند الصرف
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
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

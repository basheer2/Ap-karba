import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../domain/financials';
import {
  FileSignature,
  Plus,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Contract, ChangeOrder, ContractType, ContractStatus, ChangeOrderStatus } from '../types';

export const ContractsScreen: React.FC = () => {
  const {
    contracts,
    changeOrders,
    projects,
    clients,
    addContract,
    addChangeOrder,
    security
  } = useApp();

  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || '');
  const [isAddContractOpen, setIsAddContractOpen] = useState(false);
  const [isAddChangeOrderOpen, setIsAddChangeOrderOpen] = useState(false);

  // New Contract State
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [initialValue, setInitialValue] = useState('2500000');
  const [downPayment, setDownPayment] = useState('600000');
  const [durationDays, setDurationDays] = useState('60');
  const [agreementType, setAgreementType] = useState<ContractType>('UNIT_ITEMS');
  const [scopeOfWork, setScopeOfWork] = useState('تمديدات كهربائية، سحب أسلاك، وتركيب لوحات وإنارة');
  const [paymentTerms, setPaymentTerms] = useState('25% دفعة أولى، 25% بعد التأسيس، 30% بعد سحب الأسلاك، 20% عند التسليم');

  // Change Order State
  const [coDescription, setCoDescription] = useState('إضافة نقاط إنارة وأفياش إضافية بالسور');
  const [coAmount, setCoAmount] = useState('120000');
  const [coStatus, setCoStatus] = useState<ChangeOrderStatus>('APPROVED');

  const activeContract = contracts.find(c => c.id === selectedContractId) || contracts[0];
  const contractChangeOrders = changeOrders.filter(co => co.contractId === activeContract?.id);

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === projectId);
    const client = clients.find(c => c.id === prj?.clientId);
    const val = parseInt(initialValue) || 0;

    addContract({
      clientId: client?.id || clients[0]?.id || '',
      clientName: client?.name || clients[0]?.name || '',
      projectId,
      projectName: prj?.name || '',
      contractDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * (parseInt(durationDays) || 60)).toISOString().split('T')[0],
      durationDays: parseInt(durationDays) || 60,
      initialValue: val,
      downPayment: parseInt(downPayment) || 0,
      paymentTerms,
      scopeOfWork,
      excludedWork: 'الأجهزة الكهربائية والمكيفات والمولدات',
      agreementType,
      status: 'APPROVED',
      notes: ''
    });

    setIsAddContractOpen(false);
  };

  const handleCreateChangeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContract) return;

    addChangeOrder({
      contractId: activeContract.id,
      projectId: activeContract.projectId,
      description: coDescription,
      amount: parseInt(coAmount) || 0,
      date: new Date().toISOString().split('T')[0],
      status: coStatus,
      notes: 'تمت الموافقة وتحديث العقد تلقائياً'
    });

    setCoDescription('');
    setIsAddChangeOrderOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-amber-400" />
            <span>العقود وأوامر التغيير (Change Orders)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            صياغة العقود وتحديث القيمة تلقائياً عند اعتماد أوامر التغيير
          </p>
        </div>

        <button
          onClick={() => setIsAddContractOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>عقد جديد</span>
        </button>
      </div>

      {/* Main Layout: Contracts List (1 col) + Active Contract & Change Orders (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contracts Directory */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            سجل العقود ({contracts.length})
          </h2>

          <div className="space-y-2.5">
            {contracts.map((c) => {
              const isSelected = activeContract?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedContractId(c.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-400">{c.contractNumber}</span>
                      <h3 className="font-bold text-sm text-white">{c.projectName}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">{c.clientName}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {c.status === 'APPROVED' ? 'معتمد' : c.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : 'مسودة'}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">القيمة الحالية:</span>
                    <span className="font-bold text-white">
                      {formatMoney(c.currentValue, security.hideFinancialAmounts)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contract Details & Change Orders */}
        {activeContract ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      {activeContract.contractNumber}
                    </span>
                    <h2 className="text-lg font-bold text-white">{activeContract.projectName}</h2>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span>العميل: {activeContract.clientName}</span>
                    <span>·</span>
                    <span>المدة: {activeContract.durationDays} يوم</span>
                    <span>·</span>
                    <span>تاريخ العقد: {activeContract.contractDate}</span>
                  </div>
                </div>

                <div className="text-left font-mono">
                  <span className="text-xs text-slate-400">القيمة الإجمالية الحالية:</span>
                  <div className="text-lg font-black text-amber-400">
                    {formatMoney(activeContract.currentValue, security.hideFinancialAmounts)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    القيمة المبدئية: {formatMoney(activeContract.initialValue, security.hideFinancialAmounts)}
                  </div>
                </div>
              </div>

              {/* Terms and Scope */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="font-bold text-slate-300 block mb-1">نطاق العمل:</span>
                  <p className="text-slate-400">{activeContract.scopeOfWork}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="font-bold text-slate-300 block mb-1">شروط وسداد الدفعات:</span>
                  <p className="text-slate-400">{activeContract.paymentTerms}</p>
                </div>
              </div>
            </div>

            {/* Change Orders Section (Section 23: أوامر التغيير) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-white">أوامر التغيير (Change Orders)</h3>
                  <p className="text-xs text-slate-400">
                    عند اعتماد أمر التغيير، تضاف قيمته تلقائياً لقيمة العقد الإجمالية
                  </p>
                </div>

                <button
                  onClick={() => setIsAddChangeOrderOpen(true)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700 font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة أمر تغيير</span>
                </button>
              </div>

              <div className="space-y-3">
                {contractChangeOrders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    لا توجد أوامر تغيير مسجلة على هذا العقد.
                  </div>
                ) : (
                  contractChangeOrders.map((co) => (
                    <div
                      key={co.id}
                      className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400">{co.orderNumber}</span>
                          <span className="font-bold text-xs text-white">{co.description}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          التاريخ: {co.date} · {co.notes}
                        </div>
                      </div>

                      <div className="text-left font-mono">
                        <div className="text-sm font-black text-amber-400">
                          +{formatMoney(co.amount, security.hideFinancialAmounts)}
                        </div>
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          {co.status === 'APPROVED' ? 'معتمد ومضاف للعقد' : 'معلق'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Add Contract Modal */}
      {isAddContractOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">إبرام عقد جديد</h3>

            <form onSubmit={handleCreateContract} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المشروع</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.clientName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">القيمة المبدئية للعقد</label>
                  <input
                    type="number"
                    value={initialValue}
                    onChange={(e) => setInitialValue(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الدفعة المقدمة</label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">نوع الاتفاق</label>
                  <select
                    value={agreementType}
                    onChange={(e) => setAgreementType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="UNIT_ITEMS">حسب البنود</option>
                    <option value="LUMP_SUM">مبلغ إجمالي (مقطوع)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">مدة التنفيذ (بالأيام)</label>
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">نطاق العمل</label>
                <input
                  type="text"
                  value={scopeOfWork}
                  onChange={(e) => setScopeOfWork(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">شروط الدفع</label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  إنشاء العقد
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddContractOpen(false)}
                  className="px-4 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Change Order Modal */}
      {isAddChangeOrderOpen && activeContract && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">إضافة أمر تغيير للعقد ({activeContract.contractNumber})</h3>

            <form onSubmit={handleCreateChangeOrder} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">بيان أمر التغيير</label>
                <input
                  type="text"
                  placeholder="مثال: إضافة شبكة كاميرات مراقبة وتمديد مواسير"
                  value={coDescription}
                  onChange={(e) => setCoDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">قيمة أمر التغيير (ريال يمني)</label>
                <input
                  type="number"
                  value={coAmount}
                  onChange={(e) => setCoAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">حالة أمر التغيير</label>
                <select
                  value={coStatus}
                  onChange={(e) => setCoStatus(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="APPROVED">معتمد (يحدث قيمة العقد فوراً)</option>
                  <option value="PENDING">معلق للمراجعة</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  اعتماد وحفظ أمر التغيير
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddChangeOrderOpen(false)}
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

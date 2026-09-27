import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../domain/financials';
import {
  DollarSign,
  Receipt,
  FileText,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  Tag,
  Calendar,
  Trash2,
  Printer
} from 'lucide-react';
import { Invoice, Receipt as ReceiptType, Expense, InvoiceLine } from '../types';

export const FinanceScreen: React.FC = () => {
  const {
    invoices,
    receipts,
    expenses,
    personPayments,
    projects,
    clients,
    addInvoice,
    addReceipt,
    addExpense,
    security
  } = useApp();

  const [activeFinanceTab, setActiveFinanceTab] = useState<'INVOICES' | 'RECEIPTS' | 'EXPENSES' | 'CASH_FLOW'>('INVOICES');

  // Modals
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [isAddReceiptOpen, setIsAddReceiptOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // New Invoice Form
  const [invProjectId, setInvProjectId] = useState(projects[0]?.id || '');
  const [invLines, setInvLines] = useState<InvoiceLine[]>([
    { id: '1', description: 'أعمال تمديدات وتأسيس مواسير السقف', quantity: 1, unitPrice: 400000, total: 400000 }
  ]);
  const [invDiscount, setInvDiscount] = useState('0');
  const [invDueDate, setInvDueDate] = useState(new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0]);

  // New Receipt Form
  const [rcProjectId, setRcProjectId] = useState(projects[0]?.id || '');
  const [rcInvoiceId, setRcInvoiceId] = useState('');
  const [rcAmount, setRcAmount] = useState('200000');
  const [rcNotes, setRcNotes] = useState('دفعة نقدية');

  // New Expense Form
  const [expProjectId, setExpProjectId] = useState(projects[0]?.id || '');
  const [expCategory, setExpCategory] = useState('أسلاك ومواسير');
  const [expAmount, setExpAmount] = useState('50000');
  const [expRecipient, setExpRecipient] = useState('محل الكهرباء');
  const [expNotes, setExpNotes] = useState('');

  // Cash flow sums
  const totalInflow = receipts.reduce((sum, r) => sum + r.amount, 0);
  const totalWorkerOutflow = personPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenseOutflow = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalOutflow = totalWorkerOutflow + totalExpenseOutflow;
  const netCashFlow = totalInflow - totalOutflow;

  // Invoice calculations
  const invSubtotal = invLines.reduce((sum, l) => sum + l.total, 0);
  const invTotal = invSubtotal - (parseInt(invDiscount) || 0);

  const handleAddInvoiceLine = () => {
    setInvLines(prev => [
      ...prev,
      { id: String(Date.now()), description: 'بند إضافي', quantity: 1, unitPrice: 50000, total: 50000 }
    ]);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === invProjectId);
    const client = clients.find(c => c.id === prj?.clientId);

    addInvoice({
      clientId: client?.id || clients[0]?.id || '',
      clientName: client?.name || clients[0]?.name || '',
      projectId: invProjectId,
      projectName: prj?.name || '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: invDueDate,
      lines: invLines,
      subtotal: invSubtotal,
      discountAmount: parseInt(invDiscount) || 0,
      taxAmount: 0,
      totalAmount: invTotal,
      paidAmount: 0,
      remainingAmount: invTotal,
      status: 'ISSUED',
      notes: ''
    });

    setIsAddInvoiceOpen(false);
  };

  const handleCreateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === rcProjectId);
    const client = clients.find(c => c.id === prj?.clientId);

    addReceipt({
      clientId: client?.id || clients[0]?.id || '',
      clientName: client?.name || clients[0]?.name || '',
      projectId: rcProjectId,
      projectName: prj?.name || '',
      invoiceId: rcInvoiceId || undefined,
      amount: parseInt(rcAmount) || 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'CASH',
      notes: rcNotes
    });

    setIsAddReceiptOpen(false);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === expProjectId);

    addExpense({
      projectId: expProjectId || undefined,
      projectName: prj?.name || '',
      category: expCategory,
      amount: parseInt(expAmount) || 0,
      date: new Date().toISOString().split('T')[0],
      recipient: expRecipient,
      notes: expNotes
    });

    setIsAddExpenseOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            <span>المالية والفواتير والتدفق النقدي</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            إصدار الفواتير، سندات القبض، المصروفات، وإدارة السيولة النقدية بدقة
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeFinanceTab === 'INVOICES' && (
            <button
              onClick={() => setIsAddInvoiceOpen(true)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>فاتورة جديدة</span>
            </button>
          )}

          {activeFinanceTab === 'RECEIPTS' && (
            <button
              onClick={() => setIsAddReceiptOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>سند قبض</span>
            </button>
          )}

          {activeFinanceTab === 'EXPENSES' && (
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex items-center gap-1.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>تسجيل مصروف</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'INVOICES', label: `الفواتير الصادرة (${invoices.length})` },
          { id: 'RECEIPTS', label: `سندات القبض (${receipts.length})` },
          { id: 'EXPENSES', label: `المصروفات المباشرة (${expenses.length})` },
          { id: 'CASH_FLOW', label: 'كشف التدفق النقدي (Cash Flow)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFinanceTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFinanceTab === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Invoices Tab */}
      {activeFinanceTab === 'INVOICES' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-400">{inv.invoiceNumber}</span>
                      <h3 className="font-bold text-sm text-white mt-0.5">{inv.projectName}</h3>
                      <div className="text-xs text-slate-400">{inv.clientName}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      inv.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      inv.status === 'PARTIALLY_PAID' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {inv.status === 'PAID' ? 'مدفوعة بالكامل' : inv.status === 'PARTIALLY_PAID' ? 'مدفوعة جزئياً' : 'صادرة'}
                    </span>
                  </div>

                  <div className="py-2.5 space-y-1 text-xs">
                    {inv.lines.map((l) => (
                      <div key={l.id} className="flex justify-between text-slate-300">
                        <span className="truncate">{l.description} ({l.quantity})</span>
                        <span className="font-mono">{formatMoney(l.total, security.hideFinancialAmounts)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">المبلغ الإجمالي:</span>
                    <span className="font-bold text-white text-sm">
                      {formatMoney(inv.totalAmount, security.hideFinancialAmounts)}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-slate-400 block text-[10px]">المتبقي للتحصيل:</span>
                    <span className={`font-bold ${inv.remainingAmount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {formatMoney(inv.remainingAmount, security.hideFinancialAmounts)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receipts Tab */}
      {activeFinanceTab === 'RECEIPTS' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {receipts.map((rc) => (
              <div
                key={rc.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-400">{rc.receiptNumber}</span>
                  <h3 className="font-bold text-sm text-white mt-0.5">{rc.clientName}</h3>
                  <div className="text-xs text-slate-400">{rc.projectName || 'دفعة عامة'}</div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">{rc.date} · {rc.notes}</div>
                </div>

                <div className="text-left font-mono">
                  <div className="text-base font-black text-emerald-400">
                    +{formatMoney(rc.amount, security.hideFinancialAmounts)}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {rc.paymentMethod === 'CASH' ? 'نقداً' : 'حوالة بنكية'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeFinanceTab === 'EXPENSES' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-red-400">{exp.expenseNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {exp.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white mt-1">{exp.recipient}</h3>
                  <div className="text-xs text-slate-400">{exp.projectName || 'مصروف عام'}</div>
                  {exp.notes && <div className="text-[10px] text-slate-500 mt-0.5">{exp.notes}</div>}
                </div>

                <div className="text-left font-mono">
                  <div className="text-base font-black text-red-400">
                    −{formatMoney(exp.amount, security.hideFinancialAmounts)}
                  </div>
                  <span className="text-[10px] text-slate-400">{exp.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cash Flow Statement */}
      {activeFinanceTab === 'CASH_FLOW' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="font-bold text-base text-white">كشف التدفق النقدي الشامل (Cash Flow)</h2>
            <p className="text-xs text-slate-400">تحليل السيولة النقدية: المقبوضات مقابل المصروفات وأجور الفنيين</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                <span>إجمالي المقبوضات النقدية (Inflow)</span>
              </span>
              <div className="text-lg font-black text-emerald-400 font-mono mt-1">
                +{formatMoney(totalInflow, security.hideFinancialAmounts)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4 text-red-400" />
                <span>إجمالي المدفوعات والمصروفات (Outflow)</span>
              </span>
              <div className="text-lg font-black text-red-400 font-mono mt-1">
                −{formatMoney(totalOutflow, security.hideFinancialAmounts)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                مواد: {formatMoney(totalExpenseOutflow, security.hideFinancialAmounts)} · سلف عمال: {formatMoney(totalWorkerOutflow, security.hideFinancialAmounts)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>صافي السيولة النقدية المتوفرة (Net Flow)</span>
              </span>
              <div className={`text-xl font-black font-mono mt-1 ${netCashFlow >= 0 ? 'text-amber-400' : 'text-red-400'}`}>
                {formatMoney(netCashFlow, security.hideFinancialAmounts)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {isAddInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-white text-base">إصدار فاتورة جديدة</h3>

            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المشروع</label>
                <select
                  value={invProjectId}
                  onChange={(e) => setInvProjectId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.clientName})</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">بنود الفاتورة</label>
                  <button
                    type="button"
                    onClick={handleAddInvoiceLine}
                    className="text-amber-400 text-xs hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>إضافة بند</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {invLines.map((line, idx) => (
                    <div key={line.id} className="grid grid-cols-12 gap-1.5 items-center">
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) => {
                          const updated = [...invLines];
                          updated[idx].description = e.target.value;
                          setInvLines(updated);
                        }}
                        className="col-span-6 bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                      <input
                        type="number"
                        value={line.quantity}
                        onChange={(e) => {
                          const updated = [...invLines];
                          const q = parseFloat(e.target.value) || 1;
                          updated[idx].quantity = q;
                          updated[idx].total = q * updated[idx].unitPrice;
                          setInvLines(updated);
                        }}
                        className="col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono text-center"
                      />
                      <input
                        type="number"
                        value={line.unitPrice}
                        onChange={(e) => {
                          const updated = [...invLines];
                          const p = parseInt(e.target.value) || 0;
                          updated[idx].unitPrice = p;
                          updated[idx].total = updated[idx].quantity * p;
                          setInvLines(updated);
                        }}
                        className="col-span-3 bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono text-center"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (invLines.length > 1) {
                            setInvLines(invLines.filter((_, i) => i !== idx));
                          }
                        }}
                        className="col-span-1 text-slate-500 hover:text-red-400 text-center"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">مبلغ الخصم (ريال)</label>
                  <input
                    type="number"
                    value={invDiscount}
                    onChange={(e) => setInvDiscount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={invDueDate}
                    onChange={(e) => setInvDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex justify-between text-xs">
                <span className="text-amber-300 font-semibold">الإجمالي النهائي:</span>
                <span className="font-mono font-black text-amber-400">{formatMoney(invTotal, security.hideFinancialAmounts)}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  حفظ وإصدار الفاتورة
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddInvoiceOpen(false)}
                  className="px-4 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Receipt Modal */}
      {isAddReceiptOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">إصدار سند قبض جديد</h3>

            <form onSubmit={handleCreateReceipt} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المشروع</label>
                <select
                  value={rcProjectId}
                  onChange={(e) => setRcProjectId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.clientName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المبلغ المقبوض (ريال يمني)</label>
                <input
                  type="number"
                  value={rcAmount}
                  onChange={(e) => setRcAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ملاحظات القبض</label>
                <input
                  type="text"
                  value={rcNotes}
                  onChange={(e) => setRcNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  حفظ سند القبض
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddReceiptOpen(false)}
                  className="px-4 bg-slate-800 text-slate-300 text-xs py-2.5 rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">تسجيل مصروف مباشر</h3>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المشروع</label>
                <select
                  value={expProjectId}
                  onChange={(e) => setExpProjectId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="">-- مصروف عام (بدون مشروع) --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">تصنيف المصروف</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="مواد كهربائية">مواد كهربائية</option>
                    <option value="أسلاك ومواسير">أسلاك ومواسير</option>
                    <option value="لوحات وقواطع">لوحات وقواطع</option>
                    <option value="نقل وشحن">نقل وشحن</option>
                    <option value="عدد وأدوات">عدد وأدوات</option>
                    <option value="ضيافة وإكراميات">ضيافة وإكراميات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">المبلغ (ريال يمني)</label>
                  <input
                    type="number"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المستلم / الجهة</label>
                <input
                  type="text"
                  value={expRecipient}
                  onChange={(e) => setExpRecipient(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">البيان / ملاحظات</label>
                <input
                  type="text"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  حفظ المصروف
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
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

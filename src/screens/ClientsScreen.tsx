import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatMoney } from '../domain/financials';
import {
  Users2,
  Plus,
  Phone,
  Mail,
  MapPin,
  Receipt,
  FileText,
  Printer,
  ChevronLeft
} from 'lucide-react';
import { Client } from '../types';

export const ClientsScreen: React.FC = () => {
  const {
    clients,
    projects,
    contracts,
    invoices,
    receipts,
    addClient,
    updateClient,
    deleteClient,
    security
  } = useApp();

  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Client Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('77');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('صنعاء');
  const [notes, setNotes] = useState('');

  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Client calculations
  const clientProjects = projects.filter(p => p.clientId === activeClient?.id);
  const clientContracts = contracts.filter(c => c.clientId === activeClient?.id);
  const clientInvoices = invoices.filter(i => i.clientId === activeClient?.id);
  const clientReceipts = receipts.filter(r => r.clientId === activeClient?.id);

  const totalInvoiced = clientInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = clientReceipts.reduce((sum, r) => sum + r.amount, 0);
  const balanceDue = totalInvoiced - totalPaid;

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addClient({
      name,
      phone,
      email,
      address,
      notes
    });

    setName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users2 className="w-5 h-5 text-amber-400" />
            <span>إدارة العملاء وكشوف الحساب</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            سجل العملاء، العقود المبرمة، الفواتير الصادرة، وسندات القبض المسددة
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة عميل جديد</span>
        </button>
      </div>

      {/* Main Grid: Clients (1 col) + Client Statement of Account (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clients Directory */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            دليل العملاء ({clients.length})
          </h2>

          <div className="space-y-2.5">
            {clients.map((c) => {
              const isSelected = activeClient?.id === c.id;
              const cInvoices = invoices.filter(i => i.clientId === c.id);
              const cReceipts = receipts.filter(r => r.clientId === c.id);
              const due = cInvoices.reduce((s, i) => s + i.totalAmount, 0) - cReceipts.reduce((s, r) => s + r.amount, 0);

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-white">{c.name}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">{c.phone}</div>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {c.address}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">المتبقي ذمة العميل:</span>
                    <span className={`font-bold ${due > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {formatMoney(due, security.hideFinancialAmounts)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statement of Account (كشف حساب العميل) */}
        {activeClient ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Client Info Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">{activeClient.name}</h2>
                  <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {activeClient.phone}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {activeClient.address}</span>
                  </div>
                </div>

                <div className="text-left font-mono">
                  <span className="text-xs text-slate-400">الرصيد المتبقي بذمة العميل:</span>
                  <div className={`text-lg font-black ${balanceDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {formatMoney(balanceDue, security.hideFinancialAmounts)}
                  </div>
                </div>
              </div>

              {/* Financial KPI Grid */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <span className="text-[11px] text-slate-400">إجمالي الفواتير الصادرة</span>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {formatMoney(totalInvoiced, security.hideFinancialAmounts)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-center">
                  <span className="text-[11px] text-slate-400">إجمالي المبالغ المسددة</span>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                    {formatMoney(totalPaid, security.hideFinancialAmounts)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <span className="text-[11px] text-amber-300 font-semibold">المتبقي المطلوب سداده</span>
                  <div className="text-sm font-black text-amber-400 font-mono mt-0.5">
                    {formatMoney(balanceDue, security.hideFinancialAmounts)}
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices & Receipts Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Invoices List */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
                  <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>فواتير العميل</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">{clientInvoices.length} فواتير</span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-none">
                  {clientInvoices.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">لا توجد فواتير للعميل.</div>
                  ) : (
                    clientInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs font-mono"
                      >
                        <div>
                          <div className="font-bold text-white">{inv.invoiceNumber}</div>
                          <div className="text-[10px] text-slate-400">{inv.issueDate}</div>
                        </div>
                        <div className="text-left">
                          <div className="text-white font-bold">{formatMoney(inv.totalAmount, security.hideFinancialAmounts)}</div>
                          <div className="text-[10px] text-amber-400 font-semibold">متبقي: {formatMoney(inv.remainingAmount, security.hideFinancialAmounts)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Receipts List */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
                  <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                    <span>سندات القبض المسددة</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">{clientReceipts.length} سندات</span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-none">
                  {clientReceipts.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">لا توجد سندات قبض مسجلة.</div>
                  ) : (
                    clientReceipts.map((rc) => (
                      <div
                        key={rc.id}
                        className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs font-mono"
                      >
                        <div>
                          <div className="font-bold text-white">{rc.receiptNumber}</div>
                          <div className="text-[10px] text-slate-400">{rc.date} · {rc.paymentMethod === 'CASH' ? 'نقداً' : 'حوالة'}</div>
                        </div>
                        <div className="text-emerald-400 font-bold">
                          +{formatMoney(rc.amount, security.hideFinancialAmounts)}
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

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">إضافة عميل جديد</h3>

            <form onSubmit={handleCreateClient} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم العميل</label>
                <input
                  type="text"
                  placeholder="مثال: الشيخ محمد العواضي"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">رقم الهاتف / الواتساب</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">العنوان / الحي</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ملاحظات العميل</label>
                <input
                  type="text"
                  placeholder="ملاحظات حول طريقة الدفع والتواصل"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  حفظ العميل
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

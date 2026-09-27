import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatMoney, tafqeetArabic, calculateProjectProfit } from '../domain/financials';
import {
  BarChart3,
  Printer,
  FileText,
  DollarSign,
  Users2,
  HardHat,
  Receipt,
  Download
} from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const {
    projects,
    clients,
    persons,
    invoices,
    receipts,
    expenses,
    personPayments,
    attendance,
    company,
    security
  } = useApp();

  const [reportType, setReportType] = useState<'PROFIT' | 'CLIENT_STATEMENT' | 'WORKER_PAYROLL' | 'INVOICES_SUMMARY'>('PROFIT');
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [selectedPersonId, setSelectedPersonId] = useState<string>(persons[0]?.id || '');

  const handlePrint = () => {
    window.print();
  };

  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const activePerson = persons.find(p => p.id === selectedPersonId) || persons[0];

  // Client calculations
  const clientInvoices = invoices.filter(i => i.clientId === activeClient?.id);
  const clientReceipts = receipts.filter(r => r.clientId === activeClient?.id);
  const totalClientInvoiced = clientInvoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalClientPaid = clientReceipts.reduce((s, r) => s + r.amount, 0);
  const clientDue = totalClientInvoiced - totalClientPaid;

  // Worker calculations
  const workerAttendance = attendance.filter(a => a.personId === activePerson?.id);
  const workerPayments = personPayments.filter(p => p.personId === activePerson?.id);
  const workerEarned = workerAttendance.reduce((s, a) => s + a.earnedWage, 0);
  const workerPaid = workerPayments.reduce((s, p) => s + p.amount, 0);
  const workerBalance = workerEarned - workerPaid;

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
      {/* Header (Hidden on print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>محرك التقارير المركزية وكشوف الحساب (PDF & Reports)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تقارير الأرباح، كشوفات حساب العملاء والعمال، وتفقيط المبالغ باللغة العربية
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة / تصدير PDF</span>
        </button>
      </div>

      {/* Selectors Bar (Hidden on print) */}
      <div className="print:hidden flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'PROFIT', label: 'تقرير أرباح المشاريع' },
            { id: 'CLIENT_STATEMENT', label: 'كشف حساب عميل' },
            { id: 'WORKER_PAYROLL', label: 'كشف حساب فني / عامل' },
            { id: 'INVOICES_SUMMARY', label: 'ملخص الفواتير والتحصيل' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                reportType === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {reportType === 'CLIENT_STATEMENT' && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">العميل:</label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg p-1.5"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {reportType === 'WORKER_PAYROLL' && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">العامل:</label>
            <select
              value={selectedPersonId}
              onChange={(e) => setSelectedPersonId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg p-1.5"
            >
              {persons.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Printable Official Header */}
        <div className="border-b-2 border-amber-500 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xl sm:text-2xl font-black text-white print:text-slate-900">
              {company.companyName}
            </div>
            <div className="text-xs text-slate-400 print:text-slate-600 mt-1">
              إدارة: {company.contractorName} · هاتف: {company.phone} · {company.address}
            </div>
            <div className="text-[11px] text-slate-500 print:text-slate-500 mt-0.5">
              سجل تجاري: {company.commercialRecord} · رقم ضريبي: {company.taxNumber}
            </div>
          </div>

          <div className="text-left font-mono">
            <div className="text-xs font-bold text-amber-400 print:text-amber-800">
              {reportType === 'PROFIT' ? 'تقرير ربحية المشاريع والتكاليف' :
               reportType === 'CLIENT_STATEMENT' ? 'كشف حساب عميل مفصل' :
               reportType === 'WORKER_PAYROLL' ? 'كشف حساب ومستحقات عامل' : 'تقرير الفواتير والمتحصلات'}
            </div>
            <div className="text-[11px] text-slate-400 print:text-slate-500 mt-1">
              تاريخ الطباعة: {new Date().toISOString().split('T')[0]}
            </div>
          </div>
        </div>

        {/* 1. Projects Profitability Report */}
        {reportType === 'PROFIT' && (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-700">
                    <th className="py-2.5 px-2">رقم المشروع</th>
                    <th className="py-2.5 px-2">اسم المشروع</th>
                    <th className="py-2.5 px-2">العميل</th>
                    <th className="py-2.5 px-2">قيمة العقد</th>
                    <th className="py-2.5 px-2">المقبوضات</th>
                    <th className="py-2.5 px-2">أجور العمال</th>
                    <th className="py-2.5 px-2">المصروفات</th>
                    <th className="py-2.5 px-2">صافي الربح</th>
                    <th className="py-2.5 px-2">الهامش %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {projects.map((p) => {
                    const pReceipts = receipts.filter(r => r.projectId === p.id).reduce((s, r) => s + r.amount, 0) || p.totalValue;
                    const pLabor = attendance.filter(a => a.projectId === p.id).reduce((s, a) => s + a.earnedWage, 0);
                    const pExp = expenses.filter(e => e.projectId === p.id).reduce((s, e) => s + e.amount, 0);
                    const prof = calculateProjectProfit(pReceipts, pLabor, pExp);

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 print:hover:bg-transparent font-mono">
                        <td className="py-3 px-2 font-bold text-amber-400 print:text-slate-900">{p.projectNumber}</td>
                        <td className="py-3 px-2 font-sans font-semibold text-white print:text-black">{p.name}</td>
                        <td className="py-3 px-2 font-sans text-slate-300 print:text-slate-700">{p.clientName}</td>
                        <td className="py-3 px-2">{formatMoney(p.totalValue, security.hideFinancialAmounts)}</td>
                        <td className="py-3 px-2 text-emerald-400 print:text-emerald-700">{formatMoney(pReceipts, security.hideFinancialAmounts)}</td>
                        <td className="py-3 px-2 text-red-400 print:text-red-700">{formatMoney(pLabor, security.hideFinancialAmounts)}</td>
                        <td className="py-3 px-2 text-red-400 print:text-red-700">{formatMoney(pExp, security.hideFinancialAmounts)}</td>
                        <td className={`py-3 px-2 font-bold ${prof.netProfit >= 0 ? 'text-amber-400 print:text-amber-800' : 'text-red-400 print:text-red-800'}`}>
                          {formatMoney(prof.netProfit, security.hideFinancialAmounts)}
                        </td>
                        <td className="py-3 px-2 font-bold text-white print:text-black">%{prof.profitMarginPercent}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Client Statement of Account with Arabic Tafqeet */}
        {reportType === 'CLIENT_STATEMENT' && activeClient && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-800/50 print:bg-slate-100 border border-slate-700/60 print:border-slate-300 flex flex-wrap justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 print:text-slate-600 block">كشف حساب العميل:</span>
                <div className="text-base font-bold text-white print:text-black mt-0.5">{activeClient.name}</div>
                <div className="text-xs text-slate-400 print:text-slate-600">{activeClient.phone} · {activeClient.address}</div>
              </div>
              <div className="text-left font-mono">
                <span className="text-xs text-slate-400 print:text-slate-600 block">الرصيد المتبقي المطلوب سداده:</span>
                <div className="text-lg font-black text-amber-400 print:text-amber-800">
                  {formatMoney(clientDue, security.hideFinancialAmounts)}
                </div>
              </div>
            </div>

            {/* Tafqeet in Arabic Words (Section 51: تحويل الرقم إلى كلمات عربية) */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 print:bg-amber-50 border border-amber-500/30 print:border-amber-300 text-xs">
              <span className="font-bold text-amber-300 print:text-amber-900 block mb-1">المبلغ المطلوب كتابةً وتفقيطاً:</span>
              <p className="font-semibold text-white print:text-slate-900">
                {tafqeetArabic(clientDue, company.currency)}
              </p>
            </div>

            {/* Detailed Movements Table */}
            <div>
              <h3 className="font-bold text-xs text-slate-300 print:text-slate-800 mb-2">جدول الفواتير والدفعات المسددة</h3>
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-700">
                    <th className="py-2 px-2">التاريخ</th>
                    <th className="py-2 px-2">البيان / رقم المستند</th>
                    <th className="py-2 px-2">المشروع</th>
                    <th className="py-2 px-2">مدين (فواتير)</th>
                    <th className="py-2 px-2">دائن (سندات قبض)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200 font-mono">
                  {clientInvoices.map(inv => (
                    <tr key={inv.id}>
                      <td className="py-2 px-2">{inv.issueDate}</td>
                      <td className="py-2 px-2 font-sans font-semibold text-white print:text-black">فاتورة {inv.invoiceNumber}</td>
                      <td className="py-2 px-2 font-sans text-slate-400 print:text-slate-600">{inv.projectName}</td>
                      <td className="py-2 px-2 text-white print:text-black font-bold">{formatMoney(inv.totalAmount, security.hideFinancialAmounts)}</td>
                      <td className="py-2 px-2 text-slate-500">—</td>
                    </tr>
                  ))}
                  {clientReceipts.map(rc => (
                    <tr key={rc.id}>
                      <td className="py-2 px-2">{rc.date}</td>
                      <td className="py-2 px-2 font-sans font-semibold text-emerald-400 print:text-emerald-800">سند قبض {rc.receiptNumber} ({rc.notes})</td>
                      <td className="py-2 px-2 font-sans text-slate-400 print:text-slate-600">{rc.projectName || 'عام'}</td>
                      <td className="py-2 px-2 text-slate-500">—</td>
                      <td className="py-2 px-2 text-emerald-400 print:text-emerald-800 font-bold">+{formatMoney(rc.amount, security.hideFinancialAmounts)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Worker Payroll & Statement */}
        {reportType === 'WORKER_PAYROLL' && activePerson && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-800/50 print:bg-slate-100 border border-slate-700/60 print:border-slate-300 flex flex-wrap justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 print:text-slate-600 block">كشف مستحقات العامل:</span>
                <div className="text-base font-bold text-white print:text-black mt-0.5">{activePerson.name}</div>
                <div className="text-xs text-slate-400 print:text-slate-600">الأجر اليومي: {formatMoney(activePerson.dailyWage, security.hideFinancialAmounts)}</div>
              </div>
              <div className="text-left font-mono">
                <span className="text-xs text-slate-400 print:text-slate-600 block">صافي الرصيد المتبقي:</span>
                <div className={`text-lg font-black ${workerBalance >= 0 ? 'text-emerald-400 print:text-emerald-800' : 'text-red-400 print:text-red-800'}`}>
                  {formatMoney(workerBalance, security.hideFinancialAmounts)}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 print:bg-amber-50 border border-amber-500/30 print:border-amber-300 text-xs">
              <span className="font-bold text-amber-300 print:text-amber-900 block mb-1">المتبقي تفقيطاً بالكلمات العربية:</span>
              <p className="font-semibold text-white print:text-slate-900">
                {tafqeetArabic(workerBalance, company.currency)}
              </p>
            </div>
          </div>
        )}

        {/* 4. Invoices Summary */}
        {reportType === 'INVOICES_SUMMARY' && (
          <div className="space-y-6">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-700">
                  <th className="py-2.5 px-2">رقم الفاتورة</th>
                  <th className="py-2.5 px-2">المشروع</th>
                  <th className="py-2.5 px-2">العميل</th>
                  <th className="py-2.5 px-2">تاريخ الإصدار</th>
                  <th className="py-2.5 px-2">الإجمالي</th>
                  <th className="py-2.5 px-2">المدفوع</th>
                  <th className="py-2.5 px-2">المتبقي</th>
                  <th className="py-2.5 px-2">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200 font-mono">
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="py-3 px-2 font-bold text-amber-400 print:text-black">{inv.invoiceNumber}</td>
                    <td className="py-3 px-2 font-sans text-white print:text-black">{inv.projectName}</td>
                    <td className="py-3 px-2 font-sans text-slate-400 print:text-slate-600">{inv.clientName}</td>
                    <td className="py-3 px-2">{inv.issueDate}</td>
                    <td className="py-3 px-2 font-bold">{formatMoney(inv.totalAmount, security.hideFinancialAmounts)}</td>
                    <td className="py-3 px-2 text-emerald-400 print:text-emerald-800">{formatMoney(inv.paidAmount, security.hideFinancialAmounts)}</td>
                    <td className="py-3 px-2 text-amber-400 print:text-amber-800">{formatMoney(inv.remainingAmount, security.hideFinancialAmounts)}</td>
                    <td className="py-3 px-2 font-sans text-slate-400">{inv.status === 'PAID' ? 'مسددة' : 'متبقي'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

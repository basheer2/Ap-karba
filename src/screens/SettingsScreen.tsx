import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LocalRepository } from '../data/storage';
import {
  Settings,
  Building,
  Shield,
  Eye,
  EyeOff,
  Database,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { CompanySettings, AppSecuritySettings } from '../types';

export const SettingsScreen: React.FC = () => {
  const {
    company,
    security,
    updateCompany,
    updateSecurity,
    toggleHideFinancialAmounts,
    showToast
  } = useApp();

  const [companyForm, setCompanyForm] = useState<CompanySettings>(company);
  const [pinCode, setPinCode] = useState(security.pinCode);
  const [isPinEnabled, setIsPinEnabled] = useState(security.isPinEnabled);
  const [restoreJson, setRestoreJson] = useState('');

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany(companyForm);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    updateSecurity({
      ...security,
      isPinEnabled,
      pinCode
    });
  };

  const handleExportBackup = () => {
    const json = LocalRepository.exportFullBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kahrabani-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('تم تصدير النسخة الاحتياطية بنجاح');
  };

  const handleRestoreBackup = () => {
    if (!restoreJson.trim()) return;
    const result = LocalRepository.restoreBackup(restoreJson);
    showToast(result.message);
    if (result.success) {
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto p-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-400" />
          <span>إعدادات النظام والنسخ الاحتياطي والأمان</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          بيانات المقاول والمنشأة، العملة، قفل الحماية PIN، وحفظ واسترجاع البيانات
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-sm text-white">بيانات المقاول والمؤسسة</h2>
          </div>

          <form onSubmit={handleSaveCompany} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المنشأة أو المكتب</label>
              <input
                type="text"
                value={companyForm.companyName}
                onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المقاول / المهندس المسؤول</label>
              <input
                type="text"
                value={companyForm.contractorName}
                onChange={(e) => setCompanyForm({ ...companyForm, contractorName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">رقم الهاتف / واتساب</label>
                <input
                  type="text"
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value, whatsapp: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">العملة الافتراضية</label>
                <input
                  type="text"
                  value={companyForm.currency}
                  onChange={(e) => setCompanyForm({ ...companyForm, currency: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">السجل التجاري</label>
                <input
                  type="text"
                  value={companyForm.commercialRecord}
                  onChange={(e) => setCompanyForm({ ...companyForm, commercialRecord: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">الرقم الضريبي</label>
                <input
                  type="text"
                  value={companyForm.taxNumber}
                  onChange={(e) => setCompanyForm({ ...companyForm, taxNumber: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">العنوان والموقع</label>
              <input
                type="text"
                value={companyForm.address}
                onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md transition-all"
            >
              حفظ بيانات المنشأة
            </button>
          </form>
        </div>

        {/* Security & Financial Privacy */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Shield className="w-4 h-4 text-amber-400" />
              <h2 className="font-bold text-sm text-white">الأمان وقفل التطبيق (Security & Privacy)</h2>
            </div>

            <form onSubmit={handleSaveSecurity} className="space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div>
                  <span className="font-bold text-xs text-white block">تفعيل رمز القفل (PIN Lock)</span>
                  <span className="text-[11px] text-slate-400">طلب رمز الأمان عند فتح التطبيق</span>
                </div>
                <input
                  type="checkbox"
                  checked={isPinEnabled}
                  onChange={(e) => setIsPinEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              {isPinEnabled && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">رمز PIN (4 أرقام)</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono text-center tracking-widest text-lg font-bold"
                    required
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div>
                  <span className="font-bold text-xs text-white block">حجب المبالغ المالية (الخصوصية بالموقع)</span>
                  <span className="text-[11px] text-slate-400">إخفاء الأرقام والأسعار وتحويلها لـ ••••••</span>
                </div>
                <button
                  type="button"
                  onClick={toggleHideFinancialAmounts}
                  className={`p-2 rounded-lg border transition-colors ${
                    security.hideFinancialAmounts ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {security.hideFinancialAmounts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition-all"
              >
                تحديث إعدادات الأمان
              </button>
            </form>
          </div>

          {/* Backup & Restore (Section 45 & 46) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Database className="w-4 h-4 text-emerald-400" />
              <h2 className="font-bold text-sm text-white">النسخ الاحتياطي والاستعادة (Backup & Restore)</h2>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleExportBackup}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                <Download className="w-4 h-4" />
                <span>تصدير نسخة احتياطية كاملة (JSON)</span>
              </button>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">استعادة من ملف JSON</label>
                <textarea
                  rows={2}
                  placeholder="الصق نص ملف النسخة الاحتياطية هنا..."
                  value={restoreJson}
                  onChange={(e) => setRestoreJson(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <button
                type="button"
                onClick={handleRestoreBackup}
                disabled={!restoreJson.trim()}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition-all disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>التحقق من النسخة والاستعادة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

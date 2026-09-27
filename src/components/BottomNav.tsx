import React, { useState } from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck2,
  HardHat,
  Users2,
  MoreHorizontal,
  FileSpreadsheet,
  Receipt,
  FileSignature,
  FileText,
  AlertTriangle,
  ClipboardCheck,
  Image as ImageIcon,
  BarChart3,
  Settings,
  X,
  FileCode,
  DollarSign
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'daily_work', label: 'عمل اليوم', icon: CalendarCheck2 },
    { id: 'projects', label: 'المشاريع', icon: HardHat },
    { id: 'workers', label: 'الفريق', icon: Users2 }
  ];

  const moreItems: { id: NavigationTab; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'clients', label: 'العملاء', desc: 'إدارة العملاء وكشوف الحساب', icon: Users2 },
    { id: 'contracts', label: 'العقود وأوامر التغيير', desc: 'إبرام العقود وتعديل القيمة التلقائي', icon: FileSignature },
    { id: 'invoices', label: 'الفواتير وسندات القبض', desc: 'إصدار الفواتير، الدفعات، والتحصيل', icon: Receipt },
    { id: 'finance', label: 'المصروفات والتدفق النقدي', desc: 'تسجيل المصروفات، السيولة، والربحية', icon: DollarSign },
    { id: 'defects', label: 'العيوب والملاحظات', desc: 'متابعة الملاحظات ومعالجتها بالصور', icon: AlertTriangle },
    { id: 'handovers', label: 'محاضر التسليم', desc: 'تسليم مبدئي ونهائي مع التوقيع الحي', icon: ClipboardCheck },
    { id: 'media', label: 'المخططات والوسائط', desc: 'مخططات الإنارة والقوى وصور الموقع', icon: ImageIcon },
    { id: 'reports', label: 'التقارير وكشوف الحساب', desc: 'محرك التقارير المركزية وتصدير PDF', icon: BarChart3 },
    { id: 'android_code', label: 'مشروع كود Android Studio', desc: 'استعراض وتنزيل سورس كود Kotlin & Room', icon: FileCode },
    { id: 'settings', label: 'الإعدادات والنسخ الاحتياطي', desc: 'بيانات المنشأة، الأمان، والتصدير', icon: Settings }
  ];

  const handleSelectMore = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Bottom Nav Bar for Mobile / Sticky */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-1.5 md:hidden">
        <div className="flex items-center justify-around">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
              isMoreOpen || !mainTabs.some((t) => t.id === activeTab)
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-1" />
            <span>المزيد</span>
          </button>
        </div>
      </nav>

      {/* Desktop Top Sub-navigation / Secondary Bar */}
      <div className="hidden md:block bg-slate-800/60 border-b border-slate-800/80 px-4 py-2 sticky top-[57px] z-30 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto text-xs font-medium scrollbar-none">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-slate-700 mx-1"></div>

          {moreItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* More Modal / Bottom Sheet for Mobile */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center md:hidden animate-in fade-in duration-200">
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-2xl w-full max-h-[85vh] overflow-y-auto p-4 pb-12 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="font-bold text-white text-base">جميع أقسام كهرباني</h3>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectMore(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-right transition-colors ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                        : 'bg-slate-800/60 border-slate-800 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-800 text-amber-400 border border-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-white">{item.label}</div>
                      <div className="text-xs text-slate-400 truncate">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

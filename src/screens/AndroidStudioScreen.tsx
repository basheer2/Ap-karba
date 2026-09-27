import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES, AndroidFile } from '../data/androidProjectBundle';
import { downloadAndroidProjectZip, downloadFullSystemZip } from '../utils/downloadProjectZip';
import {
  FileCode,
  Download,
  FolderTree,
  Copy,
  Check,
  Cpu,
  Layers,
  ShieldCheck,
  Database,
  ExternalLink,
  Package,
  Sparkles
} from 'lucide-react';

export const AndroidStudioScreen: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ANDROID_PROJECT_FILES[1]); // app/build.gradle.kts
  const [copied, setCopied] = useState(false);
  const [isZippingAndroid, setIsZippingAndroid] = useState(false);
  const [isZippingFull, setIsZippingFull] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAndroid = async () => {
    setIsZippingAndroid(true);
    try {
      await downloadAndroidProjectZip();
    } finally {
      setIsZippingAndroid(false);
    }
  };

  const handleDownloadFull = async () => {
    setIsZippingFull(true);
    try {
      await downloadFullSystemZip();
    } finally {
      setIsZippingFull(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
      {/* Download Center Hero */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مركز تحميل وتصدير ملفات المشروع (Download Center)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              تحميل ملف التطبيق وكود المشروع الكامل (ZIP)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              يمكنك تحميل مشروع Android Studio الأصلي بنقرة واحدة لفتحه مباشرة في Android Studio، أو تحميل حزمة الكود المصدري الكاملة للنظام.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch gap-3">
            <button
              onClick={handleDownloadAndroid}
              disabled={isZippingAndroid}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 active:from-emerald-600 active:to-emerald-700 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[3]" />
              <span>{isZippingAndroid ? 'جارٍ تحضير الملف...' : 'تحميل مشروع Android Studio (ZIP)'}</span>
            </button>

            <button
              onClick={handleDownloadFull}
              disabled={isZippingFull}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs px-4 py-3 rounded-xl transition-all disabled:opacity-50"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>{isZippingFull ? 'جارٍ التحميل...' : 'تحميل سورس كود النظام (ZIP)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tech Architecture Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-amber-400" />
          <div className="text-xs">
            <div className="font-bold text-white">Clean Architecture</div>
            <div className="text-[10px] text-slate-400">Presentation, Domain, Data</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-2.5">
          <Database className="w-4 h-4 text-emerald-400" />
          <div className="text-xs">
            <div className="font-bold text-white">Room 2.6 (Offline-First)</div>
            <div className="text-[10px] text-slate-400">Indexed & Versioned Migrations</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-blue-400" />
          <div className="text-xs">
            <div className="font-bold text-white">Hilt Dependency Injection</div>
            <div className="text-[10px] text-slate-400">Singleton & ViewModel Scope</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <div className="text-xs">
            <div className="font-bold text-white">Security & Biometric</div>
            <div className="text-[10px] text-slate-400">Encrypted SharedPreferences</div>
          </div>
        </div>
      </div>

      {/* APK Guide Card - 3 Ways to Get APK and Install on Phone */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black">
              APK
            </div>
            <div>
              <h2 className="text-base font-bold text-white">طرق الحصول على ملف الـ APK وتثبيت التطبيق على هاتفك</h2>
              <p className="text-xs text-slate-400">اختر الطريقة الأنسب لك لتشغيل التطبيق على الهاتف المحمول</p>
            </div>
          </div>

          <button
            onClick={handleDownloadAndroid}
            disabled={isZippingAndroid}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isZippingAndroid ? 'جارٍ التحضير...' : 'تحميل حزمة الـ APK الجاهزة للبناء (ZIP)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Method 1: Android Studio 1-Click */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[11px]">1</span>
              <span>توليد APK بضغطة زر (Android Studio)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              1. افتح المجلد في **Android Studio**.<br />
              2. من القائمة العلوية اضغط: <code className="text-amber-400 bg-slate-900 px-1 rounded">Build ➔ Build APK(s)</code>.<br />
              3. ستجد ملف الـ APK جاهزاً فوراً في مسار:<br />
              <span className="text-[10px] text-emerald-300 font-mono block mt-1 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                app/build/outputs/apk/debug/app-debug.apk
              </span>
            </p>
          </div>

          {/* Method 2: GitHub Actions Automated Cloud Build */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[11px]">2</span>
                <span>بناء ملف Kahrabani-Debug-APK تلقائياً (GitHub)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed mt-1.5">
                تم تضمين Workflow رسمي لإخراج ملف <span className="text-amber-400 font-mono font-bold">Kahrabani-Debug-APK.apk</span>.<br />
                بمجرد رفع المشروع إلى GitHub أو الضغط على <b>Run workflow</b>، يقوم GitHub ببناء ملف الـ APK وتوفيره للتحميل في قسم Artifacts.
              </p>
            </div>
            <button
              onClick={() => {
                const wf = ANDROID_PROJECT_FILES.find(f => f.category === 'WORKFLOW');
                if (wf) setSelectedFile(wf);
              }}
              className="mt-2 text-[10px] text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-2.5 py-1.5 rounded-lg font-mono font-bold transition-all text-center"
            >
              عرض ومعاينة ملف build-apk.yml ➔
            </button>
          </div>

          {/* Method 3: Instant Phone Install (PWA / WebAPK) */}
          <div className="bg-slate-950 border border-amber-500/20 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[11px]">3</span>
              <span>تثبيت فوري على شاشة الهاتف (WebAPK)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              يمكنك تشغيل وتثبيت التطبيق على هاتفك الآن فوراً عبر المتصفح (Chrome على الأندرويد):<br />
              اضغط على النقاط الثلاث <span className="text-amber-300 font-bold">⋮</span> ثم اختر <span className="text-white font-bold">«تثبيت التطبيق» (Install App)</span> أو <span className="text-white font-bold">«إضافة إلى الشاشة الرئيسية»</span> وسيتحول إلى تطبيق مثبت بكامل الشاشة وبدون متصفح ويعمل أوفلاين.
            </p>
          </div>
        </div>
      </div>

      {/* Code Browser Layout: Tree on Left (1 col) + Code on Right (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project File Tree */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800 text-xs font-bold text-white">
            <FolderTree className="w-4 h-4 text-amber-400" />
            <span>ملفات المشروع (Android Studio Tree)</span>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto scrollbar-none font-mono text-xs">
            {ANDROID_PROJECT_FILES.map((f) => {
              const isSelected = selectedFile.path === f.path;
              return (
                <button
                  key={f.path}
                  onClick={() => setSelectedFile(f)}
                  className={`w-full text-right p-2 rounded-lg flex items-center justify-between gap-2 transition-colors ${
                    isSelected
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    f.category === 'WORKFLOW'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {f.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="font-mono text-xs text-amber-400 font-bold">{selectedFile.path}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">{selectedFile.category}</span>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ الكود'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto max-h-[480px] leading-relaxed select-text">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

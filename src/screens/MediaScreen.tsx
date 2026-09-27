import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Image as ImageIcon,
  Plus,
  Eye,
  Trash2,
  SlidersHorizontal,
  Compass,
  FileCheck
} from 'lucide-react';
import { ProjectFile, MediaType, MediaCategory } from '../types';

export const MediaScreen: React.FC = () => {
  const { files, projects, addFile, deleteFile } = useApp();

  const [activeMediaFilter, setActiveMediaFilter] = useState<'ALL' | 'BLUEPRINT' | 'PHOTO' | 'BEFORE_AFTER'>('ALL');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New File Form
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<MediaType>('PHOTO');
  const [category, setCategory] = useState<MediaCategory>('SITE_EXECUTION');
  const [fileUri, setFileUri] = useState('https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1000&q=80');

  const filteredFiles = files.filter(f => {
    if (activeMediaFilter === 'ALL') return true;
    if (activeMediaFilter === 'BLUEPRINT') return f.type === 'BLUEPRINT';
    if (activeMediaFilter === 'PHOTO') return f.type === 'PHOTO';
    return true;
  });

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;
    const prj = projects.find(p => p.id === projectId);

    addFile({
      projectId,
      projectName: prj?.name || '',
      name: fileName,
      type: fileType,
      category,
      uri: fileUri,
      fileSizeBytes: 2000000,
      isFavorite: false
    });

    setFileName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <span>المخططات الهندسية والوسائط (Media & Blueprints)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            مخططات الإنارة والقوى، صور التأسيس، وأداة مقارنة قبل وبعد التنفيذ (Before & After)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة مخطط / صورة</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ALL', label: 'كافة الملفات' },
          { id: 'BLUEPRINT', label: 'المخططات الهندسية' },
          { id: 'PHOTO', label: 'صور الموقع والتنفيذ' },
          { id: 'BEFORE_AFTER', label: 'مقارنة (قبل وبعد التنفيذ)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMediaFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeMediaFilter === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Before & After Interactive Comparison (Section 37) */}
      {activeMediaFilter === 'BEFORE_AFTER' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="font-bold text-sm text-white">أداة مقارنة الموقع قبل وبعد التنفيذ</h2>
            <p className="text-xs text-slate-400">حرك الشريط في المنتصف للمقارنة بين مرحلة العظم والتشطيب النهائي</p>
          </div>

          <div className="relative w-full max-w-3xl mx-auto h-80 sm:h-96 rounded-2xl overflow-hidden select-none border border-slate-700 shadow-2xl">
            {/* After Image (Background) */}
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
              alt="بعد التشطيب"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-emerald-600/90 text-white font-bold text-xs px-3 py-1 rounded-md shadow-md backdrop-blur">
              بعد التشطيب النهائي
            </div>

            {/* Before Image (Foreground Clipped) */}
            <div
              className="absolute inset-y-0 right-0 overflow-hidden"
              style={{ width: `${100 - sliderPosition}%` }}
            >
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80"
                alt="قبل التنفيذ (تأسيس وعظم)"
                className="absolute inset-y-0 right-0 w-[800px] h-full object-cover max-w-none"
              />
              <div className="absolute top-4 right-4 bg-amber-600/90 text-white font-bold text-xs px-3 py-1 rounded-md shadow-md backdrop-blur">
                قبل التنفيذ (التأسيس والعظم)
              </div>
            </div>

            {/* Divider Line & Handle */}
            <div
              className="absolute inset-y-0 w-1 bg-amber-400 shadow-lg cursor-ew-resize flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shadow-md">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
          </div>
        </div>
      )}

      {/* Media Grid */}
      {activeMediaFilter !== 'BEFORE_AFTER' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div className="relative h-48 bg-slate-950 overflow-hidden">
                <img
                  src={file.uri}
                  alt={file.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 right-2.5 text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-900/90 text-amber-400 border border-slate-700 backdrop-blur">
                  {file.type === 'BLUEPRINT' ? 'مخطط هندسي' : 'صورة تنفيذ'}
                </span>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-white truncate max-w-[200px]">{file.name}</h3>
                  <div className="text-[10px] text-slate-400 mt-0.5">{file.projectName}</div>
                </div>

                <button
                  onClick={() => deleteFile(file.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                  title="حذف الملف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Media Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">إضافة ملف أو مخطط هندسي</h3>

            <form onSubmit={handleCreateFile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">المشروع</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المخطط أو الصورة</label>
                <input
                  type="text"
                  placeholder="مثال: مخطط إنارة الدور الأرضي"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">النوع</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="BLUEPRINT">مخطط هندسي</option>
                    <option value="PHOTO">صورة موقع</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="LIGHTING_PLAN">مخطط إنارة</option>
                    <option value="POWER_PLAN">مخطط قوى ومفاتيح</option>
                    <option value="SITE_EXECUTION">تنفيذ ميداني</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">رابط الصورة أو مسار المعاينة</label>
                <input
                  type="text"
                  value={fileUri}
                  onChange={(e) => setFileUri(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  إضافة الملف
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

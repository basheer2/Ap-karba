import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
  User,
  Image as ImageIcon
} from 'lucide-react';
import { Defect, DefectPriority, DefectStatus } from '../types';

export const DefectsScreen: React.FC = () => {
  const {
    defects,
    projects,
    persons,
    addDefect,
    updateDefect,
    deleteDefect
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Defect Form
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<DefectPriority>('HIGH');
  const [personId, setPersonId] = useState(persons[0]?.id || '');

  const filteredDefects = defects.filter(d => {
    if (activeFilter === 'ALL') return true;
    return d.status === activeFilter;
  });

  const handleCreateDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const prj = projects.find(p => p.id === projectId);
    const person = persons.find(p => p.id === personId);

    addDefect({
      projectId,
      projectName: prj?.name || '',
      title,
      description,
      date: new Date().toISOString().split('T')[0],
      priority,
      assignedPersonId: personId || undefined,
      assignedPersonName: person?.name || '',
      status: 'OPEN'
    });

    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const handleUpdateStatus = (defect: Defect, newStatus: DefectStatus) => {
    updateDefect({
      ...defect,
      status: newStatus
    });
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>سجل العيوب والملاحظات الميدانية</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            رصد الملاحظات الفنية، تحديد مستوى الأولوية، وتكليف الفني بالمعالجة
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>تسجيل ملاحظة / عيب</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ALL', label: `كافة الملاحظات (${defects.length})` },
          { id: 'OPEN', label: `مفتوحة (${defects.filter(d => d.status === 'OPEN').length})` },
          { id: 'IN_PROGRESS', label: `قيد الإصلاح (${defects.filter(d => d.status === 'IN_PROGRESS').length})` },
          { id: 'FIXED', label: `تم الإصلاح (${defects.filter(d => d.status === 'FIXED').length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === tab.id
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Defects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDefects.map((defect) => {
          const priorityColor =
            defect.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
            defect.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' :
            defect.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
            'bg-slate-800 text-slate-300 border-slate-700';

          return (
            <div
              key={defect.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${priorityColor}`}>
                    {defect.priority === 'CRITICAL' ? 'حرجة جداً' : defect.priority === 'HIGH' ? 'أولوية عالية' : 'متوسطة'}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">{defect.date}</span>
                </div>

                <h3 className="font-bold text-sm text-white mt-2">{defect.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-3">{defect.description}</p>

                <div className="text-[11px] text-slate-500 mt-2.5 flex items-center justify-between border-t border-slate-800 pt-2">
                  <span className="truncate">المشروع: {defect.projectName}</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <User className="w-3 h-3" />
                    <span>{defect.assignedPersonName || 'غير مكلف'}</span>
                  </span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <select
                  value={defect.status}
                  onChange={(e) => handleUpdateStatus(defect, e.target.value as DefectStatus)}
                  className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg p-1.5 focus:border-amber-500"
                >
                  <option value="OPEN">مفتوحة</option>
                  <option value="IN_PROGRESS">قيد المعالجة</option>
                  <option value="FIXED">تم الإصلاح</option>
                  <option value="CLOSED">مغلقة نهائياً</option>
                </select>

                <button
                  onClick={() => deleteDefect(defect.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                  title="حذف الملاحظة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Defect Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base">تسجيل ملاحظة / عيب جديد</h3>

            <form onSubmit={handleCreateDefect} className="space-y-3">
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">عنوان الملاحظة</label>
                <input
                  type="text"
                  placeholder="مثال: منسوب علبة المفتاح غير متطابق مع الشيرب"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الأولوية</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    <option value="LOW">منخفضة</option>
                    <option value="MEDIUM">متوسطة</option>
                    <option value="HIGH">عالية</option>
                    <option value="CRITICAL">حرجة جداً</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">الفني المكلف</label>
                  <select
                    value={personId}
                    onChange={(e) => setPersonId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  >
                    {persons.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">تفاصيل الملاحظة والإجراء المطلوب</label>
                <textarea
                  rows={3}
                  placeholder="اكتب التوجيه الفني للعامل لتصحيح العيب"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl shadow-md"
                >
                  حفظ الملاحظة
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

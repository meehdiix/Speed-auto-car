import React, { useState, useEffect } from 'react';
import { Target, Search, Plus, ExternalLink, Activity, Code2, Trash2 } from 'lucide-react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function PixelManager() {
  const [pixels, setPixels] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [pixelId, setPixelId] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pixels'), (snapshot) => {
      const pixelsData = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setPixels(pixelsData);
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async () => {
    if (!name || !pixelId) return alert('الرجاء إدخال اسم البيكسل ومعرفه');
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'pixels'), {
        name,
        pixelId,
        events: 0,
        status: 'نشط',
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setName('');
      setPixelId('');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا البيكسل؟')) {
      await deleteDoc(doc(db, 'pixels', id));
    }
  };

  const activePixelsCount = pixels.filter(p => p.status === 'نشط').length;
  const totalEventsCount = pixels.reduce((sum, p) => sum + (p.events || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">إدارة البيكسل (Pixels)</h1>
          <p className="text-white/50 text-lg">تحكم كامل في رموز التتبع لحملات فيسبوك الإعلانية.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)]"
        >
          <Plus className="w-5 h-5 shrink-0" />
          إضافة بيكسل جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
              <Code2 className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium mb-1">البيكسل النشط (Global)</p>
              <h3 className="text-2xl font-bold text-white">{activePixelsCount}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent pointer-events-none"></div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
              <Target className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-white/50 text-sm font-medium mb-1">أحداث البيكسل (اليوم)</p>
              <h3 className="text-2xl font-bold text-white">{totalEventsCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group flex items-center justify-center">
          <a href="https://business.facebook.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group-hover:scale-105">
            <ExternalLink className="w-5 h-5" />
            <span className="font-bold underline decoration-white/30 underline-offset-4">فتح مدير إعلانات فيسبوك</span>
          </a>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none"></div>
          
          <h2 className="text-2xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
            <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
            إضافة بيكسل جديد
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10">
            <div>
              <label className="block text-white/70 font-medium mb-2">اسم الحملة / البيكسل</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: حملة كيا سبورتاج" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all" />
            </div>
            <div>
              <label className="block text-white/70 font-medium mb-2 flex items-center gap-2"><Code2 className="w-4 h-4 text-purple-400" /> Pixel ID</label>
              <input type="text" value={pixelId} onChange={(e) => setPixelId(e.target.value)} placeholder="مثال: 123456789012345" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all" dir="ltr" />
            </div>
          </div>
          <div className="flex gap-4 relative z-10">
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold px-8 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] disabled:opacity-50"
            >
              {submitting ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button onClick={() => setIsAdding(false)} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-2.5 rounded-xl transition-all">
              إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center relative z-10">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-white/40 absolute right-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="ابحث عن بيكسل..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl pr-12 pl-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-right whitespace-nowrap">
            <thead className="bg-black/20 text-white/50 font-medium text-sm">
              <tr>
                <th className="px-6 py-4">اسم البيكسل / الحملة</th>
                <th className="px-6 py-4">Pixel ID</th>
                <th className="px-6 py-4">إجمالي الأحداث (Events)</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pixels.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    لم يتم إضافة أي بيكسل بعد.
                  </td>
                </tr>
              ) : (
                pixels.map((pixel) => (
                  <tr key={pixel.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-bold text-white flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                          <Target className="w-4 h-4 text-purple-400" />
                        </div>
                        {pixel.name}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <code className="text-white/70 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 font-mono text-sm" dir="ltr">
                        {pixel.pixelId}
                      </code>
                    </td>
                    <td className="px-6 py-5 text-white/70">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-white/30" />
                        <span className="font-bold text-white">{pixel.events || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                        pixel.status === 'نشط' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
                      }`}>
                        {pixel.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button onClick={() => handleDelete(pixel.id)} className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-white/50 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Trash2, Phone, CheckCircle2, Copy, Check, 
  ExternalLink, Plus, Zap, AlertCircle, Server, ShieldCheck
} from 'lucide-react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  trackPhoneCall, 
  trackWhatsApp, 
  triggerAllOptimizationEvents,
  sendTikTokEventsApi,
  TIKTOK_EVENTS_API_TOKEN,
  TIKTOK_DEFAULT_PIXEL_ID
} from '../../utils/pixelTracker';

export default function PixelManager() {
  const [pixels, setPixels] = useState<any[]>([]);
  const [activePlatform, setActivePlatform] = useState<'tiktok' | 'meta'>('tiktok');
  
  // Clean inputs
  const [pixelId, setPixelId] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // UI states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pixels'), (snapshot) => {
      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setPixels(data);
    });
    return unsubscribe;
  }, []);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = pixelId.trim();
    if (!cleanId) {
      alert('الرجاء كتابة معرف البيكسل (Pixel ID)');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'pixels'), {
        name: name.trim() || (activePlatform === 'tiktok' ? 'بيكسل تيك توك' : 'بيكسل فيسبوك'),
        pixelId: cleanId,
        platform: activePlatform,
        status: 'نشط',
        createdAt: serverTimestamp()
      });

      setPixelId('');
      setName('');
      showNotification(`تم تفعيل بيكسل ${activePlatform === 'tiktok' ? 'تيك توك' : 'فيسبوك'} بنجاح!`);
    } catch (err) {
      console.error('Error saving pixel:', err);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل تريد حذف هذا البيكسل؟')) {
      try {
        await deleteDoc(doc(db, 'pixels', id));
        showNotification('تم حذف البيكسل');
      } catch (err) {
        console.error('Error deleting pixel:', err);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'نشط' ? 'متوقف' : 'نشط';
    try {
      await updateDoc(doc(db, 'pixels', id), { status: nextStatus });
      showNotification(`تم تغيير حالة البيكسل إلى ${nextStatus}`);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTestEvent = () => {
    triggerAllOptimizationEvents({
      carTitle: 'MG 5 2026',
      price: '3,000,000 دج'
    });
    trackPhoneCall({
      carTitle: 'MG 5 2026',
      trimName: 'فحص فوري',
      price: '3,000,000 دج',
      buttonLabel: 'إتصل بنا مباشرة'
    });
    showNotification(`تم إرسال كافة أحداث التحويل (CompletePayment, Contact, Lead) لتيك توك بنجاح! ستصبح نشطة الآن.`);
  };

  // Filter pixels strictly by platform
  const tiktokPixels = pixels.filter(p => p.platform === 'tiktok' || (!p.platform && /[A-Za-z]/.test(p.pixelId || '')));
  const metaPixels = pixels.filter(p => p.platform === 'meta' || (!p.platform && !/[A-Za-z]/.test(p.pixelId || '')));
  const currentPixels = activePlatform === 'tiktok' ? tiktokPixels : metaPixels;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast notification */}
      {statusMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">إعدادات البيكسل (Pixels)</h1>
        <p className="text-white/50 text-sm">
          أدخل رمز البيكسل لتتبع نقرات زر «إتصل بنا مباشرة» وواتساب وتحسين أداء إعلاناتك.
        </p>
      </div>

      {/* Platform Switcher (Separated TikTok vs Facebook) */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-black/40 border border-white/10 rounded-2xl">
        <button
          type="button"
          onClick={() => setActivePlatform('tiktok')}
          className={`py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            activePlatform === 'tiktok'
              ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center font-black text-xs">
            TT
          </span>
          <span>تيك توك بيكسل (TikTok)</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">
            {tiktokPixels.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActivePlatform('meta')}
          className={`py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            activePlatform === 'meta'
              ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
            f
          </span>
          <span>فيسبوك بيكسل (Facebook)</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">
            {metaPixels.length}
          </span>
        </button>
      </div>

      {/* Main Card for Selected Platform */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${activePlatform === 'tiktok' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
              {activePlatform === 'tiktok' ? 'بيكسل تيك توك (TikTok Pixel)' : 'بيكسل فيسبوك (Facebook Pixel)'}
            </h2>
            <p className="text-white/40 text-xs mt-0.5">
              {activePlatform === 'tiktok' 
                ? 'يبدأ المعرف عادةً بحرف C (مثال: C1234567890ABCDEF)' 
                : 'يتكون المعرف من أرقام فقط (مثال: 123456789012345)'}
            </p>
          </div>

          <a
            href={activePlatform === 'tiktok' ? 'https://ads.tiktok.com/i18n/events_manager/' : 'https://business.facebook.com/events_manager/'}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-white/50 hover:text-white flex items-center gap-1.5 transition-colors self-start sm:self-center"
          >
            <span>فتح مدير الأحداث</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-white/70 text-xs font-bold mb-1.5">
                معرف البيكسل (Pixel ID) *
              </label>
              <input
                type="text"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                placeholder={activePlatform === 'tiktok' ? 'مثال: C1234567890ABCDEF' : 'مثال: 123456789012345'}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-red-500/50 transition-all"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-white/70 text-xs font-bold mb-1.5">
                اسم توضيحي (اختياري)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: البيكسل الرئيسي"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2.5 rounded-xl font-bold text-white text-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                activePlatform === 'tiktok'
                  ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'جاري الحفظ...' : 'حفظ وتفعيل البيكسل'}</span>
            </button>

            <button
              type="button"
              onClick={handleTestEvent}
              className="px-4 py-2.5 rounded-xl text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              title="إرسال وتفعيل أحداث التحويل (CompletePayment, Contact, Lead) فوراً لإزالة حالة الانتظار في تيك توك"
            >
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>⚡ تفعيل كافة الأحداث في تيك توك الآن (CompletePayment & Contact)</span>
            </button>
          </div>
        </form>

        {/* TikTok Conversions API (Events API) Status Card */}
        {activePlatform === 'tiktok' && (
          <div className="p-4 bg-gradient-to-r from-red-950/30 to-black border border-red-500/20 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-red-400" />
                <span className="text-white font-bold text-sm">واجهة أحداث تيك توك المباشرة (TikTok Events API / CAPI)</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-fit">
                <ShieldCheck className="w-3.5 h-3.5" />
                مربوط ونشط بالتزامن مع البيكسل
              </span>
            </div>

            <p className="text-white/60 text-xs leading-relaxed">
              تم دمج رمز الوصول الخاص بواجهة الأحداث (Events API Token) ليعمل بالتوازي مع البيكسل المباشر، مع تفعيل خاصية مطابقة الأحداث (Event Deduplication) عبر معرّف <code className="text-red-300 font-mono text-[11px]">event_id</code> لتفادي تكرار العمليات، وتجاوز مانع الإعلانات (AdBlockers).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1" dir="ltr">
              <div className="p-2 bg-black/50 border border-white/5 rounded-lg flex items-center justify-between">
                <span className="text-white/40">Pixel ID:</span>
                <span className="text-white font-bold">{TIKTOK_DEFAULT_PIXEL_ID}</span>
              </div>
              <div className="p-2 bg-black/50 border border-white/5 rounded-lg flex items-center justify-between">
                <span className="text-white/40">Token:</span>
                <span className="text-emerald-400 truncate max-w-[150px]">{TIKTOK_EVENTS_API_TOKEN.substring(0, 10)}...{TIKTOK_EVENTS_API_TOKEN.substring(34)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Current Active Pixels List */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">
            البيكسلات المسجلة ({currentPixels.length})
          </h3>

          {currentPixels.length === 0 ? (
            <div className="p-6 text-center text-white/30 text-sm bg-black/20 rounded-xl border border-dashed border-white/10">
              لم يتم إضافة أي بيكسل {activePlatform === 'tiktok' ? 'تيك توك' : 'فيسبوك'} بعد. أدخل المعرف في الأعلى واضغط حفظ.
            </div>
          ) : (
            <div className="space-y-2">
              {currentPixels.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3.5 bg-black/30 border border-white/10 rounded-xl gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(p.id, p.status)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                        p.status === 'نشط'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-neutral-500/10 border-neutral-500/30 text-neutral-400'
                      }`}
                    >
                      {p.status || 'نشط'}
                    </button>

                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate">{p.name || 'بدون اسم'}</p>
                      <div className="flex items-center gap-2 mt-0.5" dir="ltr">
                        <code className="text-white/60 font-mono text-xs">{p.pixelId}</code>
                        <button
                          type="button"
                          onClick={() => handleCopy(p.pixelId, p.id)}
                          className="text-white/30 hover:text-white transition-colors cursor-pointer"
                          title="نسخ"
                        >
                          {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

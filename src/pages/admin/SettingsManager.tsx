import React, { useState, useEffect } from 'react';
import { Settings, Save, Phone, MapPin, Mail, Instagram, Facebook } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function SettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    phone: '0541399342',
    address: 'عين الصحراء تقرت - بلوك رقم 547',
    email: 'contact@SpeedAutoCar.com',
    instagram: 'https://instagram.com/SpeedAutoCar',
    facebook: 'https://web.facebook.com/profile.php?id=61587488037995',
    tiktok: 'https://www.tiktok.com/@wadieabid',
    heroBackgroundImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000',
    cloudinaryCloudName: '',
    cloudinaryUploadPreset: '',
    tiktokPixelId: '',
    metaPixelId: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
      alert('تم حفظ الإعدادات بنجاح!');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ الإعدادات.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-white/50">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">الإعدادات العامة</h1>
          <p className="text-white/50 text-lg">تخصيص معلومات الاتصال والروابط الخاصة بالمعرض</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] disabled:opacity-50"
        >
          <Save className="w-5 h-5 shrink-0" />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Contact Information */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent pointer-events-none"></div>
          <h2 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
            <div className="w-2 h-6 bg-red-500 rounded-full"></div>
            معلومات الاتصال
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div>
              <label className="text-white/70 font-medium mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                رقم الهاتف (الاتصال المباشر)
              </label>
              <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all text-left" dir="ltr" />
            </div>
            
            <div>
              <label className="text-white/70 font-medium mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                عنوان المعرض
              </label>
              <input type="text" name="address" value={settings.address} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all" />
            </div>

            <div>
              <label className="text-white/70 font-medium mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-400 shrink-0" />
                البريد الإلكتروني
              </label>
              <input type="email" name="email" value={settings.email} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all text-left" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none"></div>
          <h2 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
            <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
            منصات التواصل الاجتماعي
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div>
              <label className="text-white/70 font-medium mb-3 flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                رابط حساب إنستجرام
              </label>
              <input type="url" name="instagram" value={settings.instagram} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all text-left" dir="ltr" />
            </div>
            
            <div>
              <label className="text-white/70 font-medium mb-3 flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
                رابط صفحة فيسبوك
              </label>
              <input type="url" name="facebook" value={settings.facebook} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all text-left" dir="ltr" />
            </div>

            <div>
              <label className="text-white/70 font-medium mb-3 flex items-center gap-2">
                <span className="w-4 h-4 text-red-500 font-black text-xs flex items-center justify-center shrink-0">TT</span>
                رابط صفحة تيك توك
              </label>
              <input type="url" name="tiktok" value={settings.tiktok || ''} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all text-left" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Site Assets Settings */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden lg:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent pointer-events-none"></div>
          <h2 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
            <div className="w-2 h-6 bg-red-500 rounded-full"></div>
            صور وواجهة الموقع
          </h2>
          <div className="space-y-6 relative z-10">
            <div>
              <label className="text-white/70 font-medium mb-3 block">رابط صورة الواجهة الرئيسية (Hero)</label>
              <input 
                type="text" 
                name="heroBackgroundImage" 
                value={settings.heroBackgroundImage || ''} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all text-left" 
                dir="ltr" 
                placeholder="https://..." 
              />
              <p className="text-white/40 text-xs mt-2">يمكنك رفع الصورة في (مكتبة الوسائط) ونسخ الرابط ولصقه هنا.</p>
            </div>
          </div>
        </div>

        {/* Cloudinary Settings */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden lg:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none"></div>
          <h2 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
            <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
            إعدادات تخزين الصور (Cloudinary)
          </h2>
          
          <div className="space-y-6 relative z-10">
            <p className="text-white/50 text-sm">أدخل بيانات حساب Cloudinary الخاص بك للسماح برفع الصور مجاناً في لوحة التحكم (إضافة سيارة).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-white/70 font-medium mb-3 block">Cloud Name</label>
                <input type="text" name="cloudinaryCloudName" value={settings.cloudinaryCloudName} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-black/60 transition-all text-left" dir="ltr" placeholder="ex: dqwertyui" />
              </div>
              
              <div>
                <label className="text-white/70 font-medium mb-3 block">Upload Preset (Unsigned)</label>
                <input type="text" name="cloudinaryUploadPreset" value={settings.cloudinaryUploadPreset} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-black/60 transition-all text-left" dir="ltr" placeholder="ex: my_preset" />
              </div>
            </div>
          </div>
        </div>

        {/* Global Pixel Settings */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden lg:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent pointer-events-none"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-2 h-6 bg-red-500 rounded-full"></div>
              معرفات البيكسل العامة (Global Tracking Pixels)
            </h2>
          </div>
          
          <div className="space-y-6 relative z-10">
            <p className="text-white/50 text-sm">
              أدخل معرفات بيكسل تيك توك وفيسبوك الافتراضية هنا لتفعيل التتبع الشامل لجميع زوار الموقع، ونقرات "إتصل بنا مباشرة" وواتساب.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-white/70 font-medium mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 text-red-500 font-black text-xs flex items-center justify-center shrink-0">TT</span>
                    معرف تيك توك بيكسل الافتراضي (TikTok Pixel ID)
                  </span>
                </label>
                <input 
                  type="text" 
                  name="tiktokPixelId" 
                  value={settings.tiktokPixelId || ''} 
                  onChange={handleChange} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all text-left font-mono text-sm" 
                  dir="ltr" 
                  placeholder="مثال: C1234567890ABCDEF" 
                />
                <p className="text-white/40 text-xs mt-1.5">يبدأ بـ C ومكون من 16-20 حرف/رقم من مدير إعلانات تيك توك.</p>
              </div>
              
              <div>
                <label className="text-white/70 font-medium mb-2.5 flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
                  معرف فيسبوك بيكسل الافتراضي (Meta Pixel ID)
                </label>
                <input 
                  type="text" 
                  name="metaPixelId" 
                  value={settings.metaPixelId || ''} 
                  onChange={handleChange} 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all text-left font-mono text-sm" 
                  dir="ltr" 
                  placeholder="مثال: 123456789012345" 
                />
                <p className="text-white/40 text-xs mt-1.5">أرقام فقط من مدير أحداث فيسبوك.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

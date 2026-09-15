import React, { useState, useEffect } from 'react';
import { Upload, Copy, CheckCircle, Image as ImageIcon, Video, Trash2 } from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, collection, addDoc, getDocs, deleteDoc, orderBy, query } from 'firebase/firestore';

export default function MediaManager() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [copiedId, setCopiedId] = useState('');
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
    fetchMedia();
  }, []);

  const fetchSettings = async () => {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setSettings(docSnap.data());
    }
  };

  const fetchMedia = async () => {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const m: any[] = [];
    snapshot.forEach(doc => {
      m.push({ id: doc.id, ...doc.data() });
    });
    setMediaList(m);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!settings?.cloudinaryCloudName || !settings?.cloudinaryUploadPreset) {
      alert("يرجى إعداد Cloudinary أولاً في الإعدادات العامة.");
      return;
    }

    setUploading(true);
    try {
      const isVideo = file.type.startsWith('video/');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', settings.cloudinaryUploadPreset);

      const endpoint = isVideo 
        ? `https://api.cloudinary.com/v1_1/${settings.cloudinaryCloudName}/video/upload`
        : `https://api.cloudinary.com/v1_1/${settings.cloudinaryCloudName}/image/upload`;

      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        await addDoc(collection(db, 'media'), {
          url: data.secure_url,
          type: isVideo ? 'video' : 'image',
          createdAt: new Date().toISOString()
        });
        setFile(null);
        setPreview('');
        fetchMedia();
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء الرفع");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(confirm("هل أنت متأكد من الحذف؟")) {
      await deleteDoc(doc(db, 'media', id));
      fetchMedia();
    }
  };

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white mb-4">رفع وسائط جديدة (صور / فيديو)</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-white/20 border-dashed rounded-2xl cursor-pointer hover:bg-white/5 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-white/50 mb-3" />
                <p className="mb-2 text-sm text-white/70"><span className="font-bold">اضغط للاختيار</span> أو اسحب الملف هنا</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
            </label>
          </div>
          {preview && (
            <div className="w-40 h-40 relative rounded-2xl overflow-hidden border border-white/20 bg-black/50">
              {file?.type.startsWith('video/') ? (
                <video src={preview} className="w-full h-full object-cover" muted />
              ) : (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              )}
            </div>
          )}
        </div>
        {file && (
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {uploading ? 'جاري الرفع...' : 'رفع الملف'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mediaList.map((m) => (
          <div key={m.id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-2 relative group hover:border-white/30 transition-all">
            <div className="aspect-square rounded-xl overflow-hidden bg-black/50 mb-2 relative">
              {m.type === 'video' ? (
                <>
                  <video src={m.url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30"><Video className="w-8 h-8 text-white/70" /></div>
                </>
              ) : (
                <img src={m.url} className="w-full h-full object-cover" alt="" loading="lazy" />
              )}
            </div>
            
            <div className="flex items-center justify-between mt-3 px-1 pb-1">
              <button
                onClick={() => copyLink(m.url, m.id)}
                className="flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors"
                title="نسخ الرابط"
              >
                {copiedId === m.id ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copiedId === m.id ? 'تم النسخ' : 'نسخ الرابط'}
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="text-white/30 hover:text-red-500 transition-colors p-1"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

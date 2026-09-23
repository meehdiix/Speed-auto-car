import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Image as ImageIcon, MapPin, Hash, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { invalidateCarsCache } from '../../utils/carsCache';

export default function InventoryManager() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [carOrigin, setCarOrigin] = useState<'korean' | 'chinese'>('chinese');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [price, setPrice] = useState('');
  const [pixelId, setPixelId] = useState('');
  const [tiktokPixelId, setTiktokPixelId] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cars'), (snapshot) => {
      const carsData = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setCars(carsData);
      setLoading(false);
    }, (error) => {
      console.warn('[InventoryManager] Cars snapshot error:', error?.message || error);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleEdit = (car: any) => {
    setEditingId(car.id);
    setCarOrigin(car.origin || 'korean');
    setTitle(car.title || '');
    setYear(car.year || '');
    setMileage(car.mileage || '');
    setPrice(car.price || '');
    setPixelId(car.pixelId || '');
    setTiktokPixelId(car.tiktokPixelId || '');
    setDescription(car.description || '');
    setExistingImages(car.images || []);
    setImageFiles([]);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setTitle(''); setYear(''); setMileage(''); setPrice(''); setPixelId(''); setTiktokPixelId(''); setDescription(''); setImageFiles([]); setExistingImages([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const [uploadText, setUploadText] = useState('');

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!title || !year || !price) {
      setErrorMsg("الرجاء ملء الحقول الإجبارية");
      return;
    }
    if (imageFiles.length === 0 && existingImages.length === 0) {
      setErrorMsg("الرجاء إضافة صورة واحدة على الأقل");
      return;
    }
    
    setSubmitting(true);
    try {
      let finalImageUrls = [...existingImages];
      
      if (imageFiles.length > 0) {
        setUploadText('جاري التحقق من الإعدادات...');
        const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
        const settings = settingsDoc.data();
        
        if (!settings?.cloudinaryCloudName || !settings?.cloudinaryUploadPreset) {
          throw new Error("CLOUDINARY_NOT_CONFIGURED");
        }

        const cloudName = settings.cloudinaryCloudName;
        const uploadPreset = settings.cloudinaryUploadPreset;
        
        // Upload new images to Cloudinary
        for (let i = 0; i < imageFiles.length; i++) {
          setUploadText(`جاري رفع الصورة ${i + 1} من ${imageFiles.length}...`);
          const file = imageFiles[i];
          
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);
          
          const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error("CLOUDINARY_UPLOAD_FAILED");
          }
          
          const data = await response.json();
          finalImageUrls.push(data.secure_url);
        }
      }

      setUploadText('جاري حفظ البيانات...');

      const carData = {
        title,
        origin: carOrigin,
        year,
        mileage: carOrigin === 'chinese' ? '0' : mileage,
        price,
        pixelId,
        tiktokPixelId,
        description,
        images: finalImageUrls,
        status: 'متاح',
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        const { updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'cars', editingId), carData);
      } else {
        await addDoc(collection(db, 'cars'), {
          ...carData,
          createdAt: serverTimestamp()
        });
      }

      invalidateCarsCache();
      resetForm();
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message === "CLOUDINARY_NOT_CONFIGURED") {
        setErrorMsg("لم تقم بإعداد Cloudinary في قسم الإعدادات. يرجى إدخال Cloud Name و Upload Preset أولاً.");
      } else if (err instanceof Error && err.message === "CLOUDINARY_UPLOAD_FAILED") {
        setErrorMsg("فشل رفع الصور إلى Cloudinary. يرجى التحقق من Cloud Name و Upload Preset.");
      } else {
        setErrorMsg("حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setSubmitting(false);
      setUploadText('');
    }
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteDoc(doc(db, 'cars', deleteConfirmId));
      invalidateCarsCache();
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">إدارة المخزون</h1>
          <p className="text-white/50 text-lg">إضافة وتعديل وحذف السيارات المعروضة</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
        >
          <Plus className="w-5 h-5" />
          إضافة سيارة جديدة
        </button>
      </div>

      {isAdding && (
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent"></div>
          
          <h2 className="text-2xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
            <div className="w-2 h-6 bg-red-500 rounded-full"></div>
            تفاصيل السيارة الجديدة
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10"><div>
              <label className="block text-white/70 font-medium mb-2">اسم السيارة / الموديل</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: كيا K3" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all" />
            </div>
            
            <div>
              <label className="block text-white/70 font-medium mb-2">سنة الصنع</label>
              <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2022" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all" />
            </div>

            {/* Conditionally hide mileage for Chinese cars */}
            
            
            <div className="md:col-span-2">
              <label className="block text-white/70 font-medium mb-2">السعر (دج)</label>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="3,200,000" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all" />
            </div>

            <div>
              <label className="block text-white/70 font-medium mb-2 flex items-center gap-2">
                <span className="w-4 h-4 text-red-500 font-black text-xs flex items-center justify-center shrink-0">TT</span>
                TikTok Pixel ID المخصص للسيارة (اختياري)
              </label>
              <input 
                type="text" 
                value={tiktokPixelId} 
                onChange={(e) => setTiktokPixelId(e.target.value)} 
                placeholder="مثال: C1234567890ABCDEF" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all font-mono text-sm" 
                dir="ltr" 
              />
              <p className="text-white/40 text-xs mt-1.5">إذا أردت تخصيص حملة تيك توك محددة لهذه السيارة فقط.</p>
            </div>

            <div>
              <label className="block text-white/70 font-medium mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-400" />
                Meta (Facebook) Pixel ID المخصص (اختياري)
              </label>
              <input 
                type="text" 
                value={pixelId} 
                onChange={(e) => setPixelId(e.target.value)} 
                placeholder="مثال: 123456789012345" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500/50 focus:bg-black/60 transition-all font-mono text-sm" 
                dir="ltr" 
              />
              <p className="text-white/40 text-xs mt-1.5">إذا أردت تخصيص حملة فيسبوك محددة لهذه السيارة فقط.</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-white/70 font-medium mb-2">الوصف والمواصفات</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="تفاصيل السيارة والمواصفات الكاملة..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all"></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-white/70 font-medium mb-2">صور السيارة ({imageFiles.length} تم اختيارها)</label>
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <div 
                onClick={() => fileInputRef.current?.click()} 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    setImageFiles(Array.from(e.dataTransfer.files));
                  }
                }}
                className="border-2 border-dashed border-white/10 bg-black/20 rounded-2xl p-10 text-center hover:bg-black/40 hover:border-red-500/50 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-8 h-8 text-red-400" />
                </div>
                <p className="text-white font-bold text-lg mb-2">اسحب الصور وأفلتها هنا</p>
                <p className="text-white/40">أو اضغط لاختيار الملفات (سيتم رفعها مباشرة عبر Firebase Storage)</p>
              </div>
              
              {existingImages.length > 0 && (
                <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide items-center">
                  {existingImages.map((url, idx) => (
                    <div key={`existing-${idx}`} className="relative flex-none w-28 h-28 rounded-xl overflow-hidden border border-white/10 group">
                      <img src={url} alt="preview" className="w-full h-full object-cover bg-[#121212]" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 pointer-events-none">
                        <div className="flex gap-2 pointer-events-auto">
                          {idx > 0 && (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExistingImages(images => {
                                  const newImages = [...images];
                                  const temp = newImages[idx];
                                  newImages[idx] = newImages[idx - 1];
                                  newImages[idx - 1] = temp;
                                  return newImages;
                                });
                              }}
                              title="تحريك لليمين (السابق)"
                              className="bg-black/80 hover:bg-red-500 p-2 rounded-full text-white transition-colors border border-white/20"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          )}
                          {idx < existingImages.length - 1 && (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExistingImages(images => {
                                  const newImages = [...images];
                                  const temp = newImages[idx];
                                  newImages[idx] = newImages[idx + 1];
                                  newImages[idx + 1] = temp;
                                  return newImages;
                                });
                              }}
                              title="تحريك لليسار (التالي)"
                              className="bg-black/80 hover:bg-red-500 p-2 rounded-full text-white transition-colors border border-white/20"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className={`absolute bottom-1 right-1 px-2 rounded text-[10px] font-bold text-white z-10 shadow ${idx === 0 ? 'bg-emerald-600/90 border border-emerald-400/40' : 'bg-red-600/90'}`}>
                        {idx === 0 ? '⭐️ الصورة الأولى (الرئيسية)' : `#${idx + 1}`}
                      </div>
                      <button 
                        type="button"
                        onClick={() => setExistingImages(images => images.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-black/80 p-1.5 rounded-full text-white hover:text-red-400 hover:bg-white/10 transition-colors z-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {imageFiles.length > 0 && (
                <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide items-center">
                  {imageFiles.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative flex-none w-28 h-28 rounded-xl overflow-hidden border border-white/10 group">
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover bg-[#121212]" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 pointer-events-none">
                        <div className="flex gap-2 pointer-events-auto">
                          {idx > 0 && (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageFiles(files => {
                                  const newFiles = [...files];
                                  const temp = newFiles[idx];
                                  newFiles[idx] = newFiles[idx - 1];
                                  newFiles[idx - 1] = temp;
                                  return newFiles;
                                });
                              }}
                              title="تحريك لليمين (السابق)"
                              className="bg-black/80 hover:bg-red-500 p-2 rounded-full text-white transition-colors border border-white/20"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          )}
                          {idx < imageFiles.length - 1 && (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageFiles(files => {
                                  const newFiles = [...files];
                                  const temp = newFiles[idx];
                                  newFiles[idx] = newFiles[idx + 1];
                                  newFiles[idx + 1] = temp;
                                  return newFiles;
                                });
                              }}
                              title="تحريك لليسار (التالي)"
                              className="bg-black/80 hover:bg-red-500 p-2 rounded-full text-white transition-colors border border-white/20"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 bg-purple-600/90 px-2 rounded text-[10px] font-bold text-white z-10 shadow">
                        جديد {idx + 1}
                      </div>
                      <button 
                        type="button"
                        onClick={() => setImageFiles(files => files.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-black/80 p-1.5 rounded-full text-white hover:text-red-400 hover:bg-white/10 transition-colors z-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 relative z-10">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="font-medium text-sm">{errorMsg}</p>
            </div>
          )}
          
          <div className="flex gap-4 relative z-10">
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] disabled:opacity-50"
            >
              {submitting ? (uploadText || 'جاري الحفظ...') : (editingId ? 'تحديث البيانات' : 'حفظ ونشر')}
            </button>
            <button onClick={resetForm} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-3.5 rounded-xl transition-all">
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
              placeholder="ابحث عن سيارة..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl pr-12 pl-4 py-3 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl font-medium transition-all border border-white/10 w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" />
            تصفية
          </button>
        </div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-right whitespace-nowrap">
            <thead className="bg-black/20 text-white/50 font-medium text-sm">
              <tr>
                <th className="px-6 py-4">السيارة</th>
                <th className="px-6 py-4">المصدر</th>
                <th className="px-6 py-4">السنة</th>
                <th className="px-6 py-4">المسافة (كم)</th>
                <th className="px-6 py-4">السعر</th>
                <th className="px-6 py-4">الصور</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {cars.map((car) => (
                <tr key={car.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-white">{car.title}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-purple-500/10 border-purple-500/20 text-purple-400">صينية زيرو</span>
                  </td>
                  <td className="px-6 py-5 text-white/70">{car.year}</td>
                  <td className="px-6 py-5 text-white/70">{car.mileage || '---'}</td>
                  <td className="px-6 py-5 text-white/70 font-bold">{car.price?.includes('مليون') ? car.price : `${car.price} دج`}</td>
                  <td className="px-6 py-5 text-white/70">
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full w-max">
                      <ImageIcon className="w-4 h-4 text-white/50" />
                      <span className="text-sm font-bold text-white">{car.images?.length || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      car.status === 'متاح' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                    }`}>
                      {car.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEdit(car)} className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-white/50 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30">
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {deleteConfirmId === car.id ? (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-2 py-1 rounded-lg">
                           <span className="text-xs text-red-400 font-bold ml-1">حذف؟</span>
                           <button onClick={() => confirmDelete()} className="p-1 text-white bg-red-500 rounded hover:bg-red-600 transition-colors text-xs font-medium px-2">نعم</button>
                           <button onClick={() => setDeleteConfirmId(null)} className="p-1 text-white bg-white/20 rounded hover:bg-white/30 transition-colors text-xs font-medium px-2">لا</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirmId(car.id)} className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-white/50 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

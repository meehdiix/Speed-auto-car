const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/InventoryManager.tsx', 'utf8');

code = code.replace(
  /<label className="block text-white\/70 font-medium mb-2">صور السيارة \(روابط خارجية\)<\/label>[\s\S]*?(?=<\/div>\s*<\/div>\s*<div className="flex gap-4 relative z-10">)/,
  `<label className="block text-white/70 font-medium mb-2">صور السيارة ({imageFiles.length} تم اختيارها)</label>
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
                className="border-2 border-dashed border-white/10 bg-black/20 rounded-2xl p-10 text-center hover:bg-black/40 hover:border-blue-500/50 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="w-8 h-8 text-blue-400" />
                </div>
                <p className="text-white font-bold text-lg mb-2">اسحب الصور وأفلتها هنا</p>
                <p className="text-white/40">أو اضغط لاختيار الملفات (سيتم رفعها مباشرة عبر Firebase Storage)</p>
              </div>
              
              {imageFiles.length > 0 && (
                <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className="relative flex-none w-24 h-24 rounded-xl overflow-hidden border border-white/10">
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setImageFiles(files => files.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            `
);

code = code.replace(
  `{submitting ? 'جاري الحفظ...' : 'حفظ ونشر'}`,
  `{submitting ? (uploadText || 'جاري الحفظ...') : 'حفظ ونشر'}`
);

fs.writeFileSync('src/pages/admin/InventoryManager.tsx', code);

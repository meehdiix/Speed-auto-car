const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/InventoryManager.tsx', 'utf8');

code = code.replace(
  `const [imageUrlsInput, setImageUrlsInput] = useState('');`,
  `const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);`
);

code = code.replace(
  `return unsubscribe;
  }, []);`,
  `return unsubscribe;
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };`
);

code = code.replace(
  `const parsedUrls = imageUrlsInput.split('\\n').map(u => u.trim()).filter(u => u.startsWith('http'));`,
  `const imageUrls: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        setUploadText(\`جاري رفع الصورة \${i + 1} من \${imageFiles.length}...\`);
        const file = imageFiles[i];
        const fileRef = ref(storage, \`cars/\${Date.now()}_\${file.name}\`);
        const uploadTask = uploadBytes(fileRef, file);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("UPLOAD_TIMEOUT")), 15000)
        );
        await Promise.race([uploadTask, timeoutPromise]);
        const url = await getDownloadURL(fileRef);
        imageUrls.push(url);
      }

      setUploadText('جاري حفظ البيانات...');`
);

code = code.replace(
  `images: parsedUrls,`,
  `images: imageUrls,`
);

code = code.replace(
  `setTitle(''); setYear(''); setMileage(''); setPrice(''); setPixelId(''); setDescription(''); setImageUrlsInput('');`,
  `setTitle(''); setYear(''); setMileage(''); setPrice(''); setPixelId(''); setDescription(''); setImageFiles([]);`
);

code = code.replace(
  `alert("حدث خطأ أثناء الحفظ. تأكد من أنك سجلت الدخول وأن قواعد بيانات Firebase معدة بشكل صحيح.");`,
  `if (err instanceof Error && err.message === "UPLOAD_TIMEOUT") {
        alert("فشل الرفع لتجاوز الوقت المحدد. يرجى تفعيل Firebase Storage وتحديث القواعد للسماح بالقراءة والكتابة.");
      } else {
        alert("حدث خطأ أثناء الحفظ. يرجى التأكد من إعداد Firebase Storage وصلاحيات الكتابة.");
      }`
);

code = code.replace(
  `} finally {
      setSubmitting(false);`,
  `} finally {
      setSubmitting(false);
      setUploadText('');`
);

fs.writeFileSync('src/pages/admin/InventoryManager.tsx', code);

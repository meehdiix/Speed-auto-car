const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/InventoryManager.tsx', 'utf8');

code = code.replace(
  'await uploadBytes(fileRef, file);',
  `const uploadTask = uploadBytes(fileRef, file);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("UPLOAD_TIMEOUT")), 15000)
        );
        await Promise.race([uploadTask, timeoutPromise]);`
);

code = code.replace(
  'alert("حدث خطأ أثناء الحفظ. يرجى التأكد من أن قواعد بيانات Firebase (Storage) معدة بشكل صحيح بصلاحيات القراءة والكتابة.");',
  `if (err.message === "UPLOAD_TIMEOUT") {
        alert("فشل الرفع: استغرق وقتاً طويلاً. يرجى التأكد من تفعيل خدمة Firebase Storage في لوحة تحكم Firebase الخاصة بك وتحديث قواعد الأمان (Rules) لتسمح بالقراءة والكتابة.");
      } else {
        alert("حدث خطأ أثناء الحفظ. يرجى التأكد من أن قواعد بيانات Firebase (Storage) معدة بشكل صحيح بصلاحيات القراءة والكتابة.");
      }`
);

fs.writeFileSync('src/pages/admin/InventoryManager.tsx', code);

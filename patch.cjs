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
  `if (err instanceof Error && err.message === "UPLOAD_TIMEOUT") {
        alert("Upload timeout! Please make sure you have ENABLED Firebase Storage in your Firebase Console and set its rules to allow reads/writes.");
      } else {
        alert("Upload error! Please make sure Firebase Storage is enabled and rules are correctly set to allow writes.");
      }`
);

fs.writeFileSync('src/pages/admin/InventoryManager.tsx', code);

import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

content = content.replace(/توقيع العقد وإيداع العربون/g, 'توقيع العقد وإيداع التمويل');
content = content.replace(/وصل إيداع العربون/g, 'وصل إيداع التمويل');
content = content.replace(/إيداع العربون/g, 'إيداع التمويل');
content = content.replace(/العربون/g, 'التمويل');

content = content.replace(/الشحن السريع \(30 يوم\)/g, 'الشحن (3 أشهر)');
content = content.replace(/30 يوماً فقط/g, '3 أشهر');
content = content.replace(/29 يوماً/g, '3 أشهر');

content = content.replace(/Hyundai Tucson 2025/g, 'MG 5 2026');

// Rewrite faqs completely using regex
content = content.replace(/const faqs = \[[\s\S]*?\];/, `const faqs = [
    {
      q: 'كم مدة الشحن حتى استلام السيارة؟',
      a: 'مدة الشحن هي 3 أشهر من تاريخ انطلاق الحاوية من الميناء في الصين وحتى وصولها.'
    },
    {
      q: 'هل السعر المذكور نهائي؟',
      a: 'نعم، السعر المعروض هو السعر النهائي والشامل لكل شيء (السيارة، الشحن، التخليص الجمركي). لا توجد أي تكاليف إضافية مخفية.'
    },
    {
      q: 'كيف تتم عملية التعاقد؟',
      a: 'يتم توقيع عقد استيراد رسمي وموثق في مكتبنا يضمن لك حقك بالكامل، مع تسليمك وصل إيداع التمويل القانوني.'
    }
  ];`);

fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
console.log("Patched ProductTemplate.tsx dynamically");

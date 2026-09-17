import fs from 'fs/promises';

async function run() {
  let content = await fs.readFile('src/data/carsCatalog.ts', 'utf8');

  const newSpecsAuto = `
        heroSpecs: [
          { icon: Car, label: 'الأبعاد والمساحة', value: 'طول 4715 مم، عرض 1842 مم، وارتفاع 1473 مم، وقاعدة عجلات 2680 مم توفر مساحة رحبة' },
          { icon: Layers, label: 'الخلوص والتخزين', value: 'خلوص أرضي 127 مم بتصميم رياضي فاست باك، وصندوق أمتعة بسعة 401 لتر' },
          { icon: Sparkles, label: 'التصميم الخارجي', value: 'عجلات ألمنيوم 16 بوصة، مصابيح LED أوتوماتيكية (عالي/منخفض)، وفتحة سقف إلكترونية' },
          { icon: Camera, label: 'المقصورة والتقنية', value: 'شاشتين 12.3 بوصة (Dual LCD) للعدادات والنظام الترفيهي المركزي' },
          { icon: Star, label: 'المقاعد', value: '5 مقاعد من الجلد مع تحكم كهربائي متعدد الاتجاهات للسائق ومساند أمامية/خلفية' },
          { icon: ShieldCheck, label: 'أنظمة المساعدة', value: 'فرامل يد إلكترونية، مثبت سرعة، AutoHold، مساعد المرتفعات (HAC)، ومراقبة الإطارات (TPMS)' },
          { icon: FileCheck, label: 'المطابقة والاستيراد', value: 'محرك 1498 سي سي، مطابق تماماً لدفتر شروط استيراد السيارات بالجزائر CCR' }
        ]`;

  const mg5Index = content.indexOf("'mg-5': {");
  if (mg5Index === -1) {
    console.log("mg-5 not found");
    process.exit(1);
  }

  const autoIndex = content.indexOf("id: 'automatic'", mg5Index);
  const autoHeroSpecsStart = content.indexOf("heroSpecs:", autoIndex);
  const autoHeroSpecsEnd = content.indexOf("]", autoHeroSpecsStart) + 1;

  content = content.slice(0, autoHeroSpecsStart) + newSpecsAuto.trim() + content.slice(autoHeroSpecsEnd);

  await fs.writeFile('src/data/carsCatalog.ts', content, 'utf8');
  console.log("Successfully patched src/data/carsCatalog.ts with exact user specs");
}
run().catch(console.error);

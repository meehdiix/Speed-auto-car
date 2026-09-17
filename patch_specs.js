import fs from 'fs/promises';

async function run() {
  let content = await fs.readFile('src/data/carsCatalog.ts', 'utf8');

  const newSpecsAuto = `
        heroSpecs: [
          { icon: FileCheck, label: 'المطابقة والاستيراد', value: 'محرك 1498 سي سي، مطابق تماماً لدفتر شروط استيراد السيارات بالجزائر' },
          { icon: Sparkles, label: 'التصميم الخارجي', value: 'عجلات ألمنيوم 16 بوصة، مصابيح LED أوتوماتيكية، وفتحة سقف إلكترونية' },
          { icon: Car, label: 'الأبعاد والمساحة', value: 'طول 4715 مم، عرض 1842 مم، وقاعدة عجلات 2680 مم لرحابة داخلية ممتازة' },
          { icon: Camera, label: 'المقصورة والتقنية', value: 'شاشتين 12.3 بوصة للعدادات والنظام الترفيهي (Dual LCD)' },
          { icon: Star, label: 'المقاعد', value: '5 مقاعد من الجلد مع تحكم كهربائي لمقعد السائق' },
          { icon: ShieldCheck, label: 'أنظمة المساعدة', value: 'فرامل يد إلكترونية (EPB)، ومثبت سرعة، وAutoHold' },
          { icon: Layers, label: 'التخزين والخلوص', value: 'خلوص أرضي 127 مم، وصندوق أمتعة عملي بسعة 401 لتر' }
        ]`;

  const newSpecsManual = `
        heroSpecs: [
          { icon: Gauge, label: 'المحرك (تيربو)', value: '1.5 لتر تيربو بقوة 181 حصان و 285 نيوتن متر' },
          { icon: Flame, label: 'التسارع', value: 'من 0 إلى 100 كم/س في 8.1 ثانية فقط' },
          { icon: FileCheck, label: 'المطابقة والاستيراد', value: 'محرك 1498 سي سي، مطابق تماماً لدفتر شروط استيراد السيارات' },
          { icon: Sparkles, label: 'التصميم الخارجي', value: 'عجلات 16 بوصة، مصابيح LED أوتوماتيكية، وفتحة سقف إلكترونية' },
          { icon: Car, label: 'الأبعاد والمساحة', value: 'طول 4715 مم، عرض 1842 مم، وقاعدة عجلات 2680 مم' },
          { icon: Camera, label: 'المقصورة والتقنية', value: 'شاشتين 12.3 بوصة للعدادات والنظام الترفيهي (Dual LCD)' },
          { icon: Star, label: 'المقاعد', value: '5 مقاعد من الجلد مع تحكم كهربائي لمقعد السائق' },
          { icon: ShieldCheck, label: 'الأمان والتحكم', value: 'مكابح كونتيننتال الألمانية ونظام قفل التفاضل الإلكتروني (XDS)' },
          { icon: Layers, label: 'التخزين والخلوص', value: 'خلوص أرضي 127 مم، وصندوق أمتعة بسعة 401 لتر' }
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

  const manualIndex = content.indexOf("id: 'manual'", autoIndex);
  const manualHeroSpecsStart = content.indexOf("heroSpecs:", manualIndex);
  const manualHeroSpecsEnd = content.indexOf("]", manualHeroSpecsStart) + 1;

  content = content.slice(0, manualHeroSpecsStart) + newSpecsManual.trim() + content.slice(manualHeroSpecsEnd);

  await fs.writeFile('src/data/carsCatalog.ts', content, 'utf8');
  console.log("Successfully patched src/data/carsCatalog.ts");
}
run().catch(console.error);

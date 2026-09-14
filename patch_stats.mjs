import fs from 'fs';
let content = fs.readFileSync('src/components/Stats.tsx', 'utf8');

// Change values as requested
content = content.replace(/{ value: '\+500', label: 'سيارة مستوردة', desc: 'تم تسليمها للعملاء بنجاح' }/g, "{ value: '+243', label: 'سيارة مستوردة', desc: 'تم تسليمها للعملاء بنجاح' }");
content = content.replace(/{ value: '100%', label: 'عميل راضٍ', desc: 'شفافية ومصداقية تامة' }/g, "{ value: '96.3%', label: 'عميل راضٍ', desc: 'شفافية ومصداقية تامة' }");

// Add divider on small screens using divide-y for mobile and fix divider logic
content = content.replace(/grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-x-reverse divide-white\/10 text-center/, "grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/10 text-center");

// Also add py-6 to the inner items so they look good with divide-y
content = content.replace(/className="py-4 md:py-0 md:px-8 flex flex-col items-center justify-center group"/g, 'className="py-10 md:py-0 md:px-8 flex flex-col items-center justify-center group"');

fs.writeFileSync('src/components/Stats.tsx', content);
console.log("Patched Stats");

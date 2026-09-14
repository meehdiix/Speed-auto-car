import fs from 'fs';
let content = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

// Replace address
content = content.replace(
  /<p className="text-white\/80 text-2xl font-bold">\n              الجزائر\n            <\/p>/,
  '<a href="https://maps.app.goo.gl/uqyL7KUvZJmtZNm6A?g_st=ic" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors text-2xl font-bold flex flex-col items-center gap-2">\n              <span>الجزائر</span>\n              <span className="text-sm font-medium text-red-400 bg-red-400/10 px-4 py-2 rounded-full">عرض على الخريطة</span>\n            </a>'
);
fs.writeFileSync('src/pages/Contact.tsx', content);
console.log("Patched contact");

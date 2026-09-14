import fs from 'fs';
let content = fs.readFileSync('src/components/Process.tsx', 'utf8');
content = content.replace(/الأسواق الكورية أو الصينية/g, 'الأسواق الصينية');
fs.writeFileSync('src/components/Process.tsx', content);
console.log("Patched Process.tsx");

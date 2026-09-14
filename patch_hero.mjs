import fs from 'fs';
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

content = content.replace(/<a\n              href="#cars"/g, '<Link\n              to="/catalog"');
content = content.replace(/تصفح السيارات\n              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1.5 transition-transform" \/>\n            <\/a>/, 'تصفح السيارات\n              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1.5 transition-transform" />\n            </Link>');

fs.writeFileSync('src/components/Hero.tsx', content);
console.log("Patched Hero.tsx");

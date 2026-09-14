import fs from 'fs';
let content = fs.readFileSync('src/pages/Contact.tsx', 'utf8');
content = content.replace(/213779004601/g, '213564507370');
fs.writeFileSync('src/pages/Contact.tsx', content);
console.log("Patched Contact WhatsApp");

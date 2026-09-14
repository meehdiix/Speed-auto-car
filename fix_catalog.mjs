import fs from 'fs';
let content = fs.readFileSync('src/pages/Catalog.tsx', 'utf8');

content = content.replace(/\\`/g, "`");
content = content.replace(/\\\$/g, "$");

fs.writeFileSync('src/pages/Catalog.tsx', content);
console.log("Fixed Catalog.tsx");

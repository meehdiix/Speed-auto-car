import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

content = content.replace(/\s*\{\/\* 🌟 STATS SECTION \*\/\}\n\s*<Stats \/>/, '');

const targetStr = '{/* 🌟 SCROLLABLE FAQ CARDS';
const idx = content.indexOf(targetStr);
if (idx !== -1) {
  content = content.substring(0, idx) + "{/* 🌟 STATS SECTION */}\n        <Stats />\n\n        " + content.substring(idx);
}

fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
console.log("Moved Stats before FAQ");

import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

// Add import
const importInsertionPoint = content.indexOf("import { carsCatalog } from '../data/carsCatalog';");
if(importInsertionPoint !== -1) {
  content = content.substring(0, importInsertionPoint) + "import { carsCatalog } from '../data/carsCatalog';\nimport Stats from '../components/Stats';\n" + content.substring(importInsertionPoint + 50);
}

// Add <Stats /> before Liquid CTA
const ctaIndex = content.indexOf('{/* 🌟 BOTTOM LIQUID CTA SECTION');
if (ctaIndex !== -1) {
  content = content.substring(0, ctaIndex) + "{/* 🌟 STATS SECTION */}\n        <Stats />\n\n        " + content.substring(ctaIndex);
}

fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
console.log("Patched ProductTemplate with Stats");

import fs from 'fs';
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

content = content.replace(/<Link \s*href="tel:0670089119"/, '<a \n              href="tel:0670089119"');

fs.writeFileSync('src/components/Hero.tsx', content);
console.log("Fixed Hero.tsx");

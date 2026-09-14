import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

content = content.replace(
  'className="w-full h-auto max-h-[500px] object-contain transition-transform duration-500 group-hover:scale-105"',
  'className="w-full h-auto transition-transform duration-500 group-hover:scale-105 object-cover"'
);

// Also fix the thumbnails
content = content.replace(
  '<img src={img} alt="" className="w-full h-full object-contain bg-[#181818]" />',
  '<img src={img} alt="" className="w-full h-full object-cover bg-[#181818]" />'
);

fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
console.log("Fixed preview");

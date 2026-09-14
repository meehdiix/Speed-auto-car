import fs from 'fs';

let catalogContent = fs.readFileSync('src/pages/Catalog.tsx', 'utf8');
catalogContent = catalogContent.replace(
  /className="w-full h-full object-contain transition-transform duration-700 drop-shadow-2xl"/,
  'className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"'
);
fs.writeFileSync('src/pages/Catalog.tsx', catalogContent);

let servicesContent = fs.readFileSync('src/components/Services.tsx', 'utf8');
servicesContent = servicesContent.replace(
  /className="w-full h-full object-contain transition-transform duration-700"/,
  'className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"'
);
fs.writeFileSync('src/components/Services.tsx', servicesContent);

console.log("Added hover scale back");

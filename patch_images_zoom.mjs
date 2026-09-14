import fs from 'fs';

// Patch Catalog.tsx
let catalogContent = fs.readFileSync('src/pages/Catalog.tsx', 'utf8');
catalogContent = catalogContent.replace(
  /className="relative aspect-\[3\/4\] bg-gradient-to-br from-white\/5 to-transparent p-2 flex items-center justify-center overflow-hidden"/,
  'className="relative aspect-[4/5] bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center overflow-hidden"'
);
catalogContent = catalogContent.replace(
  /className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl"/,
  'className="w-full h-full object-cover scale-[1.15] group-hover:scale-[1.25] transition-transform duration-700 drop-shadow-2xl"'
);
fs.writeFileSync('src/pages/Catalog.tsx', catalogContent);


// Patch Services.tsx
let servicesContent = fs.readFileSync('src/components/Services.tsx', 'utf8');
servicesContent = servicesContent.replace(
  /className="absolute inset-0 bg-gradient-to-t from-black via-black\/40 to-transparent"><\/div>/,
  'className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent"></div>'
);
servicesContent = servicesContent.replace(
  /<div className="absolute inset-0">\n                  <img src=\{service\.images && service\.images\.length > 0 \? service\.images\[0\] : 'https:\/\/images\.unsplash\.com\/photo-1609521263047-f8f205293f24\?q=80&w=2000&auto=format&fit=crop'\} alt=\{service\.title\} loading="lazy" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" \/>\n                <\/div>/,
  '<div className="absolute inset-0">\n                  <img src={optimizeImage(service.images && service.images.length > 0 ? service.images[0] : "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2000&auto=format&fit=crop", 600)} alt={service.title} loading="lazy" className="w-full h-full object-cover scale-[1.15] transition-transform duration-700 group-hover:scale-[1.25]" />\n                </div>'
);
if (!servicesContent.includes("import { optimizeImage }")) {
    const lastImport = servicesContent.lastIndexOf("import ");
    const endOfImport = servicesContent.indexOf(";", lastImport);
    servicesContent = servicesContent.substring(0, endOfImport + 1) + "\nimport { optimizeImage } from '../utils/imageOptimization';" + servicesContent.substring(endOfImport + 1);
}
fs.writeFileSync('src/components/Services.tsx', servicesContent);

console.log("Patched sizes");

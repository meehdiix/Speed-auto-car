import fs from 'fs';

let catalogContent = fs.readFileSync('src/pages/Catalog.tsx', 'utf8');
catalogContent = catalogContent.replace(
  /className="relative aspect-\[3\/4\] bg-gradient-to-br from-white\/5 to-transparent p-4 flex items-center justify-center overflow-hidden"/,
  'className="relative aspect-[4/5] bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center overflow-hidden"'
);
catalogContent = catalogContent.replace(
  /className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl"/,
  'className="w-full h-full object-contain transition-transform duration-700 drop-shadow-2xl"'
);
fs.writeFileSync('src/pages/Catalog.tsx', catalogContent);

let servicesContent = fs.readFileSync('src/components/Services.tsx', 'utf8');
servicesContent = servicesContent.replace(
  /<img src=\{optimizeImage\(service\.images && service\.images\.length > 0 \? service\.images\[0\] : "https:\/\/images\.unsplash\.com\/photo-1609521263047-f8f205293f24\?q=80&w=2000&auto=format&fit=crop", 600\)\} alt=\{service\.title\} loading="lazy" className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110" \/>/,
  '<img src={optimizeImage(service.images && service.images.length > 0 ? service.images[0] : "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2000&auto=format&fit=crop", 600)} alt={service.title} loading="lazy" className="w-full h-full object-contain transition-transform duration-700" />'
);
fs.writeFileSync('src/components/Services.tsx', servicesContent);

let productContent = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');
productContent = productContent.replace(
  /className="w-full h-auto transition-transform duration-500 group-hover:scale-105 object-contain p-4 md:p-8"/,
  'className="w-full h-auto transition-transform duration-500 group-hover:scale-105 object-contain"'
);
fs.writeFileSync('src/pages/ProductTemplate.tsx', productContent);

console.log("Applied object-contain and removed padding");

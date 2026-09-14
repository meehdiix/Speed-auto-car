import fs from 'fs';

function patchFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes("import { optimizeImage }")) {
    // Add import after other imports
    const lastImport = content.lastIndexOf("import ");
    const endOfImport = content.indexOf(";", lastImport);
    content = content.substring(0, endOfImport + 1) + "\nimport { optimizeImage } from '../utils/imageOptimization';" + content.substring(endOfImport + 1);
  }

  // Replace src={...} with src={optimizeImage(..., width)}
  // Catalog.tsx
  if (filePath.includes('Catalog.tsx')) {
    content = content.replace(/src={car.images\[0\] || car.mainImg}/g, "src={optimizeImage(car.images?.[0] || car.mainImg, 600)}");
  }
  
  // ProductTemplate.tsx
  if (filePath.includes('ProductTemplate.tsx')) {
    content = content.replace(/src={activeImg}/g, "src={optimizeImage(activeImg, 1200)}");
    content = content.replace(/src={img}/g, "src={optimizeImage(img, 300)}"); // For thumbnails
  }
  
  // Home.tsx 
  if (filePath.includes('Home.tsx')) {
    content = content.replace(/src={car\.image}/g, "src={optimizeImage(car.image, 800)}");
    content = content.replace(/src={brand\.logo}/g, "src={optimizeImage(brand.logo, 200)}");
  }

  fs.writeFileSync(filePath, content);
  console.log(`Patched ${filePath}`);
}

patchFile('src/pages/Catalog.tsx');
patchFile('src/pages/ProductTemplate.tsx');
patchFile('src/pages/Home.tsx');


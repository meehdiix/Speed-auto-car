import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

const target = `  const activeTrimsList = getTrimsForProduct(product?.title);
  
  // Make sure selectedTrimId is valid for the current car's trims
  const activeTrim = activeTrimsList.length > 0 
    ? (activeTrimsList.find(t => t.id === selectedTrimId) || activeTrimsList[0])
    : null;`;

const replacement = `  let activeTrimsList = getTrimsForProduct(product?.title);
  
  if (activeTrimsList.length === 0) {
    activeTrimsList = [{
      id: 'standard',
      name: 'Standard',
      badge: 'نسخة قياسية',
      price: product?.price || 'تواصل معنا',
      subtitle: product?.description || '',
      tag: 'قياسية',
      heroSpecs: product?.specs?.length > 0 ? product.specs : [{ icon: null, label: 'الضمان', value: 'عام كامل' }],
      images: product?.images || []
    }];
  }

  // Make sure selectedTrimId is valid for the current car's trims
  const activeTrim = activeTrimsList.find(t => t.id === selectedTrimId) || activeTrimsList[0];`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
  console.log("Patched fallback trim successfully");
} else {
  console.log("Target not found!");
}

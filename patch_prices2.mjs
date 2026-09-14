import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

const target = `  const activeTrim = activeTrimsList.find(t => t.id === selectedTrimId) || activeTrimsList[0];

  // Map to the correct inventory images based on trim
  let displayImages = activeTrim?.images?.length > 0 ? activeTrim.images : (product?.images || defaultCoolray.thumbs);`;

const replacement = `  const activeTrim = activeTrimsList.find(t => t.id === selectedTrimId) || activeTrimsList[0];

  // Map DB Price to Active Trim if available
  if (familyCarsDb && familyCarsDb.length > 0 && activeTrim) {
    const matchedDbTrimPrice = familyCarsDb.find(c => 
      c.titleLower.includes(activeTrim.id) || 
      c.titleLower.includes(activeTrim.name.toLowerCase()) || 
      (activeTrim.badge && c.titleLower.includes(activeTrim.badge.toLowerCase()))
    );
    if (matchedDbTrimPrice && matchedDbTrimPrice.price) {
      activeTrim.price = matchedDbTrimPrice.price + ' دج';
    }
  }

  // Map to the correct inventory images based on trim
  let displayImages = activeTrim?.images?.length > 0 ? activeTrim.images : (product?.images || defaultCoolray.thumbs);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
  console.log("Patched prices 2 successfully");
} else {
  console.log("Target 2 not found!");
}

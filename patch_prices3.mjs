import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

const target = `  // Map DB Price to Active Trim if available
  if (familyCarsDb && familyCarsDb.length > 0 && activeTrim) {
    const matchedDbTrimPrice = familyCarsDb.find(c => 
      c.titleLower.includes(activeTrim.id) || 
      c.titleLower.includes(activeTrim.name.toLowerCase()) || 
      (activeTrim.badge && c.titleLower.includes(activeTrim.badge.toLowerCase()))
    );
    if (matchedDbTrimPrice && matchedDbTrimPrice.price) {
      activeTrim.price = matchedDbTrimPrice.price + ' دج';
    }
  }`;

const replacement = `  // Map DB Price to Active Trim if available
  if (familyCarsDb && familyCarsDb.length > 0 && activeTrim) {
    let matchedDbTrimPrice = familyCarsDb.find(c => 
      c.titleLower.includes(activeTrim.id) || 
      c.titleLower.includes(activeTrim.name.toLowerCase()) || 
      (activeTrim.badge && c.titleLower.includes(activeTrim.badge.toLowerCase()))
    );
    
    // If we can't find an exact trim match, use the first matching car for this family as a fallback
    // This handles cases where the user just named it "Roewe i5" without specifying a trim name
    if (!matchedDbTrimPrice) {
      matchedDbTrimPrice = familyCarsDb[0];
    }
    
    if (matchedDbTrimPrice && matchedDbTrimPrice.price) {
      // Avoid appending " دج" if the user already included it in their admin inventory entry
      const priceStr = String(matchedDbTrimPrice.price);
      activeTrim.price = priceStr.includes('دج') || priceStr.includes('DA') 
        ? priceStr 
        : priceStr + ' دج';
    }
  }`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
  console.log("Patched prices 3 successfully");
} else {
  console.log("Target not found!");
}

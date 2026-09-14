import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

const target2 = `  const applyPermutation = (customImages: string[]) => {
    const defaultTrimImages = activeTrimsList[0]?.images || [];
    const activeTrimCatalogImages = activeTrim.images?.length > 0 ? activeTrim.images : defaultCoolray.thumbs;
    
    const orderedActiveTrimImages: string[] = [];
    const usedIndices = new Set();
    
    customImages.forEach((customImg: string) => {
      const indexInDefault = defaultTrimImages.indexOf(customImg);
      if (indexInDefault !== -1 && indexInDefault < activeTrimCatalogImages.length) {
        orderedActiveTrimImages.push(activeTrimCatalogImages[indexInDefault]);
        usedIndices.add(indexInDefault);
      } else {
        orderedActiveTrimImages.push(customImg);
      }
    });
    
    activeTrimCatalogImages.forEach((img: string, idx: number) => {
      if (!usedIndices.has(idx)) {
        orderedActiveTrimImages.push(img);
      }
    });
    
    return orderedActiveTrimImages;
  };
  
  if (familyCarsDb && familyCarsDb.length > 0) {
    // Attempt to find an exact trim match in the user's DB entries
    const matchedDbTrim = familyCarsDb.find(c => 
      c.titleLower.includes(activeTrim.id) || 
      c.titleLower.includes(activeTrim.name.toLowerCase()) || 
      (activeTrim.badge && c.titleLower.includes(activeTrim.badge.toLowerCase()))
    );`;

const replacement2 = `  const applyPermutation = (customImages: string[]) => {
    const defaultTrimImages = activeTrimsList[0]?.images || [];
    const activeTrimCatalogImages = activeTrim?.images?.length > 0 ? activeTrim.images : defaultCoolray.thumbs;
    
    const orderedActiveTrimImages: string[] = [];
    const usedIndices = new Set();
    
    customImages.forEach((customImg: string) => {
      const indexInDefault = defaultTrimImages.indexOf(customImg);
      if (indexInDefault !== -1 && indexInDefault < activeTrimCatalogImages.length) {
        orderedActiveTrimImages.push(activeTrimCatalogImages[indexInDefault]);
        usedIndices.add(indexInDefault);
      } else {
        orderedActiveTrimImages.push(customImg);
      }
    });
    
    activeTrimCatalogImages.forEach((img: string, idx: number) => {
      if (!usedIndices.has(idx)) {
        orderedActiveTrimImages.push(img);
      }
    });
    
    return orderedActiveTrimImages;
  };
  
  if (familyCarsDb && familyCarsDb.length > 0 && activeTrim) {
    // Attempt to find an exact trim match in the user's DB entries
    const matchedDbTrim = familyCarsDb.find(c => 
      c.titleLower.includes(activeTrim.id) || 
      c.titleLower.includes(activeTrim.name.toLowerCase()) || 
      (activeTrim.badge && c.titleLower.includes(activeTrim.badge.toLowerCase()))
    );`;

if (content.includes(target2)) {
  content = content.replace(target2, replacement2);
  fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
  console.log("Patched 2 successfully");
} else {
  console.log("Target 2 not found!");
}

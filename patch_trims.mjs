import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

const target1 = `  const getTrimsForProduct = (title: string | undefined): TrimOption[] => {
    if (!title) return coolrayTrims;
    const t = title.toLowerCase();
    if (t.includes('livan') || t.includes('x3')) return livanTrims;
    if (t.includes('roewe') || t.includes('i5')) return roeweTrims;
    if (t.includes('mg 5') || t.includes('mg5') || t.includes('ام جي')) return mgTrims;
    return coolrayTrims;
  };

  const activeTrimsList = getTrimsForProduct(product?.title);
  
  // Make sure selectedTrimId is valid for the current car's trims
  const activeTrim = activeTrimsList.find(t => t.id === selectedTrimId) || activeTrimsList[0];

  // Map to the correct inventory images based on trim
  let displayImages = activeTrim.images?.length > 0 ? activeTrim.images : (product?.images || defaultCoolray.thumbs);`;

const replacement1 = `  const getTrimsForProduct = (title: string | undefined): TrimOption[] => {
    if (!title) return coolrayTrims;
    const t = title.toLowerCase();
    if (t.includes('coolray') || t.includes('كولراي')) return coolrayTrims;
    if (t.includes('livan') || t.includes('x3')) return livanTrims;
    if (t.includes('roewe') || t.includes('i5')) return roeweTrims;
    if (t.includes('mg 5') || t.includes('mg5') || t.includes('ام جي')) return mgTrims;
    return []; // No trims for arbitrary custom cars
  };

  const activeTrimsList = getTrimsForProduct(product?.title);
  
  // Make sure selectedTrimId is valid for the current car's trims
  const activeTrim = activeTrimsList.length > 0 
    ? (activeTrimsList.find(t => t.id === selectedTrimId) || activeTrimsList[0])
    : null;

  // Map to the correct inventory images based on trim
  let displayImages = activeTrim?.images?.length > 0 ? activeTrim.images : (product?.images || defaultCoolray.thumbs);`;

if (content.includes(target1)) {
  content = content.replace(target1, replacement1);
  fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
  console.log("Patched 1 successfully");
} else {
  console.log("Target 1 not found!");
}

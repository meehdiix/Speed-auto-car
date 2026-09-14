import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

const target = `          setProduct({
            id: catalogData.id,
            title: catalogData.title,
            year: catalogData.year,
            mileage: '0 كم جديدة من المصنع',
            images: finalImages,
            thumbs: finalImages,
            hasCustomImages: customImages.length > 0, // Flag for display logic
            mainImg: finalImages[0] || defaultCoolray.mainImg,
            price: catalogData.trims[0]?.price,
            specs: catalogData.trims[0]?.heroSpecs?.map(s => ({ label: s.label, value: s.value })) || []
          });`;

const replacement = `          setProduct({
            id: catalogData.id,
            title: catalogData.title,
            year: catalogData.year,
            mileage: '0 كم جديدة من المصنع',
            images: finalImages,
            thumbs: finalImages,
            hasCustomImages: customImages.length > 0, // Flag for display logic
            mainImg: finalImages[0] || defaultCoolray.mainImg,
            price: matchedTrimCar?.price || catalogData.trims[0]?.price,
            specs: catalogData.trims[0]?.heroSpecs?.map(s => ({ label: s.label, value: s.value })) || []
          });`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
  console.log("Patched prices successfully");
} else {
  console.log("Target not found!");
}

import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

const target = `            price: matchedTrimCar?.price || catalogData.trims[0]?.price,`;
const replacement = `            price: (matchedTrimCar?.price ? (String(matchedTrimCar.price).includes('دج') ? matchedTrimCar.price : matchedTrimCar.price + ' دج') : catalogData.trims[0]?.price),`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
  console.log("Patched prices 4 successfully");
} else {
  console.log("Target not found!");
}

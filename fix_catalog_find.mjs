import fs from 'fs';
let content = fs.readFileSync('src/pages/Catalog.tsx', 'utf8');

// Replace the find calls on carsCatalog since it's an object, not an array.
content = content.replace(/carsCatalog\.find\(c => c\.id === (group\.baseCarId|car\.baseCarId|baseCarId)\)/g, 'carsCatalog[$1]');

fs.writeFileSync('src/pages/Catalog.tsx', content);
console.log("Fixed carsCatalog find issue");

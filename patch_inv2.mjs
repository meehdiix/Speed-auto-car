import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/InventoryManager.tsx', 'utf8');

content = content.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-<div>/g, '<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 relative z-10"><div>');

fs.writeFileSync('src/pages/admin/InventoryManager.tsx', content);
console.log("Patched InventoryManager successfully again");

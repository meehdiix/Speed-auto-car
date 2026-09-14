import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/InventoryManager.tsx', 'utf8');

// Just remove the origin selector entirely from the UI, keep default as chinese
content = content.replace(/const \[carOrigin, setCarOrigin\] = useState\<'korean' \| 'chinese'\>\('korean'\);/g, "const [carOrigin, setCarOrigin] = useState<'korean' | 'chinese'>('chinese');");

const uiBlockToRegex = /<div className="grid grid-cols-2 gap-4">[\s\S]*?<\/div>[\s\S]*?{carOrigin === 'korean' && \([\s\S]*?<\/div>[\s\S]*?\)}/;
content = content.replace(uiBlockToRegex, ""); // Or I can just manually do it

fs.writeFileSync('src/pages/admin/InventoryManager.tsx', content);
console.log("Patched InventoryManager origin toggle");

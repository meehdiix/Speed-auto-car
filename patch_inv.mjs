import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/InventoryManager.tsx', 'utf8');

// replace state default
content = content.replace(/useState\<'korean' \| 'chinese'\>\('korean'\)/, "useState<'korean' | 'chinese'>('chinese')");

// remove the origin selection UI
const uiStart = content.indexOf('{/* Origin Selection */}');
const uiEnd = content.indexOf('<div>', uiStart);
if(uiStart !== -1 && uiEnd !== -1) {
  content = content.substring(0, uiStart - 30) + content.substring(uiEnd);
}

// remove conditional mileage
content = content.replace(/{carOrigin === 'korean' && \([\s\S]*?<\/div>[\s\S]*?\)}/, "");

// remove conditional class for price
content = content.replace(/<div className={carOrigin === 'chinese' \? "md:col-span-2" : ""}>/, '<div className="md:col-span-2">');

// remove origin pill in list
const listStart = content.indexOf('<td className="px-6 py-5">', content.indexOf('{car.title}'));
const listEnd = content.indexOf('</td>', listStart) + 5;

// wait, the pill is:
// <td className="px-6 py-5">
//   <span className={`px-3 py-1 rounded-full text-xs font-bold border ${car.origin === 'korean' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}`}>
//     {car.origin === 'korean' ? 'كورية' : 'صينية زيرو'}
//   </span>
// </td>

content = content.replace(/<span className=\{`px-3 py-1 rounded-full text-xs font-bold border \$\{car\.origin === 'korean' \? 'bg-red-500\/10 border-red-500\/20 text-red-400' : 'bg-purple-500\/10 border-purple-500\/20 text-purple-400'}`\}>[\s\S]*?<\/span>/, 
  `<span className="px-3 py-1 rounded-full text-xs font-bold border bg-purple-500/10 border-purple-500/20 text-purple-400">صينية زيرو</span>`);

fs.writeFileSync('src/pages/admin/InventoryManager.tsx', content);
console.log("Patched InventoryManager successfully");

import fs from 'fs';
let content = fs.readFileSync('src/pages/Catalog.tsx', 'utf8');

// 1. Add useNavigate to imports
if (!content.includes('useNavigate')) {
  content = content.replace("import { Link } from 'react-router-dom';", "import { Link, useNavigate } from 'react-router-dom';");
}

// 2. Add useNavigate hook inside Catalog component
if (!content.includes('const navigate = useNavigate();')) {
  content = content.replace("export default function Catalog() {", "export default function Catalog() {\n  const navigate = useNavigate();");
}

// 3. Make the card clickable and change image aspect ratio
content = content.replace(
  /className="bg-\[#181818\] border border-white\/5 rounded-3xl overflow-hidden hover:border-red-500\/30 transition-all duration-300 group flex flex-col"/,
  'onClick={() => navigate(`/product/${car.baseCarId}`)}\n                    className="bg-[#181818] border border-white/5 rounded-3xl overflow-hidden hover:border-red-500/30 transition-all duration-300 group flex flex-col cursor-pointer"'
);

// 4. Update the image container
content = content.replace(
  /<div className="relative aspect-\[4\/3\] bg-gradient-to-br from-white\/5 to-transparent p-6 flex items-center justify-center overflow-hidden">/,
  '<div className="relative aspect-[3/4] bg-gradient-to-br from-white/5 to-transparent p-2 flex items-center justify-center overflow-hidden">'
);

// 5. Update the inner link to not navigate so it doesn't conflict, or change to a simple div
content = content.replace(
  /<Link \n                          to=\{\`\/product\/\$\{car.baseCarId\}\`\}\n                          className="w-12 h-12 bg-white\/5 hover:bg-red-600 rounded-2xl flex items-center justify-center transition-colors group\/btn"\n                        >/g,
  '<div className="w-12 h-12 bg-white/5 hover:bg-red-600 rounded-2xl flex items-center justify-center transition-colors group/btn">'
);
content = content.replace(
  /<ArrowLeft className="w-5 h-5 text-white group-hover\/btn:-translate-x-1 transition-transform" \/>\n                        <\/Link>/g,
  '<ArrowLeft className="w-5 h-5 text-white group-hover/btn:-translate-x-1 transition-transform" />\n                        </div>'
);

fs.writeFileSync('src/pages/Catalog.tsx', content);
console.log("Patched Catalog cards");

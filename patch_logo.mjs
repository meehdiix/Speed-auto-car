import fs from 'fs';
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
content = content.replace(
  /<span className="text-white">H<\/span>\s*<span className="text-red-500 ml-0.5">M<\/span>/,
  '<span className="text-white">S</span>\n              <span className="text-red-500 ml-0.5">A</span>'
);
fs.writeFileSync('src/components/Navbar.tsx', content);
console.log("Patched mobile logo to SA");

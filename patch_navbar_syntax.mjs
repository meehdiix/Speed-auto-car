import fs from 'fs';
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

content = content.replace(/  \]\);\n\n  useEffect\(\(\) => \{/g, "\n  useEffect(() => {");
fs.writeFileSync('src/components/Navbar.tsx', content);
console.log("Patched syntax error in Navbar");

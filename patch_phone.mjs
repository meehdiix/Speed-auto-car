import fs from 'fs';
import path from 'path';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/0670089119/g, '0564507370');
  content = content.replace(/0670 08 91 19/g, '0564 50 73 70');
  fs.writeFileSync(filePath, content);
}

const files = [
  'src/pages/AboutUs.tsx',
  'src/pages/Contact.tsx',
  'src/pages/admin/SettingsManager.tsx',
  'src/pages/ProductTemplate.tsx',
  'src/components/Navbar.tsx',
  'src/components/LiquidCTA.tsx',
  'src/components/Footer.tsx',
  'src/components/Hero.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    replaceInFile(f);
    console.log("Patched phone in", f);
  }
});

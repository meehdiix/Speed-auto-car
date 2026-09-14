import fs from 'fs';

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('MessageCircle') && filePath !== 'src/components/WhatsappIcon.tsx') {
    // Add import if not present
    if (!content.includes('WhatsappIcon')) {
      // Find the last import line and add WhatsappIcon after it
      content = content.replace(/(import .*;\n)(?!import)/, `$1import { WhatsappIcon } from '${filePath.includes('/') && filePath.split('/').length > 2 ? '../' : './'}components/WhatsappIcon';\n`);
    }
    content = content.replace(/<MessageCircle/g, '<WhatsappIcon');
    fs.writeFileSync(filePath, content);
    console.log("Patched", filePath);
  }
}

const files = [
  'src/pages/AboutUs.tsx',
  'src/pages/Contact.tsx',
  'src/pages/ProductTemplate.tsx',
  'src/components/Process.tsx',
  'src/components/Footer.tsx'
];

files.forEach(f => replaceInFile(f));

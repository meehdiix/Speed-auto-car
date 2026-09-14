import fs from 'fs';

function fixImport(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (filePath.startsWith('src/components/')) {
    content = content.replace(/import { WhatsappIcon } from '\.\.\/components\/WhatsappIcon';/, "import { WhatsappIcon } from './WhatsappIcon';");
  } else if (filePath.startsWith('src/pages/')) {
    content = content.replace(/import { WhatsappIcon } from '\.\/components\/WhatsappIcon';/, "import { WhatsappIcon } from '../components/WhatsappIcon';");
  }
  fs.writeFileSync(filePath, content);
}

['src/components/Footer.tsx', 'src/components/Process.tsx', 'src/pages/AboutUs.tsx', 'src/pages/Contact.tsx', 'src/pages/ProductTemplate.tsx'].forEach(fixImport);

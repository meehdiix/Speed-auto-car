import fs from 'fs';
let content = fs.readFileSync('src/components/Hero.tsx', 'utf8');

content = content.replace(/<Link\s+href="#cars"/, '<Link to="/catalog"');
content = content.replace(/<a\s+href="#cars"/, '<Link to="/catalog"');

// Fix any leftover closing </a>
// Well wait, the error says: Unexpected closing "Link" tag does not match opening "a" tag
// Meaning I have `<a` somewhere that closes with `</Link>`.
// Let's replace the button carefully.
fs.writeFileSync('src/components/Hero.tsx.bak', content);

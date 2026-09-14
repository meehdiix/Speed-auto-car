import fs from 'fs';
let content = fs.readFileSync('src/utils/imageOptimization.ts', 'utf8');
content = content.replace("const transforms = ['f_auto', 'q_auto', 'e_trim'];", "const transforms = ['f_auto', 'q_auto'];");
fs.writeFileSync('src/utils/imageOptimization.ts', content);
console.log("Removed e_trim");

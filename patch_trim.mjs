import fs from 'fs';
let content = fs.readFileSync('src/utils/imageOptimization.ts', 'utf8');
content = content.replace("const transforms = ['f_auto', 'q_auto'];", "const transforms = ['f_auto', 'q_auto', 'e_trim'];");
fs.writeFileSync('src/utils/imageOptimization.ts', content);
console.log("Patched optimizeImage with e_trim");

import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

const target = `              </AnimatePresence>
            </div>

            {/* 🎨 COMPACT COLOR PALETTE SELECTOR */}`;

const replacement = `              </AnimatePresence>
            </div>
            )}

            {/* 🎨 COMPACT COLOR PALETTE SELECTOR */}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
  console.log("Patched 4 successfully");
} else {
  console.log("Target 4 not found!");
}

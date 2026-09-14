import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

const target3 = `              <h1 dir="ltr" className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight whitespace-nowrap overflow-hidden text-ellipsis text-right">
                Geely Coolray {activeTrim.name} 2026
              </h1>
              <p className="text-xs sm:text-sm text-red-400/90 font-medium mt-1">
                {activeTrim.subtitle}
              </p>
            </div>

            {/* 🌟 SLEEK STANDOUT TRIM DROPDOWN PILL */}
            <div className="relative">`;

const replacement3 = `              <h1 dir="ltr" className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight whitespace-nowrap overflow-hidden text-ellipsis text-right">
                {product?.title || 'سيارة'} {activeTrimsList.length > 1 ? activeTrim?.name : ''} {product?.year || ''}
              </h1>
              {activeTrim?.subtitle && (
                <p className="text-xs sm:text-sm text-red-400/90 font-medium mt-1">
                  {activeTrim.subtitle}
                </p>
              )}
            </div>

            {/* 🌟 SLEEK STANDOUT TRIM DROPDOWN PILL */}
            {activeTrimsList.length > 1 && (
            <div className="relative">`;

if (content.includes(target3)) {
  content = content.replace(target3, replacement3);
  fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
  console.log("Patched 3 successfully");
} else {
  console.log("Target 3 not found!");
}

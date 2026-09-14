import fs from 'fs';
let content = fs.readFileSync('src/pages/Catalog.tsx', 'utf8');

const target1 = '<div className="flex flex-col lg:flex-row gap-8 relative">';
const target2 = '{/* Sidebar Filters */}';

const startIndex = content.indexOf(target1);
const endIndex = content.indexOf(target2, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const toggleButtonHTML = `
        {/* Filters Toggle (All Devices) */}
        <div className="mb-8 flex justify-end">
          <button 
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="w-full md:w-64 bg-[#181818] border border-white/10 hover:border-red-500/50 rounded-2xl p-4 flex items-center justify-between text-white transition-all shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-red-400" />
              <span className="font-bold">خيارات البحث والفلاتر</span>
            </div>
            <ChevronDown className={\`w-5 h-5 transition-transform \${isMobileFiltersOpen ? 'rotate-180' : ''}\`} />
          </button>
        </div>

        <div className="flex flex-col gap-8 relative">
          `;
  
  content = content.substring(0, startIndex) + toggleButtonHTML + content.substring(endIndex);
}

// Remove the `typeof window !== 'undefined' && window.innerWidth >= 1024` logic
content = content.replace(
  /\{\(isMobileFiltersOpen \|\| typeof window !== 'undefined' && window\.innerWidth >= 1024\) && \(/,
  '{(isMobileFiltersOpen) && ('
);

// Change the sidebar width logic to be a full-width grid on desktop when open
content = content.replace(
  /className="lg:w-72 shrink-0 lg:block overflow-hidden lg:overflow-visible"/,
  'className="w-full overflow-hidden"'
);

// Change the inner sticky div to a flex row on large screens
content = content.replace(
  /<div className="bg-\[#181818\] border border-white\/5 rounded-3xl p-6 sticky top-32">/,
  '<div className="bg-[#181818] border border-white/5 rounded-3xl p-6 flex flex-col lg:flex-row gap-6 lg:items-end">'
);

// Modify internal margins so they fit in a row (Search, Brand, Price)
content = content.replace(/<div className="mb-8">/g, '<div className="flex-1">');

fs.writeFileSync('src/pages/Catalog.tsx', content);
console.log("Patched filters correctly");

import fs from 'fs';
let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// The dropdown starts around here:
/*
<div 
  className="relative"
  onMouseEnter={() => setCatalogOpen(true)}
  onMouseLeave={() => setCatalogOpen(false)}
>
  <button className="flex items-center gap-1 text-white/80 hover:text-white font-bold transition-colors py-2 text-sm">
    تصفح السيارات
    <ChevronDown className="w-4 h-4" />
  </button>
  
  <AnimatePresence>
  ...
  </AnimatePresence>
</div>
*/

// Replace desktop dropdown with simple link
const desktopSearch = /<div \s*className="relative"\s*onMouseEnter=\{\(\) => setCatalogOpen\(true\)\}\s*onMouseLeave=\{\(\) => setCatalogOpen\(false\)\}\s*>\s*<button className="flex items-center gap-1 text-white\/80 hover:text-white font-bold transition-colors py-2 text-sm">\s*تصفح السيارات\s*<ChevronDown className="w-4 h-4" \/>\s*<\/button>[\s\S]*?<\/AnimatePresence>\s*<\/div>/;

content = content.replace(desktopSearch, '<Link to="/catalog" className="text-white/80 hover:text-white font-bold transition-colors py-2 text-sm">تصفح السيارات</Link>');

// For mobile menu:
/*
  <button 
    onClick={() => setMobileView('catalog')} 
    className="px-4 py-3 text-white font-bold hover:bg-white/10 rounded-xl transition-colors flex items-center justify-between w-full text-lg"
  >
    تصفح السيارات
    <ChevronDown className="w-5 h-5 transform -rotate-90" />
  </button>
*/

const mobileButtonSearch = /<button \s*onClick=\{\(\) => setMobileView\('catalog'\)\} \s*className="px-4 py-3 text-white font-bold hover:bg-white\/10 rounded-xl transition-colors flex items-center justify-between w-full text-lg"\s*>\s*تصفح السيارات\s*<ChevronDown className="w-5 h-5 transform -rotate-90" \/>\s*<\/button>/;

content = content.replace(mobileButtonSearch, '<Link to="/catalog" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white font-bold hover:bg-white/10 rounded-xl transition-colors text-lg">تصفح السيارات</Link>');

// Remove the mobile catalog view rendering:
const mobileCatalogViewSearch = /\{catalogItems\.length > 0 \? \([\s\S]*?\) : \([\s\S]*?الرجوع[\s\S]*?<\/button>\s*\{catalogItems\.length > 0 \? \([\s\S]*?\) : \([\s\S]*?<\/AnimatePresence>/;

// Wait, the mobile view structure:
/*
{mobileView === 'main' ? (
  <motion.div ...>
    ...
  </motion.div>
) : (
  <motion.div ...>
    ...
  </motion.div>
)}
*/
// It's easier to just do it via regex carefully or string manipulation.
fs.writeFileSync('src/components/Navbar.tsx.bak', content);

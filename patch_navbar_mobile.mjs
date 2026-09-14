import fs from 'fs';
let content = fs.readFileSync('src/components/Navbar.tsx.bak', 'utf8');

const startIdx = content.indexOf("{mobileView === 'main' ? (");
const endIdx = content.indexOf("</AnimatePresence>", startIdx);

const replacement = `
                    <motion.div 
                      key="main"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex flex-col gap-4"
                    >
                      <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white font-bold hover:bg-white/10 rounded-xl transition-colors text-lg">الرئيسية</Link>
                      <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white font-bold hover:bg-white/10 rounded-xl transition-colors text-lg">تصفح السيارات</Link>
                      <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white font-bold hover:bg-white/10 rounded-xl transition-colors text-lg">كيف نعمل؟</Link>
                      <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-white font-bold hover:bg-white/10 rounded-xl transition-colors text-lg">تواصل معنا</Link>
                    </motion.div>
`;

if(startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
}

// Remove unused state and useEffect for fetching dbItems
content = content.replace(/const \[catalogOpen, setCatalogOpen\] = useState\(false\);\n\s*const \[mobileView, setMobileView\] = useState<'main' \| 'catalog'>\('main'\);\n\s*const \[catalogItems, setCatalogItems\] = useState<\{title: string, href: string\}\[\]>\(\[\]\);/, "");

// Find and remove the useEffect that fetches cars for navbar
// It starts with useEffect(() => { const q = query
const efStart = content.indexOf("useEffect(() => {\n    const q = query(collection(db, 'cars')");
const efEnd = content.indexOf("return unsubscribe;\n  }, []);", efStart);
if(efStart !== -1 && efEnd !== -1) {
  content = content.substring(0, efStart) + content.substring(efEnd + 26);
}

// Remove firestore imports from Navbar if we don't need them
// content = content.replace(/import { collection, query, where, onSnapshot } from 'firebase\/firestore';/, "");
// content = content.replace(/import { db } from '\.\.\/lib\/firebase';/, "");

fs.writeFileSync('src/components/Navbar.tsx', content);
console.log("Patched Navbar completely");

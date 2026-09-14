import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

if(!content.includes('const Catalog = lazy')) {
  content = content.replace("const Home = lazy(() => import('./pages/Home'));", "const Home = lazy(() => import('./pages/Home'));\nconst Catalog = lazy(() => import('./pages/Catalog'));");
}

if(!content.includes('<Route path="/catalog" element={<Catalog />} />')) {
  content = content.replace('<Route path="/" element={<Home />} />', '<Route path="/" element={<Home />} />\n            <Route path="/catalog" element={<Catalog />} />');
}

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx");

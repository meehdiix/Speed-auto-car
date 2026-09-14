import fs from 'fs';
let content = fs.readFileSync('src/pages/Catalog.tsx', 'utf8');

content = content.replace(
  "import { Search, Filter, SlidersHorizontal, ArrowRight, Car, MapPin, Calendar, Activity, Info, AlertCircle, ChevronDown, Check } from 'lucide-react';", 
  "import { Search, Filter, SlidersHorizontal, ArrowRight, Car, MapPin, Calendar, Activity, Info, AlertCircle, ChevronDown, Check, Layers } from 'lucide-react';"
);

fs.writeFileSync('src/pages/Catalog.tsx', content);
console.log("Fixed Layers import");

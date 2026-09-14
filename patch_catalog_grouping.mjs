import fs from 'fs';
let content = fs.readFileSync('src/pages/Catalog.tsx', 'utf8');

// Replace the cars grid generation
const startCarsMap = content.indexOf('const sortedCars =');
const endCarsMap = content.indexOf('const getBaseCarImage =');

if (startCarsMap !== -1 && endCarsMap !== -1) {
  const replacement = `
  const groupedCars = Object.values(cars.reduce((acc, car) => {
    if (!acc[car.baseCarId]) {
      acc[car.baseCarId] = {
        baseCarId: car.baseCarId,
        titles: new Set([car.title]),
        prices: [],
        year: car.year,
        images: car.images,
        count: 0
      };
    }
    
    // Extract numerical value from price (e.g., "300 مليون" -> 300)
    const numMatch = String(car.price).match(/\\d+(\\.\\d+)?/);
    if (numMatch) {
      acc[car.baseCarId].prices.push(parseFloat(numMatch[0]));
    }
    
    acc[car.baseCarId].titles.add(car.title);
    acc[car.baseCarId].count += 1;
    
    return acc;
  }, {} as Record<string, any>)).map(group => {
    const minPrice = group.prices.length > 0 ? Math.min(...group.prices) : 0;
    
    // Find the base catalog car to get the actual clean title
    const catalogItem = carsCatalog.find(c => c.id === group.baseCarId);
    
    return {
      id: group.baseCarId,
      baseCarId: group.baseCarId,
      title: catalogItem ? catalogItem.title : Array.from(group.titles)[0],
      price: minPrice > 0 ? \`\${minPrice} مليون\` : 'تواصل معنا',
      minPriceNum: minPrice,
      year: group.year,
      images: group.images,
      hasMultipleTrims: group.count > 1
    };
  });

  const filteredCars = groupedCars.filter(car => {
    const matchesSearch = String(car.title).toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesBrand = true;
    if (brandFilter !== 'all') {
      const carBrand = car.baseCarId.split('-')[0]; // geely, roewe, mg, livan
      matchesBrand = carBrand === brandFilter;
    }
    
    return matchesSearch && matchesBrand;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (priceSort === 'none') return 0;
    return priceSort === 'asc' ? a.minPriceNum - b.minPriceNum : b.minPriceNum - a.minPriceNum;
  });

  `;
  content = content.substring(0, content.indexOf('const filteredCars =')) + replacement + content.substring(endCarsMap);
}

// Update the JSX to show "فئات متعددة" and "يبدأ من"
content = content.replace(/<h2 className="text-xl font-bold text-white mb-2 line-clamp-1">\{car\.title\}<\/h2>/, 
  `<h2 className="text-xl font-bold text-white mb-2 line-clamp-1">{car.title}</h2>`);

content = content.replace(/<span className="flex items-center gap-1.5"><Car className="w-4 h-4" \/> زيرو كم<\/span>/,
  `{car.hasMultipleTrims ? (
                              <span className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 text-xs font-bold"><Layers className="w-3.5 h-3.5" /> فئات متعددة</span>
                            ) : (
                              <span className="flex items-center gap-1.5"><Car className="w-4 h-4" /> زيرو كم</span>
                            )}`);
                            
content = content.replace(/<div className="text-xs text-white\/40 mb-1">السعر النهائي \(شامل كل شيء\)<\/div>/,
  `{car.hasMultipleTrims ? (
                              <div className="text-xs text-white/40 mb-1">يبدأ من (حسب الفئة)</div>
                            ) : (
                              <div className="text-xs text-white/40 mb-1">السعر النهائي (شامل كل شيء)</div>
                            )}`);
                            
// Ensure Layers is imported
if (!content.includes('Layers')) {
  content = content.replace(/import \{ Search, Filter, SlidersHorizontal, ArrowRight, Car, MapPin, Calendar, Activity, Info, AlertCircle, ChevronDown, Check \} from 'lucide-react';/,
  "import { Search, Filter, SlidersHorizontal, ArrowRight, Car, MapPin, Calendar, Activity, Info, AlertCircle, ChevronDown, Check, Layers } from 'lucide-react';");
}

fs.writeFileSync('src/pages/Catalog.tsx', content);
console.log("Patched Catalog grouping");

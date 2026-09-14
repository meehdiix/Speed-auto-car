import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowRight, Car, MapPin, Calendar, Activity, Info, AlertCircle, ChevronDown, Check, Layers, ArrowLeft } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { carsCatalog } from '../data/carsCatalog';
import { optimizeImage } from '../utils/imageOptimization';

interface CarItem {
  id: string;
  title: string;
  price: string;
  year: string;
  mileage?: string;
  status?: string;
  images: string[];
  baseCarId: string;
}

export default function Catalog() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('none');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, 'cars'), where('status', '==', 'متاح'));
        const snapshot = await getDocs(q);
        
        const fetchedCars: CarItem[] = snapshot.docs.map(doc => {
          const data = doc.data();
          const titleLower = (data.title || '').toLowerCase();
          
          let baseCarId = 'geely-coolray'; // fallback
          if (titleLower.includes('coolray') || titleLower.includes('كولراي')) {
            baseCarId = 'geely-coolray';
          } else if (titleLower.includes('livan') || titleLower.includes('ليفان') || titleLower.includes('x3')) {
            baseCarId = 'livan-x3-pro';
          } else if (titleLower.includes('roewe') || titleLower.includes('رويوي') || titleLower.includes('i5')) {
            baseCarId = 'roewe-i5';
          } else if (titleLower.includes('mg') || titleLower.includes('ام جي')) {
            baseCarId = 'mg-5';
          }

          return {
            id: doc.id,
            title: data.title || 'سيارة غير مسماة',
            price: data.price || '0',
            year: data.year || '2024',
            mileage: data.mileage,
            status: data.status,
            images: data.images || [],
            baseCarId
          };
        });

        if (fetchedCars.length === 0) {
          fetchedCars.push({
            id: 'coolray-2026-battle',
            title: 'جيلي كولراي 2026 باتل',
            price: '345 مليون',
            year: '2026',
            status: 'متاح',
            images: [],
            baseCarId: 'geely-coolray'
          });
        }

        setCars(fetchedCars);
      } catch (err) {
        console.error("Error fetching cars catalog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const brands = [
    { id: 'all', name: 'الكل' },
    { id: 'geely', name: 'Geely' },
    { id: 'roewe', name: 'Roewe' },
    { id: 'mg', name: 'MG' },
    { id: 'livan', name: 'Livan' }
  ];

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
    const numMatch = String(car.price).match(/\d+(\.\d+)?/);
    if (numMatch) {
      acc[car.baseCarId].prices.push(parseFloat(numMatch[0]));
    }
    
    acc[car.baseCarId].titles.add(car.title);
    acc[car.baseCarId].count += 1;
    
    return acc;
  }, {} as Record<string, any>)).map(group => {
    const minPrice = group.prices.length > 0 ? Math.min(...group.prices) : 0;
    
    const catalogItem = carsCatalog[group.baseCarId];
    
    return {
      id: group.baseCarId,
      baseCarId: group.baseCarId,
      title: catalogItem ? catalogItem.title : Array.from(group.titles)[0],
      price: minPrice > 0 ? `${minPrice} مليون` : 'تواصل معنا',
      minPriceNum: minPrice,
      year: group.year,
      images: group.images,
      hasMultipleTrims: group.count > 1,
      mainImg: catalogItem ? catalogItem.mainImg : ''
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

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              تصفح <span className="font-amiri text-red-400 font-normal">السيارات</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl">
              اكتشف أحدث السيارات المستوردة بأسعار تنافسية. جميع السيارات المعروضة متوفرة للطلب الفوري.
            </p>
          </div>
        </div>

        
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
            <ChevronDown className={`w-5 h-5 transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex flex-col gap-8 relative">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {(isMobileFiltersOpen) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full overflow-hidden"
              >
                <div className="bg-[#181818] border border-white/5 rounded-3xl p-6 flex flex-col lg:flex-row gap-6 lg:items-end">
                  
                  {/* Search */}
                  <div className="flex-1">
                    <label className="text-white font-bold mb-3 block flex items-center gap-2">
                      <Search className="w-4 h-4 text-red-400" /> بحث
                    </label>
                    <input 
                      type="text" 
                      placeholder="ابحث عن سيارة..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-all"
                    />
                  </div>

                  {/* Brand Filter */}
                  <div className="flex-1">
                    <label className="text-white font-bold mb-3 block flex items-center gap-2">
                      <Filter className="w-4 h-4 text-red-400" /> العلامة التجارية
                    </label>
                    <div className="flex flex-col gap-2">
                      {brands.map(brand => (
                        <button
                          key={brand.id}
                          onClick={() => setBrandFilter(brand.id)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                            brandFilter === brand.id 
                              ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                              : 'bg-black/20 border-white/5 text-white/70 hover:bg-black/40 hover:text-white'
                          }`}
                        >
                          <span>{brand.name}</span>
                          {brandFilter === brand.id && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Sort */}
                  <div>
                    <label className="text-white font-bold mb-3 block flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-red-400" /> ترتيب حسب السعر
                    </label>
                    <div className="bg-black/40 rounded-xl border border-white/10 p-1 flex">
                      <button
                        onClick={() => setPriceSort('none')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${priceSort === 'none' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'}`}
                      >
                        الافتراضي
                      </button>
                      <button
                        onClick={() => setPriceSort('asc')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${priceSort === 'asc' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'}`}
                      >
                        الأرخص
                      </button>
                      <button
                        onClick={() => setPriceSort('desc')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${priceSort === 'desc' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'}`}
                      >
                        الأغلى
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cars Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-white/10 border-t-red-500 rounded-full animate-spin mb-4" />
                <p className="text-white/60">جاري تحميل السيارات...</p>
              </div>
            ) : sortedCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedCars.map((car, idx) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => navigate(`/product/${car.baseCarId}`)}
                    className="bg-[#181818] border border-white/5 rounded-3xl overflow-hidden hover:border-red-500/30 transition-all duration-300 group flex flex-col cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center overflow-hidden">
                      <img 
                        src={optimizeImage(car.images?.[0] || car.mainImg, 600)} 
                        alt={car.title} 
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <span className="bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {car.year}
                        </span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-green-500/10 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full border border-green-500/20 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5" /> متاح
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-4 flex-1">
                        <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">{car.title}</h2>
                        <div className="flex flex-wrap items-center gap-3 text-white/50 text-sm font-medium">
                          {car.hasMultipleTrims ? (
                            <span className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 text-xs font-bold"><Layers className="w-3.5 h-3.5" /> فئات متعددة</span>
                          ) : (
                            <span className="flex items-center gap-1.5"><Car className="w-4 h-4" /> زيرو كم</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                        <div>
                          {car.hasMultipleTrims ? (
                            <div className="text-xs text-white/40 mb-1">يبدأ من (حسب الفئة)</div>
                          ) : (
                            <div className="text-xs text-white/40 mb-1">السعر النهائي (شامل كل شيء)</div>
                          )}
                          <div className="text-xl font-bold text-red-400">{car.price} دج</div>
                        </div>
                        <div className="w-12 h-12 bg-white/5 hover:bg-red-600 rounded-2xl flex items-center justify-center transition-colors group/btn">
                          <ArrowLeft className="w-5 h-5 text-white group-hover/btn:-translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-[#181818] border border-white/5 rounded-3xl p-12 text-center">
                <AlertCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">لا توجد نتائج</h3>
                <p className="text-white/50">لم نتمكن من العثور على سيارات تطابق بحثك. جرب تغيير الفلاتر أو كلمات البحث.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setBrandFilter('all');
                    setPriceSort('none');
                  }}
                  className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { optimizeImage } from '../utils/imageOptimization';
import { getCarsList, getDefaultCatalogCars } from '../utils/carsCache';

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Initialize immediately with static catalog data to guarantee 0ms instant display under pressure
  const [services, setServices] = useState<any[]>(() => getDefaultCatalogCars());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getCarsList().then(cars => {
      if (isMounted && cars && cars.length > 0) {
        setServices(cars);
      }
    }).catch(() => {
      // Fallback already pre-rendered
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current || services.length === 0) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const itemWidth = scrollRef.current.clientWidth * 0.85; 
    const index = Math.round(Math.abs(scrollLeft) / itemWidth);
    setActiveIndex(Math.min(Math.max(index, 0), services.length - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [services]);

  if (loading) {
    return (
      <section id="services" className="pt-0 pb-16 md:pt-4 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center py-20">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/50 font-medium">جاري تحميل السيارات...</p>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="pt-0 pb-16 md:pt-4 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col mb-10 md:mb-12">
        <div className="max-w-3xl text-right">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">أحدث السيارات <span className="font-amiri text-red-400 font-normal">المتوفرة</span></h2>
          <p className="text-lg md:text-xl text-white/70 font-medium leading-relaxed">
            استكشف مجموعة من أحدث السيارات التي نوفرها لعملائنا من الأسواق العالمية. جميع سياراتنا تشمل فئات متعددة لتختار ما يناسبك.
          </p>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible transition-all hide-scroll"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map((service, idx) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex-none w-[85%] md:w-auto snap-center"
            >
              <Link to={`/product/${service.baseCarId || service.id}`} className="group block relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-[0_8px_30px_rgba(0,0,0,0.5)] bg-neutral-900 border border-white/10">
                <div className="absolute inset-0">
                  <img src={optimizeImage(service.images && service.images.length > 0 ? service.images[0] : "https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2000&auto=format&fit=crop", 600)} alt={service.title} loading="lazy" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent"></div>
                
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                   {service.origin === 'korean' ? 'كوريا' : 'الصين'}
                </div>
                
                {service.hasMultipleTrims && (
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    فئات متعددة
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end items-start mb-2 text-right w-full">
                   <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md mb-1">{service.title || 'سيارة'}</h3>
                   {service.price && (
                     <div className="text-red-400 font-bold text-sm mb-2">
                       {service.hasMultipleTrims ? `يبدأ من ${service.price}` : service.price}
                     </div>
                   )}
                   <span className="text-white/80 text-sm font-bold bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 group-hover:bg-white group-hover:text-black transition-colors w-full text-center mt-1">
                     عرض المواصفات والفئات
                   </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile Scroll Indicators */}
        <div className="flex md:hidden justify-center items-center gap-3 mt-2">
          {services.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-10 bg-red-500' : 'w-3 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

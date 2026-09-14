import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, Phone, X, Star, Car } from 'lucide-react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const [phoneNumber, setPhoneNumber] = useState('0541399342');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().phone) {
          setPhoneNumber(docSnap.data().phone);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-2 sm:pt-3 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative border border-t-[rgba(255,255,255,0.15)] border-white/[0.02] rounded-full px-4 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.03)] ${isScrolled ? 'bg-transparent backdrop-blur-2xl' : 'bg-transparent backdrop-blur-md'}`}>
          <div className="absolute inset-0 rounded-full animate-[pulse_3s_ease-in-out_infinite] bg-white/[0.02] pointer-events-none"></div>
          
          {/* Logo: Full 'SpeedAutoCar' on Desktop/PC, 'HM' on Mobile */}
          <Link to="/" dir="ltr" className="flex items-center relative z-10 font-normal tracking-wide hover:opacity-90 transition-opacity">
            {/* Desktop Brand */}
            <span className="hidden md:flex items-center font-bruno font-bold tracking-wider text-base lg:text-[17px] uppercase">
              <span className="text-white">Speed</span>
              <span className="text-red-500 ml-1.5">Auto</span>
            </span>

            {/* Mobile SA Monogram */}
            <span className="md:hidden flex items-center font-bruno font-bold text-lg uppercase tracking-wider">
              <span className="text-white">S</span>
              <span className="text-red-500 ml-0.5">A</span>
            </span>
          </Link>

          {/* Glowing Stars (Liquid Glass White) - Mobile Only */}
          <div className="md:hidden flex items-center gap-1 opacity-90 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {[1, 2, 3, 4, 5].map((star, i) => (
              <div key={star} className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-white/30 blur-[1px] rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }}></div>
                <Star
                  className="w-3 h-3 text-white fill-white/60 drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-[pulse_2s_ease-in-out_infinite] relative z-10"
                  strokeWidth={1.5}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              </div>
            ))}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 relative z-10">
            <Link to="/" className="text-white/80 hover:text-white font-bold transition-colors text-sm">
              الرئيسية
            </Link>

            {/* Dropdown */}
            <Link to="/catalog" className="text-white/80 hover:text-white font-bold transition-colors py-2 text-sm">تصفح السيارات</Link>

            <Link to="/about" className="text-white/80 hover:text-white font-bold transition-colors text-sm">
              كيف نعمل؟
            </Link>
            <Link to="/contact" className="text-white/80 hover:text-white font-bold transition-colors text-sm">
              تواصل معنا
            </Link>
          </div>

          {/* Action Button */}
          <div className="hidden md:block relative z-10">
            <a
              href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
              className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md border border-red-400/30 text-white px-4 py-1.5 rounded-full font-bold text-[10px] sm:text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <Phone className="w-3 h-3" />
              <span dir="ltr">اتصل بنا الأن</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden relative z-10">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-1.5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  
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
</AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

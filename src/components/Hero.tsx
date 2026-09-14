import { motion } from 'motion/react';
import { CarFront, ArrowLeft, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative min-h-[85dvh] md:min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-[#121212]">
      {/* High Quality Car Image Background with slow zoom effect */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <motion.img 
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium Car"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#121212]/80"></div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#121212] to-transparent z-0"></div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 md:mt-24 pb-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto flex flex-col items-center mb-16 md:mb-0 mt-8 md:mt-28"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-16 sm:mb-12 -translate-y-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-100 text-xs sm:text-xs font-bold tracking-wide shadow-sm"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </div>
            الوسيط الأول لاستيراد السيارات
          </motion.div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bruno font-bold tracking-wider sm:tracking-widest uppercase text-white leading-tight mb-5 sm:mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
            <span className="text-white">Speed </span>
            <span className="text-red-500">Auto </span>
            <span className="text-white">Car</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 font-medium leading-relaxed mb-20 sm:mb-16 max-w-[95%] sm:max-w-2xl mx-auto drop-shadow-lg">
            من الصين إلى الجزائر. أنت تمول، ونحن نتكفل بالبحث، الفحص، والشراء لضمان وصول سيارتك بأفضل حالة وأنسب سعر.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full px-4">
            <a 
              href="tel:0541399342"
              className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md border border-red-400/30 text-white rounded-full font-bold text-xs sm:text-sm transition-all shadow-[0_4px_24px_rgba(239,68,68,0.2)] flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Phone className="w-3.5 h-3.5"/>
              اتصل بنا الأن
            </a>
            <Link 
              to="/catalog"
              className="px-5 py-2.5 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              تصفح السيارات
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Indicators */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
         <div className="hidden md:flex justify-between items-end gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-black/50 backdrop-blur-md border border-white/10 p-5 rounded-3xl shadow-xl max-w-[280px] flex flex-col gap-4 text-right"
            >
              <div className="flex items-center justify-between text-white">
                <span className="text-xs font-bold bg-red-500/20 text-red-100 border border-red-500/30 px-3 py-1.5 rounded-full">شفافية مطلقة</span>
              </div>
              <p className="text-white/90 text-sm font-medium leading-snug">نقوم بفحص السيارة بالكامل وإرسال تقرير مفصل لك قبل الشراء بأموالك.</p>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link to="#services" className="flex items-center gap-5 bg-black/50 backdrop-blur-md hover:bg-black/70 border border-white/10 p-3 pr-6 rounded-full shadow-xl transition-all group">
                <div className="text-right">
                  <p className="text-white font-bold block text-base">اكتشف الماركات</p>
                  <p className="text-white/60 text-sm font-medium">كيا، هيونداي، جيلي والمزيد</p>
                </div>
                <div className="bg-red-500 text-white p-4 rounded-full group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                  <CarFront className="w-6 h-6" />
                </div>
              </Link>
            </motion.div>
         </div>
      </div>
    </div>
  );
}

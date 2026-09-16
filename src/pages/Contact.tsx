import { motion } from 'motion/react';
import { Phone, MapPin, PhoneCall } from 'lucide-react';
import { trackPhoneCall } from '../utils/pixelTracker';

export default function Contact() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6"><span className="font-amiri text-red-400 font-normal">تواصل</span> معنا</h1>
        <p className="text-xl md:text-2xl text-white/75 max-w-3xl mx-auto leading-relaxed font-medium">
          نفضل دائماً الاتصال الهاتفي المباشر لنمنحك المعلومة الدقيقة فوراً ونجيب على كل تساؤلاتك حول السيارات وعملية الاستيراد بدون أي تضييع للوقت.
        </p>
      </motion.section>

      {/* 2. Direct Call Action Banner */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto mb-20 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-[3rem] p-10 md:p-16 text-center shadow-[0_10px_40px_rgba(239,68,68,0.35)] relative overflow-hidden border border-red-500/40"
      >
        <div className="absolute -top-16 -right-16 opacity-10 pointer-events-none">
          <PhoneCall className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-white/15 rounded-full flex items-center justify-center mb-8 backdrop-blur-md border border-white/20 shadow-inner">
            <PhoneCall className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">اتصل بنا <span className="font-amiri text-white/90 font-normal">مباشرة</span></h2>
          <p className="text-lg md:text-xl font-medium mb-10 text-white/90 max-w-2xl">
            للحصول على استشارة فورية وشاملة حول توفر السيارات، الأسعار الإجمالية، والشروع في عملية الشراء.
          </p>
          <a 
            href="tel:0541399342" 
            onClick={() => trackPhoneCall({ buttonLabel: 'اتصل بنا مباشرة (صفحة تواصل معنا - البانر)' })}
            className="bg-white text-red-600 hover:bg-neutral-100 px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-xl sm:text-2xl transition-all shadow-xl inline-flex items-center gap-3 active:scale-95 hover:scale-105"
          >
            <Phone className="w-6 h-6 sm:w-7 sm:h-7" />
            <span dir="ltr" className="tracking-wider">0541 39 93 42</span>
          </a>
        </div>
      </motion.section>

      {/* 3. Contact Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center flex flex-col items-center hover:border-red-500/30 transition-colors"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-400 border border-red-500/20">
              <Phone className="w-9 h-9" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">رقم الهاتف المباشر</h3>
            <p className="text-white/50 text-sm mb-4">متاح للرد والاستفسار المباشر</p>
            <a 
              href="tel:0541399342" 
              onClick={() => trackPhoneCall({ buttonLabel: 'رقم الهاتف المباشر (صفحة تواصل معنا - البطاقة)' })}
              className="text-white hover:text-red-400 transition-colors text-2xl sm:text-3xl font-bold tracking-wider" 
              dir="ltr"
            >
              0541 39 93 42
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center flex flex-col items-center hover:border-red-500/30 transition-colors"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-400 border border-red-500/20">
              <MapPin className="w-9 h-9" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">مقرنا</h3>
            <p className="text-white/50 text-sm mb-4">مرحباً بك في أي وقت</p>
            <a href="https://maps.app.goo.gl/uqyL7KUvZJmtZNm6A?g_st=ic" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors text-xl sm:text-2xl font-bold flex flex-col items-center gap-2">
              <span>عين الصحراء تقرت - بلوك رقم 547</span>
              <span className="text-sm font-medium text-red-400 bg-red-400/10 px-4 py-2 rounded-full">عرض على الخريطة</span>
            </a>
          </motion.div>
      </section>

    </div>
  );
}

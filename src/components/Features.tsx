import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Search, Banknote, Ship } from 'lucide-react';

const features = [
  {
    icon: <Search className="w-8 h-8" />,
    title: 'نبحث لك عن الأفضل',
    desc: 'نقوم بالبحث في الأسواق الكورية والصينية عن السيارة التي تطابق مواصفاتك وميزانيتك بدقة عالية.'
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: 'فحص شامل وشفاف',
    desc: 'قبل الشراء، نقوم بفحص السيارة فنياً وميكانيكياً ونرسل لك تقريراً مفصلاً بالصور والفيديو لضمان الجودة.'
  },
  {
    icon: <Banknote className="w-8 h-8" />,
    title: 'أنت الممول، نحن المنفذ',
    desc: 'نعمل كوسيط أمين؛ أنت من يمول عملية الشراء، ونحن نتكفل بإتمام الصفقة بأفضل سعر دون وسطاء إضافيين.'
  },
  {
    icon: <Ship className="w-8 h-8" />,
    title: 'شحن آمن للجزائر',
    desc: 'نتابع كافة إجراءات الشحن والتصدير حتى تصل سيارتك إلى الموانئ الجزائرية بأمان تام وفي أسرع وقت.'
  }
];

export default function Features() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const itemWidth = scrollRef.current.clientWidth * 0.85; 
    const index = Math.round(Math.abs(scrollLeft) / itemWidth);
    setActiveIndex(Math.min(Math.max(index, 0), features.length - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="py-16 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#121212]">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 flex items-center justify-center gap-2">
          <span className="font-amiri text-red-400 font-normal">لماذا</span>
          <span>تختار</span>
          <span className="font-signature font-normal text-red-400" dir="ltr">Speed Auto Car</span>
        </h2>
        <p className="text-white/70 max-w-3xl mx-auto font-medium text-lg md:text-xl leading-relaxed">
          نحن لسنا مجرد بائعين، بل نحن فريقك ووكيلك في الخارج. نسهل عليك عملية استيراد السيارات المعقدة ونجعلها آمنة ومضمونة.
        </p>
      </div>

      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:overflow-visible transition-all hide-scroll"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex-none w-[85%] md:w-auto snap-center bg-white/5 border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 hover:border-red-500/30 transition-all shadow-lg group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-500/20 transition-colors"></div>
              
              <div className="w-20 h-20 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center text-red-500 mb-8 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] relative z-10">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed text-lg relative z-10">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Mobile Scroll Indicators */}
        <div className="flex md:hidden justify-center items-center gap-3 mt-4">
          {features.map((_, idx) => (
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

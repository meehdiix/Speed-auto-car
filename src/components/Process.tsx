import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { PhoneCall, Search, ShieldCheck, Ship } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

const steps = [
  {
    icon: <PhoneCall className="w-8 h-8" />,
    num: '1',
    title: 'الطلب والاستفسار',
    desc: 'تتصل بنا مباشرة هاتفياً وتخبرنا بنوع السيارة التي تريدها (ماركة، سنة، ميزانية).'
  },
  {
    icon: <Search className="w-8 h-8" />,
    num: '2',
    title: 'البحث والاختيار',
    desc: 'نقوم بالبحث في الأسواق الصينية عن أفضل الخيارات التي تطابق طلبك ونعرضها عليك.'
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    num: '3',
    title: 'الفحص والشراء',
    desc: 'بعد اختيارك للسيارة، نقوم بفحصها بالكامل في بلد المنشأ. إذا كانت سليمة، تقوم بتمويل الشراء وننفذ الصفقة.'
  },
  {
    icon: <Ship className="w-8 h-8" />,
    num: '4',
    title: 'الشحن للجزائر',
    desc: 'نتكفل بإجراءات التصدير وشحن السيارة عبر البحر حتى تصل إلى الموانئ الجزائرية بأمان وتسجل باسمك.'
  }
];

export default function Process() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    direction: 'rtl',
    breakpoints: {
      '(min-width: 768px)': { active: false }
    }
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % steps.length;
        if (emblaApi && emblaApi.internalEngine().options.active) {
          emblaApi.scrollTo(next);
        }
        return next;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [emblaApi]);

  return (
    <section className="pt-8 pb-16 md:pt-16 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="text-center mb-0 md:mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          خطوات استيراد <span className="font-amiri text-red-400 font-normal">سيارتك</span>
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto font-medium text-lg md:text-xl">
          خطوات بسيطة ومدروسة لضمان وصول سيارتك بأعلى معايير الأمان والجودة.
        </p>
      </div>
      
      <div className="relative">
        {/* Connecting line (Desktop only) */}
        <div className="hidden md:block absolute top-24 left-[12.5%] right-[12.5%] h-px bg-white/10 z-0">
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 h-[2px] w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.8)] -mr-12"
            animate={{ right: `${activeIndex * 33.333}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
        
        {/* Carousel Container */}
        <div className="overflow-hidden md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 pb-12 pt-10 md:pt-12 md:pb-8" ref={emblaRef} dir="rtl">
          <div className="flex md:grid md:grid-cols-4 gap-6 md:gap-8 touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
            {steps.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className={`w-[85vw] md:w-auto flex-none min-w-0 relative z-10 flex flex-col items-center text-center group bg-[#121212]/40 border border-white/5 p-8 rounded-[2rem] md:bg-transparent md:border-none md:p-0 md:rounded-none overflow-hidden md:overflow-visible ${activeIndex === idx ? 'active-pulse' : ''}`}
              >
                {/* Huge Number Background (Mobile only) */}
                <div className="absolute -top-6 -right-4 text-[10rem] font-black text-white/[0.02] group-hover:text-red-500/[0.05] transition-colors duration-500 z-0 select-none pointer-events-none md:hidden mobile-bg-num">
                  {step.num}
                </div>

                <div className="relative z-10 flex flex-col items-center h-full">
                  {/* Icon Box */}
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-[#121212] border border-white/10 rounded-2xl flex items-center justify-center text-red-400 mb-6 shadow-xl group-hover:-translate-y-2 group-hover:border-red-500/50 transition-all duration-300 md:rotate-3 md:group-hover:rotate-0 relative z-10 mobile-icon-box">
                    {step.icon}
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="bg-red-500/10 text-red-400 text-sm font-bold px-4 py-1.5 rounded-full mb-5 border border-red-500/20 shadow-sm">
                    الخطوة {step.num}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/60 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="flex md:hidden justify-center items-center gap-2 mt-4">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-500 ${
                activeIndex === idx ? 'w-8 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slow-pulse {
          0%, 100% { 
            box-shadow: 0 0 0 rgba(239, 68, 68, 0); 
            border-color: rgba(255, 255, 255, 0.05); 
          }
          50% { 
            box-shadow: 0 0 25px rgba(239, 68, 68, 0.25); 
            border-color: rgba(239, 68, 68, 0.4); 
          }
        }
        @keyframes number-pulse {
          0%, 100% { color: rgba(255, 255, 255, 0.02); }
          50% { color: rgba(239, 68, 68, 0.08); }
        }
        @keyframes icon-pulse {
          0%, 100% { 
            transform: translateY(0);
            border-color: rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          }
          50% { 
            transform: translateY(-8px);
            border-color: rgba(239, 68, 68, 0.5);
            box-shadow: 0 0 25px rgba(239, 68, 68, 0.4);
          }
        }
        .active-pulse .mobile-icon-box {
          animation: icon-pulse 3s ease-in-out infinite;
        }
        @media (max-width: 767px) {
          .active-pulse {
            animation: slow-pulse 3s ease-in-out infinite;
          }
          .active-pulse .mobile-bg-num {
            animation: number-pulse 3s ease-in-out infinite;
          }
        }
      `}</style>
    </section>
  );
}

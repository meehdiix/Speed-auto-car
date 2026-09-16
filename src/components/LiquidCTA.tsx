import { motion } from 'motion/react';
import { Phone } from 'lucide-react';
import { trackPhoneCall } from '../utils/pixelTracker';

export default function LiquidCTA() {
  return (
    <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#121212] flex items-center justify-center overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear" 
          }}
          className="w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-red-600/10 blur-[100px] absolute"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear" 
          }}
          className="w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] rounded-full bg-green-500/10 blur-[100px] absolute translate-x-1/4 -translate-y-1/4"
        />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#121212] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#121212] to-transparent z-10 pointer-events-none"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] p-12 md:p-20 rounded-[3rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Internal Glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            ابدأ رحلة استيراد سيارتك <span className="font-amiri text-red-400 font-normal">اليوم</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            تواصل معنا الآن، وسيقوم فريقنا بالرد على جميع استفساراتك وتقديم أفضل العروض التي تناسب ميزانيتك.
          </p>

          {/* Liquid Glass Button */}
          <a
            href="tel:0541399342"
            onClick={() => trackPhoneCall({ buttonLabel: 'إتصل بنا الأن (القسم الترويجي)' })}
            className="group relative inline-flex items-center justify-center gap-3 md:gap-4 px-8 md:px-10 py-3 md:py-3 rounded-full font-bold text-base md:text-lg text-white transition-all duration-300 ease-out hover:scale-105 active:scale-95 overflow-hidden whitespace-nowrap"
          >
            {/* Button Glass Background */}
            <div className="absolute inset-0 bg-red-500/20 backdrop-blur-md border border-white/20 rounded-full transition-all duration-500 group-hover:bg-red-500/40 group-hover:border-white/40"></div>
            
            {/* Liquid Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_2s_infinite]"></div>
            </div>

            {/* Glowing Shadow */}
            <div className="absolute -inset-2 bg-red-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full z-[-1]"></div>

            <Phone className="w-6 h-6 relative z-10 drop-shadow-md group-hover:animate-pulse" />
            <span className="relative z-10 drop-shadow-md tracking-wide">إتصل بنا الأن</span>
          </a>
        </motion.div>
      </div>

      <style>{`
        @keyframes shine {
          100% {
            left: 200%;
          }
        }
      `}</style>
    </section>
  );
}

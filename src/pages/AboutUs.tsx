import { motion } from 'motion/react';
import { Target, Search, FileCheck, Ship, Phone, PhoneCall } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-24"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8"><span className="font-amiri text-red-400 font-normal">كيف</span> نعمل؟</h1>
        <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-bold">
          نحن في <span className="font-bruno font-bold text-red-500 tracking-wider uppercase px-1">Speed Auto Car</span> نلعب دور الوسيط الآمن بينك وبين أسواق السيارات في الصين. لا نبيع السيارات بأنفسنا، بل نشتريها لك بأموالك الخاصة بعد التأكد من جودتها.
        </p>
      </motion.section>

      {/* 2. The Process */}
      <section className="mb-32">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">خطوات استيراد <span className="font-amiri text-red-400 font-normal">سيارتك</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center relative"
          >
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">1</div>
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 text-white">
              <PhoneCall className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">الطلب والاستفسار</h3>
            <p className="text-white/70 text-lg leading-relaxed">
              تتصل بنا مباشرة هاتفياً وتخبرنا بنوع السيارة التي تريدها (ماركة، سنة، ميزانية).
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center relative"
          >
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">2</div>
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 text-white">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">البحث والاختيار</h3>
            <p className="text-white/70 text-lg leading-relaxed">
              نقوم بالبحث في الأسواق الكورية أو الصينية عن أفضل الخيارات التي تطابق طلبك ونعرضها عليك.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center relative"
          >
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">3</div>
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 text-white">
              <FileCheck className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">الفحص والشراء</h3>
            <p className="text-white/70 text-lg leading-relaxed">
              بعد اختيارك للسيارة، نقوم بفحصها بالكامل في بلد المنشأ. إذا كانت سليمة، تقوم بتمويل الشراء وننفذ الصفقة.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center relative"
          >
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">4</div>
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 text-white">
              <Ship className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">الشحن للجزائر</h3>
            <p className="text-white/70 text-lg leading-relaxed">
              نتكفل بإجراءات التصدير وشحن السيارة عبر البحر حتى تصل إلى الموانئ الجزائرية بأمان وتسجل باسمك.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-[2.5rem] p-10 md:p-14 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-400 mb-6">
             <Phone className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">جاهز لاستيراد سيارة <span className="font-amiri text-red-400 font-normal">أحلامك</span>؟</h2>
          <p className="text-white/60 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            نحن هنا للإجابة على كافة استفساراتك وتسهيل كل خطوة في رحلتك.
          </p>
          <a
            href="tel:0541399342"
            className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-lg transition-all shadow-[0_4px_20px_rgba(239,68,68,0.3)] hover:-translate-y-1"
          >
            <Phone className="w-5 h-5"/>
            إتصل بنا الأن
          </a>
        </div>
      </motion.section>
    </div>
  );
}

import { motion } from 'motion/react';
import { Phone, MapPin, MessageCircle, Send } from 'lucide-react';
import { WhatsappIcon } from '../components/WhatsappIcon';

export default function Contact() {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6"><span className="font-amiri text-red-400 font-normal">تواصل</span> معنا</h1>
        <p className="text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-medium">
          أسرع طريقة للتواصل معنا هي عبر واتساب. نحن متواجدون للرد على استفساراتك حول السيارات وعملية الاستيراد.
        </p>
      </motion.section>

      {/* 2. Important Contact Method (WhatsApp) */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto mb-20 bg-green-500 text-white rounded-[3rem] p-10 md:p-16 text-center shadow-[0_10px_40px_rgba(34,197,94,0.4)] relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 opacity-20">
          <WhatsappIcon className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <WhatsappIcon className="w-20 h-20 mb-8" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">استفسر براحة <span className="font-amiri text-red-400 font-normal">تامة</span></h2>
          <p className="text-xl md:text-2xl font-bold mb-10 text-white/90">اضغط على الزر أدناه وسيحولك مباشرة إلى محادثة معنا عبر واتساب.</p>
          <a 
            href="https://wa.me/213564507370" 
            target="_blank" 
            rel="noreferrer"
            className="bg-white text-green-600 px-10 py-5 rounded-full font-bold text-2xl hover:bg-gray-100 transition-all shadow-lg inline-block"
          >
            تحدث معنا على واتساب
          </a>
        </div>
      </motion.section>

      {/* 3. Contact Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">رقم الهاتف</h3>
            <a href="tel:0564507370" className="text-white/80 hover:text-white transition-colors text-2xl font-bold" dir="ltr">
              0564 50 73 70
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] text-center flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">مقرنا</h3>
            <a href="https://maps.app.goo.gl/uqyL7KUvZJmtZNm6A?g_st=ic" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors text-2xl font-bold flex flex-col items-center gap-2">
              <span>الجزائر</span>
              <span className="text-sm font-medium text-red-400 bg-red-400/10 px-4 py-2 rounded-full">عرض على الخريطة</span>
            </a>
          </motion.div>
      </section>

    </div>
  );
}

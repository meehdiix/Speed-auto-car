import { motion } from 'motion/react';

const stats = [
  { value: '+247', label: 'سيارة مستوردة', desc: 'تم تسليمها للعملاء بنجاح' },
  { value: '96.3%', label: 'عميل راضٍ', desc: 'شفافية ومصداقية تامة' },
  { value: '90', label: 'يوم', desc: 'متوسط مدة الشحن' }
];

export default function Stats() {
  return (
    <section className="py-8 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="bg-[#121212]/60 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 text-center">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="py-10 md:py-0 md:px-8 flex flex-col items-center justify-center group border-b md:border-b-0 md:border-e last:border-b-0 md:last:border-e-0 border-white/10"
            >
              <h3 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight group-hover:scale-105 transition-transform duration-300" dir="ltr">{stat.value}</h3>
              <h4 className="text-2xl font-bold text-red-400 mb-2 font-amiri">{stat.label}</h4>
              <p className="text-white/60 text-base font-medium">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


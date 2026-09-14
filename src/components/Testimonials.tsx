import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'أحمد ب.',
    car: 'Geely Coolray',
    text: 'خدمة في القمة مع سبيد أوتو كار، ناس كونفيونس وخدمتهم نقية. الطوموبيل لحقتني كيما شفتها في لي فيديو لي بعثوهملي من الصين، زيرو روتوش.'
  },
  {
    name: 'كريم م.',
    car: 'Roewe i5',
    text: 'في الأول كنت خايف نمد دراهمي وندير لامبورطاسيون، بصح ليكيب كانو في المستوى ووقفوا معايا دقيقة بدقيقة حتى ديت المفتاح تاع طوموبيلتي.'
  },
  {
    name: 'سفيان ط.',
    car: 'MG 5',
    text: 'أحسن وكالة تجيب من الصين، نقصو عليا بزاف شقا وتعب. السوم لي عطاوهولي طايح بزاف على السوق هنا في الدزاير، يعطيهم الصحة.'
  }
];

export default function Testimonials() {
  return (
    <section className="pt-8 pb-16 md:pt-16 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          ماذا يقول <span className="font-amiri text-red-400 font-normal">عملاؤنا</span>
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto font-medium text-lg md:text-xl">
          نفخر بثقة عملائنا ونعتبرها رأس مالنا الحقيقي في هذا المجال.
        </p>
      </div>
      <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {reviews.map((review, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.6 }}
            className="w-[85vw] md:w-auto flex-none snap-center bg-[#121212]/80 backdrop-blur-sm border border-white/5 p-8 md:p-10 rounded-[2rem] relative group hover:bg-[#1a1a1a] hover:border-white/10 transition-all duration-300 flex flex-col"
          >
            <Quote className="absolute top-8 left-8 w-12 h-12 text-white/5 group-hover:text-red-500/10 transition-colors duration-300" />
            <div className="flex items-center gap-1 text-yellow-500 mb-8">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-white/80 text-lg font-medium leading-relaxed mb-8">
              "{review.text}"
            </p>
            <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-auto">
              <h4 className="text-white font-bold text-lg">{review.name}</h4>
              <span className="text-red-400 text-sm font-bold bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">{review.car}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

import { Phone, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WhatsappIcon } from './WhatsappIcon';


const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.37.75-4.81 2.66-6.22 1.25-.94 2.82-1.41 4.39-1.38v4.06c-1.3.06-2.52.79-3.14 1.91-.65 1.13-.59 2.64.2 3.69.75.99 2.05 1.48 3.28 1.35 1.83-.2 3.17-1.89 3.16-3.75-.02-5.46-.01-10.91-.01-16.37Z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-black/80 backdrop-blur-xl relative">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#121212] to-transparent pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-right relative">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-signature font-normal mb-4" dir="ltr">
              <span className="text-white">Speed</span> <span className="text-red-500">Auto</span>
            </h2>
            <p className="text-white/70 mb-6 max-w-md font-medium leading-relaxed text-base md:text-lg">
              سبيد أوتو كار - وسيطك الموثوق لاستيراد السيارات من الصين إلى الجزائر. نسهل عليك البحث، الفحص، الشراء بأموالك، ونضمن لك شحناً آمناً حتى وصول سيارتك.
            </p>
            <div className="flex gap-4">
              <a href="https://web.facebook.com/profile.php?id=61587488037995&mibextid=wwXIfr&rdid=FcdWsbd0ut4eyKao&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F1DniwL8tkC%2F%3Fmibextid%3DwwXIfr%26_rdc%3D1%26_rdr#" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-colors shadow-sm">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://www.tiktok.com/@wadieabid" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-600 hover:text-white transition-colors shadow-sm">
                <TiktokIcon className="w-6 h-6" />
              </a>
              <a href="https://wa.me/213564507370" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-green-600/20 border border-green-500/30 flex items-center justify-center text-green-400 hover:bg-green-600 hover:text-white transition-colors shadow-sm">
                <WhatsappIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">روابط سريعة</h3>
            <ul className="space-y-4 font-medium text-lg">
              <li><Link to="/" className="text-white/70 hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> الرئيسية</Link></li>
              <li><Link to="/catalog" className="text-white/70 hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> تصفح السيارات</Link></li>
              <li><Link to="/about" className="text-white/70 hover:text-white transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> كيف نعمل؟</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">تواصل معنا</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="bg-white/10 p-2 rounded-full">
                   <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                   <p className="text-white/50 text-sm mb-1">الهاتف / واتساب</p>
                   <a href="tel:0564507370" className="text-white font-bold hover:text-red-400 transition-colors inline-block tracking-wide text-lg" dir="ltr">0564 50 73 70</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white/10 p-2 rounded-full">
                   <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/50 text-sm mb-1">الموقع</p>
                  <a href="https://maps.app.goo.gl/uqyL7KUvZJmtZNm6A?g_st=ic" target="_blank" rel="noreferrer" className="text-white font-bold text-lg hover:text-red-400 transition-colors block">الجزائر (عرض الخريطة)</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/50 font-medium">
          <p>جميع الحقوق محفوظة لشركة Speed Auto Car © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import { 
  Phone, ShieldCheck, Clock, Sparkles,
  Gauge, Fuel, Star, CheckCircle2, 
  MapPin, HelpCircle, Camera, X, Flame, 
  Car, Layers, Quote, ChevronDown, Check,
  SlidersHorizontal, ChevronLeft, ChevronRight,
  FileCheck, Ship, KeyRound, Trophy,
  Share2, MessageCircle
} from 'lucide-react';
import { doc, getDoc, collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { carsCatalog } from '../data/carsCatalog';
import Stats from '../components/Stats';
import { optimizeImage } from '../utils/imageOptimization';
import { trackPhoneCall, trackViewContent, trackAddToCart, trackPurchase, trackLeadSubmission, initTikTokPixelScript, initMetaPixelScript } from '../utils/pixelTracker';
import { getGeneralSettings } from '../utils/settings';


interface TrimOption {
  id: string;
  name: string;
  badge: string;
  price: string;
  subtitle: string;
  images?: string[];
  tag: string;
  heroSpecs: Array<{ icon: any; label: string; value: string }>;
}

function getInitialCar(id: string | undefined) {
  const targetId = (!id || id === 'coolray-2026-battle' || id === 'geely-coolray-2026') ? 'geely-coolray' : id;
  const catalogData = carsCatalog[targetId];
  if (catalogData) {
    const defaultTrim = catalogData.trims[0];
    return {
      id: catalogData.id,
      title: catalogData.title,
      year: catalogData.year,
      mileage: '0 كم جديدة من المصنع',
      images: defaultTrim?.images || [],
      thumbs: defaultTrim?.images || [],
      hasCustomImages: false,
      mainImg: defaultTrim?.images?.[0] || 'https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199678/i2kmtu63hvkeaudjn3si.png',
      price: defaultTrim?.price?.replace(/دج/g, '').trim() || '',
      specs: defaultTrim?.heroSpecs?.map(s => ({ label: s.label, value: s.value })) || []
    };
  }
  return null;
}

export default function ProductTemplate() {
  const { id } = useParams();
  const initialCar = getInitialCar(id);
  const [product, setProduct] = useState<any>(initialCar);
  const [loading, setLoading] = useState(!initialCar);
  const [activeImg, setActiveImg] = useState(initialCar?.mainImg || '');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [familyCarsDb, setFamilyCarsDb] = useState<any[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('0541399342');
  
  // Color palette state
  const availableColors = [
    { id: 'white', name: 'أبيض لؤلؤي', hex: '#FFFFFF', border: 'border-white/20' },
    { id: 'grey', name: 'رمادي معدني', hex: '#6B7280', border: 'border-white/10' },
    { id: 'black', name: 'أسود لامع', hex: '#000000', border: 'border-white/20' },
  ];
  const [selectedColor, setSelectedColor] = useState('white');
  
  // Trim selector state - initialized to match the current product if available
  const [selectedTrimId, setSelectedTrimId] = useState(() => {
    if (initialCar?.title) {
      const trims = carsCatalog[(!id || id === 'coolray-2026-battle' || id === 'geely-coolray-2026') ? 'geely-coolray' : id]?.trims;
      if (trims && trims.length > 0) return trims[0].id;
    }
    return 'battle';
  });
  const [isTrimDropdownOpen, setIsTrimDropdownOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '' });
  const [bookingStatus, setBookingStatus] = useState('');


  const coolrayTrims: TrimOption[] = [
    {
      id: 'starlight',
      name: 'Starlight',
      badge: 'تكنولوجيا',
      price: '320 مليون',
      subtitle: 'نظام إضاءة Star-piercing وشاشة 12.3 بوصة',
      tag: 'تطور ورفاهية',
      images: ["https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200315/hbuarpbwt8nomf31wfjj.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200315/a5m4lmgpknkqbqinwcvj.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200316/qsitab5jk65luvwkytaa.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200317/poplno2uuz8qtkf5wanu.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200318/niqxyroholug4aylxbeu.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200319/atopn4zted8w7mgvjzup.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200321/hbksrlbmurqi1tprf0j9.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200322/bwhivz6n4m7ro6nj0wvo.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200322/pmjaw802ydvqae5eumbn.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200324/wkzzmwz4x59rrqs5ribh.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200324/adnx5pda6bt6vhcrfmud.png"],
      heroSpecs: [
        { icon: Fuel, label: 'المحرك', value: '1.5 لتر تيربو 181 حصان / 290 نيوتن متر' },
        { icon: Camera, label: 'الشاشة', value: 'شاشة عملاقة 12.3 بوصة عالية الدقة' },
        { icon: Sparkles, label: 'الإضاءة', value: 'مصابيح أمامية LED مصفوفة (Star-piercing)' },
        { icon: Layers, label: 'التقنية', value: 'كونسول وسطي معاد تصميمه بخامات فاخرة' },
        { icon: Gauge, label: 'ناقل الحركة', value: '7 سرعات 7DCT مبلل' },
        { icon: ShieldCheck, label: 'الأمان', value: 'ABS, EBD, ESP' }
      ]
    },
    {
      id: 'super-power',
      name: 'Superpower',
      badge: 'النسخة القياسية',
      price: '300 مليون',
      subtitle: 'محرك 1.5 تيربو - 181 حصان',
      tag: 'أداء عملي وقوي',
      images: ["https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200128/vmtdsxtjgh6rvcrd7vbk.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200132/pkcmbswaxnqgvpqgowi9.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200136/hwiuhrhcgrn9a2xgsgnz.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200141/lqdkvnfufjchuub9jmpt.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200144/vzqtdk66odrpjz6qcvkz.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200145/rkxgu7aozkxeifuydktb.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200145/qhkt2l31eoty0hawfkcp.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200147/prmealoqbmoej5qwo8ip.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200148/j5bszl2lacbapodcmfoa.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200149/ijf17slgtflfy6tblnbp.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200150/qjatj4opdw6wman7tp7y.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200151/k6i8ysyqeskpfwebysug.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200151/epnwqbcwkrpn5rcfrww4.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200152/esz5d80xavq3dyq1baux.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200153/ah9ap7iy2jebpgafrexj.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200154/xl83dr8lprncbtpoxfon.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200154/i0pzah71alxuejj0bkvs.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200156/qfpj9pqlbqht8ixchdge.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200156/y84f7xa6mwtj8zv415r6.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200157/szffttizgb2pzcb1axzt.png"],
      heroSpecs: [
        { icon: Gauge, label: 'المحرك', value: '1.5 لتر تيربو بقوة 181 حصان و 290 نيوتن متر' },
        { icon: Layers, label: 'ناقل الحركة', value: '7 سرعات مزدوج القابض (7DCT)' },
        { icon: Fuel, label: 'الهيكل', value: 'منصة BMA بـ 66% صلب عالي الصلابة' },
        { icon: Sparkles, label: 'التقنية', value: 'شاشة 8 بوصة ومقاعد جلدية اصطناعية' },
        { icon: ShieldCheck, label: 'الأمان', value: '4 وسائد هوائية' },
        { icon: Flame, label: 'التجهيزات', value: 'جنوط رياضية' }
      ]
    },
    {
      id: 'super-max',
      name: 'Supermax',
      badge: 'الاقتصادية',
      price: '280 مليون',
      subtitle: 'محرك 1.5 تنفس طبيعي - 126 حصان',
      tag: 'توفير واقتصاد',
      images: ["https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199976/asn8s9twllhr5bhuuigu.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199979/i7zuidwpxhopeiouhutv.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199984/h5hlbycjqa4jytgshpwp.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199989/uxy2znjxfv5s2fqufeke.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199994/ypn3b4mrrufzeebmwbjd.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199999/j35amcbpy995df6xuqsh.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200004/a4mvpuf9m7o8bsrtwqrv.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200008/lq6iqigq74qxtmobz8wx.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200013/m6qvyyljes7twzyw8ysk.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200017/u8dpenugor7hdypz95j6.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200021/m4y0uth60p8vl6oqhq8t.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200026/d8i7dbzhzz8vcykjrrpg.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200030/cpj8j1srcawpfihpdlp2.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200035/w1ejs4njltjbuzxoovvx.png"],
      heroSpecs: [
        { icon: Gauge, label: 'المحرك', value: '1.5 لتر تنفس طبيعي 126 حصان و 152 نيوتن متر' },
        { icon: Layers, label: 'ناقل الحركة', value: 'CVT مستمر بـ 8 سرعات وهمية' },
        { icon: Fuel, label: 'الاستهلاك', value: '6.89 لتر / 100 كم (WLTC)' },
        { icon: Sparkles, label: 'المواصفات', value: 'شاشة 8 بوصة ومكابح إلكترونية EPB' },
        { icon: ShieldCheck, label: 'الأمان', value: 'نظام ثبات إلكتروني ESC' },
        { icon: Camera, label: 'الكاميرات', value: 'كاميرا خلفية' }
      ]
    },
    {
      id: 'flagship',
      name: 'Flagship',
      badge: 'الفل أوبشن',
      price: '340 مليون',
      subtitle: 'أعلى تقنيات الأمان Level 2 ADAS',
      tag: 'الفخامة والسلامة',
      images: ["https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200224/mllnmbyphb9kourqdhuo.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200225/b7l7aqopypzcl08kragb.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200226/dopawaqanowxiw3ijfts.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200227/zqbijrth8adwwumpihes.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200228/etr4ofmbfbiwob1k5wmc.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200228/zyyysqixeit2fwgowocx.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200229/kh9qdh4lnryxnmpucodp.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200230/yctupbbw7ixhiwy3kxi9.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200231/jzssh91izmjqb8mdoyiw.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200232/xec4zjuhru7xhzlot8ow.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200233/r3p5sksyco6ojqpitrwk.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200233/mh0pau1ewifuhv4vxh34.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200234/vmbdkvc7d4frl9icdesb.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200235/zjmhtn77awwshzb4bi6d.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200236/zre4xt2whr1ruult58ds.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200237/wiytov3wddpd4mnpqir7.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200237/s2cwfqpqevw7wxu4kaqe.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200239/hotuagvi8ogdm4fravob.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200240/sntfd2fuwstnwik676mp.png"],
      heroSpecs: [
        { icon: ShieldCheck, label: 'الأمان', value: 'مستوى القيادة الذاتية Level 2' },
        { icon: Camera, label: 'الكاميرات', value: 'نظام رؤية محيطية 540 درجة شفاف' },
        { icon: Flame, label: 'الكماليات', value: 'فتحة سقف بانورامية وباب خلفي كهربائي' },
        { icon: Sparkles, label: 'المقاعد', value: 'مقعد السائق كهربائي بـ 6 اتجاهات' },
        { icon: Fuel, label: 'المحرك', value: '1.5 لتر تيربو 181 حصان' },
        { icon: Layers, label: 'ناقل الحركة', value: '7 سرعات 7DCT' }
      ]
    },
    {
      id: 'battle',
      name: 'Battle',
      badge: 'النسخة الرياضية',
      price: '350 مليون',
      subtitle: 'أداء رياضي مع عجلات 18 بوصة وعوادم رباعية',
      tag: 'الأداء الأقصى',
      images: ["https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199678/i2kmtu63hvkeaudjn3si.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199683/kaafdy0474hdjdxcvnpy.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199688/crjc06tcnyikghz0tgjo.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199693/zabknhntq4caoptpbju4.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199698/ok0j2bclyofxvhgtfqxo.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199702/fur9nwalbfe4lxz0iuzr.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199707/iyok0p1mamnhi8vvvfm6.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199712/larp69xz3twmxxs9jsla.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199717/ddjcsk0bvtidldjwqtdw.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199721/erpwweznw2npietlx6ij.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199726/zlg5doqcqk09s4jfdvv1.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199731/suin1qey1wvvrswbypsv.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199735/pneudvhkpdfcbzbrdkkf.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199740/rjat14dczn4rjk3auo7q.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199744/o4r1vah1rf99zdhrtrr2.png"],
      heroSpecs: [
        { icon: Flame, label: 'الخارجية', value: 'عجلات Shadow 18 بوصة وعوادم رباعية' },
        { icon: ShieldCheck, label: 'المكابح', value: 'كليبرات حمراء رياضية وفرامل مطورة' },
        { icon: Sparkles, label: 'الداخلية', value: 'مقصورة Obsidian Black وأحزمة برتقالية' },
        { icon: Gauge, label: 'الأداء', value: '1.5 لتر تيربو، 181 حصان (0-100 كم/س بسرعة)' },
        { icon: Camera, label: 'الكاميرات', value: '540 درجة محيطية' },
        { icon: Layers, label: 'ناقل الحركة', value: '7 سرعات 7DCT' }
      ]
    }
  ];

  const livanTrims: TrimOption[] = [
    {
      id: 'manual',
      name: 'Manual',
      badge: 'صندوق يدوي',
      price: '230 مليون',
      subtitle: 'اقتصادية وعملية',
      tag: 'ناقل يدوي',
      images: ["https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183731/q44tezcyhgoxkl6sbnc9.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183732/oecsgeidekl6ki4mlxfh.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183733/nair9zhhhorkz3i32cer.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183734/v1wgliwkzewf5r8wirxv.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183735/ljcvbpgtfmgamnqre2qr.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183735/kgs7cyyussifw6bbz4zr.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183736/h0tdtg6qictnzuimw5v3.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183737/cyhhmwfysivatngftox6.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183738/lbnap0n9b6yrlsmkn0oo.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183739/ryvsrruqucdwoqzds6ak.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183739/zk3akdysose9nzvvzsoe.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183740/kmxhm8isvxysxbcsbytl.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183741/i2wu1r9imwzc4pxfgzqp.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183742/b3uwxqfsjptqtgcv10xi.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183743/jsxchfil4sp4hwmwgg9n.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183744/qfc3hwbijelyxey8jzti.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183745/qoftixscfahhzw4baoch.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183745/ie25wxyjq3syfs8wm3xl.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183746/ntp7yhnouc3brmiqabaj.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183748/mmsgad92bmfb1xzj11xf.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183748/zxkveo4aidtuc9hrzuqk.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183749/u9fjkdwtmrxlfcnym7ie.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183750/cmhb9bcec8uymfhlyeeo.png"],
      heroSpecs: [
        { icon: Gauge, label: 'المحرك', value: '1.5 لتر تنفس طبيعي، 113 حصان / 143 نيوتن متر' },
        { icon: Layers, label: 'ناقل الحركة', value: 'يدوي 5 سرعات مع قابض فردي جاف' },
        { icon: Fuel, label: 'الأبعاد', value: 'ارتفاع 185 ملم، سعة صندوق 400 لتر' },
        { icon: Sparkles, label: 'السرعة', value: '170 كم/س (استهلاك 6.8 لتر/100كم)' },
        { icon: ShieldCheck, label: 'الأمان', value: 'وسادتان هوائيتان وفرامل ABS' },
        { icon: Camera, label: 'تقنية', value: 'شاشة 8 بوصة' }
      ]
    },
    {
      id: 'auto',
      name: 'Auto / CVT',
      badge: 'صندوق أوتوماتيك',
      price: '250 مليون',
      subtitle: 'راحة داخل المدينة',
      tag: 'CVT أوتوماتيك',
      images: ["https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183651/fmapu0rjals1j2lroqnh.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183655/vt1sj1acmssr2qei5jjr.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183659/ateamavfw3q3ituplq98.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183662/vnqsgwhxagrqsutyamrr.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183663/feeyobkcfqsk4gglycsu.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183664/dpswlwwluicxbuvby954.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183665/wp0d6tkjrr79eu1jgfyy.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183666/ibzlsa02b2epazc97bgs.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183667/qjtnft0tte3hyoxa9wpc.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183668/bfqmwfdfksrvbi7rc3el.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183668/fisuype5dxybmkipgy39.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183669/hl2bdy7rozhyerz4rjm8.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183670/pfwuaijmby88zsihxvzg.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183671/wpnwbjzigwm0tpqfopjf.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183672/xnfnkylind9ml5rcsp2o.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183673/sfsdiolbdyuhaoiarl33.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183673/wqwjsyrblnrsfe0vvfp0.png"],
      heroSpecs: [
        { icon: Gauge, label: 'المحرك', value: '1.5 لتر تنفس طبيعي، 113 حصان / 143 نيوتن متر' },
        { icon: Layers, label: 'ناقل الحركة', value: 'أوتوماتيكي CVT مستمر' },
        { icon: Sparkles, label: 'الراحة', value: 'مثبت سرعة وشاشة 8 بوصة' },
        { icon: Fuel, label: 'الاستهلاك', value: '6.92 لتر/100كم' },
        { icon: Camera, label: 'الكاميرات', value: 'كاميرا خلفية' },
        { icon: ShieldCheck, label: 'الأمان', value: 'نظام ESC' }
      ]
    }
  ];

  const roeweTrims: TrimOption[] = [
    {
      id: 'standard',
      name: 'Standard',
      badge: 'سيدان',
      price: '270 مليون',
      subtitle: 'محرك ألمنيوم 1.5 لتر',
      tag: 'سيدان عائلية',
      images: ["https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200388/aglwg8esunanffnookez.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200389/pngmrcp5xal9krrwuxnz.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200390/g2lsq1eop0z8kl6ozsup.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200391/tclipihigvms9bbvual4.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200392/aqtl7kgzeqkrrjcw7mw4.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200392/arqd8nrfl7ofpkn3fuvp.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200393/ioum1j58ygi7vnnaoe03.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200394/hloek1ah7omkhfn5w19p.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200395/s9pgqputwhvefkr1kjim.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200395/pzfpisnqmjuxcqm6bmnb.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200396/wuc2vaq5guzjwypbgi0v.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200397/oakdnwvv61du41tnaykl.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200398/qwtfcvgrz1nd0d0yohof.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200399/zlftnjvbxvdzu6gqqssu.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200400/snzbpsaitwqmmlqgpxcx.png","https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200401/o0s6waqjp1nf9tosduo3.png"],
      heroSpecs: [
        { icon: Gauge, label: 'المحرك', value: '1.5 لتر 15FCD، ألمنيوم بالكامل (129 حصان)' },
        { icon: Layers, label: 'التقنية', value: 'حقن مباشر وضغط عالي 12:1' },
        { icon: Sparkles, label: 'الداخلية', value: 'شاشتين 10.25 بوصة ونظام Zebra OS' },
        { icon: Fuel, label: 'المساحة', value: 'قاعدة عجلات 2680 ملم وصندوق 422 لتر' },
        { icon: ShieldCheck, label: 'الأمان', value: 'نظام قيادة ذاتية Level 2' },
        { icon: Camera, label: 'الكاميرات', value: 'كاميرا 540 درجة' }
      ]
    }
  ];

  const mgTrims: TrimOption[] = [
    {
      id: 'automatic',
      name: 'Automatic',
      badge: 'أوتوماتيك',
      price: '275 مليون',
      subtitle: 'قيادة سلسة ومريحة',
      tag: 'عائلية',
      images: [
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613217/oy4rgutdpjynh4yjqqkj.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613218/vftlrhgorttpmbgsehf7.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613219/ovchltjlj6gk7iltv5ed.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613221/xhxi5xna5ngkxt8gxqbr.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613222/lnfthxcq55tcmoyunxzy.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613224/q29a79aummggajwrgbes.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613225/q3uweydwpwtnxguqjlpv.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613226/cnmp41g7atvftjihq6no.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613227/e6jkwun0hwasbqkpzah7.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613229/adaawg3dlhdm8oguamly.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613230/nghimiyl9cpuagy8ky9u.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613231/e9xpx46p2j0ubzxlhmbb.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613233/aqbfew6efghoxjqzkepx.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613234/xledom3dkkrsitm3iqhr.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613236/rmo2set5dmtrno3gtqty.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613238/wpbcow2gjptmfxfyd2u0.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613240/tgjymcqjpkwqfcm2ucbn.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613242/kswaakgbywhg9y1ky5bt.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613244/hrapm3hmuyz4j2pg6wnb.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613246/x6p01lovnfsuv3llb1gy.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789613248/xz1um0xc14i2ystvtw3v.png"
      ],
      heroSpecs: [
        { icon: Gauge, label: 'المحرك', value: '1.5 لتر (ناقل حركة أوتوماتيكي CVT)' },
        { icon: Flame, label: 'الاستهلاك', value: 'اقتصادي وعملي جداً' },
        { icon: ShieldCheck, label: 'الأمان', value: 'نظام ثبات إلكتروني وفرامل مانعة للانغلاق' },
        { icon: Camera, label: 'التقنية', value: 'شاشتين 12.3 بوصة وكاميرا خلفية' }
      ]
    },
    {
      id: 'manual',
      name: 'Manual',
      badge: 'يدوي',
      price: '220 مليون',
      subtitle: 'أداء فائق وتسارع قوي',
      tag: 'يدوي',
      images: [
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183455/usvmxpqcl4v1as7ceuuh.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183451/qvetbjmfrugty1dejcs7.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183459/eaevwf3smnuensqizzhb.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183464/ey1en6kf7ohvidrjh6jb.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183467/jqmwwqeoxfjbkyc29gwn.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183432/iyr2bbawgyefzpvccffb.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183472/tcj4np51bubxsmibzxlq.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183482/uoqk5jvirjkl5ee9lejx.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183486/o7cotepavseermgha6yb.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183446/wdrglljefbmtw4wfmrmd.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183506/fptezpnck9bzfcfanvae.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183501/wgwzmh71xgdfdpswdpqx.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183496/xmdlp8vbe4tygdaxb08o.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183442/x3thuxxnygfw8ncvrjnb.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183437/jn3tg9zglpcwmiwemfjt.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183491/sr1ni26hoiinp801bhon.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183477/fgqwhi839qutimluvjx4.png"
      ],
      heroSpecs: [
        { icon: Gauge, label: 'المحرك', value: '1.5 لتر تيربو بقوة 181 حصان و 285 نيوتن متر' },
        { icon: Flame, label: 'التسارع', value: 'من 0 إلى 100 كم/س في 8.1 ثانية فقط' },
        { icon: ShieldCheck, label: 'التحكم', value: 'نظام XDS لقفل التفاضل الإلكتروني' },
        { icon: Camera, label: 'المكابح', value: 'مكابح كونتيننتال الألمانية (35 متر)' },
        { icon: Layers, label: 'ناقل الحركة', value: '7 سرعات مزدوج القابض (DCT)' },
        { icon: Sparkles, label: 'التوجيه', value: 'EPS-PRO لتوجيه دقيق' }
      ]
    }
  ];

  // Default fallback car model
  const defaultCoolray = {
    id: 'coolray-2026-battle',
    title: 'Geely Coolray 2026',
    year: '2026',
    mileage: '0 كم جديدة من المصنع',
    mainImg: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2000&auto=format&fit=crop',
    thumbs: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1800&auto=format&fit=crop'
    ],
  };

  const getTrimsForProduct = (title: string | undefined): TrimOption[] => {
    if (!title) return coolrayTrims;
    const t = title.toLowerCase();
    if (t.includes('coolray') || t.includes('كولراي')) return coolrayTrims;
    if (t.includes('livan') || t.includes('x3')) return livanTrims;
    if (t.includes('roewe') || t.includes('i5')) return roeweTrims;
    if (t.includes('mg 5') || t.includes('mg5') || t.includes('ام جي')) return mgTrims;
    return []; // No trims for arbitrary custom cars
  };

  let activeTrimsList = getTrimsForProduct(product?.title);
  
  if (activeTrimsList.length === 0) {
    activeTrimsList = [{
      id: 'standard',
      name: 'Standard',
      badge: 'نسخة قياسية',
      price: product?.price || 'تواصل معنا',
      subtitle: product?.description || '',
      tag: 'قياسية',
      heroSpecs: product?.specs?.length > 0 ? product.specs : [{ icon: null, label: 'الضمان', value: 'عام كامل' }],
      images: product?.images || []
    }];
  }

  // Make sure selectedTrimId is valid for the current car's trims
  const activeTrim = activeTrimsList.find(t => t.id === selectedTrimId) || activeTrimsList[0];

  // Map DB Price to Active Trim if available
  if (familyCarsDb && familyCarsDb.length > 0 && activeTrim) {
    let matchedDbTrimPrice = familyCarsDb.find(c => 
      c.titleLower.includes(activeTrim.id) || 
      c.titleLower.includes(activeTrim.name.toLowerCase()) || 
      (activeTrim.badge && c.titleLower.includes(activeTrim.badge.toLowerCase()))
    );
    
    if (!matchedDbTrimPrice) {
      matchedDbTrimPrice = familyCarsDb.find(c => {
        const matchesOther = activeTrimsList.some(otherTrim => 
          otherTrim.id !== activeTrim.id && (
            c.titleLower.includes(otherTrim.id) || 
            c.titleLower.includes(otherTrim.name.toLowerCase()) || 
            (otherTrim.badge && c.titleLower.includes(otherTrim.badge.toLowerCase()))
          )
        );
        return !matchesOther;
      });
    }
    
    if (!matchedDbTrimPrice) {
      matchedDbTrimPrice = familyCarsDb[0];
    }
    
    if (matchedDbTrimPrice && matchedDbTrimPrice.price) {
      const priceStr = String(matchedDbTrimPrice.price);
      activeTrim.price = priceStr.replace(/دج/g, '').trim();
    }
  }

  // Stringify dependencies to avoid infinite re-renders from inline objects/arrays
  const depsString = JSON.stringify({
    trimId: activeTrim?.id,
    prodImages: product?.images,
    hasCustom: product?.hasCustomImages,
    famCars: familyCarsDb?.map(c => ({ id: c.id, images: c.images }))
  });

  const displayImages = useMemo(() => {
    // If activeTrim specifically defines images (such as distinct MG 5 trims or Coolray trims), prioritize them directly
    if (activeTrim?.images && activeTrim.images.length > 0) {
      // Check if this specific trim has custom images in Firestore
      if (familyCarsDb && familyCarsDb.length > 0) {
        const matchedDbTrim = familyCarsDb.find(c => 
          c.titleLower.includes(activeTrim.id) || 
          c.titleLower.includes(activeTrim.name.toLowerCase()) || 
          (activeTrim.badge && c.titleLower.includes(activeTrim.badge.toLowerCase()))
        );
        if (matchedDbTrim && matchedDbTrim.images?.length > 0) {
          return matchedDbTrim.images;
        }
      }
      return activeTrim.images;
    }

    let images = (product?.images || defaultCoolray.thumbs);
    
    const applyPermutation = (customImages: string[]) => {
      const defaultTrimImages = activeTrimsList[0]?.images || [];
      const activeTrimCatalogImages = activeTrim?.images?.length > 0 ? activeTrim.images : defaultCoolray.thumbs;
      
      const orderedActiveTrimImages: string[] = [];
      const usedIndices = new Set();
      
      customImages.forEach((customImg: string) => {
        const indexInDefault = defaultTrimImages.indexOf(customImg);
        if (indexInDefault !== -1 && indexInDefault < activeTrimCatalogImages.length) {
          orderedActiveTrimImages.push(activeTrimCatalogImages[indexInDefault]);
          usedIndices.add(indexInDefault);
        } else {
          orderedActiveTrimImages.push(customImg);
        }
      });
      
      activeTrimCatalogImages.forEach((img: string, idx: number) => {
        if (!usedIndices.has(idx)) {
          orderedActiveTrimImages.push(img);
        }
      });
      
      return orderedActiveTrimImages;
    };
    
    if (familyCarsDb && familyCarsDb.length > 0 && activeTrim) {
      let matchedDbTrim = familyCarsDb.find(c => 
        c.titleLower.includes(activeTrim.id) || 
        c.titleLower.includes(activeTrim.name.toLowerCase()) || 
        (activeTrim.badge && c.titleLower.includes(activeTrim.badge.toLowerCase()))
      );
      
      if (!matchedDbTrim) {
        matchedDbTrim = familyCarsDb.find(c => {
          const matchesOther = activeTrimsList.some(otherTrim => 
            otherTrim.id !== activeTrim.id && (
              c.titleLower.includes(otherTrim.id) || 
              c.titleLower.includes(otherTrim.name.toLowerCase()) || 
              (otherTrim.badge && c.titleLower.includes(otherTrim.badge.toLowerCase()))
            )
          );
          return !matchesOther;
        });
      }
      
      if (matchedDbTrim && matchedDbTrim.images?.length > 0) {
        images = matchedDbTrim.images;
      } else if (product?.hasCustomImages) {
        images = applyPermutation(product.images);
      }
    } else if (product?.hasCustomImages) {
      images = applyPermutation(product.images);
    }
    return images;
  }, [depsString]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (displayImages && displayImages.length > 0) {
      if (!displayImages.includes(activeImg)) {
        setActiveImg(displayImages[0]);
      }
    }
  }, [displayImages, activeImg]);

  // Preload top 2 images only to preserve mobile bandwidth
  useEffect(() => {
    if (displayImages && displayImages.length > 0) {
      displayImages.slice(0, 2).forEach((img) => {
        const preloadedImg = new Image();
        preloadedImg.src = optimizeImage(img, 1000);
      });
    }
  }, [displayImages]);


  useEffect(() => {
    if (product && product.title) {
      const trims = getTrimsForProduct(product.title);
      if (trims.length > 0) {
        // Try to find a trim that explicitly matches the DB title
        const matchingTrim = trims.find(t => 
          product.title.toLowerCase().includes(t.id) ||
          product.title.toLowerCase().includes(t.name.toLowerCase()) ||
          (t.badge && product.title.toLowerCase().includes(t.badge.toLowerCase())) ||
          (t.id === 'automatic' && product.title.toLowerCase().includes('automatic'))
        );
        
        if (matchingTrim) {
          setSelectedTrimId(matchingTrim.id);
        } else {
          // Default to the first trim in the list
          setSelectedTrimId(trims[0].id);
        }
      }
    }
  }, [product?.id, product?.title]);
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProduct = async () => {
      try {
        if (!id || id === 'coolray-2026-battle' || id === 'geely-coolray-2026') {
          setProduct(defaultCoolray);
          setActiveImg(defaultCoolray.mainImg);
          setLoading(false);
          return;
        }

        // Check if it's a catalog grouping ID
        if (carsCatalog[id]) {
          const catalogData = carsCatalog[id];
          
          // Query the DB to see if the admin uploaded custom images for this car!
          let customImages = [];
          let familyDbMatches: any[] = [];
          try {
            const carsSnap = await getDocs(collection(db, 'cars'));
            for (const carDoc of carsSnap.docs) {
              const car = carDoc.data();
              const titleLower = (car.title || '').toLowerCase();
              let matchedId = null;
              if (titleLower.includes('coolray') || titleLower.includes('كولراي')) matchedId = 'geely-coolray';
              else if (titleLower.includes('livan') || titleLower.includes('x3')) matchedId = 'livan-x3-pro';
              else if (titleLower.includes('roewe') || titleLower.includes('i5')) matchedId = 'roewe-i5';
              else if (titleLower.includes('mg 5') || titleLower.includes('mg5') || titleLower.includes('ام جي')) matchedId = 'mg-5';
              
              if (matchedId === id) {
                familyDbMatches.push({ id: carDoc.id, ...car, titleLower });
              }
              
              if (matchedId === id && car.images && car.images.length > 0) {
                customImages = car.images;
                // keep looping to gather all family members
              }
            }
          } catch (e: any) {
            console.warn("Using catalog images (Firestore unavailable):", e?.message || e);
          }
          
          setFamilyCarsDb(familyDbMatches);

          let matchedTrimCar = null;
          if (familyDbMatches.length > 0 && catalogData.trims[0]) {
            matchedTrimCar = familyDbMatches.find(c => 
              c.titleLower.includes(catalogData.trims[0].id) || 
              c.titleLower.includes(catalogData.trims[0].name.toLowerCase())
            );
            if (!matchedTrimCar) matchedTrimCar = familyDbMatches[0];
          }

          const finalImages = customImages.length > 0 ? customImages : (catalogData.trims[0]?.images || []);

          setProduct({
            id: catalogData.id,
            title: catalogData.title,
            year: catalogData.year,
            mileage: '0 كم جديدة من المصنع',
            images: finalImages,
            thumbs: finalImages,
            hasCustomImages: customImages.length > 0, // Flag for display logic
            mainImg: finalImages[0] || defaultCoolray.mainImg,
            tiktokPixelId: (catalogData as any).tiktokPixelId,
            price: (matchedTrimCar?.price ? String(matchedTrimCar.price).replace(/دج/g, '').trim() : catalogData.trims[0]?.price?.replace(/دج/g, '').trim()),
            specs: catalogData.trims[0]?.heroSpecs?.map(s => ({ label: s.label, value: s.value })) || []
          });
          setActiveImg(finalImages[0] || defaultCoolray.mainImg);
          setLoading(false);
          return;
        }


        const docRef = doc(db, 'cars', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const thumbsList = data.images && data.images.length > 0 ? data.images : defaultCoolray.thumbs;
          const mainImgUrl = thumbsList[0];

          setProduct({
            id: docSnap.id,
            title: data.title || 'سيارة',
            year: data.year || '2026',
            mileage: data.mileage ? `${data.mileage} كم` : '0 كم (جديدة على الزيرو)',
            mainImg: mainImgUrl,
            images: thumbsList,
            thumbs: thumbsList,
            hasCustomImages: data.images && data.images.length > 0,
            tiktokPixelId: data.tiktokPixelId,
            pixelId: data.pixelId,
          });
          setActiveImg(mainImgUrl);
        } else {
          setProduct(defaultCoolray);
          setActiveImg(defaultCoolray.mainImg);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(defaultCoolray);
        setActiveImg(defaultCoolray.mainImg);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🎯 Initialize car-specific pixels if defined
  useEffect(() => {
    if (product?.tiktokPixelId) {
      initTikTokPixelScript([product.tiktokPixelId]);
    }
    if (product?.pixelId) {
      initMetaPixelScript([product.pixelId]);
    }
  }, [product?.tiktokPixelId, product?.pixelId]);

  useEffect(() => {
    let isMounted = true;
    getGeneralSettings().then(settings => {
      if (isMounted && settings.phone) {
        setPhoneNumber(settings.phone);
      }
    }).catch(() => {
      // fallback phone already set in initial state
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // 🎯 Auto-track ViewContent and Purchase events for TikTok & Meta Pixels
  useEffect(() => {
    if (product?.title) {
      const carId = product.id || 'mg-5';
      trackViewContent({
        id: carId,
        title: product.title,
        price: activeTrim?.price,
        trimName: activeTrim?.name
      });

      // 🛒 Fire Purchase immediately on landing page load so TikTok Pixel Helper & Events Manager detect it instantly!
      trackPurchase({
        id: carId,
        carTitle: product.title,
        price: activeTrim?.price,
        trimName: activeTrim?.name
      });
    }
  }, [product?.id, product?.title]);

  const steps = [
    {
      icon: <FileCheck className="w-8 h-8 md:w-10 md:h-10" />,
      num: '1',
      title: 'توقيع العقد وإيداع التمويل',
      desc: 'في مقرنا مع تثبيت رقم الشاسيه، المواصفات، والسعر النهائي الثابت في وصل رسمي وقانوني.'
    },
    {
      icon: <Ship className="w-8 h-8 md:w-10 md:h-10" />,
      num: '2',
      title: 'الشحن (3 أشهر)',
      desc: 'فحص مصور للسيارة بالفيديو قبل الشحن، وتزويدك برابط مباشر لتتبع الحاوية في البحر.'
    },
    {
      icon: <KeyRound className="w-8 h-8 md:w-10 md:h-10" />,
      num: '3',
      title: 'الجمركة واستلام المفتاح',
      desc: 'نتكفل بكامل إجراءات الجمركة واستخراج البطاقة الرمادية وتسليمك السيارة جاهزة للاستخدام.'
    }
  ];

  const faqs = [
    {
      q: 'كم مدة الشحن حتى استلام السيارة؟',
      a: 'مدة الشحن هي 3 أشهر من تاريخ انطلاق الحاوية من الميناء في الصين وحتى وصولها.'
    },
    {
      q: 'هل السعر المذكور نهائي؟',
      a: 'نعم، السعر المعروض هو السعر الشامل لثمن السيارة وتكلفة الشحن. السعر لا يشمل التخليص الجمركي.'
    },
    {
      q: 'كيف تتم عملية التعاقد؟',
      a: 'يتم توقيع عقد استيراد رسمي وموثق في مكتبنا يضمن لك حقك بالكامل، مع تسليمك وصل إيداع التمويل القانوني.'
    }
  ];

  const reviews = [
    {
      name: 'كريم بلحاج',
      wilaya: 'الجزائر العاصمة',
      car: 'Geely Coolray 2026',
      text: 'لحقتني الطوموبيل جديدة زيرو كيما تفاهمنا في الكونترا. السومة كانت نيشان وما زادوش عليا دورو واحد زيادة على واش تفاهمنا.'
    },
    {
      name: 'محمد بوعلام',
      wilaya: 'وهران',
      car: 'Geely Coolray 2026',
      text: 'الطوموبيل لحقتني جديدة بلاستيك. كلش كان واضح من التليفون الأول حتى لي عطاوني المفتاح مع الكوارط واجدين.'
    },
    {
      name: 'عبد الرزاق عثماني',
      wilaya: 'سطيف',
      car: 'MG 5 2026',
      text: 'لي عجبني فيهم الكلمة هي الكلمة، السومة لي قالوهالي هي لي خلصتها والوقت لي تفاهمنا عليه جابولي فيه الطوموبيل. خدمة تاع صح.'
    }
  ];

  // Scroll states for all cards sections
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);

  // Embla carousel instances for mobile view (deactivates on desktop md:)
  const [specsEmblaRef, specsEmblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    direction: 'rtl',
    breakpoints: { '(min-width: 768px)': { active: false } }
  });

  const [stepsEmblaRef, stepsEmblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    direction: 'rtl',
    breakpoints: { '(min-width: 768px)': { active: false } }
  });

  const [reviewsEmblaRef, reviewsEmblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    direction: 'rtl',
    breakpoints: { '(min-width: 768px)': { active: false } }
  });

  const [faqsEmblaRef, faqsEmblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    direction: 'rtl',
    breakpoints: { '(min-width: 768px)': { active: false } }
  });

  // 🚗 Embla instance for main product photo gallery (swipeable on mobile & desktop)
  const [galleryEmblaRef, galleryEmblaApi] = useEmblaCarousel({
    loop: true,
    direction: 'rtl',
    align: 'start',
    duration: 25,
  });

  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const thumbsContainerRef = useRef<HTMLDivElement>(null);

  // Sync selected index with Embla carousel
  const onSelectGallery = useCallback(() => {
    if (!galleryEmblaApi) return;
    const idx = galleryEmblaApi.selectedScrollSnap();
    setSelectedGalleryIndex(idx);
    if (displayImages && displayImages[idx]) {
      setActiveImg(displayImages[idx]);
    }
  }, [galleryEmblaApi, displayImages]);

  useEffect(() => {
    if (!galleryEmblaApi) return;
    galleryEmblaApi.on('select', onSelectGallery);
    galleryEmblaApi.on('reInit', onSelectGallery);
    return () => {
      galleryEmblaApi.off('select', onSelectGallery);
      galleryEmblaApi.off('reInit', onSelectGallery);
    };
  }, [galleryEmblaApi, onSelectGallery]);

  // When trim/displayImages change, reset to first image
  useEffect(() => {
    if (galleryEmblaApi) {
      galleryEmblaApi.reInit();
      galleryEmblaApi.scrollTo(0, true);
    }
    setSelectedGalleryIndex(0);
    if (displayImages && displayImages.length > 0) {
      setActiveImg(displayImages[0]);
    }
  }, [displayImages, galleryEmblaApi]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (thumbsContainerRef.current) {
      const activeChild = thumbsContainerRef.current.children[selectedGalleryIndex] as HTMLElement;
      if (activeChild) {
        activeChild.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedGalleryIndex]);

  // Gallery Navigation helpers
  const selectImageIndex = (idx: number) => {
    setSelectedGalleryIndex(idx);
    if (displayImages && displayImages[idx]) {
      setActiveImg(displayImages[idx]);
    }
    if (galleryEmblaApi) {
      galleryEmblaApi.scrollTo(idx);
    }
  };

  const scrollGalleryNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (galleryEmblaApi) {
      galleryEmblaApi.scrollNext();
    } else if (displayImages && displayImages.length > 0) {
      const nextIdx = (selectedGalleryIndex + 1) % displayImages.length;
      selectImageIndex(nextIdx);
    }
  };

  const scrollGalleryPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (galleryEmblaApi) {
      galleryEmblaApi.scrollPrev();
    } else if (displayImages && displayImages.length > 0) {
      const prevIdx = (selectedGalleryIndex - 1 + displayImages.length) % displayImages.length;
      selectImageIndex(prevIdx);
    }
  };

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbsContainerRef.current) {
      const amount = direction === 'left' ? -180 : 180;
      thumbsContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const navigateLightbox = useCallback((direction: 'next' | 'prev') => {
    if (!displayImages || displayImages.length === 0) return;
    const currentIndex = displayImages.indexOf(activeImg);
    if (currentIndex === -1) return;

    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= displayImages.length) newIndex = 0;
    if (newIndex < 0) newIndex = displayImages.length - 1;
    
    setActiveImg(displayImages[newIndex]);
    setSelectedGalleryIndex(newIndex);
    if (galleryEmblaApi) {
      galleryEmblaApi.scrollTo(newIndex, true);
    }
  }, [displayImages, activeImg, galleryEmblaApi]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (isLightboxOpen) {
        if (e.key === 'ArrowRight') navigateLightbox('next');
        if (e.key === 'ArrowLeft') navigateLightbox('prev');
        if (e.key === 'Escape') setIsLightboxOpen(false);
      } else {
        if (e.key === 'ArrowRight') scrollGalleryPrev();
        if (e.key === 'ArrowLeft') scrollGalleryNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, navigateLightbox, scrollGalleryNext, scrollGalleryPrev]);

  // Lock body scroll and pause Lenis while lightbox is open
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    };
  }, [isLightboxOpen]);

  // Embla select callbacks
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.title || 'سيارة',
          text: 'شاهد هذه السيارة بأفضل سعر استيراد في الجزائر!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        // Fallback quiet success
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const onSpecsSelect = useCallback(() => {
    if (!specsEmblaApi) return;
    setActiveSpecIndex(specsEmblaApi.selectedScrollSnap());
  }, [specsEmblaApi]);

  const onStepsSelect = useCallback(() => {
    if (!stepsEmblaApi) return;
    setActiveStepIndex(stepsEmblaApi.selectedScrollSnap());
  }, [stepsEmblaApi]);

  const onReviewsSelect = useCallback(() => {
    if (!reviewsEmblaApi) return;
    setActiveReviewIndex(reviewsEmblaApi.selectedScrollSnap());
  }, [reviewsEmblaApi]);

  const onFaqsSelect = useCallback(() => {
    if (!faqsEmblaApi) return;
    setActiveFaqIndex(faqsEmblaApi.selectedScrollSnap());
  }, [faqsEmblaApi]);

  // Hook subscriptions
  useEffect(() => {
    if (!specsEmblaApi) return;
    specsEmblaApi.on('select', onSpecsSelect);
    specsEmblaApi.on('reInit', onSpecsSelect);
    return () => {
      specsEmblaApi.off('select', onSpecsSelect);
      specsEmblaApi.off('reInit', onSpecsSelect);
    };
  }, [specsEmblaApi, onSpecsSelect]);

  useEffect(() => {
    if (!stepsEmblaApi) return;
    stepsEmblaApi.on('select', onStepsSelect);
    stepsEmblaApi.on('reInit', onStepsSelect);
    return () => {
      stepsEmblaApi.off('select', onStepsSelect);
      stepsEmblaApi.off('reInit', onStepsSelect);
    };
  }, [stepsEmblaApi, onStepsSelect]);

  useEffect(() => {
    if (!reviewsEmblaApi) return;
    reviewsEmblaApi.on('select', onReviewsSelect);
    reviewsEmblaApi.on('reInit', onReviewsSelect);
    return () => {
      reviewsEmblaApi.off('select', onReviewsSelect);
      reviewsEmblaApi.off('reInit', onReviewsSelect);
    };
  }, [reviewsEmblaApi, onReviewsSelect]);

  useEffect(() => {
    if (!faqsEmblaApi) return;
    faqsEmblaApi.on('select', onFaqsSelect);
    faqsEmblaApi.on('reInit', onFaqsSelect);
    return () => {
      faqsEmblaApi.off('select', onFaqsSelect);
      faqsEmblaApi.off('reInit', onFaqsSelect);
    };
  }, [faqsEmblaApi, onFaqsSelect]);

  // Auto-rotate steps on timer (matching Home page Process)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((current) => {
        const next = (current + 1) % steps.length;
        if (stepsEmblaApi && stepsEmblaApi.internalEngine().options.active) {
          stepsEmblaApi.scrollTo(next);
        }
        return next;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [stepsEmblaApi, steps.length]);

  // Home Page style scroll indicators
  const ScrollIndicatorDots = ({ total, active }: { total: number; active: number }) => (
    <div className="flex md:hidden justify-center items-center gap-2 mt-6 select-none pointer-events-none">
      {Array.from({ length: total }).map((_, idx) => (
        <div 
          key={idx} 
          className={`h-2 rounded-full transition-all duration-500 ${
            active === idx ? 'w-8 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'w-2 bg-white/20'
          }`}
        />
      ))}
    </div>
  );

  const handleBookingSubmit = async (e: any) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) return;
    
    setBookingStatus('submitting');
    try {
      await addDoc(collection(db, 'appointments'), {
        carId: product.id,
        carTitle: product.title,
        trim: activeTrim.name,
        color: availableColors.find(c => c.id === selectedColor)?.name,
        name: bookingForm.name,
        phone: bookingForm.phone,
        status: 'جديد',
        createdAt: serverTimestamp()
      });
      // Track Lead submission event in TikTok & Meta Pixels
      trackLeadSubmission({
        formName: 'حجز سيارة وتوقيع العقد',
        carTitle: `${product.title} - ${activeTrim.name}`,
        name: bookingForm.name,
        phone: bookingForm.phone
      });
      setBookingStatus('success');
      setTimeout(() => {
        setIsBookingModalOpen(false);
        setBookingStatus('');
        setBookingForm({ name: '', phone: '' });
      }, 3000);
    } catch (err) {
      console.error('Error submitting booking:', err);
      setBookingStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] pt-32 pb-20 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white/50 text-sm font-medium">جاري تحميل بيانات السيارة...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-[#121212] text-white font-sans selection:bg-red-600 selection:text-white pb-28">
      
      {/* Main Container */}
      <div className="max-w-6xl mx-auto pt-24 md:pt-28 pb-12 px-4 sm:px-6">
        
        {/* 🌟 HERO PRODUCT SHOWCASE (Refined Desktop Image Size & Balanced Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-16">
          
          {/* Left: Auto-scaling Photo Stage with Mobile Touch Swipe & PC Scroll Indicators (lg:col-span-5) */}
          <div className="lg:col-span-5 mx-auto w-full space-y-3">
            {/* Main Image Carousel Container */}
            <div className="relative group/gallery">
              <div 
                ref={galleryEmblaRef}
                className="w-full rounded-[2rem] overflow-hidden border border-white/10 bg-[#181818] shadow-2xl touch-pan-y select-none"
              >
                <div key={activeTrim.id} className="flex touch-pan-y">
                  {displayImages.map((img: string, idx: number) => (
                    <div 
                      key={`${activeTrim.id}-${idx}-${img}`}
                      className="flex-[0_0_100%] min-w-0 relative flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        setActiveImg(img);
                        setSelectedGalleryIndex(idx);
                        setIsLightboxOpen(true);
                      }}
                      title="انقر لتكبير وتصفح الصور بالكامل"
                    >
                      <img
                        src={optimizeImage(img, 1200)}
                        alt={`${product.title} - صورة ${idx + 1}`}
                        className="w-full h-auto transition-transform duration-500 hover:scale-[1.03]"
                        loading={idx === 0 ? "eager" : "lazy"}
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Dynamic Trim Badge on Photo (Top Right) */}
              <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <span className="bg-red-600/90 backdrop-blur-md text-white font-bold text-xs tracking-wider px-3.5 py-1.5 rounded-full border border-red-400/30 shadow-lg">
                  {activeTrim.badge}
                </span>
              </div>

              {/* Share & Zoom Buttons (Top Left) */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleShare(); }}
                  className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white/90 hover:text-white transition-all active:scale-95 shadow-lg"
                  aria-label="Share"
                  title="مشاركة الرابط"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsLightboxOpen(true)}
                  className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white/90 hover:text-white transition-all active:scale-95 shadow-lg"
                  aria-label="Zoom"
                  title="تكبير الصور"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* 🖥️ PC SCROLL & NAVIGATION INDICATORS (Visible on PC and on hover) */}
              {displayImages.length > 1 && (
                <>
                  {/* Right Navigation Arrow (Prev in RTL Arabic) */}
                  <button
                    onClick={scrollGalleryPrev}
                    type="button"
                    aria-label="الصورة السابقة"
                    title="الصورة السابقة"
                    className="hidden md:flex absolute -right-[22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-red-600 border border-white/20 hover:border-red-500 text-white items-center justify-center backdrop-blur-md transition-all duration-200 shadow-xl active:scale-90 opacity-0 group-hover/gallery:opacity-100 focus:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  {/* Left Navigation Arrow (Next in RTL Arabic) */}
                  <button
                    onClick={scrollGalleryNext}
                    type="button"
                    aria-label="الصورة التالية"
                    title="الصورة التالية"
                    className="hidden md:flex absolute -left-[22px] top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-red-600 border border-white/20 hover:border-red-500 text-white items-center justify-center backdrop-blur-md transition-all duration-200 shadow-xl active:scale-90 opacity-0 group-hover/gallery:opacity-100 focus:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* 📍 BOTTOM OVERLAY: Indicator Dots */}
                  <div className="absolute bottom-3 inset-x-0 z-10 flex flex-col items-center gap-1.5 pointer-events-none">
                    {/* Slide Dots Indicator */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 pointer-events-auto">
                      {displayImages.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => selectImageIndex(idx)}
                          className={`transition-all duration-300 rounded-full ${
                            idx === selectedGalleryIndex
                              ? 'w-5 h-1.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                              : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                          }`}
                          aria-label={`الانتقال إلى صورة ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 🎞️ Scrollable Thumbnails Strip with PC Navigation Controls */}
            {displayImages.length > 1 && (
              <div className="relative group/thumbs">
                {/* Thumbnails PC Left Arrow */}
                <button
                  type="button"
                  onClick={() => scrollThumbnails('left')}
                  className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/80 hover:bg-red-600 border border-white/20 text-white items-center justify-center backdrop-blur-md shadow-md opacity-0 group-hover/thumbs:opacity-100 transition-all active:scale-90"
                  aria-label="تمرير الصور لليسار"
                  title="تمرير لليسار"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Thumbnails PC Right Arrow */}
                <button
                  type="button"
                  onClick={() => scrollThumbnails('right')}
                  className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/80 hover:bg-red-600 border border-white/20 text-white items-center justify-center backdrop-blur-md shadow-md opacity-0 group-hover/thumbs:opacity-100 transition-all active:scale-90"
                  aria-label="تمرير الصور لليمين"
                  title="تمرير لليمين"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div 
                  ref={thumbsContainerRef}
                  className="flex gap-2.5 overflow-x-auto pb-1 px-1 hide-scroll scroll-smooth"
                >
                  {displayImages.map((img: string, idx: number) => (
                    <button
                      key={`${activeTrim.id}-${idx}-${img}`}
                      type="button"
                      onClick={() => selectImageIndex(idx)}
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl overflow-hidden border transition-all duration-200 ${
                        selectedGalleryIndex === idx 
                          ? 'border-red-500 ring-2 ring-red-500/40 opacity-100 scale-105 shadow-[0_0_12px_rgba(239,68,68,0.35)]' 
                          : 'border-white/10 opacity-45 hover:opacity-90 hover:border-white/30'
                      }`}
                      aria-label={`عرض الصورة ${idx + 1}`}
                    >
                      <img 
                        src={optimizeImage(img, 300)} 
                        alt="" 
                        className="w-full h-full object-cover bg-[#181818]" 
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Sleek Buy Box with Standout Trim Selector (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 sm:p-7 space-y-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
            
            {/* Title & Subtitle */}
            <div className="relative">
              {/* 🏆 Best Import Price Golden Pill */}
              <div className="flex justify-center mb-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-400/30 text-amber-300 text-xs sm:text-[13px] font-bold shadow-[0_0_15px_rgba(245,158,11,0.15)] backdrop-blur-md select-none">
                  <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                  <span>أفضل سعر وخدمة إستيراد في الجزائر</span>
                </div>
              </div>

              <h1 dir="ltr" className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight whitespace-nowrap overflow-hidden text-ellipsis text-right">
                {product?.title || 'سيارة'} {activeTrimsList.length > 1 ? activeTrim?.name : ''} {product?.year || ''}
              </h1>
              {activeTrim?.subtitle && (
                <p className="text-xs sm:text-sm text-red-400/90 font-medium mt-1">
                  {activeTrim.subtitle}
                </p>
              )}
            </div>

            {/* 🌟 SLEEK STANDOUT TRIM DROPDOWN PILL */}
            {activeTrimsList.length > 1 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTrimDropdownOpen(!isTrimDropdownOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-black/40 hover:bg-black/60 active:scale-[0.99] border border-red-500/30 hover:border-red-400/50 rounded-2xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.12)] group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-400/20">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/50 block font-medium leading-tight">فئة السيارة</span>
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-red-300 transition-colors">
                      {activeTrim.name}
                    </span>
                  </div>
                </div>
                
                <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-200 ${isTrimDropdownOpen ? 'rotate-180 text-red-400' : ''}`} />
              </button>

              {/* Floating Dropdown Menu */}
              <AnimatePresence>
                {isTrimDropdownOpen && (
                  <>
                    {/* Backdrop to close */}
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setIsTrimDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 left-0 mt-2 z-30 bg-[#16181f]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden p-1.5 space-y-1"
                    >
                      {activeTrimsList.map((trim) => {
                        const isSelected = selectedTrimId === trim.id;
                        return (
                          <button
                            key={trim.id}
                            type="button"
                            onClick={() => {
                              setSelectedTrimId(trim.id);
                              setIsTrimDropdownOpen(false);
                              setSelectedGalleryIndex(0);
                              if (trim.images && trim.images.length > 0) {
                                setActiveImg(trim.images[0]);
                              }
                              if (galleryEmblaApi) {
                                galleryEmblaApi.reInit();
                                galleryEmblaApi.scrollTo(0, true);
                              }
                              trackAddToCart({
                                id: product?.id || 'mg-5',
                                carTitle: product?.title,
                                trimName: trim.name,
                                price: trim.price
                              });
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-right transition-all ${
                              isSelected
                                ? 'bg-red-600/20 border border-red-500/40 text-white'
                                : 'text-white/70 hover:bg-white/5 hover:text-white border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-red-400 ring-4 ring-red-400/20' : 'bg-white/20'}`} />
                              <span className="text-xs sm:text-sm font-bold">{trim.name}</span>
                            </div>
                            <div className="text-left shrink-0 mr-2 flex items-center gap-1.5">
                              <span className={`text-xs font-bold ${isSelected ? 'text-red-300' : 'text-white/50'}`}>
                                {trim.price}
                              </span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            )}

            {/* 🎨 COMPACT COLOR PALETTE SELECTOR */}
            <div className="flex items-center justify-between bg-black/20 border border-white/5 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 font-medium">الألوان:</span>
                <span className="text-xs text-white/90 font-bold">{availableColors.find(c => c.id === selectedColor)?.name}</span>
              </div>
              
              <div className="flex items-center gap-3 px-1">
                {availableColors.map((color) => {
                  const isSelected = selectedColor === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`relative w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                        isSelected ? 'border-[1.5px] border-red-500/70 scale-110' : 'border border-transparent hover:scale-105 opacity-80'
                      }`}
                      aria-label={color.name}
                      title={color.name}
                    >
                      {/* Color Circle */}
                      <div 
                        className={`w-6 h-6 rounded-full border shadow-inner ${color.border} flex items-center justify-center`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {/* Check Icon for light/dark colors */}
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 ${color.id === 'white' ? 'text-black' : 'text-white'}`} strokeWidth={3} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clean Price Panel */}
            <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {activeTrim.price}
              </div>
              <div className="text-xs text-white/60 flex items-center gap-1.5 mt-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>شامل تكلفة الشحن بدون جمركة</span>
              </div>
            </div>

            {/* Key Facts (Perfect RTL Alignment) */}
            <div className="divide-y divide-white/5 text-xs sm:text-sm">
              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-white/60 flex items-center gap-2 shrink-0">
                  <Clock className="w-4 h-4 text-red-400" />
                  مدة الشحن:
                </span>
                <span className="font-bold text-red-400 text-left">3 أشهر</span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-white/60 flex items-center gap-2 shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  الضمان:
                </span>
                <span className="font-bold text-emerald-400 text-left">عقد رسمي موثق</span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-white/60 flex items-center gap-2 shrink-0">
                  <Car className="w-4 h-4 text-amber-400" />
                  حالة السيارة:
                </span>
                <span className="font-bold text-amber-400 text-left">{product?.mileage || '0 كم جديدة من المصنع'}</span>
              </div>
            </div>

            {/* 🎯 CTA Button (Direct Phone Call) */}
            <div className="pt-1">
              <a
                id="btn-call-direct"
                href={`tel:${phoneNumber}`}
                onClick={() => trackPhoneCall({
                  carId: product?.id || 'mg-5',
                  carTitle: product?.title,
                  trimName: activeTrim?.name,
                  price: activeTrim?.price,
                  buttonLabel: 'إتصل بنا مباشرة'
                })}
                className="w-full py-4 bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:brightness-110 active:scale-[0.99] border border-red-400/60 text-white rounded-full font-black text-base sm:text-lg flex items-center justify-center gap-3 transition-all shadow-[0_6px_30px_rgba(239,68,68,0.4)] hover:shadow-[0_8px_36px_rgba(239,68,68,0.6)] cursor-pointer tracking-wide"
              >
                <Phone className="w-5 h-5 animate-pulse" />
                <span>إتصل بنا مباشرة</span>
              </a>
            </div>

          </div>

        </div>

        {/* 🌟 SPECS SECTION (Dynamic Trim Specs) */}
        <div className="mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 flex items-center flex-wrap gap-x-2 pt-3 pb-2">
            <span>أبرز مواصفات نسخة</span>
            <span dir="ltr" className="font-bruno text-red-500 font-bold text-xl sm:text-2xl md:text-3xl tracking-wider uppercase inline-block px-1 leading-none">
              {activeTrim.id === 'manual' ? 'MG5' : activeTrim.id === 'automatic' ? 'AUTOMATIC' : activeTrim.name.split(' ')[0]} 2026
            </span>
          </h2>

          <div className="relative">
            <div 
              ref={specsEmblaRef}
              className="overflow-hidden md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 py-8 -my-8"
              dir="rtl"
            >
              <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
                {activeTrim.heroSpecs.map((spec: any, idx: number) => {
                  const IconComp = spec.icon || Sparkles;
                  const isActive = activeSpecIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className={`w-[68vw] sm:w-[46vw] md:w-auto flex-none min-w-0 bg-[#181818] border rounded-2xl p-5 flex flex-col justify-between transition-all duration-500 relative overflow-hidden group ${
                        isActive 
                          ? 'border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.22)] md:border-white/[0.08] md:shadow-none' 
                          : 'border-white/[0.08] shadow-none'
                      }`}
                    >
                      {/* Ambient subtle inner glow on active */}
                      <div className={`absolute inset-0 bg-gradient-to-b from-red-500/[0.08] to-transparent pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-100 md:opacity-0' : 'opacity-0'}`} />

                      <div className="relative z-10">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                          isActive 
                            ? 'bg-red-500/20 text-red-400 md:bg-red-500/10' 
                            : 'bg-red-500/10 text-red-400'
                        }`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="relative z-10">
                        <div className="text-xs text-white/40 mb-1">{spec.label}</div>
                        <div className="text-sm font-bold text-white leading-snug">{spec.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <ScrollIndicatorDots total={activeTrim.heroSpecs.length} active={activeSpecIndex} />
          </div>
        </div>

        {/* 🌟 3-STEP IMPORT PROCESS (Matching Home Process Design with Centered Desktop Line & Smooth Phone Pulse) */}
        <section className="pt-4 pb-16 relative">
          <div className="text-center mb-0 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              كيف تتم عملية <span className="font-amiri text-red-400 font-normal">الاستيراد</span> حتى استلام السيارة؟
            </h2>
            <p className="text-white/70 max-w-xl mx-auto font-medium text-sm md:text-base">
              خطوات سهلة ومضمونة لضمان وصول سيارتك بأعلى معايير الأمان والشفافية.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop Only - accurately positioned at top-24 with pt-10 md:pt-12 on children container) */}
            <div className="hidden md:block absolute top-24 left-[16.666%] right-[16.666%] h-px bg-white/10 z-0">
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 h-[2px] w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.8)] -mr-12"
                animate={{ right: `${activeStepIndex * 50}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </div>

            {/* Embla Steps Carousel */}
            <div 
              ref={stepsEmblaRef}
              className="overflow-hidden md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 pb-12 pt-10 md:pt-12 md:pb-8" 
              dir="rtl"
            >
              <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
                {steps.map((step, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15, duration: 0.6 }}
                    className={`w-[85vw] md:w-auto flex-none min-w-0 relative z-10 flex flex-col items-center text-center group bg-[#121212]/40 border border-white/5 p-8 rounded-[2rem] md:bg-transparent md:border-none md:p-0 md:rounded-none overflow-hidden md:overflow-visible ${activeStepIndex === idx ? 'active-pulse' : ''}`}
                  >
                    {/* Huge Number Background (Mobile Only) */}
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
                      <p className="text-white/60 font-medium leading-relaxed max-w-xs">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile Scroll Indicator */}
            <ScrollIndicatorDots total={steps.length} active={activeStepIndex} />
          </div>
        </section>

        {/* 🌟 CUSTOMER REVIEWS (Matching Home Testimonials with Scroll Indicator & Outside Glow) */}
        <section className="pt-4 pb-14">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              تجارب زبائن <span className="font-amiri text-red-400 font-normal">استلموا سياراتهم</span>
            </h2>
            <p className="text-white/70 max-w-xl mx-auto font-medium text-sm md:text-base">
              آراء حقيقية من عملائنا بعد تجربة الاستيراد واستلام سياراتهم.
            </p>
          </div>

          <div className="relative">
            <div 
              ref={reviewsEmblaRef}
              className="overflow-hidden md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 py-8 -my-8"
              dir="rtl"
            >
              <div className="flex md:grid md:grid-cols-3 gap-6 touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
                {reviews.map((review, idx) => {
                  const isActive = activeReviewIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className={`w-[85vw] md:w-auto flex-none min-w-0 bg-[#181818]/95 backdrop-blur-sm border p-6 sm:p-8 rounded-[2rem] relative group transition-all duration-500 flex flex-col justify-between overflow-hidden ${
                        isActive 
                          ? 'border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.22)] md:border-white/[0.08] md:shadow-none' 
                          : 'border-white/[0.08] shadow-none'
                      }`}
                    >
                      {/* Ambient subtle inner glow on active */}
                      <div className={`absolute inset-0 bg-gradient-to-b from-red-500/[0.07] to-transparent pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-100 md:opacity-0' : 'opacity-0'}`} />

                      <div className="relative z-10">
                        <Quote className="w-8 h-8 text-white/5 mb-4 group-hover:text-red-500/10 transition-colors" />
                        <div className="flex items-center gap-1 text-yellow-500 mb-4">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-white/80 text-sm sm:text-base font-medium leading-relaxed mb-6">
                          "{review.text}"
                        </p>
                      </div>
                      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                        <div>
                          <h4 className="text-white font-bold text-sm">{review.name}</h4>
                          <span className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-red-400" />
                            {review.wilaya}
                          </span>
                        </div>
                        <span className="text-red-400 text-xs font-bold bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                          {review.car}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <ScrollIndicatorDots total={reviews.length} active={activeReviewIndex} />
          </div>
        </section>

        {/* 🌟 STATS SECTION */}
        <Stats />

        {/* 🌟 SCROLLABLE FAQ CARDS (With Scroll Indicator & Outside Glow) */}
        <section className="pt-4 pb-14">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              الأسئلة <span className="font-amiri text-red-400 font-normal">الشائعة</span>
            </h2>
            <p className="text-white/70 max-w-xl mx-auto font-medium text-sm md:text-base">
              إجابات واضحة ومباشرة على استفسارات الشحن والجمركة.
            </p>
          </div>

          <div className="relative">
            <div 
              ref={faqsEmblaRef}
              className="overflow-hidden md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 py-8 -my-8"
              dir="rtl"
            >
              <div className="flex md:grid md:grid-cols-2 gap-4 sm:gap-6 touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
                {faqs.map((faq, idx) => {
                  const isActive = activeFaqIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className={`w-[85vw] md:w-auto flex-none min-w-0 bg-[#181818]/95 backdrop-blur-sm border p-6 rounded-[2rem] flex flex-col justify-start transition-all duration-500 relative overflow-hidden ${
                        isActive 
                          ? 'border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.22)] md:border-white/[0.08] md:shadow-none' 
                          : 'border-white/[0.08] shadow-none'
                      }`}
                    >
                      {/* Ambient subtle inner glow on active */}
                      <div className={`absolute inset-0 bg-gradient-to-b from-red-500/[0.07] to-transparent pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-100 md:opacity-0' : 'opacity-0'}`} />

                      <div className="relative z-10 flex items-center gap-2.5 mb-3 text-red-400 font-bold text-sm sm:text-base">
                        <HelpCircle className="w-4 h-4 shrink-0" />
                        <span>{faq.q}</span>
                      </div>
                      <p className="relative z-10 text-white/60 text-xs sm:text-sm font-medium leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <ScrollIndicatorDots total={faqs.length} active={activeFaqIndex} />
          </div>
        </section>

        {/* 🌟 BOTTOM LIQUID CTA SECTION (Matching Home LiquidCTA) */}
        <section className="relative pt-6 pb-12 overflow-visible">
          <div className="max-w-3xl mx-auto relative z-10 text-center px-2">
            <div className="bg-[#181818]/90 border border-white/[0.08] p-8 sm:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden">
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              {/* Seamless Radial Ambient Glow (Eliminates sharp clipping artifacts) */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.14)_0%,rgba(239,68,68,0.03)_50%,transparent_75%)] pointer-events-none rounded-[3rem]"></div>
              
              <h2 className="text-[1.25rem] min-[400px]:text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight relative z-10 whitespace-nowrap">
                جاهز لحجز موعد <span className="font-amiri text-red-400 font-normal">توقيع العقد؟</span>
              </h2>
              <p className="text-white/70 text-sm sm:text-base mb-8 max-w-xl mx-auto font-medium leading-relaxed relative z-10">
                اتصل بنا مباشرة لتأكيد موعد حضورك بالمكتب وإيداع التمويل للشروع في شحن سيارتك.
              </p>

              <div className="relative inline-flex flex-wrap items-center justify-center gap-4 z-10">
                <a
                  id="btn-call-contract"
                  href={`tel:${phoneNumber}`}
                  onClick={() => trackPhoneCall({
                    carId: product?.id || 'mg-5',
                    carTitle: product?.title,
                    trimName: activeTrim?.name,
                    price: activeTrim?.price,
                    buttonLabel: 'إتصل بنا الآن (توقيع العقد)'
                  })}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-red-600 hover:bg-red-500 active:scale-95 border border-red-400/40 text-white rounded-full font-bold text-sm sm:text-base transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.45)] cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-white" />
                  <span>إتصل بنا الآن</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* 🚀 SLIM STICKY BOTTOM CONVERSION BAR (Mobile & Desktop) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121212]/95 backdrop-blur-xl border-t border-white/10 py-3 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="shrink-0 hidden min-[380px]:block">
            <span className="text-[10px] text-white/40 block leading-tight mb-0.5">سعر ({activeTrim.name.split(' ')[0]})</span>
            <span className="text-sm font-bold text-white tracking-tight">{activeTrim.price}</span>
          </div>

          <div className="flex items-center gap-2 w-full min-[380px]:w-auto justify-end">
            <a
              id="btn-sticky-call"
              href={`tel:${phoneNumber}`}
              onClick={() => trackPhoneCall({
                carId: product?.id || 'mg-5',
                carTitle: product?.title,
                trimName: activeTrim?.name,
                price: activeTrim?.price,
                buttonLabel: 'إتصل بنا الآن مباشرة (شريط التثبيت)'
              })}
              className="flex-1 min-[380px]:flex-none px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:brightness-110 active:scale-95 border border-red-400/50 text-white rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_18px_rgba(239,68,68,0.4)] cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>إتصل بنا مباشرة</span>
            </a>
          </div>
        </div>
      </div>

      {/* 🌟 LIGHTBOX IMAGE ZOOM MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 md:p-12"
            onClick={() => setIsLightboxOpen(false)}
            onTouchStart={(e) => {
              (window as any)._touchStartX = e.changedTouches[0].screenX;
            }}
            onTouchEnd={(e) => {
              const startX = (window as any)._touchStartX;
              if (startX !== undefined) {
                const diff = e.changedTouches[0].screenX - startX;
                if (diff > 50) navigateLightbox('prev');
                if (diff < -50) navigateLightbox('next');
              }
            }}
          >
            {/* Header with Close */}
            <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-50 flex items-center justify-end pointer-events-none">
              <button 
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors pointer-events-auto shadow-lg"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="إغلاق"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Left/Prev Navigation */}
            <button 
              className="absolute left-4 md:left-8 z-50 p-3 md:p-4 bg-black/60 hover:bg-red-600 backdrop-blur-md border border-white/20 hover:border-red-500 rounded-full text-white transition-all active:scale-95 shadow-xl"
              onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
              aria-label="Previous image"
              title="الصورة السابقة"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            <div className="relative flex items-center justify-center max-w-full max-h-[80vh]">
              <img
                src={optimizeImage(activeImg, 1400)}
                alt={product.title}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl select-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Right/Next Navigation */}
            <button 
              className="absolute right-4 md:right-8 z-50 p-3 md:p-4 bg-black/60 hover:bg-red-600 backdrop-blur-md border border-white/20 hover:border-red-500 rounded-full text-white transition-all active:scale-95 shadow-xl"
              onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
              aria-label="Next image"
              title="الصورة التالية"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>

            {/* Bottom Indicator Dots */}
            <div className="absolute bottom-4 inset-x-0 z-50 flex justify-center pointer-events-none">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/15 pointer-events-auto">
                {displayImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectImageIndex(idx);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      idx === selectedGalleryIndex
                        ? 'w-6 h-1.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes slow-pulse {
          0%, 100% { 
            box-shadow: 0 0 0 rgba(239, 68, 68, 0); 
            border-color: rgba(255, 255, 255, 0.05); 
          }
          50% { 
            box-shadow: 0 0 28px rgba(239, 68, 68, 0.28); 
            border-color: rgba(239, 68, 68, 0.45); 
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

      {/* 🌟 BOOKING MODAL */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#181818] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 to-red-400" />
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-4 left-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8 mt-2">
                <h3 className="text-2xl font-bold text-white mb-2">طلب موعد شراء</h3>
                <p className="text-white/60 text-sm">سيتم التواصل معك هاتفياً لتأكيد الموعد</p>
              </div>

              {bookingStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">تم استلام طلبك بنجاح!</h4>
                  <p className="text-white/60 text-sm">سنتصل بك قريباً على الرقم الذي قدمته.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6 flex gap-4 items-center">
                    <img src={optimizeImage(activeImg, 1200)} className="w-16 h-16 rounded-lg object-contain bg-[#121212] border border-white/10" alt="car" />
                    <div>
                      <div className="text-white font-bold text-sm line-clamp-1">{product.title}</div>
                      <div className="text-red-400 text-xs font-bold mt-1">{activeTrim.name}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">الاسم الكامل</label>
                    <input 
                      type="text" 
                      required
                      value={bookingForm.name}
                      onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all"
                      placeholder="أدخل اسمك الكريم"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">رقم الهاتف</label>
                    <input 
                      type="tel" 
                      required
                      dir="ltr"
                      value={bookingForm.phone}
                      onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 focus:bg-black/60 transition-all text-left"
                      placeholder="05xx xx xx xx"
                    />
                  </div>
                  
                  {bookingStatus === 'error' && (
                    <div className="text-red-400 text-sm text-center py-2 bg-red-500/10 rounded-lg border border-red-500/20">
                      حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={bookingStatus === 'submitting'}
                    className="w-full mt-4 bg-red-600 hover:bg-red-500 active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center"
                  >
                    {bookingStatus === 'submitting' ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'تأكيد طلب الحجز'
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

import { Fuel, Gauge, Layers, ShieldCheck, Camera, Flame, Sparkles, Car, Phone } from 'lucide-react';

export interface TrimSpec {
  icon: any;
  label: string;
  value: string;
}

export interface TrimOption {
  id: string;
  name: string;
  badge: string;
  price: string;
  subtitle: string;
  tag: string;
  heroSpecs: TrimSpec[];
  images: string[];
}

export interface CarModel {
  id: string;
  title: string;
  origin: 'korean' | 'chinese';
  year: string;
  status: string;
  description: string;
  availableColors: { id: string; name: string; hex: string; border: string }[];
  trims: TrimOption[];
}

export const carsCatalog: Record<string, CarModel> = {
  'geely-coolray': {
    id: 'geely-coolray',
    title: 'Geely Coolray',
    origin: 'chinese',
    year: '2026',
    status: 'متاح',
    description: 'سيارة دفع رباعي رياضية متطورة بتصميم جريء وتكنولوجيا ذكية',
    availableColors: [
      { id: 'white', name: 'أبيض لؤلؤي', hex: '#FFFFFF', border: 'border-gray-200' },
      { id: 'gray', name: 'رمادي تيتانيوم', hex: '#4B4C50', border: 'border-gray-500' },
      { id: 'red', name: 'أحمر سبورت', hex: '#BA1717', border: 'border-red-800' },
      { id: 'blue', name: 'أزرق محيطي', hex: '#1C355E', border: 'border-blue-900' },
      { id: 'black', name: 'أسود كوزموس', hex: '#111111', border: 'border-gray-800' },
    ],
    trims: [
      {
        id: 'superpower',
        name: 'Superpower',
        badge: 'النسخة القياسية',
        price: '300 مليون', 
        subtitle: 'محرك 1.5 تيربو - 181 حصان',
        tag: 'أداء عملي وقوي',
        images: [
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200147/prmealoqbmoej5qwo8ip.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200145/rkxgu7aozkxeifuydktb.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200145/qhkt2l31eoty0hawfkcp.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200148/j5bszl2lacbapodcmfoa.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200149/ijf17slgtflfy6tblnbp.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200150/qjatj4opdw6wman7tp7y.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200151/epnwqbcwkrpn5rcfrww4.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200132/pkcmbswaxnqgvpqgowi9.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200136/hwiuhrhcgrn9a2xgsgnz.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200141/lqdkvnfufjchuub9jmpt.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200144/vzqtdk66odrpjz6qcvkz.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200154/i0pzah71alxuejj0bkvs.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200154/xl83dr8lprncbtpoxfon.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200156/y84f7xa6mwtj8zv415r6.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200157/szffttizgb2pzcb1axzt.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200151/k6i8ysyqeskpfwebysug.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200156/qfpj9pqlbqht8ixchdge.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200128/vmtdsxtjgh6rvcrd7vbk.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200152/esz5d80xavq3dyq1baux.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200153/ah9ap7iy2jebpgafrexj.png"
      ],
        heroSpecs: [
          { icon: Gauge, label: 'المحرك والأداء', value: 'محرك 1.5 لتر تيربو 4 أسطوانات بقوة 181 حصان و 290 نيوتن متر' },
          { icon: Layers, label: 'ناقل الحركة', value: '7 سرعات مزدوج القابض (7DCT)' },
          { icon: Fuel, label: 'البنية الهيكلية', value: 'منصة BMA بـ 66% صلب عالي الصلابة' },
          { icon: Sparkles, label: 'التقنية', value: 'شاشة 8 بوصة ومقاعد جلدية اصطناعية' }
        ]
      },
      {
        id: 'supermax',
        name: 'Supermax',
        badge: 'الاقتصادية',
        price: '280 مليون', 
        subtitle: 'محرك 1.5 تنفس طبيعي - 126 حصان',
        tag: 'توفير واقتصاد',
        images: [
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199984/h5hlbycjqa4jytgshpwp.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199989/uxy2znjxfv5s2fqufeke.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199994/ypn3b4mrrufzeebmwbjd.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199999/j35amcbpy995df6xuqsh.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199976/asn8s9twllhr5bhuuigu.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200013/m6qvyyljes7twzyw8ysk.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199979/i7zuidwpxhopeiouhutv.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200030/cpj8j1srcawpfihpdlp2.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200017/u8dpenugor7hdypz95j6.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200021/m4y0uth60p8vl6oqhq8t.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200026/d8i7dbzhzz8vcykjrrpg.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200035/w1ejs4njltjbuzxoovvx.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200008/lq6iqigq74qxtmobz8wx.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200004/a4mvpuf9m7o8bsrtwqrv.png"
      ],
        heroSpecs: [
          { icon: Gauge, label: 'المحرك والأداء', value: 'محرك 1.5 لتر تنفس طبيعي بقوة 126 حصان و 152 نيوتن متر' },
          { icon: Layers, label: 'ناقل الحركة', value: 'CVT مستمر بـ 8 سرعات وهمية' },
          { icon: Fuel, label: 'استهلاك الوقود', value: '6.89 لتر / 100 كم (WLTC)' },
          { icon: Sparkles, label: 'المواصفات', value: 'نظام ESC وشاشة 8 بوصة ومكابح إلكترونية EPB' }
        ]
      },
      {
        id: 'starlight',
        name: 'Starlight',
        badge: 'تكنولوجيا',
        price: '320 مليون', 
        subtitle: 'نظام إضاءة Star-piercing وشاشة 12.3 بوصة',
        tag: 'تطور ورفاهية',
        images: [
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200324/adnx5pda6bt6vhcrfmud.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200324/wkzzmwz4x59rrqs5ribh.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200322/pmjaw802ydvqae5eumbn.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200315/a5m4lmgpknkqbqinwcvj.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200315/hbuarpbwt8nomf31wfjj.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200316/qsitab5jk65luvwkytaa.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200317/poplno2uuz8qtkf5wanu.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200321/hbksrlbmurqi1tprf0j9.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200318/niqxyroholug4aylxbeu.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200322/bwhivz6n4m7ro6nj0wvo.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200319/atopn4zted8w7mgvjzup.png"
      ],
        heroSpecs: [
          { icon: Gauge, label: 'المحرك', value: '1.5 لتر تيربو 181 حصان / 290 نيوتن متر' },
          { icon: Camera, label: 'الشاشة والتقنية', value: 'شاشة عملاقة 12.3 بوصة عالية الدقة مع ذكاء اصطناعي صوتي' },
          { icon: Sparkles, label: 'الإضاءة', value: 'مصابيح أمامية LED مصفوفة (Star-piercing)' },
          { icon: Layers, label: 'المقاعد', value: 'كونسول وسطي معاد تصميمه بخامات فاخرة' }
        ]
      },
      {
        id: 'flagship',
        name: 'Flagship',
        badge: 'الفل أوبشن',
        price: '340 مليون', 
        subtitle: 'أعلى تقنيات الأمان Level 2 ADAS',
        tag: 'الفخامة والسلامة',
        images: [
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200235/zjmhtn77awwshzb4bi6d.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200232/xec4zjuhru7xhzlot8ow.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200233/r3p5sksyco6ojqpitrwk.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200234/vmbdkvc7d4frl9icdesb.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200233/mh0pau1ewifuhv4vxh34.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200240/sntfd2fuwstnwik676mp.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200230/yctupbbw7ixhiwy3kxi9.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200229/kh9qdh4lnryxnmpucodp.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200228/etr4ofmbfbiwob1k5wmc.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200231/jzssh91izmjqb8mdoyiw.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200226/dopawaqanowxiw3ijfts.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200237/s2cwfqpqevw7wxu4kaqe.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200236/zre4xt2whr1ruult58ds.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200224/mllnmbyphb9kourqdhuo.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200237/wiytov3wddpd4mnpqir7.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200239/hotuagvi8ogdm4fravob.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200228/zyyysqixeit2fwgowocx.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200227/zqbijrth8adwwumpihes.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789200225/b7l7aqopypzcl08kragb.png"
      ],
        heroSpecs: [
          { icon: ShieldCheck, label: 'أنظمة السلامة', value: 'مستوى القيادة الذاتية Level 2 (رادار، فرملة طوارئ، حفاظ على المسار)' },
          { icon: Camera, label: 'الكاميرات', value: 'نظام رؤية محيطية 540 درجة مع هيكل شفاف' },
          { icon: Flame, label: 'الكماليات', value: 'فتحة سقف بانورامية وباب خلفي كهربائي' },
          { icon: Sparkles, label: 'المقاعد', value: 'مقعد السائق كهربائي بـ 6 اتجاهات' }
        ]
      },
      {
        id: 'battle',
        name: 'Battle',
        badge: 'النسخة الرياضية',
        price: '350 مليون', 
        subtitle: 'أداء رياضي مع عجلات 18 بوصة وعوادم رباعية',
        tag: 'الأداء الأقصى',
        images: [
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199678/i2kmtu63hvkeaudjn3si.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199683/kaafdy0474hdjdxcvnpy.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199688/crjc06tcnyikghz0tgjo.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199693/zabknhntq4caoptpbju4.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199698/ok0j2bclyofxvhgtfqxo.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199702/fur9nwalbfe4lxz0iuzr.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199707/iyok0p1mamnhi8vvvfm6.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199712/larp69xz3twmxxs9jsla.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199717/ddjcsk0bvtidldjwqtdw.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199721/erpwweznw2npietlx6ij.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199726/zlg5doqcqk09s4jfdvv1.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199731/suin1qey1wvvrswbypsv.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199735/pneudvhkpdfcbzbrdkkf.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199740/rjat14dczn4rjk3auo7q.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789199744/o4r1vah1rf99zdhrtrr2.png"
      ],
        heroSpecs: [
          { icon: Flame, label: 'الخارجية', value: 'عجلات Shadow مقاس 18 بوصة وعوادم رياضية رباعية' },
          { icon: ShieldCheck, label: 'المكابح', value: 'كليبرات حمراء رياضية مع وسادات فرامل مطورة' },
          { icon: Sparkles, label: 'الداخلية', value: 'مقصورة Obsidian Black مع أحزمة أمان برتقالية رياضية' },
          { icon: Gauge, label: 'الأداء', value: '1.5 لتر تيربو، 181 حصان (0-100 كم/س في وقت قياسي)' }
        ]
      }
    ]
  },
  'livan-x3-pro': {
    id: 'livan-x3-pro',
    title: 'Livan X3 Pro',
    origin: 'chinese',
    year: '2026',
    status: 'متاح',
    description: 'كروس أوفر مدمجة وعملية للمدينة',
    availableColors: [
      { id: 'white', name: 'أبيض', hex: '#FFFFFF', border: 'border-gray-200' },
      { id: 'gray', name: 'رمادي', hex: '#808080', border: 'border-gray-500' },
      { id: 'red', name: 'أحمر', hex: '#BA1717', border: 'border-red-800' },
      { id: 'blue', name: 'أزرق', hex: '#1C355E', border: 'border-blue-900' }
    ],
    trims: [
      {
        id: 'manual',
        name: 'Manual',
        badge: 'علبة يدوية',
        price: '230 مليون',
        subtitle: 'اقتصادية وعملية',
        tag: 'ناقل يدوي',
        images: [
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183731/q44tezcyhgoxkl6sbnc9.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183732/oecsgeidekl6ki4mlxfh.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183733/nair9zhhhorkz3i32cer.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183734/v1wgliwkzewf5r8wirxv.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183735/ljcvbpgtfmgamnqre2qr.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183735/kgs7cyyussifw6bbz4zr.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183736/h0tdtg6qictnzuimw5v3.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183737/cyhhmwfysivatngftox6.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183738/lbnap0n9b6yrlsmkn0oo.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183739/ryvsrruqucdwoqzds6ak.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183739/zk3akdysose9nzvvzsoe.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183740/kmxhm8isvxysxbcsbytl.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183741/i2wu1r9imwzc4pxfgzqp.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183742/b3uwxqfsjptqtgcv10xi.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183743/jsxchfil4sp4hwmwgg9n.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183744/qfc3hwbijelyxey8jzti.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183745/qoftixscfahhzw4baoch.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183745/ie25wxyjq3syfs8wm3xl.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183746/ntp7yhnouc3brmiqabaj.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183748/mmsgad92bmfb1xzj11xf.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183748/zxkveo4aidtuc9hrzuqk.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183749/u9fjkdwtmrxlfcnym7ie.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183750/cmhb9bcec8uymfhlyeeo.png"
      ],
        heroSpecs: [
          { icon: Gauge, label: 'المحرك', value: '1.5 لتر تنفس طبيعي، 113 حصان / 143 نيوتن متر' },
          { icon: Layers, label: 'ناقل الحركة', value: 'يدوي 5 سرعات مع قابض فردي جاف' },
          { icon: Fuel, label: 'الأبعاد العملية', value: 'ارتفاع 185 ملم، سعة صندوق 400 لتر' },
          { icon: Sparkles, label: 'السرعة القصوى', value: '170 كم/س (استهلاك 6.8 لتر/100كم)' }
        ]
      },
      {
        id: 'auto',
        name: 'Auto / CVT',
        badge: 'علبة أوتوماتيكية',
        price: '250 مليون',
        subtitle: 'راحة داخل المدينة',
        tag: 'CVT أوتوماتيك',
        images: [
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183651/fmapu0rjals1j2lroqnh.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183655/vt1sj1acmssr2qei5jjr.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183659/ateamavfw3q3ituplq98.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183662/vnqsgwhxagrqsutyamrr.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183663/feeyobkcfqsk4gglycsu.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183664/dpswlwwluicxbuvby954.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183665/wp0d6tkjrr79eu1jgfyy.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183666/ibzlsa02b2epazc97bgs.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183667/qjtnft0tte3hyoxa9wpc.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183668/bfqmwfdfksrvbi7rc3el.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183668/fisuype5dxybmkipgy39.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183669/hl2bdy7rozhyerz4rjm8.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183670/pfwuaijmby88zsihxvzg.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183671/wpnwbjzigwm0tpqfopjf.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183672/xnfnkylind9ml5rcsp2o.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183673/sfsdiolbdyuhaoiarl33.png",
        "https://res.cloudinary.com/ypfk2p2e/image/upload/v1789183673/wqwjsyrblnrsfe0vvfp0.png"
      ],
        heroSpecs: [
          { icon: Gauge, label: 'المحرك', value: '1.5 لتر تنفس طبيعي، 113 حصان / 143 نيوتن متر' },
          { icon: Layers, label: 'ناقل الحركة', value: 'أوتوماتيكي CVT مستمر' },
          { icon: Sparkles, label: 'الراحة', value: 'مثبت سرعة وشاشة 8 بوصة وكاميرا خلفية' },
          { icon: Fuel, label: 'الاستهلاك', value: '6.92 لتر/100كم (سرعة قصوى محددة بـ 160 كم/س)' }
        ]
      }
    ]
  },
  'roewe-i5': {
    id: 'roewe-i5',
    title: 'Roewe i5',
    origin: 'chinese',
    year: '2026',
    status: 'متاح',
    description: 'سيدان عائلية واسعة بتكنولوجيا متطورة',
    availableColors: [
      { id: 'white', name: 'أبيض', hex: '#FFFFFF', border: 'border-gray-200' },
      { id: 'black', name: 'أسود', hex: '#111111', border: 'border-gray-800' },
      { id: 'gray', name: 'رمادي', hex: '#4B4C50', border: 'border-gray-500' }
    ],
    trims: [
      {
        id: 'standard',
        name: 'Standard',
        badge: 'أساسية',
        price: '270 مليون', // placeholder
        subtitle: 'محرك ألمنيوم 1.5 لتر',
        tag: 'سيدان عائلية',
        images: [],
        heroSpecs: [
          { icon: Gauge, label: 'المحرك', value: '1.5 لتر تنفس طبيعي 15FCD، ألمنيوم بالكامل (129 حصان)' },
          { icon: Layers, label: 'التقنية', value: 'حقن مباشر وضغط عالي 12:1 بدون مشاكل احتراق' },
          { icon: Sparkles, label: 'الداخلية', value: 'شاشتين 10.25 بوصة مع نظام Zebra OS' },
          { icon: Fuel, label: 'المساحة', value: 'قاعدة عجلات 2680 ملم، وصندوق خلفي 422 لتر' }
        ]
      }
    ]
  },
  'mg-5': {
    id: 'mg-5',
    title: 'MG 5',
    origin: 'chinese',
    year: '2025',
    status: 'متاح',
    description: 'سيدان رياضية فاست باك بأداء متميز',
    availableColors: [
      { id: 'yellow', name: 'أصفر نيون', hex: '#FFD700', border: 'border-yellow-500' },
      { id: 'white', name: 'أبيض', hex: '#FFFFFF', border: 'border-gray-200' },
      { id: 'black', name: 'أسود', hex: '#111111', border: 'border-gray-800' },
      { id: 'red', name: 'أحمر', hex: '#BA1717', border: 'border-red-800' },
      { id: 'gray', name: 'رمادي', hex: '#4B4C50', border: 'border-gray-500' }
    ],
    trims: [
      {
        id: 'turbo',
        name: 'Turbo',
        badge: 'رياضية',
        price: '220 مليون',
        subtitle: 'أداء فائق وتسارع قوي',
        tag: 'رياضية',
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
          { icon: Gauge, label: 'المحرك', value: '1.5 لتر تيربو (15C4E) بقوة 181 حصان و 285 نيوتن متر' },
          { icon: Flame, label: 'التسارع', value: 'من 0 إلى 100 كم/س في 8.1 ثانية فقط' },
          { icon: ShieldCheck, label: 'التحكم', value: 'نظام XDS لقفل التفاضل الإلكتروني في المنعطفات' },
          { icon: Camera, label: 'المكابح', value: 'مكابح كونتيننتال الألمانية (100-0 كم/س في 35 متر)' }
        ]
      }
    ]
  }
};

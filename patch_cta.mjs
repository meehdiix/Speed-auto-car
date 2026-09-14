import fs from 'fs';

let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

const targetButtons = `            <div className="pt-1 flex flex-col gap-3">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full py-3 bg-red-600 hover:bg-red-500 active:scale-[0.99] text-white rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_4px_24px_rgba(239,68,68,0.3)]"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>طلب حجز موعد شراء</span>
              </button>
              
              <a
                href={\`tel:\${phoneNumber}\`}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 active:scale-[0.99] border border-white/10 text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-white/70" />
                <span>أو إتصل بنا مباشرة</span>
              </a>
            </div>`;

const replacementButtons = `            <div className="pt-1 flex flex-col gap-3">
              <a
                href={\`tel:\${phoneNumber}\`}
                className="w-full py-3 bg-red-600 hover:bg-red-500 active:scale-[0.99] border border-red-500/50 text-white rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-[0_4px_24px_rgba(239,68,68,0.3)]"
              >
                <Phone className="w-5 h-5" />
                <span>إتصل بنا مباشرة</span>
              </a>
            </div>`;

if (content.includes(targetButtons)) {
  content = content.replace(targetButtons, replacementButtons);
  fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
  console.log("Patched CTA buttons successfully");
} else {
  console.log("Target CTA buttons not found");
}


import fs from 'fs';
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const tiktokSvg = `
const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.37.75-4.81 2.66-6.22 1.25-.94 2.82-1.41 4.39-1.38v4.06c-1.3.06-2.52.79-3.14 1.91-.65 1.13-.59 2.64.2 3.69.75.99 2.05 1.48 3.28 1.35 1.83-.2 3.17-1.89 3.16-3.75-.02-5.46-.01-10.91-.01-16.37Z" />
  </svg>
);
`;

const fbUrl = "https://web.facebook.com/profile.php?id=61587488037995&mibextid=wwXIfr&rdid=FcdWsbd0ut4eyKao&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F1DniwL8tkC%2F%3Fmibextid%3DwwXIfr%26_rdc%3D1%26_rdr#";
const tiktokUrl = "https://web.facebook.com/profile.php?id=61587488037995&mibextid=wwXIfr&rdid=FcdWsbd0ut4eyKao&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F1DniwL8tkC%2F%3Fmibextid%3DwwXIfr%26_rdc%3D1%26_rdr#";

const newSocials = `
            <div className="flex gap-4">
              <a href="${fbUrl}" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white transition-colors shadow-sm">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="${tiktokUrl}" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-600 hover:text-white transition-colors shadow-sm">
                <TiktokIcon className="w-6 h-6" />
              </a>
              <a href="https://wa.me/213564507370" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-green-600/20 border border-green-500/30 flex items-center justify-center text-green-400 hover:bg-green-600 hover:text-white transition-colors shadow-sm">
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
`;

// Insert the TikTok icon component above the export default function Footer
content = content.replace("export default function Footer() {", tiktokSvg + "\nexport default function Footer() {");

// Replace the socials div
content = content.replace(
  /<div className="flex gap-4">[\s\S]*?<\/div>/,
  newSocials.trim()
);

// Replace the location address
content = content.replace(
  /<p className="text-white font-bold text-lg">الجزائر<\/p>/,
  '<a href="https://maps.app.goo.gl/uqyL7KUvZJmtZNm6A?g_st=ic" target="_blank" rel="noreferrer" className="text-white font-bold text-lg hover:text-red-400 transition-colors block">الجزائر (عرض الخريطة)</a>'
);

fs.writeFileSync('src/components/Footer.tsx', content);
console.log("Patched footer");

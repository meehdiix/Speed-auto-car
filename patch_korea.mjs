import fs from 'fs';

// 1. AboutUs.tsx
let about = fs.readFileSync('src/pages/AboutUs.tsx', 'utf8');
about = about.replace(/الصين وكوريا/g, 'الصين');
fs.writeFileSync('src/pages/AboutUs.tsx', about);

// 2. Hero.tsx
let hero = fs.readFileSync('src/components/Hero.tsx', 'utf8');
hero = hero.replace(/الصين وكوريا/g, 'الصين');
fs.writeFileSync('src/components/Hero.tsx', hero);

// 3. Footer.tsx
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/الصين وكوريا/g, 'الصين');
fs.writeFileSync('src/components/Footer.tsx', footer);

// 4. Services.tsx
let services = fs.readFileSync('src/components/Services.tsx', 'utf8');
services = services.replace(/{service.origin === 'korean' \? 'كوريا الجنوبية' : 'الصين'}/g, "'الصين'");
fs.writeFileSync('src/components/Services.tsx', services);

// 5. Testimonials.tsx
let testm = fs.readFileSync('src/components/Testimonials.tsx', 'utf8');
testm = testm.replace(/كوريا/g, 'الصين');
testm = testm.replace(/Kia Sportage/g, 'Geely Coolray');
testm = testm.replace(/Hyundai Tucson/g, 'Roewe i5');
testm = testm.replace(/Geely Monjaro/g, 'MG 5');
fs.writeFileSync('src/components/Testimonials.tsx', testm);

console.log("Patched Korea to China and updated Testimonials");

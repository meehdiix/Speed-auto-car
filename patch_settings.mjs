import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/SettingsManager.tsx', 'utf8');
content = content.replace("https://facebook.com/SpeedAutoCar", "https://web.facebook.com/profile.php?id=61587488037995");
fs.writeFileSync('src/pages/admin/SettingsManager.tsx', content);
console.log("Patched SettingsManager");

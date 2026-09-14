const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const replacements = [
    // Text Rebranding
    { regex: /Haythem Auto/gi, replace: 'Speed Auto Car' },
    { regex: /HaythemAuto/gi, replace: 'SpeedAutoCar' },
    { regex: /هيثم أوتو/g, replace: 'سبيد أوتو كار' },
    { regex: /هيثم أوطو/g, replace: 'سبيد أوتو كار' },
    { regex: /haythemauto\.com/gi, replace: 'speedautocar.com' },
    { regex: /instagram\.com\/haythemauto/gi, replace: 'instagram.com/speedautocar' },
    { regex: /facebook\.com\/haythemauto/gi, replace: 'facebook.com/speedautocar' },
    { regex: />Haythem</g, replace: '>Speed<' },
    
    // Color Rebranding (Tailwind Classes)
    { regex: /blue-300/g, replace: 'red-300' },
    { regex: /blue-400/g, replace: 'red-400' },
    { regex: /blue-500/g, replace: 'red-500' },
    { regex: /blue-600/g, replace: 'red-600' },
    
    // Color Rebranding (RGBA shadow/ambient glows)
    { regex: /59,130,246/g, replace: '239,68,68' },
    { regex: /59, 130, 246/g, replace: '239, 68, 68' }
];

walkDir('./src', function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        replacements.forEach(({ regex, replace }) => {
            if (regex.test(content)) {
                content = content.replace(regex, replace);
                modified = true;
            }
        });
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});

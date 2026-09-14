import fs from 'fs';
import path from 'path';

const outputFile = 'ALL_CODE.txt';
let outputContent = '=================================================================\n';
outputContent += '              SPEED AUTO CAR - FULL SOURCE CODE EXPORT           \n';
outputContent += '=================================================================\n\n';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (!dirPath.includes('node_modules') && !dirPath.includes('dist') && !dirPath.includes('.git')) {
                walkDir(dirPath, callback);
            }
        } else {
            callback(dirPath);
        }
    });
}

const targetExtensions = ['.tsx', '.ts', '.css', '.html', '.json', '.js'];
const filesToProcess = [];

// Get all source files
if (fs.existsSync('./src')) {
    walkDir('./src', (filePath) => {
        if (targetExtensions.some(ext => filePath.endsWith(ext))) {
            filesToProcess.push(filePath);
        }
    });
}

// Add root configuration files
const rootFiles = [
    'index.html',
    'package.json',
    'tsconfig.json',
    'tsconfig.app.json',
    'tsconfig.node.json',
    'vite.config.ts',
    'tailwind.config.js',
    'postcss.config.js',
    '.env.example'
];

rootFiles.forEach(f => {
    if (fs.existsSync(f)) {
        filesToProcess.push(f);
    }
});

filesToProcess.forEach(filePath => {
    outputContent += `\n\n\n/************************************************************************\n`;
    outputContent += ` * FILE: ${filePath}\n`;
    outputContent += ` ************************************************************************/\n\n`;
    outputContent += fs.readFileSync(filePath, 'utf8');
});

fs.writeFileSync(outputFile, outputContent, 'utf8');
console.log(`Successfully combined ${filesToProcess.length} files into ${outputFile}`);

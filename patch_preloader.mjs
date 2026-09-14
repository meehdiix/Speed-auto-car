import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

const preloaderEffect = `
  // Preload high-res images for instant switching
  useEffect(() => {
    if (displayImages && displayImages.length > 0) {
      displayImages.forEach((img) => {
        const preloadedImg = new Image();
        preloadedImg.src = optimizeImage(img, 1200);
      });
    }
  }, [displayImages]);
`;

// Insert it right after the existing useEffect that handles displayImages
const insertionTarget = "}, [displayImages, activeImg]);";
const insertionIndex = content.indexOf(insertionTarget);

if (insertionIndex !== -1) {
  content = content.substring(0, insertionIndex + insertionTarget.length) + "\n" + preloaderEffect + content.substring(insertionIndex + insertionTarget.length);
  fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
  console.log("Patched Preloader");
} else {
  console.log("Could not find insertion point");
}

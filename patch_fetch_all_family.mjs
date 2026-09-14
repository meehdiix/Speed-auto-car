import fs from 'fs';
let content = fs.readFileSync('src/pages/ProductTemplate.tsx', 'utf8');

const target1 = `  const [product, setProduct] = useState<any>(null);
  const [activeImg, setActiveImg] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);`;

const replacement1 = `  const [product, setProduct] = useState<any>(null);
  const [activeImg, setActiveImg] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [familyCarsDb, setFamilyCarsDb] = useState<any[]>([]);`;

const target2 = `        // Check if it's a catalog grouping ID
        if (carsCatalog[id]) {
          const catalogData = carsCatalog[id];
          
          // Query the DB to see if the admin uploaded custom images for this car!
          let customImages = [];
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
              
              if (matchedId === id && car.images && car.images.length > 0) {
                customImages = car.images;
                break;
              }
            }
          } catch (e) {
            console.error("Error fetching custom images:", e);
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
            price: catalogData.trims[0]?.price,
            specs: catalogData.trims[0]?.heroSpecs?.map(s => ({ label: s.label, value: s.value })) || []
          });
          setActiveImg(finalImages[0] || defaultCoolray.mainImg);
          setLoading(false);
          return;
        }`;

const replacement2 = `        // Check if it's a catalog grouping ID
        if (carsCatalog[id]) {
          const catalogData = carsCatalog[id];
          
          // Query the DB to grab all variations/trims the admin created for this family
          let familyDbMatches: any[] = [];
          let defaultImages = catalogData.trims[0]?.images || [];
          
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
            }
          } catch (e) {
            console.error("Error fetching custom images:", e);
          }

          setFamilyCarsDb(familyDbMatches);

          // Find if there's a specific match for the FIRST trim, otherwise use the first family match
          let matchedTrimCar = familyDbMatches.find(c => c.titleLower.includes(catalogData.trims[0].id) || c.titleLower.includes(catalogData.trims[0].name.toLowerCase()));
          if (!matchedTrimCar && familyDbMatches.length > 0) matchedTrimCar = familyDbMatches[0];
          
          const finalImages = (matchedTrimCar?.images?.length > 0) ? matchedTrimCar.images : defaultImages;

          setProduct({
            id: catalogData.id,
            title: catalogData.title,
            year: catalogData.year,
            mileage: '0 كم جديدة من المصنع',
            images: finalImages,
            thumbs: finalImages,
            mainImg: finalImages[0] || defaultCoolray.mainImg,
            price: catalogData.trims[0]?.price,
            specs: catalogData.trims[0]?.heroSpecs?.map(s => ({ label: s.label, value: s.value })) || []
          });
          setActiveImg(finalImages[0] || defaultCoolray.mainImg);
          setLoading(false);
          return;
        }`;

const target3 = `  const activeTrim = activeTrimsList.find(t => t.id === selectedTrimId) || activeTrimsList[0];

  // The admin organizes pictures per car (not per trim) in the inventory.
  // If custom images are found, ALWAYS use them across all trims.
  const displayImages = product?.hasCustomImages 
    ? product.images 
    : (activeTrim?.images?.length > 0 ? activeTrim.images : (product?.images || defaultCoolray.thumbs));`;

const replacement3 = `  const activeTrim = activeTrimsList.find(t => t.id === selectedTrimId) || activeTrimsList[0];

  // Dynamic Trim Image Resolution:
  // 1. Check if the admin created a specific inventory entry for THIS trim
  // 2. Fallback to catalog default trim images
  // 3. Fallback to general product images
  const matchingDbTrim = familyCarsDb.find(c => 
    c.titleLower.includes(activeTrim.id) || 
    c.titleLower.includes(activeTrim.name.toLowerCase()) || 
    (activeTrim.badge && c.titleLower.includes(activeTrim.badge.toLowerCase()))
  );
  
  let displayImages = activeTrim.images; // fallback to catalog
  if (matchingDbTrim && matchingDbTrim.images?.length > 0) {
    displayImages = matchingDbTrim.images;
  } else if (!activeTrim.images || activeTrim.images.length === 0) {
    displayImages = product?.images || defaultCoolray.thumbs;
  }`;

if (content.includes(target1) && content.includes(target2) && content.includes(target3)) {
  content = content.replace(target1, replacement1);
  content = content.replace(target2, replacement2);
  content = content.replace(target3, replacement3);
  fs.writeFileSync('src/pages/ProductTemplate.tsx', content);
  console.log("Patched Family Cars Db successfully");
} else {
  console.log("Targets not found!");
}

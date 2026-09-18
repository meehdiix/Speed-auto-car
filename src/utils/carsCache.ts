import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { carsCatalog, CarModel } from '../data/carsCatalog';

export interface DisplayCarItem {
  id: string;
  title: string;
  price?: string;
  origin?: string;
  year?: string;
  mileage?: string;
  images: string[];
  status: string;
  isCatalogDriven: boolean;
  baseCarId?: string;
  [key: string]: any;
}

const CARS_CACHE_KEY = 'speedauto_cars_cache_v5';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

let memoryCarsCache: DisplayCarItem[] | null = null;
let cachedRawDbCars: any[] | null = null;
let lastCarsFetchTime = 0;
let isFetchingCars = false;
let pendingPromise: Promise<DisplayCarItem[]> | null = null;

/**
 * Normalizes any car title or identifier into its canonical car model ID
 */
export function matchCarModelId(rawTitle: string): string | null {
  const t = (rawTitle || '').toLowerCase().trim();
  if (t.includes('coolray') || t.includes('كولراي') || t.includes('geely') || t.includes('جيلي')) return 'geely-coolray';
  if (t.includes('livan') || t.includes('x3') || t.includes('ليفان')) return 'livan-x3-pro';
  if (t.includes('roewe') || t.includes('i5') || t.includes('روي') || t.includes('رويفي')) return 'roewe-i5';
  if (t.includes('mg') || t.includes('ام جي') || t.includes('إم جي') || t.includes('امجي')) return 'mg-5';
  return null;
}

/**
 * Returns default static catalog cars instantly (0ms)
 */
export function getDefaultCatalogCars(): DisplayCarItem[] {
  return Object.values(carsCatalog).map(catalogData => {
    let imagesToUse = catalogData.trims[0]?.images || [];
    if (catalogData.id === 'mg-5') {
      const autoTrim = catalogData.trims.find(t => t.id === 'automatic');
      if (autoTrim && autoTrim.images && autoTrim.images.length > 0) {
        imagesToUse = autoTrim.images;
      }
    }

    // Determine the lowest trim price for catalog display
    const trimPrices = catalogData.trims
      .map(t => {
        const m = String(t.price).match(/\d+(\.\d+)?/);
        return m ? parseFloat(m[0]) : null;
      })
      .filter((p): p is number => p !== null);

    const minTrimPrice = trimPrices.length > 0 ? Math.min(...trimPrices) : null;
    const defaultPrice = minTrimPrice !== null ? `${minTrimPrice} مليون` : (catalogData.trims[0]?.price?.replace(/دج/g, '').trim() || '');

    return {
      id: catalogData.id,
      title: catalogData.title,
      price: defaultPrice,
      minPriceNum: minTrimPrice || 0,
      origin: catalogData.origin,
      year: catalogData.year,
      mileage: '0 كم جديدة من المصنع',
      images: imagesToUse,
      status: 'متاح',
      isCatalogDriven: true,
      hasMultipleTrims: catalogData.trims.length > 1,
      baseCarId: catalogData.id
    };
  });
}

function loadCarsFromStorage(): DisplayCarItem[] | null {
  try {
    // Clean up any stale legacy cache versions to avoid showing separated trim cards
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('speedauto_cars_') && key !== CARS_CACHE_KEY) {
        sessionStorage.removeItem(key);
      }
    }
    const raw = sessionStorage.getItem(CARS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.data) && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      return parsed.data;
    }
  } catch {
    // silent
  }
  return null;
}

function saveCarsToStorage(cars: DisplayCarItem[]) {
  try {
    sessionStorage.setItem(CARS_CACHE_KEY, JSON.stringify({
      data: cars,
      timestamp: Date.now()
    }));
  } catch {
    // silent
  }
}

/**
 * Returns all raw Firestore car documents cached in memory
 */
export async function getRawDbCars(): Promise<any[]> {
  if (cachedRawDbCars && cachedRawDbCars.length > 0) {
    return cachedRawDbCars;
  }
  await getCarsList();
  return cachedRawDbCars || [];
}

/**
 * Returns all Firestore cars belonging to a given car model
 */
export async function getDbCarsForModel(modelId: string): Promise<any[]> {
  const raw = await getRawDbCars();
  return raw.filter(car => {
    const matched = matchCarModelId(car.title);
    return matched === modelId;
  }).map(c => ({ ...c, titleLower: (c.title || '').toLowerCase() }));
}

/**
 * High-performance, pressure-resilient cars loader with in-memory + sessionStorage caching,
 * 2.5s network timeout guard, and seamless fallback to static catalog data.
 * Returns ONE card per car model (unified car with starting price).
 */
export async function getCarsList(forceRefresh = false): Promise<DisplayCarItem[]> {
  const now = Date.now();
  if (!forceRefresh && memoryCarsCache && (now - lastCarsFetchTime < CACHE_TTL_MS)) {
    return memoryCarsCache;
  }

  if (!forceRefresh) {
    const stored = loadCarsFromStorage();
    if (stored && stored.length > 0) {
      memoryCarsCache = stored;
      lastCarsFetchTime = now;
      return stored;
    }
  }

  // Deduplicate concurrent in-flight requests
  if (isFetchingCars && pendingPromise) {
    return pendingPromise;
  }

  isFetchingCars = true;
  pendingPromise = (async () => {
    try {
      // Race Firestore query with a 2.5s timeout to prevent hanging on traffic pressure
      const fetchWithTimeout = async () => {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore timeout')), 2500)
        );

        const q = query(collection(db, 'cars'), where('status', '==', 'متاح'));
        const queryPromise = getDocs(q);

        return await Promise.race([queryPromise, timeoutPromise]);
      };

      const snapshot = await fetchWithTimeout();
      const dbCars = snapshot.docs.map(d => ({ id: d.id, ...d.data() as any }));
      cachedRawDbCars = dbCars;

      const groupedCatalogCars: Record<string, { catalogData: any; cars: any[] }> = {};
      const customCarsMap: Record<string, any[]> = {};

      dbCars.forEach(car => {
        const matchedModelId = matchCarModelId(car.title);
        if (matchedModelId && carsCatalog[matchedModelId]) {
          const catalogData = carsCatalog[matchedModelId];
          if (!groupedCatalogCars[matchedModelId]) {
            groupedCatalogCars[matchedModelId] = { catalogData, cars: [] };
          }
          groupedCatalogCars[matchedModelId].cars.push(car);
        } else {
          // Non-catalog custom car: group by base title so trims don't duplicate
          const baseKey = (car.title || 'custom-car').split(' ')[0].toLowerCase();
          if (!customCarsMap[baseKey]) customCarsMap[baseKey] = [];
          customCarsMap[baseKey].push(car);
        }
      });

      const displayCars: DisplayCarItem[] = [];

      // For each catalog car model, emit EXACTLY ONE unified car item.
      // Every model has ONE single page and URL (/product/:id) with all its trims inside.
      Object.entries(carsCatalog).forEach(([catalogId, catalogData]) => {
        const groupCars = groupedCatalogCars[catalogId]?.cars || [];

        // Determine best images
        let imagesToUse: string[] = [];
        const carWithImages = groupCars.find(c => c.images && c.images.length > 0);
        if (carWithImages) {
          imagesToUse = carWithImages.images;
        } else if (catalogData.id === 'mg-5') {
          const autoTrim = catalogData.trims.find((t: any) => t.id === 'automatic');
          imagesToUse = autoTrim?.images || catalogData.trims[0]?.images || [];
        } else {
          imagesToUse = catalogData.trims[0]?.images || [];
        }

        // Collect all prices from DB trims and catalog trims to find the minimum starting price
        const allPrices: number[] = [];
        groupCars.forEach(c => {
          if (c.price) {
            const m = String(c.price).match(/\d+(\.\d+)?/);
            if (m) allPrices.push(parseFloat(m[0]));
          }
        });
        if (allPrices.length === 0) {
          catalogData.trims.forEach(t => {
            const m = String(t.price).match(/\d+(\.\d+)?/);
            if (m) allPrices.push(parseFloat(m[0]));
          });
        }

        const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : null;
        const displayPrice = minPrice !== null ? `${minPrice} مليون` : (catalogData.trims[0]?.price?.replace(/دج/g, '').trim() || 'تواصل معنا');

        displayCars.push({
          id: catalogData.id,
          baseCarId: catalogData.id,
          title: catalogData.title,
          price: displayPrice,
          minPriceNum: minPrice || 0,
          origin: catalogData.origin,
          year: groupCars[0]?.year || catalogData.year,
          mileage: groupCars[0]?.mileage ? `${groupCars[0].mileage} كم` : '0 كم جديدة من المصنع',
          images: imagesToUse,
          status: 'متاح',
          isCatalogDriven: true,
          hasMultipleTrims: catalogData.trims.length > 1
        });
      });

      // If any non-catalog custom car was added in the DB, append ONE unified card per custom model
      Object.entries(customCarsMap).forEach(([_, customGroup]) => {
        const firstCar = customGroup[0];
        const prices = customGroup
          .map(c => {
            const m = String(c.price).match(/\d+(\.\d+)?/);
            return m ? parseFloat(m[0]) : null;
          })
          .filter((p): p is number => p !== null);
        const minPrice = prices.length > 0 ? Math.min(...prices) : null;

        displayCars.push({
          id: firstCar.id,
          baseCarId: firstCar.id,
          title: firstCar.title || 'سيارة معروضة',
          price: minPrice !== null ? `${minPrice} مليون` : (firstCar.price ? String(firstCar.price).replace(/دج/g, '').trim() : 'تواصل معنا'),
          minPriceNum: minPrice || 0,
          year: firstCar.year || '2026',
          mileage: firstCar.mileage ? `${firstCar.mileage} كم` : '0 كم',
          images: firstCar.images || [],
          status: firstCar.status || 'متاح',
          isCatalogDriven: false,
          hasMultipleTrims: customGroup.length > 1
        });
      });

      // If no cars matched from DB, return static defaults
      const finalResult = displayCars.length > 0 ? displayCars : getDefaultCatalogCars();
      memoryCarsCache = finalResult;
      lastCarsFetchTime = Date.now();
      saveCarsToStorage(finalResult);
      return finalResult;
    } catch (error: any) {
      console.warn('[CarsCache] Using fallback catalog due to network/pressure:', error?.message || error);
      const fallback = memoryCarsCache || loadCarsFromStorage() || getDefaultCatalogCars();
      memoryCarsCache = fallback;
      return fallback;
    } finally {
      isFetchingCars = false;
      pendingPromise = null;
    }
  })();

  return pendingPromise;
}

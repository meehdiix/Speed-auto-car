import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { initTikTokPixelScript, initMetaPixelScript, trackPageView, TIKTOK_DEFAULT_PIXEL_ID, META_DEFAULT_PIXEL_ID } from '../utils/pixelTracker';
import { getGeneralSettings } from '../utils/settings';

const PIXEL_CACHE_KEY = 'speedauto_pixel_ids_cache_v2';
const PIXEL_CACHE_TTL = 30 * 60 * 1000; // 30 minutes TTL

interface CachedPixels {
  tiktokIds: string[];
  metaIds: string[];
  timestamp: number;
}

function getStoredPixels(): CachedPixels | null {
  try {
    const raw = localStorage.getItem(PIXEL_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Date.now() - parsed.timestamp < PIXEL_CACHE_TTL) {
      return parsed;
    }
  } catch {
    // silent
  }
  return null;
}

function storePixels(tiktokIds: string[], metaIds: string[]) {
  try {
    localStorage.setItem(PIXEL_CACHE_KEY, JSON.stringify({
      tiktokIds,
      metaIds,
      timestamp: Date.now()
    }));
  } catch {
    // silent
  }
}

export default function MetaPixelTracker() {
  const location = useLocation();

  useEffect(() => {
    let isCancelled = false;

    const loadPixels = async () => {
      // 1. Check local storage cache first for instant 0ms execution
      const cached = getStoredPixels();
      if (cached) {
        if (!cached.tiktokIds.includes(TIKTOK_DEFAULT_PIXEL_ID)) {
          cached.tiktokIds.push(TIKTOK_DEFAULT_PIXEL_ID);
        }
        if (!cached.metaIds.includes(META_DEFAULT_PIXEL_ID)) {
          cached.metaIds.push(META_DEFAULT_PIXEL_ID);
        }
        initTikTokPixelScript(cached.tiktokIds);
        initMetaPixelScript(cached.metaIds);
        return;
      }

      // 2. Fetch from Firestore with a 2-second safety timeout guard to protect under high pressure
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Pixel fetch timeout')), 2000)
        );

        const snapPromise = getDocs(collection(db, 'pixels'));
        const snapshot = await Promise.race([snapPromise, timeoutPromise]);

        if (isCancelled) return;

        const activePixels = snapshot.docs.map(d => d.data());
        const tiktokIds: string[] = [];
        const metaIds: string[] = [];

        activePixels.forEach(p => {
          if (p.status !== 'نشط') return;
          const pid = (p.pixelId || '').trim();
          if (!pid) return;

          if (p.platform === 'tiktok' || (!p.platform && /[A-Za-z]/.test(pid))) {
            tiktokIds.push(pid);
          } else {
            metaIds.push(pid);
          }
        });

        if (!tiktokIds.includes(TIKTOK_DEFAULT_PIXEL_ID)) {
          tiktokIds.push(TIKTOK_DEFAULT_PIXEL_ID);
        }
        if (!metaIds.includes(META_DEFAULT_PIXEL_ID)) {
          metaIds.push(META_DEFAULT_PIXEL_ID);
        }

        // Cache for future page views
        storePixels(tiktokIds, metaIds);

        initTikTokPixelScript(tiktokIds);
        initMetaPixelScript(metaIds);
      } catch (err: any) {
        // Fallback gracefully without throwing or blocking UI
        if (isCancelled) return;
        initTikTokPixelScript([TIKTOK_DEFAULT_PIXEL_ID]);
        initMetaPixelScript([META_DEFAULT_PIXEL_ID]);
      }

      // 3. Supplement with general settings pixels if any
      try {
        const settings = await getGeneralSettings();
        if (isCancelled) return;
        if (settings.tiktokPixelId && typeof settings.tiktokPixelId === 'string' && settings.tiktokPixelId.trim()) {
          initTikTokPixelScript([settings.tiktokPixelId.trim()]);
        }
        if (settings.metaPixelId && typeof settings.metaPixelId === 'string' && settings.metaPixelId.trim()) {
          initMetaPixelScript([settings.metaPixelId.trim()]);
        }
      } catch {
        // silent
      }
    };

    loadPixels();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Track PageView on route navigation
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
}


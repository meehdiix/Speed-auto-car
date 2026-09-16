import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { initTikTokPixelScript, initMetaPixelScript, trackPageView } from '../utils/pixelTracker';

export default function MetaPixelTracker() {
  const location = useLocation();

  useEffect(() => {
    // 1. Listen for active Pixels in 'pixels' collection (TikTok & Meta)
    const unsubPixels = onSnapshot(collection(db, 'pixels'), (snapshot) => {
      const activePixels = snapshot.docs.map(d => d.data());

      const tiktokIds: string[] = [];
      const metaIds: string[] = [];

      activePixels.forEach(p => {
        if (p.status !== 'نشط') return;
        const pid = (p.pixelId || '').trim();
        if (!pid) return;

        // Platform detection: explicit platform or check alphanumeric characters (TikTok IDs have letters)
        if (p.platform === 'tiktok' || (!p.platform && /[A-Za-z]/.test(pid))) {
          tiktokIds.push(pid);
        } else {
          metaIds.push(pid);
        }
      });

      // Always ensure the active MG 5 TikTok pixel is loaded
      if (!tiktokIds.includes('DALDKHBC77U05QM9RMN0')) {
        tiktokIds.push('DALDKHBC77U05QM9RMN0');
      }

      if (tiktokIds.length > 0) {
        initTikTokPixelScript(tiktokIds);
      }
      if (metaIds.length > 0) {
        initMetaPixelScript(metaIds);
      }

      // Fire initial PageView
      trackPageView();
    }, (error) => {
      console.warn('[Pixel Tracker] Firestore pixels subscription error:', error);
    });

    // 2. Listen for global Pixel IDs from settings/general
    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.tiktokPixelId && typeof data.tiktokPixelId === 'string' && data.tiktokPixelId.trim()) {
          initTikTokPixelScript([data.tiktokPixelId.trim()]);
        }
        if (data.metaPixelId && typeof data.metaPixelId === 'string' && data.metaPixelId.trim()) {
          initMetaPixelScript([data.metaPixelId.trim()]);
        }
      }
    }, (error) => {
      console.warn('[Pixel Tracker] Firestore settings subscription error:', error);
    });

    return () => {
      unsubPixels();
      unsubSettings();
    };
  }, []);

  // Track PageView on route navigation
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
}

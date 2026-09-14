import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

// Injects official Meta Pixel runtime if not already loaded
function initMetaPixelScript() {
  if (window.fbq) return;

  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
}

export default function MetaPixelTracker() {
  const location = useLocation();

  useEffect(() => {
    // Listen for active pixels configured in admin dashboard
    const unsubscribe = onSnapshot(collection(db, 'pixels'), (snapshot) => {
      const activePixels = snapshot.docs
        .map(d => d.data())
        .filter(p => p.status === 'نشط' && p.pixelId);

      if (activePixels.length > 0) {
        initMetaPixelScript();
        activePixels.forEach(p => {
          try {
            window.fbq('init', p.pixelId);
          } catch (e) {
            console.error('Meta pixel init error:', e);
          }
        });
        try {
          window.fbq('track', 'PageView');
        } catch (e) {
          // ignore
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Track PageView on route change
  useEffect(() => {
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'PageView');
      } catch (e) {
        // ignore
      }
    }
  }, [location.pathname, location.search]);

  return null;
}

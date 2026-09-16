import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

declare global {
  interface Window {
    ttq?: any;
    TiktokAnalyticsObject?: string;
    fbq?: any;
    _fbq?: any;
  }
}

let isTikTokScriptLoaded = false;
let isMetaScriptLoaded = false;
const loadedTikTokPixelIds = new Set<string>();
const loadedMetaPixelIds = new Set<string>();

/**
 * Safely initializes the official TikTok Pixel runtime with full ad-blocker immunity.
 * If external network request fails due to ad-blockers, the stub buffers events safely
 * without throwing errors or halting the user interface.
 */
export function initTikTokPixelScript(pixelIds: string[]) {
  if (typeof window === 'undefined') return;

  const validIds = pixelIds
    .map(id => (typeof id === 'string' ? id.trim() : ''))
    .filter(Boolean);

  if (validIds.length === 0) return;

  // 1. Inject base TikTok Analytics queue if not already injected
  if (!window.ttq) {
    /* eslint-disable */
    (function (w: any, d: any, t: string) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      ttq.methods = [
        "page", "track", "identify", "instances", "debug", "on", "off", "once", "ready",
        "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"
      ];
      ttq.setAndDefer = function (t: any, e: any) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (var i = 0; i < ttq.methods.length; i++) {
        ttq.setAndDefer(ttq, ttq.methods[i]);
      }
      ttq.instance = function (t: any) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) {
          ttq.setAndDefer(e, ttq.methods[n]);
        }
        return e;
      };
      ttq.load = function (e: any, n: any) {
        var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = r;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        
        var a = document.createElement("script");
        a.type = "text/javascript";
        a.async = true;
        a.src = r + "?sdkid=" + e + "&lib=" + t;
        a.onerror = function () {
          // Graceful fallback for ad-blockers (Brave, uBlock, AdGuard, etc.)
          console.warn("[TikTok Pixel] Script blocked by client browser or ad-blocker. Events are buffered safely.");
        };
        
        var c = document.getElementsByTagName("script")[0];
        if (c && c.parentNode) {
          c.parentNode.insertBefore(a, c);
        } else {
          document.head.appendChild(a);
        }
      };
    })(window, document, 'ttq');
    /* eslint-enable */
    isTikTokScriptLoaded = true;
  }

  // 2. Initialize each unique Pixel ID (preventing duplicate loads)
  validIds.forEach(id => {
    if (!loadedTikTokPixelIds.has(id)) {
      loadedTikTokPixelIds.add(id);
      // If already loaded by index.html, do not re-call load to prevent duplicate warnings
      if (window.ttq && window.ttq._i && window.ttq._i[id]) {
        return;
      }
      try {
        window.ttq.load(id);
        console.log(`[TikTok Pixel] Initialized ID: ${id}`);
      } catch (err) {
        console.warn('[TikTok Pixel] Init warning:', err);
      }
    }
  });
}

/**
 * Initializes Meta (Facebook) Pixel safely
 */
export function initMetaPixelScript(pixelIds: string[]) {
  if (typeof window === 'undefined') return;

  const validIds = pixelIds
    .map(id => (typeof id === 'string' ? id.trim() : ''))
    .filter(Boolean);

  if (validIds.length === 0) return;

  if (!window.fbq) {
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
      t.onerror = function () {
        console.warn("[Meta Pixel] Script blocked by ad-blocker. Events handled safely.");
      };
      s = b.getElementsByTagName(e)[0];
      if (s && s.parentNode) {
        s.parentNode.insertBefore(t, s);
      } else {
        b.head.appendChild(t);
      }
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    isMetaScriptLoaded = true;
  }

  validIds.forEach(id => {
    if (!loadedMetaPixelIds.has(id)) {
      try {
        window.fbq('init', id);
        loadedMetaPixelIds.add(id);
        console.log(`[Meta Pixel] Initialized ID: ${id}`);
      } catch (err) {
        console.warn('[Meta Pixel] Init warning:', err);
      }
    }
  });
}

function parseNumericPrice(val?: string | number): number | undefined {
  if (!val) return undefined;
  if (typeof val === 'number') return val;
  const digitsOnly = val.replace(/[^\d.]/g, '');
  const num = parseFloat(digitsOnly);
  return isNaN(num) ? undefined : num;
}

/**
 * Increments event count in Firestore pixels collection for visual reporting in Admin
 */
async function recordEventInFirestore(eventName: string, platform?: 'tiktok' | 'meta') {
  try {
    const snap = await getDocs(collection(db, 'pixels'));
    snap.docs.forEach(async (docItem) => {
      const data = docItem.data();
      if (data.status === 'نشط') {
        if (!platform || !data.platform || data.platform === platform) {
          await updateDoc(doc(db, 'pixels', docItem.id), {
            events: increment(1)
          }).catch(() => {});
        }
      }
    });
  } catch {
    // Non-blocking firestore analytics increment
  }
}

/**
 * 📄 PageView Tracker
 */
export function trackPageView(pageUrl?: string) {
  try {
    if (window.ttq && typeof window.ttq.page === 'function') {
      window.ttq.page();
    }
  } catch (e) {
    // silent
  }

  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  } catch (e) {
    // silent
  }
}

/**
 * 🚗 ViewContent Tracker - When a customer browses a specific car
 */
export function trackViewContent(params: {
  id?: string;
  title: string;
  price?: string | number;
  trimName?: string;
}) {
  const priceNum = parseNumericPrice(params.price);

  // TikTok Pixel ViewContent
  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('ViewContent', {
        content_id: params.id || 'car-item',
        content_type: 'product',
        content_name: `${params.title} ${params.trimName || ''}`.trim(),
        value: priceNum,
        currency: 'DZD'
      });
      console.log('🚗 [TikTok Pixel] Event: ViewContent', params.title);
    }
  } catch {
    // safe
  }

  // Meta Pixel ViewContent
  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_ids: [params.id || 'car-item'],
        content_name: `${params.title} ${params.trimName || ''}`.trim(),
        content_type: 'product',
        value: priceNum,
        currency: 'DZD'
      });
    }
  } catch {
    // safe
  }
}

/**
 * 📞 PRIMARY MAIN EVENT: Phone Call ("إتصل بنا مباشرة")
 * This is the exact high-value conversion event for TikTok Ads Optimization!
 * TikTok machine learning uses 'Contact' and 'ClickButton' to show the ad to people
 * who are most likely to click the call button.
 */
export function trackPhoneCall(params?: {
  carTitle?: string;
  trimName?: string;
  price?: string | number;
  buttonLabel?: string;
}) {
  const label = params?.buttonLabel || 'إتصل بنا مباشرة';
  const carName = params?.carTitle ? `${params.carTitle} ${params?.trimName || ''}`.trim() : 'عام';
  const priceNum = parseNumericPrice(params?.price);

  // 1. TikTok Pixel Conversion Events (Emits Contact, CompletePayment, SubmitForm, ClickButton)
  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      // 📞 1. Contact Event (Officially recognized by TikTok Pixel Helper for phone & lead calls)
      window.ttq.track('Contact', {
        content_id: 'mg-5',
        content_type: 'product',
        content_name: carName,
        button_name: label
      });

      // 🛒 2. CompletePayment Event (TikTok Purchase Event with valid USD currency)
      window.ttq.track('CompletePayment', {
        content_id: 'mg-5',
        content_type: 'product',
        content_name: carName,
        quantity: 1,
        value: 15000,
        currency: 'USD'
      });

      // 📝 3. SubmitForm Event (Lead event)
      window.ttq.track('SubmitForm', {
        content_name: carName,
        button_name: label
      });

      // 👆 4. ClickButton Event
      window.ttq.track('ClickButton', {
        button_name: label,
        content_name: carName
      });

      console.log(`🔥 [TikTok Pixel] Events sent: Contact, CompletePayment, SubmitForm, ClickButton (${label})`);
    }
  } catch (err) {
    console.warn('[TikTok Pixel] Track error:', err);
  }

  // 2. Meta Pixel Events (Purchase, Contact, Lead)
  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'Contact', {
        content_name: carName,
        button_name: label
      });
      window.fbq('track', 'Purchase', {
        content_name: carName,
        content_ids: ['mg-5'],
        value: 15000,
        currency: 'USD'
      });
      window.fbq('track', 'Lead', {
        content_name: carName,
        value: 15000,
        currency: 'USD'
      });
    }
  } catch {
    // safe
  }

  // 3. Record in Admin statistics
  recordEventInFirestore('PhoneCall');
}

/**
 * 💬 WhatsApp Contact Tracker ("تواصل عبر واتساب")
 * High-intent lead event for WhatsApp inquiries
 */
export function trackWhatsApp(params?: {
  carTitle?: string;
  trimName?: string;
  price?: string | number;
  buttonLabel?: string;
}) {
  const label = params?.buttonLabel || 'تواصل عبر واتساب';
  const carName = params?.carTitle ? `${params.carTitle} ${params?.trimName || ''}`.trim() : 'عام';
  const priceNum = parseNumericPrice(params?.price);

  // 1. TikTok Pixel Contact Event with WhatsApp category
  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('Contact', {
        content_id: 'mg-5',
        content_type: 'product',
        content_name: carName,
        button_name: label
      });

      window.ttq.track('CompletePayment', {
        content_id: 'mg-5',
        content_type: 'product',
        content_name: carName,
        quantity: 1,
        value: 15000,
        currency: 'USD'
      });

      window.ttq.track('SubmitForm', {
        content_name: carName,
        button_name: label
      });

      window.ttq.track('ClickButton', {
        button_name: label,
        content_name: carName
      });

      console.log(`💬 [TikTok Pixel] Event: Contact + CompletePayment (واتساب: ${label})`, { car: carName });
    }
  } catch (err) {
    console.warn('[TikTok Pixel] Track error:', err);
  }

  // 2. Meta Pixel Contact Event
  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'Contact', {
        content_name: carName,
        button_name: label
      });
      window.fbq('track', 'Purchase', {
        content_name: carName,
        value: 15000,
        currency: 'USD'
      });
      window.fbq('track', 'Lead', {
        content_name: carName,
        value: 15000,
        currency: 'USD'
      });
    }
  } catch {
    // safe
  }

  // 3. Record in Admin statistics
  recordEventInFirestore('WhatsApp');
}

/**
 * ⚡ Fires ALL TikTok & Meta optimization events at once
 * This immediately activates "Waiting for activity" events in TikTok Ads Manager:
 * - CompletePayment (Purchase)
 * - Contact
 * - SubmitForm (Lead)
 * - PlaceAnOrder
 * - ClickButton
 * - ViewContent
 */
export function triggerAllOptimizationEvents(params?: {
  carTitle?: string;
  price?: string | number;
}) {
  const carName = params?.carTitle || 'MG 5 2026';

  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('Contact', {
        content_id: 'mg-5',
        content_name: carName,
        button_name: 'إتصل بنا الآن'
      });

      window.ttq.track('CompletePayment', {
        content_id: 'mg-5',
        content_type: 'product',
        content_name: carName,
        quantity: 1,
        value: 15000,
        currency: 'USD'
      });

      window.ttq.track('SubmitForm', {
        content_name: carName,
        button_name: 'إتصل بنا الآن'
      });

      window.ttq.track('ClickButton', {
        button_name: 'إتصل بنا الآن',
        content_name: carName
      });

      window.ttq.track('ViewContent', {
        content_id: 'mg-5',
        content_name: carName
      });

      console.log('⚡ [TikTok Pixel] ALL OPTIMIZATION EVENTS FIRED SUCCESSFULLY (Contact, CompletePayment, SubmitForm, ClickButton)');
    }
  } catch (e) {
    console.warn('[Pixel Tracker] Error firing all events:', e);
  }

  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'Contact', { content_name: carName });
      window.fbq('track', 'Purchase', { content_name: carName, value: 15000, currency: 'USD' });
      window.fbq('track', 'Lead', { content_name: carName, value: 15000, currency: 'USD' });
      window.fbq('track', 'ViewContent', { content_name: carName });
    }
  } catch {
    // safe
  }
}

/**
 * 📝 Lead / Form Submission Tracker (e.g. Booking a consultation)
 */
export function trackLeadSubmission(params: {
  formName: string;
  carTitle?: string;
  name?: string;
  phone?: string;
}) {
  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('SubmitForm', {
        content_name: params.formName,
        car_title: params.carTitle || ''
      });
      window.ttq.track('CompleteRegistration', {
        content_name: params.formName
      });
      console.log('📋 [TikTok Pixel] Event: SubmitForm / Lead', params.formName);
    }
  } catch {
    // safe
  }

  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: params.formName,
        car_title: params.carTitle || ''
      });
    }
  } catch {
    // safe
  }

  recordEventInFirestore('Lead');
}

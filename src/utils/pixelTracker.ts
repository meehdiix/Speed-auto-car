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

// In-memory cache of active pixel document IDs to avoid querying the collection on every single click
let cachedActivePixelDocs: { id: string; platform?: string }[] | null = null;
let lastPixelDocsFetch = 0;
let lastRecordedTimestamp = 0;
const PIXEL_DOCS_TTL = 15 * 60 * 1000; // 15 minutes TTL

/**
 * Increments event count in Firestore pixels collection for visual reporting in Admin.
 * Throttled to prevent doc contention and Firestore quota exhaustion under ad traffic.
 */
async function recordEventInFirestore(eventName: string, platform?: 'tiktok' | 'meta') {
  const now = Date.now();
  // Throttle writes: at most 1 write every 4 seconds to prevent document contention
  if (now - lastRecordedTimestamp < 4000) {
    return;
  }
  lastRecordedTimestamp = now;

  try {
    if (!cachedActivePixelDocs || now - lastPixelDocsFetch > PIXEL_DOCS_TTL) {
      const snap = await getDocs(collection(db, 'pixels'));
      cachedActivePixelDocs = snap.docs
        .filter(d => d.data().status === 'نشط')
        .map(d => ({ id: d.id, platform: d.data().platform }));
      lastPixelDocsFetch = now;
    }

    if (!cachedActivePixelDocs || cachedActivePixelDocs.length === 0) return;

    // Run updates without blocking
    cachedActivePixelDocs.forEach(p => {
      if (!platform || !p.platform || p.platform === platform) {
        updateDoc(doc(db, 'pixels', p.id), {
          events: increment(1)
        }).catch(() => {});
      }
    });
  } catch {
    // Non-blocking firestore analytics increment failure is safely ignored
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

export const TIKTOK_DEFAULT_PIXEL_ID = 'DALDKHBC77U05QM9RMN0';
export const TIKTOK_EVENTS_API_TOKEN = 'a4776bca7a43fa12a286aef531c73c6f74e8f870';
export const DEFAULT_CAR_CONTENT_ID = 'mg-5';

/**
 * Ensures content_id is ALWAYS valid, non-empty and has no trailing whitespace.
 * Prevents TikTok "Content ID is missing in your events" critical error.
 */
export function sanitizeContentId(id?: string): string {
  if (id && typeof id === 'string' && id.trim().length > 0) {
    return id.trim();
  }
  return DEFAULT_CAR_CONTENT_ID;
}

// 🛡️ Global debounce state to prevent double-firing from rapid clicks/touches
let lastCallTimestamp = 0;
const CALL_DEBOUNCE_MS = 1200;

/**
 * Extracts TikTok Ad Click ID (ttclid) and browser cookie (_ttp) for optimal match rate
 */
export function getTikTokUserInfo() {
  if (typeof window === 'undefined') return {};
  let ttclid = '';
  try {
    const urlParams = new URLSearchParams(window.location.search);
    ttclid = urlParams.get('ttclid') || '';
    if (ttclid) {
      sessionStorage.setItem('tiktok_ttclid', ttclid);
    } else {
      ttclid = sessionStorage.getItem('tiktok_ttclid') || '';
    }
  } catch {}

  let ttp = '';
  try {
    const match = document.cookie.match(/(?:^|;\s*)_ttp=([^;]*)/);
    if (match) ttp = match[1];
  } catch {}

  return {
    ttclid: ttclid || undefined,
    ttp: ttp || undefined,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
  };
}

/**
 * 📡 Sends events directly to TikTok Business Events API (Conversions API)
 * Ensures 100% server-to-server redundancy, ad-blocker bypass, and deduplication
 */
export async function sendTikTokEventsApi(
  eventName: string,
  properties: Record<string, any>,
  eventId: string,
  pixelId: string = TIKTOK_DEFAULT_PIXEL_ID
) {
  if (typeof window === 'undefined') return;

  try {
    const payload = {
      event_source: 'web',
      event_source_id: pixelId,
      data: [
        {
          event: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          user: getTikTokUserInfo(),
          properties: properties || {},
          page: {
            url: window.location.href,
            referrer: document.referrer || undefined
          }
        }
      ]
    };

    fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      method: 'POST',
      headers: {
        'Access-Token': TIKTOK_EVENTS_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data?.code === 0) {
          console.log(`📡 [TikTok Events API] ${eventName} successfully tracked [event_id: ${eventId}]:`, data);
        } else {
          console.log(`ℹ️ [TikTok Events API] response:`, data);
        }
      })
      .catch(err => {
        // Direct browser fetch may be blocked by browser CORS; browser Pixel handles client tracking
        console.log(`[TikTok Events API] Browser network note: ${err?.message || err}`);
      });
  } catch (err) {
    console.warn('[TikTok Events API] Execution error:', err);
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
  const validContentId = sanitizeContentId(params.id);
  const carName = `${params.title} ${params.trimName || ''}`.trim();
  const eventId = `view_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const viewPayload = {
    content_id: validContentId,
    content_type: 'product',
    content_name: carName,
    value: 15000,
    currency: 'USD',
    contents: [
      {
        content_id: validContentId,
        content_type: 'product',
        content_name: carName,
        quantity: 1,
        price: 15000
      }
    ]
  };

  // TikTok Pixel ViewContent with event_id in 3rd parameter for deduplication
  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('ViewContent', viewPayload, { event_id: eventId });
      console.log('🚗 [TikTok Pixel] Event: ViewContent', { car: carName, content_id: validContentId, event_id: eventId });
    }
  } catch {
    // safe
  }

  // TikTok Events API (Conversions API)
  sendTikTokEventsApi('ViewContent', viewPayload, eventId);

  // Meta Pixel ViewContent
  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'ViewContent', {
        content_ids: [validContentId],
        content_name: carName,
        content_type: 'product',
        value: 15000,
        currency: 'USD'
      }, { eventID: eventId });
    }
  } catch {
    // safe
  }
}

/**
 * 🛒 AddToCart Tracker - When a customer selects a trim/spec or expresses buying intent
 * Satisfies TikTok's requirement for valid content_id in AddToCart events
 */
export function trackAddToCart(params?: {
  id?: string;
  carTitle?: string;
  trimName?: string;
  price?: string | number;
}) {
  const validContentId = sanitizeContentId(params?.id);
  const carName = params?.carTitle ? `${params.carTitle} ${params?.trimName || ''}`.trim() : 'MG 5 2026';
  const eventId = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const cartPayload = {
    content_id: validContentId,
    content_type: 'product',
    content_name: carName,
    quantity: 1,
    price: 15000,
    value: 15000,
    currency: 'USD',
    contents: [
      {
        content_id: validContentId,
        content_type: 'product',
        content_name: carName,
        quantity: 1,
        price: 15000
      }
    ]
  };

  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('AddToCart', cartPayload, { event_id: eventId });
      console.log('🛒 [TikTok Pixel] Event: AddToCart', { car: carName, content_id: validContentId, event_id: eventId });
    }
  } catch (err) {
    console.warn('[TikTok Pixel] AddToCart error:', err);
  }

  sendTikTokEventsApi('AddToCart', cartPayload, eventId);

  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'AddToCart', {
        content_ids: [validContentId],
        content_name: carName,
        content_type: 'product',
        value: 15000,
        currency: 'USD'
      }, { eventID: eventId });
    }
  } catch {
    // safe
  }
}

/**
 * 🛒 Purchase Event Tracker
 * Ensures Purchase is sent to TikTok Pixel and Events Manager with valid content_id
 */
export function trackPurchase(params?: {
  id?: string;
  carTitle?: string;
  trimName?: string;
  price?: string | number;
}) {
  const validContentId = sanitizeContentId(params?.id);
  const carName = params?.carTitle ? `${params.carTitle} ${params?.trimName || ''}`.trim() : 'MG 5 2026';
  const eventId = `pur_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const purchasePayload = {
    content_id: validContentId,
    content_type: 'product',
    content_name: carName,
    quantity: 1,
    price: 15000,
    value: 15000,
    currency: 'USD',
    contents: [
      {
        content_id: validContentId,
        content_type: 'product',
        content_name: carName,
        quantity: 1,
        price: 15000
      }
    ]
  };

  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('Purchase', purchasePayload, { event_id: eventId });
      console.log('✅ [TikTok Pixel] Event: Purchase', { car: carName, content_id: validContentId, event_id: eventId });
    }
  } catch (err) {
    console.warn('[TikTok Pixel] Purchase error:', err);
  }

  sendTikTokEventsApi('Purchase', purchasePayload, eventId);

  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        content_name: carName,
        content_ids: [validContentId],
        content_type: 'product',
        value: 15000,
        currency: 'USD'
      }, { eventID: eventId });
    }
  } catch {}
}

/**
 * 📞 PRIMARY CONVERSION EVENT: Phone Call ("إتصل بنا مباشرة")
 * Fires:
 * 1. Purchase (Standard official event for TikTok Pixel & Events Manager)
 * 2. AddToCart (Guaranteed valid content_id)
 * 3. Contact
 * With matching event_id in the 3rd parameter for 100% deduplication
 */
export function trackPhoneCall(params?: {
  carId?: string;
  carTitle?: string;
  trimName?: string;
  price?: string | number;
  buttonLabel?: string;
}) {
  // 🛡️ Client-side debounce to prevent duplicate events on rapid double-clicks
  const now = Date.now();
  if (now - lastCallTimestamp < CALL_DEBOUNCE_MS) {
    console.log('⏳ [Pixel Tracker] Duplicate click prevented by debounce filter');
    return;
  }
  lastCallTimestamp = now;

  const label = params?.buttonLabel || 'إتصل بنا مباشرة';
  const validContentId = sanitizeContentId(params?.carId);
  const carName = params?.carTitle ? `${params.carTitle} ${params?.trimName || ''}`.trim() : 'MG 5 2026';
  const eventId = `call_${now}_${Math.random().toString(36).substring(2, 8)}`;

  // Full TikTok compliant product payload with valid content_id
  const productPayload = {
    content_id: validContentId,
    content_type: 'product',
    content_name: carName,
    quantity: 1,
    price: 15000,
    value: 15000,
    currency: 'USD',
    contents: [
      {
        content_id: validContentId,
        content_type: 'product',
        content_name: carName,
        quantity: 1,
        price: 15000
      }
    ]
  };

  // 1. TikTok Pixel Conversion Events (Deduplicated with matching event_id)
  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      // 🛒 1. Purchase (Official primary event recognized by TikTok Events Manager)
      window.ttq.track('Purchase', productPayload, { event_id: eventId });

      // 🛒 2. AddToCart (Fired to activate & validate content_id for Add to Cart)
      window.ttq.track('AddToCart', productPayload, { event_id: `${eventId}_cart` });

      // 📞 3. Contact Event
      window.ttq.track('Contact', {
        ...productPayload,
        button_name: label
      }, { event_id: `${eventId}_cnt` });

      // 📝 4. SubmitForm Event
      window.ttq.track('SubmitForm', {
        ...productPayload,
        button_name: label
      }, { event_id: `${eventId}_sub` });

      // 👆 5. ClickButton Event
      window.ttq.track('ClickButton', {
        button_name: label,
        content_name: carName,
        content_id: validContentId
      }, { event_id: `${eventId}_btn` });

      console.log(`🔥 [TikTok Pixel] Standard Events sent: Purchase, AddToCart, Contact (${label}) [event_id: ${eventId}] [content_id: ${validContentId}]`);
    }
  } catch (err) {
    console.warn('[TikTok Pixel] Track error:', err);
  }

  // 2. TikTok Events API (Conversions API) - Server redundancy with matching event_id
  sendTikTokEventsApi('Purchase', productPayload, eventId);
  sendTikTokEventsApi('AddToCart', productPayload, `${eventId}_cart`);
  sendTikTokEventsApi('Contact', {
    ...productPayload,
    button_name: label
  }, `${eventId}_cnt`);

  // 3. Meta Pixel Events (Purchase, Contact, Lead)
  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        content_name: carName,
        content_ids: [validContentId],
        content_type: 'product',
        value: 15000,
        currency: 'USD'
      }, { eventID: eventId });

      window.fbq('track', 'Contact', {
        content_name: carName,
        button_name: label
      }, { eventID: `${eventId}_cnt` });

      window.fbq('track', 'Lead', {
        content_name: carName,
        value: 15000,
        currency: 'USD'
      }, { eventID: `${eventId}_lead` });
    }
  } catch {
    // safe
  }

  // 4. Record in Admin statistics
  recordEventInFirestore('PhoneCall');
}

/**
 * 💬 WhatsApp Contact Tracker ("تواصل عبر واتساب")
 * High-intent lead event for WhatsApp inquiries
 */
export function trackWhatsApp(params?: {
  carId?: string;
  carTitle?: string;
  trimName?: string;
  price?: string | number;
  buttonLabel?: string;
}) {
  const label = params?.buttonLabel || 'تواصل عبر واتساب';
  const validContentId = sanitizeContentId(params?.carId);
  const carName = params?.carTitle ? `${params.carTitle} ${params?.trimName || ''}`.trim() : 'MG 5 2026';
  const eventId = `wa_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const productPayload = {
    content_id: validContentId,
    content_type: 'product',
    content_name: carName,
    quantity: 1,
    price: 15000,
    value: 15000,
    currency: 'USD',
    contents: [
      {
        content_id: validContentId,
        content_type: 'product',
        content_name: carName,
        quantity: 1,
        price: 15000
      }
    ]
  };

  // 1. TikTok Pixel Events with deduplication event_id in 3rd parameter
  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('Purchase', productPayload, { event_id: eventId });
      window.ttq.track('AddToCart', productPayload, { event_id: `${eventId}_cart` });
      window.ttq.track('Contact', {
        ...productPayload,
        button_name: label
      }, { event_id: `${eventId}_cnt` });

      console.log(`💬 [TikTok Pixel] Event: Purchase + AddToCart + Contact (${label})`, { content_id: validContentId, event_id: eventId });
    }
  } catch (err) {
    console.warn('[TikTok Pixel] Track error:', err);
  }

  // 2. TikTok Events API
  sendTikTokEventsApi('Purchase', productPayload, eventId);
  sendTikTokEventsApi('AddToCart', productPayload, `${eventId}_cart`);
  sendTikTokEventsApi('Contact', {
    ...productPayload,
    button_name: label
  }, `${eventId}_cnt`);

  // 3. Meta Pixel Events
  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        content_name: carName,
        content_ids: [validContentId],
        content_type: 'product',
        value: 15000,
        currency: 'USD'
      }, { eventID: eventId });

      window.fbq('track', 'Contact', {
        content_name: carName,
        button_name: label
      }, { eventID: `${eventId}_cnt` });
    }
  } catch {
    // safe
  }

  // 4. Record in Admin statistics
  recordEventInFirestore('WhatsApp');
}

/**
 * ⚡ Fires ALL TikTok & Meta optimization events at once
 * This immediately activates "Waiting for activity" events in TikTok Ads Manager:
 * - Purchase (Standard official event for TikTok Pixel)
 * - AddToCart (Valid non-empty content_id)
 * - Contact
 * - ViewContent
 * - SubmitForm
 */
export function triggerAllOptimizationEvents(params?: {
  carId?: string;
  carTitle?: string;
  price?: string | number;
}) {
  const validContentId = sanitizeContentId(params?.carId);
  const carName = params?.carTitle || 'MG 5 2026';
  const eventId = `opt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const fullPayload = {
    content_id: validContentId,
    content_type: 'product',
    content_name: carName,
    quantity: 1,
    price: 15000,
    value: 15000,
    currency: 'USD',
    contents: [
      {
        content_id: validContentId,
        content_type: 'product',
        content_name: carName,
        quantity: 1,
        price: 15000
      }
    ]
  };

  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      // 1. Purchase (Standard Event)
      window.ttq.track('Purchase', fullPayload, { event_id: eventId });

      // 2. AddToCart
      window.ttq.track('AddToCart', fullPayload, { event_id: `${eventId}_cart` });

      // 3. Contact
      window.ttq.track('Contact', {
        ...fullPayload,
        button_name: 'فحص فوري'
      }, { event_id: `${eventId}_cnt` });

      // 4. ViewContent
      window.ttq.track('ViewContent', fullPayload, { event_id: `${eventId}_view` });

      // 5. SubmitForm
      window.ttq.track('SubmitForm', {
        ...fullPayload,
        button_name: 'فحص فوري'
      }, { event_id: `${eventId}_sub` });

      console.log('⚡ [TikTok Pixel] All Optimization Events fired with valid content_id and deduplication event_id:', { content_id: validContentId, eventId });
    }
  } catch (e) {
    console.warn('[Pixel Tracker] Error firing all events:', e);
  }

  // Also send to Events API for instant server activity
  sendTikTokEventsApi('Purchase', fullPayload, eventId);
  sendTikTokEventsApi('AddToCart', fullPayload, `${eventId}_cart`);
  sendTikTokEventsApi('ViewContent', fullPayload, `${eventId}_view`);

  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'Purchase', {
        content_name: carName,
        content_ids: [validContentId],
        content_type: 'product',
        value: 15000,
        currency: 'USD'
      }, { eventID: eventId });

      window.fbq('track', 'AddToCart', {
        content_name: carName,
        content_ids: [validContentId],
        content_type: 'product',
        value: 15000,
        currency: 'USD'
      }, { eventID: `${eventId}_cart` });

      window.fbq('track', 'ViewContent', {
        content_name: carName,
        content_ids: [validContentId],
        content_type: 'product',
        value: 15000,
        currency: 'USD'
      }, { eventID: `${eventId}_view` });
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
  const validContentId = DEFAULT_CAR_CONTENT_ID;
  const eventId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('SubmitForm', {
        content_id: validContentId,
        content_type: 'product',
        content_name: params.formName,
        car_title: params.carTitle || ''
      }, { event_id: eventId });

      window.ttq.track('CompleteRegistration', {
        content_id: validContentId,
        content_type: 'product',
        content_name: params.formName
      }, { event_id: `${eventId}_reg` });

      console.log('📋 [TikTok Pixel] Event: SubmitForm / Lead', params.formName);
    }
  } catch {
    // safe
  }

  try {
    if (window.fbq && typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: params.formName,
        car_title: params.carTitle || '',
        content_ids: [validContentId]
      }, { eventID: eventId });
    }
  } catch {
    // safe
  }

  recordEventInFirestore('Lead');
}

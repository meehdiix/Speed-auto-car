import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useState, useEffect } from 'react';

export interface GeneralSettings {
  phone: string;
  address: string;
  email: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  heroBackgroundImage: string;
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;
  tiktokPixelId: string;
  metaPixelId: string;
}

export const DEFAULT_SETTINGS: GeneralSettings = {
  phone: '0541399342',
  address: 'الجزائر العاصمة، بئر مراد رايس',
  email: 'contact@speedautocar.dz',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  tiktok: 'https://tiktok.com',
  heroBackgroundImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000',
  cloudinaryCloudName: '',
  cloudinaryUploadPreset: '',
  tiktokPixelId: 'DALDKHBC77U05QM9RMN0',
  metaPixelId: ''
};

const STORAGE_KEY = 'speedauto_general_settings';
let inMemoryCache: GeneralSettings | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory TTL
let quotaExceeded = false;

function loadFromStorage(): GeneralSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

function saveToStorage(settings: GeneralSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  const now = Date.now();
  if (inMemoryCache && (now - lastFetchTime < CACHE_TTL_MS || quotaExceeded)) {
    return inMemoryCache;
  }

  const stored = loadFromStorage();

  if (quotaExceeded) {
    inMemoryCache = stored;
    return stored;
  }

  try {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Partial<GeneralSettings>;
      const merged: GeneralSettings = { ...DEFAULT_SETTINGS, ...data };
      inMemoryCache = merged;
      lastFetchTime = now;
      saveToStorage(merged);
      return merged;
    }
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    if (errMsg.includes('Quota limit exceeded') || errMsg.includes('resource-exhausted')) {
      quotaExceeded = true;
      console.warn('[Settings] Firestore quota limit reached; using cached/default settings.');
    } else {
      console.warn('[Settings] Unable to fetch settings from Firestore, using fallback:', errMsg);
    }
  }

  inMemoryCache = stored;
  return stored;
}

export function useGeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettings>(() => {
    return inMemoryCache || loadFromStorage();
  });

  useEffect(() => {
    let isMounted = true;
    getGeneralSettings().then((s) => {
      if (isMounted) setSettings(s);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return settings;
}

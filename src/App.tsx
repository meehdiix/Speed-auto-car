/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MetaPixelTracker from './components/MetaPixelTracker';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

// Public pages - eagerly imported for instant, zero-delay navigation
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductTemplate from './pages/ProductTemplate';
import About from './pages/AboutUs';
import Contact from './pages/Contact';

// Admin Pages - lazily loaded only when accessed
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const InventoryManager = lazy(() => import('./pages/admin/InventoryManager'));
const SettingsManager = lazy(() => import('./pages/admin/SettingsManager'));
const MediaManager = lazy(() => import('./pages/admin/MediaManager'));
const AnalyticsManager = lazy(() => import('./pages/admin/AnalyticsManager'));
const PixelManager = lazy(() => import('./pages/admin/PixelManager'));

// Layout wrapper for public pages to include Navbar and Footer
function PublicLayout() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);

  // 🌟 Butter-Smooth Inertial Scroll across the entire website
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    (window as any).lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  if (!fontsLoaded) {
    return <div className="min-h-screen bg-black flex items-center justify-center"></div>;
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MetaPixelTracker />
      <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white"><span className="animate-pulse">جاري التحميل...</span></div>}>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductTemplate />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AnalyticsManager />} />
            <Route path="inventory" element={<InventoryManager />} />
            <Route path="pixels" element={<PixelManager />} />
            <Route path="settings" element={<SettingsManager />} />
            <Route path="media" element={<MediaManager />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

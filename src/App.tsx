/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const ProductTemplate = lazy(() => import('./pages/ProductTemplate'));
const About = lazy(() => import('./pages/AboutUs'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const InventoryManager = lazy(() => import('./pages/admin/InventoryManager'));
const SettingsManager = lazy(() => import('./pages/admin/SettingsManager'));
const AnalyticsManager = lazy(() => import('./pages/admin/AnalyticsManager'));
const PixelManager = lazy(() => import('./pages/admin/PixelManager'));

// Layout wrapper for public pages to include Navbar and Footer
function PublicLayout() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="flex h-[80vh] items-center justify-center text-white"><span className="animate-pulse">جاري التحميل...</span></div>}>
          <Outlet />
        </Suspense>
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

  if (!fontsLoaded) {
    return <div className="min-h-screen bg-black flex items-center justify-center"></div>;
  }

  return (
    <BrowserRouter>
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
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

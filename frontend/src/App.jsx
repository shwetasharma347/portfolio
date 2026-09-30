import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { NavigationDrawer } from './components/layout/NavigationDrawer';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';

// Pages
import { HomePage } from './pages/HomePage';
import { BestSellersPage } from './pages/BestSellersPage';
import { TrendingStylesPage } from './pages/TrendingStylesPage';
import { MensFootwearPage } from './pages/MensFootwearPage';
import { WomensFootwearPage } from './pages/WomensFootwearPage';
import { KidsFootwearPage } from './pages/KidsFootwearPage';
import { CustomerReviewsPage } from './pages/CustomerReviewsPage';
import { SecureCheckoutPage } from './pages/SecureCheckoutPage';

// Scroll to top on route transition
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Toast notification for cart interactions
const Toast = () => {
  const { toastMessage } = useCart();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="px-5 py-3.5 rounded-2xl neo-raised bg-background text-primary font-headline font-semibold text-sm flex items-center gap-2.5 shadow-2xl border border-primary/20">
        <span className="material-symbols-outlined text-xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>
          check_circle
        </span>
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container relative">
      <ScrollToTop />
      <Navbar />
      <NavigationDrawer />
      <CartDrawer />
      <Toast />

      <div className="flex-grow flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/best-sellers" element={<BestSellersPage />} />
          <Route path="/trending" element={<TrendingStylesPage />} />
          <Route path="/men" element={<MensFootwearPage />} />
          <Route path="/women" element={<WomensFootwearPage />} />
          <Route path="/kids" element={<KidsFootwearPage />} />
          <Route path="/reviews" element={<CustomerReviewsPage />} />
          <Route path="/checkout" element={<SecureCheckoutPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}

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

// Error boundary to catch any unexpected runtime issues
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background text-on-surface">
          <div className="p-8 rounded-3xl neo-raised bg-background max-w-lg space-y-4">
            <span className="material-symbols-outlined text-5xl text-error">error</span>
            <h1 className="text-2xl font-bold font-headline">Something went wrong</h1>
            <p className="text-on-surface-variant text-sm font-body">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl neo-raised bg-background text-primary font-semibold text-sm neo-raised-interactive"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      <ErrorBoundary>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

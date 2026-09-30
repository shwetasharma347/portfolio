import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-background w-full rounded-t-2xl mt-auto shadow-[-6px_-6px_12px_rgba(255,255,255,0.6)] z-10 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 sm:px-12 py-12 max-w-7xl mx-auto relative before:absolute before:inset-x-12 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-outline-variant/40 before:to-transparent">
        {/* Brand & Copyright */}
        <div className="flex flex-col space-y-4 justify-center md:justify-start">
          <Link to="/" className="font-headline font-bold text-on-surface text-2xl tracking-tight">
            SILK FOOTWEAR
          </Link>
          <p className="font-body text-sm text-on-surface-variant max-w-xs">
            Sculpted comfort. Tactile neomorphic aesthetics engineered for effortless movement.
          </p>
          <div className="flex gap-4 pt-2">
            <button
              className="w-10 h-10 rounded-full neo-raised flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors neo-raised-interactive"
              aria-label="Website"
            >
              <span className="material-symbols-outlined text-lg">language</span>
            </button>
            <button
              className="w-10 h-10 rounded-full neo-raised flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors neo-raised-interactive"
              aria-label="Instagram"
            >
              <span className="material-symbols-outlined text-lg">photo_camera</span>
            </button>
          </div>
          <p className="text-xs text-on-surface-variant/70 pt-2">
            © {new Date().getFullYear()} Silk Footwear Co. All rights reserved.
          </p>
        </div>

        {/* Links Navigation */}
        <div className="col-span-1 md:col-span-2 flex flex-wrap gap-x-16 gap-y-6 md:justify-end">
          <nav className="flex flex-col space-y-3">
            <span className="font-bold text-on-surface mb-1 font-headline">Shop</span>
            <Link to="/men" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
              Men's Footwear
            </Link>
            <Link to="/women" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
              Women's Footwear
            </Link>
            <Link to="/kids" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
              Kids' Footwear
            </Link>
            <Link to="/trending" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
              Trending Styles
            </Link>
            <Link to="/best-sellers" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
              Best Sellers
            </Link>
          </nav>

          <nav className="flex flex-col space-y-3">
            <span className="font-bold text-on-surface mb-1 font-headline">Company</span>
            <Link to="/reviews" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
              Customer Reviews
            </Link>
            <span className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              Support Center
            </span>
            <span className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              Shipping & Returns
            </span>
            <span className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              Sustainability
            </span>
          </nav>

          <nav className="flex flex-col space-y-3">
            <span className="font-bold text-on-surface mb-1 font-headline">Legal</span>
            <span className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              Terms of Service
            </span>
            <Link to="/checkout" className="font-body text-sm text-on-surface-variant hover:text-primary transition-colors">
              Secure Checkout
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

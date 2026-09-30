import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
  const { totalItemCount, setIsCartOpen, setIsDrawerOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Men', path: '/men' },
    { name: 'Women', path: '/women' },
    { name: 'Kids', path: '/kids' },
    { name: 'Trending', path: '/trending' },
    { name: 'Best Sellers', path: '/best-sellers' },
    { name: 'Reviews', path: '/reviews' }
  ];

  return (
    <header
      className={`sticky top-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)]'
          : 'bg-background shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.6)]'
      }`}
    >
      <div className="flex justify-between items-center px-4 sm:px-8 py-4 max-w-7xl mx-auto">
        {/* Mobile Menu Button & Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2.5 rounded-xl text-primary font-semibold hover:text-primary transition-colors duration-200 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all neo-raised"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined block text-2xl">menu</span>
          </button>

          <Link
            to="/"
            className="font-headline font-bold text-on-surface text-xl sm:text-2xl tracking-tight hover:text-primary transition-colors flex items-center gap-2"
          >
            <span>SILK FOOTWEAR</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-3">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-body font-semibold transition-all duration-200 neo-interactive ${
                  isActive
                    ? 'neo-pressed text-primary'
                    : 'text-on-surface-variant hover:text-primary active:scale-95'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Cart and Checkout Link */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-primary font-semibold hover:text-primary transition-colors duration-200 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all neo-raised relative"
            aria-label="View Shopping Cart"
          >
            <span className="material-symbols-outlined text-xl">shopping_bag</span>
            <span className="hidden sm:inline font-medium">Cart</span>
            {totalItemCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold bg-primary text-white shadow-sm">
                {totalItemCount}
              </span>
            )}
          </button>

          <Link
            to="/checkout"
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm font-semibold neo-raised active:neo-pressed"
          >
            <span>Checkout</span>
            <span className="material-symbols-outlined text-base">lock</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

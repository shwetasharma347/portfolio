import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const NavigationDrawer = () => {
  const { isDrawerOpen, setIsDrawerOpen } = useCart();
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname, setIsDrawerOpen]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const links = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Men', path: '/men', icon: 'male' },
    { name: 'Women', path: '/women', icon: 'female' },
    { name: 'Kids', path: '/kids', icon: 'child_care' },
    { name: 'Trending Styles', path: '/trending', icon: 'local_fire_department' },
    { name: 'Best Sellers', path: '/best-sellers', icon: 'star' },
    { name: 'Customer Reviews', path: '/reviews', icon: 'rate_review' },
    { name: 'Secure Checkout', path: '/checkout', icon: 'lock' }
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 rounded-r-2xl bg-background shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.6)] z-50 transform transition-transform duration-300 ease-in-out flex flex-col p-6 ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-outline-variant/20">
          <span className="text-xl font-headline font-bold text-on-surface">SILK FOOTWEAR</span>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors neo-raised neo-raised-interactive"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto pr-1">
          {links.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-body font-medium transition-all ${
                  isActive
                    ? 'neo-pressed text-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary active:scale-95'
                }`}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info in drawer */}
        <div className="mt-auto pt-4 border-t border-outline-variant/20">
          <div className="p-4 rounded-xl neo-inset bg-background flex items-center space-x-3">
            <span className="material-symbols-outlined text-primary text-2xl">support_agent</span>
            <div>
              <p className="text-sm font-semibold text-on-surface">Need Help?</p>
              <p className="text-xs text-on-surface-variant">support@silkfootwear.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

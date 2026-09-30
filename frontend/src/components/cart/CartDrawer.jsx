import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, subtotal, tax } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const total = subtotal + tax;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background shadow-[-8px_0_16px_rgba(0,0,0,0.1),8px_0_16px_rgba(255,255,255,0.7)] flex flex-col p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">shopping_bag</span>
              <h2 className="font-headline font-bold text-xl text-on-surface">Your Bag</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-on-surface-variant hover:text-primary transition-colors neo-raised neo-raised-interactive"
              aria-label="Close cart"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Cart Item List */}
          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full neo-inset flex items-center justify-center text-on-surface-variant/60">
                <span className="material-symbols-outlined text-4xl">shopping_bag</span>
              </div>
              <h3 className="font-headline font-semibold text-lg text-on-surface">Your bag is empty</h3>
              <p className="text-sm text-on-surface-variant max-w-xs">
                Looks like you haven't added any pairs yet. Explore our handcrafted footwear collections!
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/best-sellers');
                }}
                className="mt-4 px-6 py-3 rounded-xl bg-background text-primary font-semibold neo-raised neo-raised-interactive"
              >
                Explore Best Sellers
              </button>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto py-4 space-y-4 pr-1">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="p-4 rounded-2xl neo-raised bg-background flex items-center gap-4 group"
                >
                  <div className="w-20 h-20 rounded-xl neo-inset overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-headline font-semibold text-sm text-on-surface">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Size: {item.size} | {item.color}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-bold text-sm text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                      {/* Stepper */}
                      <div className="flex items-center gap-2 neo-inset px-2 py-1 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold text-on-surface hover:text-primary"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold text-on-surface hover:text-primary"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="pt-4 border-t border-outline-variant/30 space-y-3">
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Estimated Tax (8.5%)</span>
                <span className="font-semibold text-on-surface">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Standard Shipping</span>
                <span className="font-semibold text-primary">FREE</span>
              </div>
              <div className="flex justify-between text-base font-bold text-on-surface pt-2 border-t border-outline-variant/20">
                <span>Estimated Total</span>
                <span className="text-primary text-xl">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-4 py-4 rounded-xl bg-background text-primary font-headline font-bold text-base neo-raised hover:text-tertiary transition-colors neo-raised-interactive flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('silk_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    // Default initial item as in Google Stitch checkout mockup
    return [
      {
        id: "aero-silk-runner",
        name: "Aero Silk Runner",
        price: 145.0,
        quantity: 1,
        size: 10,
        color: "Cloud White",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFD43U9BxRhvoT97sKf1abj9n0pvtWvibKuuxjjwwTWrpgzDg7TE8dG_Mp4VQ0R2Y9qLHhhX6Ye--BtavPpcG_tbrLkT5-bV4u5UxPRLOerSf2xrJI_tTlACe9M3cDlY7nLbwbwmFL-9IpLHyvv7whU3DykZRK8q1H0jOvUqlymhBNNBjg3TuzsxIfBkCY17vPZo07QMOpBqhUUiP0KtrSQTyJPW3o-McheUew2tdxv5uv-31q9mY"
      }
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('silk_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const addToCart = (product, quantity = 1, size = null) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          size: size || product.sizes?.[0] || 10,
          color: product.color || "Standard",
          image: product.image
        }
      ];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.085; // 8.5%
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        totalItemCount,
        isCartOpen,
        setIsCartOpen,
        isDrawerOpen,
        setIsDrawerOpen,
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

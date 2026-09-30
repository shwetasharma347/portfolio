import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product, showBadge = true, variant = 'standard' }) => {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 10);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-1 text-[#f59e0b]">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="material-symbols-outlined text-sm filled" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
        ))}
        {hasHalf && (
          <span className="material-symbols-outlined text-sm">
            star_half
          </span>
        )}
        <span className="text-on-surface-variant text-xs ml-1 font-medium">({product.reviewCount || 48})</span>
      </div>
    );
  };

  if (variant === 'featured') {
    return (
      <article className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-background rounded-3xl neo-raised p-6 flex flex-col md:flex-row gap-8 group">
        <div className="flex-1 rounded-2xl neo-inset overflow-hidden relative min-h-[300px]">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.badge && showBadge && (
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-tertiary neo-raised">
              {product.badge}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center space-y-4">
          {renderStars(product.rating)}
          <h4 className="text-3xl font-headline font-bold text-on-surface">{product.name}</h4>
          <p className="text-on-surface-variant line-clamp-3 leading-relaxed">{product.description}</p>
          <div className="text-2xl font-bold text-primary pt-2">${product.price.toFixed(2)}</div>
          <div className="pt-4 flex gap-4">
            <button
              onClick={() => addToCart(product, 1, selectedSize)}
              className="flex-1 py-3 rounded-xl bg-background text-primary font-semibold neo-raised hover:text-tertiary transition-colors neo-raised-interactive flex items-center justify-center space-x-2"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              <span>Add to Cart</span>
            </button>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-xl bg-background neo-raised transition-colors neo-raised-interactive ${
                isLiked ? 'text-error' : 'text-on-surface hover:text-error'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>
                favorite
              </span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-background rounded-xl p-6 neo-raised flex flex-col group transition-all duration-300">
      <div className="relative w-full aspect-square mb-6 rounded-xl overflow-hidden neo-pressed flex items-center justify-center p-4">
        {product.badge && showBadge && (
          <div className="absolute top-4 left-4 z-10">
            <span className={`${product.badgeColor || 'bg-[#e06c4f]'} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
              {product.badge}
            </span>
          </div>
        )}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur neo-raised transition-colors ${
            isLiked ? 'text-error' : 'text-on-surface-variant hover:text-error'
          }`}
          aria-label="Save to Wishlist"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105"
        />
      </div>

      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-headline font-semibold text-xl text-on-surface">{product.name}</h3>
            <span className="font-headline font-bold text-lg text-primary">${product.price.toFixed(2)}</span>
          </div>
          <p className="text-on-surface-variant text-sm font-body mb-3">{product.tagline || product.category}</p>
          {renderStars(product.rating)}
        </div>

        <div className="mt-6 pt-4 border-t border-outline-variant/20 flex gap-3 items-center">
          {product.sizes && (
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl neo-inset bg-background text-sm font-medium text-on-surface border-none focus:ring-0 outline-none"
            >
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  US {s}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => addToCart(product, 1, selectedSize)}
            className="flex-grow py-2.5 px-4 rounded-xl bg-background text-primary font-semibold text-sm neo-raised hover:text-tertiary transition-colors neo-raised-interactive flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">shopping_bag</span>
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
};

import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/common/ProductCard';
import { getProducts } from '../api/client';
import { useCart } from '../context/CartContext';

export const TrendingStylesPage = () => {
  const { addToCart } = useCart();
  const [productsList, setProductsList] = useState([]);
  const [ugcLiked, setUgcLiked] = useState(false);

  useEffect(() => {
    getProducts().then((data) => {
      setProductsList(data);
    });
  }, []);

  const auraProduct = productsList.find((p) => p.id === 'aura-runner') || productsList[0];
  const trendingList = productsList.filter((p) => p.isTrending || p.id !== 'aura-runner');

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Editorial Header */}
      <section className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neo-inset text-xs font-semibold text-primary mb-4">
          <span className="material-symbols-outlined text-sm filled" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_fire_department
          </span>
          <span>VIRAL ON SOCIAL</span>
        </div>
        <h1 className="font-headline font-semibold text-4xl md:text-6xl text-on-surface tracking-tight mb-4">
          Trending Now
        </h1>
        <p className="font-body text-on-surface-variant text-base sm:text-lg max-w-2xl mx-auto">
          The styles dominating your feed. Curated looks, viral silhouettes, and community favorites.
        </p>
      </section>

      {/* Bento Grid Layout */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Featured Viral Style (Full Width / 8 cols on desktop) */}
        <div className="md:col-span-8 bg-background rounded-2xl p-6 sm:p-8 neo-raised flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full md:w-1/2 aspect-square rounded-xl overflow-hidden neo-pressed p-3 flex items-center justify-center">
            <img
              className="w-full h-full object-cover rounded-lg"
              alt="The Aura Runner"
              src={auraProduct.image}
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 pr-2">
            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold tracking-wider uppercase">
              <span className="material-symbols-outlined text-base filled" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span>Viral Pick</span>
            </div>
            <h2 className="font-headline font-semibold text-3xl text-on-surface">{auraProduct.name}</h2>
            <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
              Spotted on streets from Tokyo to New York. The Aura redefines daily comfort with a hyper-minimalist profile and unparalleled cushioning.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <span className="font-headline font-bold text-2xl text-primary">${auraProduct.price.toFixed(2)}</span>
              <button
                onClick={() => addToCart(auraProduct, 1, 10)}
                className="bg-background text-primary font-semibold py-3 px-6 rounded-xl neo-raised hover:text-tertiary transition-colors neo-raised-interactive flex items-center gap-2 text-sm"
              >
                <span>Shop Aura</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* UGC Community Highlight (Side Column: 4 cols) */}
        <div className="md:col-span-4 bg-background rounded-2xl p-6 neo-raised flex flex-col justify-between">
          <div>
            <h3 className="font-headline font-semibold text-lg text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">alternate_email</span>
              <span>Community Spotted</span>
            </h3>
            <div className="w-full aspect-[4/5] rounded-xl overflow-hidden neo-pressed p-2 mb-4">
              <img
                className="w-full h-full object-cover rounded-lg"
                alt="Community Styled Footwear"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwphx86R-Tdr_P0HQNVwDy_Cs-mXsxQ6FFybg6WS4uF49Dojr9zJfU0gZXftOVZ-NZ53CFLX_zT8FlgPxluuB8OGjRKkDf21ZAd05m_6LzY8Mrwdh2OcpWoN_foAupbGPFz0D31oSYf8osogME_YoqyAX_NvH52Trhpmq3AqoGJ3hAPpGJXXdNInTyb9tAloHHc4Z4ifhCAt5bgjlv1Da-Mg9r8jR4JVM4ml_uZrTMmKZ5X_1HayA"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center neo-pressed">
                <span className="material-symbols-outlined text-sm text-on-surface-variant">person</span>
              </div>
              <span className="text-sm font-medium text-on-surface-variant">@stylemaven_</span>
            </div>
            <button
              onClick={() => setUgcLiked(!ugcLiked)}
              className={`w-9 h-9 rounded-full flex items-center justify-center neo-raised neo-interactive transition-colors ${
                ugcLiked ? 'text-error' : 'text-on-surface-variant hover:text-error'
              }`}
              aria-label="Like community post"
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: ugcLiked ? "'FILL' 1" : "'FILL' 0" }}>
                favorite
              </span>
            </button>
          </div>
        </div>

        {/* Neomorphic Inset Quote Card (4 cols) */}
        <div className="col-span-1 md:col-span-4 bg-background rounded-2xl p-8 neo-pressed flex flex-col justify-center items-center text-center">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-4 filled" style={{ fontVariationSettings: "'FILL' 1" }}>
            format_quote
          </span>
          <p className="font-body text-base sm:text-lg text-on-surface italic mb-4 leading-relaxed">
            "Silk has completely ruined other shoes for me. The comfort is insane, and the aesthetic just works with literally everything in my wardrobe."
          </p>
          <div className="text-sm font-semibold text-primary font-headline">— Highsnobiety Review</div>
        </div>

        {/* Trending Spotlight Cards (8 cols) */}
        <div className="col-span-1 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {trendingList.slice(0, 2).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Additional Trending Grid */}
      <section className="pt-6">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-6">More Dominating Silhouettes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(2).map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </main>
  );
};

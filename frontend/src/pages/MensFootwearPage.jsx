import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/common/ProductCard';
import { getProducts } from '../api/client';

export const MensFootwearPage = () => {
  const [productsList, setProductsList] = useState([]);
  const [selectedSize, setSelectedSize] = useState(10);
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [priceMax, setPriceMax] = useState(180);

  useEffect(() => {
    getProducts().then((data) => {
      setProductsList(data);
    });
  }, []);

  const occasions = ['All', 'Performance Running', 'Daily Lifestyle', 'Minimalist Training'];
  const sizes = [8, 9, 10, 11, 12, 13];

  const mensProducts = productsList.filter((p) => p.category === 'men' || p.category === 'trending');

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      {/* Filter Sidebar */}
      <aside className="hidden md:flex flex-col p-6 space-y-6 bg-background h-fit w-64 rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.6)] flex-shrink-0 sticky top-28">
        <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
          <span className="font-headline font-bold text-lg text-on-surface">Filters</span>
          <button
            onClick={() => {
              setSelectedSize(10);
              setSelectedOccasion('All');
              setPriceMax(180);
            }}
            className="text-xs text-primary font-medium hover:underline"
          >
            Reset
          </button>
        </div>

        {/* Size Filter */}
        <div>
          <h3 className="text-xs font-bold text-on-surface-variant mb-3 uppercase tracking-wider">Shoe Size (US)</h3>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`py-2 text-sm font-semibold rounded-xl transition-all ${
                  selectedSize === s
                    ? 'neo-pressed text-primary'
                    : 'neo-raised text-on-surface hover:text-primary active:scale-95'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion / Tag Filter */}
        <div>
          <h3 className="text-xs font-bold text-on-surface-variant mb-3 uppercase tracking-wider">Occasion</h3>
          <div className="space-y-2">
            {occasions.map((occ) => (
              <label key={occ} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="occasion"
                  checked={selectedOccasion === occ}
                  onChange={() => setSelectedOccasion(occ)}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                    selectedOccasion === occ ? 'neo-pressed text-primary' : 'neo-raised'
                  }`}
                >
                  {selectedOccasion === occ && (
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  )}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    selectedOccasion === occ ? 'text-primary font-semibold' : 'text-on-surface group-hover:text-primary'
                  }`}
                >
                  {occ}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Slider Filter */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Max Price</h3>
            <span className="text-sm font-bold text-primary">${priceMax}</span>
          </div>
          <input
            type="range"
            min="100"
            max="200"
            step="5"
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full accent-primary bg-background cursor-pointer"
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-grow">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-on-surface mb-2">Men's Footwear</h1>
          <p className="text-on-surface-variant font-body text-base sm:text-lg">
            Architectural precision meets cloud-like cushioning. Every pair features our signature neomorphic foam sole.
          </p>

          {/* Quick Active Filter Badges */}
          <div className="flex items-center gap-2 mt-4 text-xs font-medium text-on-surface-variant flex-wrap">
            <span>Active filters:</span>
            <span className="px-2.5 py-1 rounded-lg neo-inset text-primary">US {selectedSize}</span>
            <span className="px-2.5 py-1 rounded-lg neo-inset text-primary">{selectedOccasion}</span>
            <span className="px-2.5 py-1 rounded-lg neo-inset text-primary">Up to ${priceMax}</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mensProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};

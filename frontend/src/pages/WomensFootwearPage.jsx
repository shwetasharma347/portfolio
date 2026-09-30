import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/common/ProductCard';
import { getProducts } from '../api/client';

export const WomensFootwearPage = () => {
  const [productsList, setProductsList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    getProducts().then((data) => {
      setProductsList(data);
    });
  }, []);

  const categories = ['All', 'Heels', 'Sneakers', 'Flats', 'Boots'];

  const womensProducts = productsList.map((p, idx) => ({
    ...p,
    id: `women-${p.id}`,
    name: idx === 0 ? "Silk Elegance Runner" : idx === 1 ? "CloudStep Pulse" : idx === 2 ? "Aura Minimalist Flat" : p.name,
    category: "women"
  }));

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner */}
      <section className="rounded-2xl bg-background neo-raised overflow-hidden relative min-h-[280px] sm:min-h-[320px] flex items-center justify-center p-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsyFtpJbuPrc_4OxGfLtQUKm3hkPBpjUWVgSpsb6t67FWZeC64UnvRg-zr2VIXbvo9TFL-Nomka5mB3AwnnWV94G8pnIaQXgg10kXAUkcsCXf5ENIxzf7NVgcC8-MRNoMs1xGkhTDKSI-DAdnNHuQ7_sfm2TnQBQIcuED3eYSObjstnppmpGjH7tulF_YhvsW8BjwP_tzdRkjiwfJmjzh8AsnwUE6UY0L_NXmV3vlnOFGskK3-8Zk')`
          }}
        />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neo-inset text-xs font-semibold text-primary mb-3">
            <span>WOMEN'S COLLECTION 2024</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-headline font-bold text-on-surface mb-3 tracking-tight">
            Step into Confidence
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
            Discover our latest collection of premium women's footwear, designed for tactile elegance and crafted for all-day comfort.
          </p>
        </div>
      </section>

      {/* Filters & Sort Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'neo-pressed text-primary font-semibold'
                  : 'neo-raised text-on-surface-variant hover:text-primary active:neo-pressed'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background neo-raised text-on-surface-variant text-sm font-medium">
            <span className="material-symbols-outlined text-lg">sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none text-on-surface text-sm font-medium focus:ring-0 cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {womensProducts.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </main>
  );
};

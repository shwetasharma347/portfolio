import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
import { getProducts } from '../api/client';
import { products as fallbackProducts } from '../data/products';

export const BestSellersPage = () => {
  const [productsList, setProductsList] = useState(fallbackProducts.filter((p) => p.isBestSeller));
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    getProducts({ isBestSeller: true }).then((data) => {
      if (data && data.length) setProductsList(data);
    });
  }, []);

  const bestSellersList = productsList.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.category === selectedFilter;
  });

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8">
      {/* Category Sidebar */}
      <aside className="hidden md:flex flex-col p-6 space-y-4 bg-background h-fit w-64 rounded-2xl shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.6)] flex-shrink-0 sticky top-28">
        <h2 className="text-xl font-semibold text-on-surface font-headline mb-2">Categories</h2>
        <nav className="flex flex-col gap-2.5 font-body font-medium">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all active:scale-95 text-left text-sm ${
              selectedFilter === 'all'
                ? 'neo-pressed text-primary font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-xl">category</span>
            <span>All Best Sellers</span>
          </button>
          <button
            onClick={() => setSelectedFilter('men')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all active:scale-95 text-left text-sm ${
              selectedFilter === 'men'
                ? 'neo-pressed text-primary font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-xl">male</span>
            <span>Men</span>
          </button>
          <button
            onClick={() => setSelectedFilter('women')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all active:scale-95 text-left text-sm ${
              selectedFilter === 'women'
                ? 'neo-pressed text-primary font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-xl">female</span>
            <span>Women</span>
          </button>
          <button
            onClick={() => setSelectedFilter('kids')}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all active:scale-95 text-left text-sm ${
              selectedFilter === 'kids'
                ? 'neo-pressed text-primary font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-xl">child_care</span>
            <span>Kids</span>
          </button>
          <Link
            to="/trending"
            className="flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-container-low hover:text-primary rounded-xl transition-all active:scale-95 text-sm"
          >
            <span className="material-symbols-outlined text-xl">local_fire_department</span>
            <span>Trending</span>
          </Link>
        </nav>
      </aside>

      {/* Main Product Catalog Area */}
      <section className="flex-grow">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neo-inset text-xs font-semibold text-primary mb-3">
            <span className="material-symbols-outlined text-sm">stars</span>
            <span>COMMUNITY RATED 4.8+</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-on-surface font-headline tracking-tight mb-2">
            Best Sellers
          </h1>
          <p className="text-on-surface-variant font-body text-base sm:text-lg">
            Our highest-rated footwear, engineered with sculpted neomorphic support and loved by thousands.
          </p>

          {/* Mobile Filter Tabs */}
          <div className="flex md:hidden gap-2 overflow-x-auto py-4 no-scrollbar">
            {['all', 'men', 'women', 'kids'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap ${
                  selectedFilter === f ? 'neo-pressed text-primary' : 'neo-raised text-on-surface-variant'
                }`}
              >
                {f === 'all' ? 'All Pairs' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestSellersList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

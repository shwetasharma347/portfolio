import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/common/ProductCard';
import { getProducts } from '../api/client';

export const KidsFootwearPage = () => {
  const [productsList, setProductsList] = useState([]);
  const [selectedAge, setSelectedAge] = useState('Toddlers');
  const [selectedClosure, setSelectedClosure] = useState('Velcro');

  useEffect(() => {
    getProducts().then((data) => {
      setProductsList(data);
    });
  }, []);

  const ageGroups = ['Toddlers', 'Little Kids', 'Big Kids'];
  const closures = ['Velcro', 'Slip-on', 'Laces'];

  const kidsProductList = productsList.map((p, i) => ({
    ...p,
    id: `kids-${p.id}`,
    name: i === 0 ? "PlayStride Lite" : i === 1 ? "Mini Bounce Pro" : "Junior CloudStep",
    category: "kids",
    price: i === 0 ? 75.0 : i === 1 ? 65.0 : 80.0,
    badge: i === 0 ? "PARENT FAVORITE" : "DURABLE",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6nU-Hp-pWYYiVFBYHKmvqWD6oS2Ta_6SOHYrnqoWpUCTSiGewH7m7DlVq7AU_1JYSFjdxWtnG7JDdD66DQvyq2L_6tlLX5HdQrY5lbJcYNhXwMxwCmfOam9E-6BLzEz3OFQ_bMc9liOuqS49thpggRLYP7za-5wZV8lmZVekHqazwh3JGPx4Ooio505nu2LyAhHIchTSZ1wiOHZlMIFNQ-4iYUXRSZwNMQEWmGWSorAW5yffUgMo"
  }));

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Banner */}
      <section className="bg-surface neo-raised rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neo-inset text-xs font-bold text-tertiary">
            <span className="material-symbols-outlined text-sm">toys</span>
            <span>PLAYGROUND TESTED</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-headline text-on-surface leading-tight tracking-tight">
            Fun, Durable, &amp; Supportive Steps
          </h1>
          <p className="text-on-surface-variant text-base sm:text-lg font-body leading-relaxed">
            Discover footwear designed for the playground, the classroom, and everywhere in between. Built with flexible neomorphic soles that support growing feet.
          </p>
        </div>

        <div className="w-full md:w-1/2 h-64 md:h-72 bg-surface neo-pressed rounded-2xl overflow-hidden relative flex items-center justify-center p-4">
          <img
            alt="Kids Sneakers"
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6nU-Hp-pWYYiVFBYHKmvqWD6oS2Ta_6SOHYrnqoWpUCTSiGewH7m7DlVq7AU_1JYSFjdxWtnG7JDdD66DQvyq2L_6tlLX5HdQrY5lbJcYNhXwMxwCmfOam9E-6BLzEz3OFQ_bMc9liOuqS49thpggRLYP7za-5wZV8lmZVekHqazwh3JGPx4Ooio505nu2LyAhHIchTSZ1wiOHZlMIFNQ-4iYUXRSZwNMQEWmGWSorAW5yffUgMo"
          />
        </div>
      </section>

      {/* Filters Section */}
      <section className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-background p-6 rounded-2xl neo-raised">
        {/* Age Group */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="font-semibold text-sm text-on-surface font-headline min-w-[90px]">Age Group:</span>
          <div className="flex flex-wrap gap-2.5">
            {ageGroups.map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedAge === age
                    ? 'neo-pressed text-primary'
                    : 'neo-raised text-on-surface-variant hover:text-primary active:neo-pressed'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* Closure */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="font-semibold text-sm text-on-surface font-headline min-w-[80px]">Closure:</span>
          <div className="flex flex-wrap gap-2.5">
            {closures.map((closure) => (
              <button
                key={closure}
                onClick={() => setSelectedClosure(closure)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  selectedClosure === closure
                    ? 'neo-pressed text-primary'
                    : 'neo-raised text-on-surface-variant hover:text-primary active:neo-pressed'
                }`}
              >
                {selectedClosure === closure && (
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                )}
                <span>{closure}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {kidsProductList.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </main>
  );
};

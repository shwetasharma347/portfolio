import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/common/ProductCard';
import { getProducts, getCategories } from '../api/client';

export const HomePage = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getProducts(), getCategories()])
      .then(([prods, cats]) => {
        if (isMounted) {
          setProductsList(prods);
          setCategoriesList(cats);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const featuredProduct = productsList.find((p) => p.id === 'silk-aeris-pro') || productsList[0];
  const gridProducts = productsList.filter((p) => p.id !== 'silk-aeris-pro').slice(0, 4);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero Section */}
      <section className="relative w-full rounded-3xl overflow-hidden neo-raised bg-background p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 min-h-[500px]">
        <div className="flex-1 space-y-6 z-10 relative px-2 sm:px-0">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full neo-inset text-sm font-medium text-tertiary">
            <span className="material-symbols-outlined text-sm">flare</span>
            <span>Introducing CloudStep Technology</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-on-surface leading-tight tracking-tight">
            The Future of <br />
            <span className="text-primary bg-clip-text">Comfort.</span>
          </h1>

          <p className="text-lg text-on-surface-variant max-w-md font-body leading-relaxed">
            Experience weightless movement with our new neomorphic-inspired sole design. Crafted for the modern journey.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/best-sellers"
              className="px-8 py-4 rounded-xl bg-background text-primary font-semibold text-lg neo-raised hover:text-tertiary transition-colors neo-raised-interactive flex items-center space-x-2"
            >
              <span>Shop the Collection</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>

            <Link
              to="/trending"
              className="px-8 py-4 rounded-xl bg-background text-on-surface font-semibold text-lg neo-inset hover:text-primary transition-colors flex items-center space-x-2"
            >
              <span className="material-symbols-outlined">play_circle</span>
              <span>Watch Story</span>
            </Link>
          </div>
        </div>

        {/* Hero Visual Area */}
        <div className="flex-1 w-full h-[380px] md:h-[460px] relative rounded-2xl neo-inset overflow-hidden flex items-center justify-center p-4">
          <div
            className="w-full h-full bg-cover bg-center rounded-xl absolute inset-0 opacity-95 transition-transform duration-1000 hover:scale-105"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqAkzS6r2zod0aZFMlUpTUgT__07unzd-ZJYP-HMGvRjexJ5Z-CcQfW92LE8KZptohSwtf1pb8_GW35dx1A9vZ9PrfhPmxxETi1qWh_JIvPx29upwV57afXlkvHk12ZJ3VfKGdvLl1Fgsil_JyvLiVNeHQVZKj2NwkSuEDE3cQd61-3_s0GIfPeKjQ48y_Aamzob6CkRvaxWD2BPUvaBKlYjGfJN2ntv0ZcF6r3LooBZwtPOMj7H8')`
            }}
          />
          {/* Badge Overlay */}
          <div className="absolute bottom-6 right-6 px-4 py-3 rounded-xl neo-raised bg-background/90 backdrop-blur-sm flex items-center space-x-3 border border-white/20 shadow-lg">
            <div className="w-3 h-3 rounded-full bg-tertiary animate-pulse" />
            <span className="text-sm font-semibold text-on-surface font-headline">CloudStep Series X</span>
          </div>
        </div>
      </section>

      {/* Quick Access Categories (Circular Cards) */}
      <section className="py-4">
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface tracking-tight">
              Explore Collections
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">Tactile silhouettes designed for every stride</p>
          </div>
          <Link
            to="/best-sellers"
            className="text-sm font-semibold text-primary hover:text-tertiary transition-colors flex items-center group"
          >
            <span>View All</span>
            <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">
              east
            </span>
          </Link>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-6 pt-2 px-2 no-scrollbar snap-x snap-mandatory">
          {categoriesList.map((cat) => (
            <Link
              key={cat.id}
              to={cat.path}
              className="flex flex-col items-center gap-3 snap-start shrink-0 group focus:outline-none"
            >
              <div
                className={`w-24 h-24 rounded-full bg-background flex items-center justify-center transition-all ${
                  cat.highlight
                    ? 'neo-inset text-tertiary'
                    : 'neo-raised text-on-surface group-hover:text-primary neo-raised-interactive'
                }`}
              >
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ fontVariationSettings: cat.highlight ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {cat.icon}
                </span>
              </div>
              <span
                className={`font-medium text-sm transition-colors ${
                  cat.highlight ? 'text-tertiary font-bold' : 'text-on-surface group-hover:text-primary'
                }`}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Drops Bento Grid */}
      <section className="py-4">
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface tracking-tight">Featured Drops</h2>
            <p className="text-sm text-on-surface-variant mt-1">Hand-picked neomorphic sneakers with ultra-cushioning</p>
          </div>
          <Link to="/trending" className="text-sm font-semibold text-primary hover:text-tertiary transition-colors">
            See Trending
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Large Hero Card */}
          <ProductCard product={featuredProduct} variant="featured" />

          {/* Grid Products */}
          {gridProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Silk Club Newsletter Banner */}
      <section className="rounded-3xl neo-raised p-8 sm:p-12 relative overflow-hidden bg-background">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <h3 className="text-3xl font-headline font-bold text-on-surface">Join the Silk Club</h3>
            <p className="text-on-surface-variant font-body max-w-md">
              Get exclusive early access to drops, member-only neomorphic colorways, and 15% off your first order.
            </p>
          </div>

          <div className="w-full max-w-md">
            {subscribed ? (
              <div className="p-4 rounded-xl neo-inset bg-background text-primary font-semibold text-center flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-xl">check_circle</span>
                <span>Welcome to Silk Club! Check your inbox for your 15% coupon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 rounded-xl neo-inset bg-background flex items-center px-4 py-3">
                  <span className="material-symbols-outlined text-on-surface-variant mr-3">mail</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-transparent border-none outline-none focus:ring-0 text-on-surface w-full placeholder-on-surface-variant/60 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-background text-primary font-bold neo-raised hover:text-tertiary transition-colors neo-raised-interactive text-sm"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

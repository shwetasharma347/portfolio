import React, { useState, useEffect } from 'react';
import { reviews as initialReviews, reviewStats as initialStats } from '../data/reviews';
import { getReviews, submitReview, voteReview } from '../api/client';

export const CustomerReviewsPage = () => {
  const [reviewsList, setReviewsList] = useState(initialReviews);
  const [stats, setStats] = useState(initialStats);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', title: '', content: '', rating: 5 });

  useEffect(() => {
    getReviews().then(({ reviews, stats: s }) => {
      if (reviews) setReviewsList(reviews);
      if (s) setStats(s);
    });
  }, []);

  const filterOptions = ['All', 'With Photos', 'Verified Buyers', 'Comfort', 'Durability'];

  const handleVote = async (id, type) => {
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            helpfulCount: type === 'up' ? r.helpfulCount + 1 : r.helpfulCount,
            unhelpfulCount: type === 'down' ? r.unhelpfulCount + 1 : r.unhelpfulCount
          };
        }
        return r;
      })
    );

    try {
      await voteReview(id, type);
    } catch (err) {
      console.warn('API vote sync issue:', err);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.content) return;

    try {
      const res = await submitReview({
        name: newReview.name,
        title: newReview.title || 'Exceptional experience',
        content: newReview.content,
        rating: newReview.rating
      });

      if (res && res.data) {
        setReviewsList((prev) => [res.data, ...prev]);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.warn('Backend review submit failed, using fallback:', err);
      const created = {
        id: Date.now(),
        author: newReview.name,
        verified: true,
        rating: newReview.rating,
        date: 'Just now',
        title: newReview.title || 'Exceptional experience',
        content: newReview.content,
        helpfulCount: 0,
        unhelpfulCount: 0
      };
      setReviewsList((prev) => [created, ...prev]);
    }

    setIsWriteModalOpen(false);
    setNewReview({ name: '', title: '', content: '', rating: 5 });
  };

  return (
    <main className="flex-grow container mx-auto px-4 md:px-8 py-10 max-w-6xl">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-headline font-bold text-on-surface mb-2">Customer Reviews</h1>
          <p className="text-on-surface-variant text-base">
            Verified feedback from wearers testing our neomorphic footwear around the globe.
          </p>
        </div>
        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="px-6 py-3 rounded-xl bg-background text-primary font-bold text-sm neo-raised hover:text-tertiary transition-colors neo-raised-interactive flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-lg">rate_review</span>
          <span>Write a Review</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Rating Breakdown & Filters */}
        <div className="lg:col-span-4 space-y-8">
          {/* Overall Rating Card */}
          <div className="bg-background neo-raised rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="text-6xl font-headline font-extrabold text-primary mb-2">
              {stats.averageRating}
            </div>
            <div className="flex gap-1 text-primary mb-2">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="material-symbols-outlined filled text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
              <span className="material-symbols-outlined text-2xl">star_half</span>
            </div>
            <div className="text-sm font-medium text-on-surface-variant">
              Based on {stats.totalReviews.toLocaleString()} reviews
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-background neo-raised rounded-2xl p-6 sm:p-8">
            <h3 className="font-headline font-bold mb-6 text-lg text-on-surface">Rating Distribution</h3>
            <div className="space-y-4">
              {stats.distribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-4">
                  <span className="text-xs font-semibold w-12 shrink-0 text-on-surface">{dist.label}</span>
                  <div className="flex-grow h-3.5 bg-background neo-pressed rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500 shadow-[2px_0_6px_rgba(99,102,241,0.5)]"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-on-surface-variant w-9 text-right">
                    {dist.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Filter Tags */}
          <div className="bg-background neo-raised rounded-2xl p-6 sm:p-8">
            <h3 className="font-headline font-bold mb-4 text-lg text-on-surface">Filter Reviews</h3>
            <div className="flex flex-wrap gap-2.5">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setActiveFilter(opt)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeFilter === opt
                      ? 'neo-pressed text-primary font-bold'
                      : 'neo-raised text-on-surface-variant hover:text-primary active:neo-pressed'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Review Cards */}
        <div className="lg:col-span-8 space-y-6">
          {reviewsList.map((review) => (
            <article key={review.id} className="bg-background neo-raised rounded-2xl p-6 sm:p-8 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h4 className="font-headline font-bold text-lg text-on-surface">{review.author}</h4>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md neo-pressed">
                        <span className="material-symbols-outlined text-sm filled" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 text-primary text-sm mb-1">
                    {[...Array(review.rating)].map((_, idx) => (
                      <span key={idx} className="material-symbols-outlined text-base filled" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-on-surface-variant">Reviewed on {review.date}</div>
                </div>
              </div>

              <h5 className="font-headline font-bold text-base text-on-surface mb-2">{review.title}</h5>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6 font-body">
                {review.content}
              </p>

              {/* Helpful Votes */}
              <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/20">
                <span className="text-xs text-on-surface-variant">Was this review helpful?</span>
                <button
                  onClick={() => handleVote(review.id, 'up')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-background neo-raised text-xs font-semibold text-primary neo-interactive"
                >
                  <span className="material-symbols-outlined text-sm">thumb_up</span>
                  <span>{review.helpfulCount}</span>
                </button>
                <button
                  onClick={() => handleVote(review.id, 'down')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-background neo-raised text-xs font-semibold text-on-surface-variant neo-interactive"
                >
                  <span className="material-symbols-outlined text-sm">thumb_down</span>
                  <span>{review.unhelpfulCount}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
          <div className="bg-background rounded-3xl neo-raised p-6 sm:p-8 max-w-lg w-full space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-xl text-on-surface">Share Your Feedback</h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-2 rounded-full neo-raised text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full neo-inset rounded-xl px-4 py-2.5 text-on-surface bg-background border-none focus:ring-0 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: s })}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        newReview.rating >= s ? 'neo-pressed text-primary' : 'neo-raised text-on-surface-variant'
                      }`}
                    >
                      {s}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">Headline</label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="e.g. The most comfortable shoes I've ever owned"
                  className="w-full neo-inset rounded-xl px-4 py-2.5 text-on-surface bg-background border-none focus:ring-0 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-1">Review</label>
                <textarea
                  rows="4"
                  required
                  value={newReview.content}
                  onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                  placeholder="Share details about the fit, texture, and everyday wear..."
                  className="w-full neo-inset rounded-xl px-4 py-2.5 text-on-surface bg-background border-none focus:ring-0 text-sm resize-none"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl neo-raised text-on-surface-variant font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-background text-primary font-bold text-sm neo-raised hover:text-tertiary neo-raised-interactive"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

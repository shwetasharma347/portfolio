import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

/**
 * Dynamically recalculate aggregate review stats from review list
 */
function calculateReviewStats(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 5.0,
      totalReviews: 0,
      distribution: [
        { stars: 5, label: "5 Stars", percentage: 100 },
        { stars: 4, label: "4 Stars", percentage: 0 },
        { stars: 3, label: "3 Stars", percentage: 0 },
        { stars: 2, label: "2 Stars", percentage: 0 },
        { stars: 1, label: "1 Star", percentage: 0 }
      ]
    };
  }

  const total = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
  const averageRating = Math.round((sum / total) * 10) / 10;

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
    counts[star] = (counts[star] || 0) + 1;
  });

  const distribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    label: `${stars} Star${stars > 1 ? 's' : ''}`,
    percentage: Math.round((counts[stars] / total) * 100)
  }));

  return {
    averageRating,
    totalReviews: total,
    distribution
  };
}

// GET /api/reviews - Get reviews with stats and optional filters (?rating=5, ?sort=helpful|newest)
router.get('/', (req, res) => {
  try {
    const db = readDB();
    let reviews = db.reviews || [];
    const stats = calculateReviewStats(reviews);

    const { rating, sort } = req.query;

    if (rating) {
      const targetRating = parseInt(rating);
      if (!isNaN(targetRating)) {
        reviews = reviews.filter(r => Math.round(r.rating) === targetRating);
      }
    }

    if (sort === 'helpful') {
      reviews = [...reviews].sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    } else if (sort === 'newest') {
      reviews = [...reviews].sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return res.json({
      success: true,
      stats,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving reviews',
      error: error.message
    });
  }
});

// POST /api/reviews - Post a new review
router.post('/', (req, res) => {
  try {
    const { name, author, title, content, rating } = req.body;
    const reviewerName = (author || name || '').trim();

    if (!reviewerName || !content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reviewer name and review content are required'
      });
    }

    const numericRating = Math.min(5, Math.max(1, parseInt(rating) || 5));

    const db = readDB();
    db.reviews = db.reviews || [];

    const newReview = {
      id: Date.now(),
      author: reviewerName,
      verified: true,
      rating: numericRating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      title: (title || 'Exceptional experience').trim(),
      content: content.trim(),
      helpfulCount: 0,
      unhelpfulCount: 0
    };

    db.reviews.unshift(newReview);
    const updatedStats = calculateReviewStats(db.reviews);
    db.reviewStats = updatedStats;

    writeDB(db);

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: newReview,
      stats: updatedStats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error adding review',
      error: error.message
    });
  }
});

// POST /api/reviews/:id/vote - Vote helpful or unhelpful
router.post('/:id/vote', (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const { type } = req.body; // 'up' or 'down'

    if (!['up', 'down'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Vote type must be 'up' or 'down'"
      });
    }

    const db = readDB();
    db.reviews = db.reviews || [];
    const reviewIndex = db.reviews.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Review with ID ${reviewId} not found`
      });
    }

    if (type === 'up') {
      db.reviews[reviewIndex].helpfulCount = (db.reviews[reviewIndex].helpfulCount || 0) + 1;
    } else {
      db.reviews[reviewIndex].unhelpfulCount = (db.reviews[reviewIndex].unhelpfulCount || 0) + 1;
    }

    writeDB(db);

    return res.json({
      success: true,
      message: `Vote recorded for review ${reviewId}`,
      data: db.reviews[reviewIndex]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating vote',
      error: error.message
    });
  }
});

// DELETE /api/reviews/:id - Delete a review
router.delete('/:id', (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const db = readDB();
    db.reviews = db.reviews || [];

    const initialLen = db.reviews.length;
    db.reviews = db.reviews.filter(r => r.id !== reviewId);

    if (db.reviews.length === initialLen) {
      return res.status(404).json({
        success: false,
        message: `Review with ID ${reviewId} not found`
      });
    }

    const updatedStats = calculateReviewStats(db.reviews);
    db.reviewStats = updatedStats;
    writeDB(db);

    return res.json({
      success: true,
      message: `Review ${reviewId} deleted successfully`,
      stats: updatedStats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting review',
      error: error.message
    });
  }
});

export default router;

import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// GET /api/reviews - Get all reviews & overall stats
router.get('/', (req, res) => {
  try {
    const db = readDB();
    return res.json({
      success: true,
      stats: db.reviewStats,
      count: db.reviews.length,
      data: db.reviews
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving reviews', error: error.message });
  }
});

// POST /api/reviews - Post a new review
router.post('/', (req, res) => {
  try {
    const { name, author, title, content, rating } = req.body;
    const reviewerName = author || name;

    if (!reviewerName || !content) {
      return res.status(400).json({ success: false, message: 'Author name and review content are required' });
    }

    const db = readDB();
    const reviewRating = parseInt(rating) || 5;

    const newReview = {
      id: Date.now(),
      author: reviewerName,
      verified: true,
      rating: reviewRating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      title: title || 'Exceptional experience',
      content,
      helpfulCount: 0,
      unhelpfulCount: 0
    };

    db.reviews.unshift(newReview);

    // Update rating stats
    db.reviewStats.totalReviews += 1;

    writeDB(db);

    return res.status(201).json({ success: true, data: newReview, stats: db.reviewStats });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error adding review', error: error.message });
  }
});

// POST /api/reviews/:id/vote - Vote helpful or unhelpful
router.post('/:id/vote', (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const { type } = req.body; // 'up' or 'down'

    if (!['up', 'down'].includes(type)) {
      return res.status(400).json({ success: false, message: "Vote type must be 'up' or 'down'" });
    }

    const db = readDB();
    const reviewIndex = db.reviews.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1) {
      return res.status(404).json({ success: false, message: `Review with ID ${reviewId} not found` });
    }

    if (type === 'up') {
      db.reviews[reviewIndex].helpfulCount += 1;
    } else {
      db.reviews[reviewIndex].unhelpfulCount += 1;
    }

    writeDB(db);

    return res.json({ success: true, data: db.reviews[reviewIndex] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating vote', error: error.message });
  }
});

export default router;

import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/newsletter/subscribe - Subscribe to newsletter & get welcome coupon
router.post('/subscribe', (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();
    db.newsletter = db.newsletter || [];

    const existing = db.newsletter.find(s => s.email === cleanEmail);
    if (existing) {
      return res.json({
        success: true,
        alreadySubscribed: true,
        message: 'You are already subscribed to the Silk Club! Use coupon code SILK15 at checkout.',
        couponCode: 'SILK15'
      });
    }

    const subscription = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
      couponCode: 'SILK15',
      discountPercent: 15
    };

    db.newsletter.push(subscription);
    writeDB(db);

    return res.status(201).json({
      success: true,
      message: 'Welcome to the Silk Club! Use coupon code SILK15 for 15% off your order.',
      couponCode: 'SILK15',
      data: subscription
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error processing subscription',
      error: error.message
    });
  }
});

// GET /api/newsletter/subscribers - List subscribers
router.get('/subscribers', (req, res) => {
  try {
    const db = readDB();
    const subscribers = db.newsletter || [];
    return res.json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving subscribers',
      error: error.message
    });
  }
});

export default router;


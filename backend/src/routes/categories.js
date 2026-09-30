import express from 'express';
import { readDB } from '../db.js';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', (req, res) => {
  try {
    const db = readDB();
    return res.json({ success: true, count: db.categories.length, data: db.categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving categories', error: error.message });
  }
});

export default router;

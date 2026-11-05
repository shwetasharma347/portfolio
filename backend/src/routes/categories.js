import express from 'express';
import { readDB } from '../db.js';

const router = express.Router();

// GET /api/categories - Get all categories with dynamic product counts
router.get('/', (req, res) => {
  try {
    const db = readDB();
    const products = db.products || [];
    const categories = (db.categories || []).map(cat => {
      let count = 0;
      if (cat.id === 'best-sellers') {
        count = products.filter(p => p.isBestSeller).length;
      } else if (cat.id === 'trending') {
        count = products.filter(p => p.isTrending).length;
      } else {
        count = products.filter(p => p.category === cat.id).length;
      }
      return {
        ...cat,
        productCount: count
      };
    });

    return res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving categories',
      error: error.message
    });
  }
});

// GET /api/categories/:id - Get single category details
router.get('/:id', (req, res) => {
  try {
    const db = readDB();
    const category = (db.categories || []).find(c => c.id.toLowerCase() === req.params.id.toLowerCase());

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category '${req.params.id}' not found`
      });
    }

    const products = (db.products || []).filter(p => p.category === category.id);
    return res.json({
      success: true,
      data: {
        ...category,
        productCount: products.length,
        products
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving category',
      error: error.message
    });
  }
});

export default router;

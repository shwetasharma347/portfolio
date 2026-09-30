import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// GET /api/products - Get all products with optional filters (?category=men, ?isBestSeller=true, ?isTrending=true, ?search=...)
router.get('/', (req, res) => {
  try {
    const db = readDB();
    let products = db.products || [];

    const { category, isBestSeller, isTrending, search } = req.query;

    if (category) {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (isBestSeller === 'true') {
      products = products.filter(p => p.isBestSeller === true);
    }

    if (isTrending === 'true') {
      products = products.filter(p => p.isTrending === true);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving products', error: error.message });
  }
});

// GET /api/products/:id - Get single product by ID
router.get('/:id', (req, res) => {
  try {
    const db = readDB();
    const product = db.products.find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: `Product with ID '${req.params.id}' not found` });
    }

    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error retrieving product', error: error.message });
  }
});

// POST /api/products - Create a new product
router.post('/', (req, res) => {
  try {
    const { name, tagline, price, category, image, description, sizes, color } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    }

    const db = readDB();
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;

    const newProduct = {
      id,
      name,
      tagline: tagline || '',
      price: parseFloat(price),
      category,
      rating: 5.0,
      reviewCount: 0,
      badge: req.body.badge || 'NEW',
      badgeColor: req.body.badgeColor || 'bg-primary text-white',
      isBestSeller: Boolean(req.body.isBestSeller),
      isTrending: Boolean(req.body.isTrending),
      image: image || 'https://via.placeholder.com/600',
      description: description || '',
      sizes: sizes || [8, 9, 10, 11],
      color: color || 'Standard'
    };

    db.products.push(newProduct);
    writeDB(db);

    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error creating product', error: error.message });
  }
});

export default router;

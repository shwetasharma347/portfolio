import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// GET /api/products - Get all products with rich filtering and sorting
router.get('/', (req, res) => {
  try {
    const db = readDB();
    let products = db.products || [];

    const {
      category,
      isBestSeller,
      isTrending,
      search,
      minPrice,
      maxPrice,
      sort,
      page,
      limit
    } = req.query;

    // Filter by Category
    if (category && category !== 'all') {
      products = products.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Best Seller flag
    if (isBestSeller === 'true') {
      products = products.filter(p => p.isBestSeller === true);
    }

    // Filter by Trending flag
    if (isTrending === 'true') {
      products = products.filter(p => p.isTrending === true);
    }

    // Filter by Search Keyword
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.color && p.color.toLowerCase().includes(q))
      );
    }

    // Filter by Price range
    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        products = products.filter(p => p.price >= min);
      }
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        products = products.filter(p => p.price <= max);
      }
    }

    // Sorting
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'newest') {
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    const total = products.length;

    // Pagination (if specified)
    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.max(1, parseInt(limit) || 10);
      const startIndex = (pageNum - 1) * limitNum;
      products = products.slice(startIndex, startIndex + limitNum);

      return res.json({
        success: true,
        count: products.length,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        data: products
      });
    }

    return res.json({
      success: true,
      count: products.length,
      total,
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving products',
      error: error.message
    });
  }
});

// GET /api/products/:id - Get single product by ID
router.get('/:id', (req, res) => {
  try {
    const db = readDB();
    const product = (db.products || []).find(p => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${req.params.id}' not found`
      });
    }

    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving product',
      error: error.message
    });
  }
});

// POST /api/products - Create a new product
router.post('/', (req, res) => {
  try {
    const { name, tagline, price, category, image, description, sizes, color, badge, badgeColor, isBestSeller, isTrending } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required'
      });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    const db = readDB();
    db.products = db.products || [];

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;

    // Prevent duplicate ID
    if (db.products.some(p => p.id === id)) {
      return res.status(409).json({
        success: false,
        message: `A product with ID '${id}' already exists`
      });
    }

    const newProduct = {
      id,
      name: name.trim(),
      tagline: (tagline || '').trim(),
      price: parsedPrice,
      category: category.toLowerCase().trim(),
      rating: 5.0,
      reviewCount: 0,
      badge: badge || 'NEW',
      badgeColor: badgeColor || 'bg-primary text-white',
      isBestSeller: Boolean(isBestSeller),
      isTrending: Boolean(isTrending),
      image: image || 'https://via.placeholder.com/600',
      description: (description || '').trim(),
      sizes: Array.isArray(sizes) && sizes.length ? sizes : [8, 9, 10, 11, 12],
      color: color || 'Standard'
    };

    db.products.push(newProduct);
    writeDB(db);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error creating product',
      error: error.message
    });
  }
});

// PUT /api/products/:id - Update existing product
router.put('/:id', (req, res) => {
  try {
    const db = readDB();
    db.products = db.products || [];
    const index = db.products.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${req.params.id}' not found`
      });
    }

    const current = db.products[index];
    const updated = {
      ...current,
      ...req.body,
      id: current.id, // Preserve ID
      price: req.body.price !== undefined ? parseFloat(req.body.price) : current.price
    };

    db.products[index] = updated;
    writeDB(db);

    return res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating product',
      error: error.message
    });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', (req, res) => {
  try {
    const db = readDB();
    db.products = db.products || [];
    const initialLen = db.products.length;

    db.products = db.products.filter(p => p.id !== req.params.id);

    if (db.products.length === initialLen) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${req.params.id}' not found`
      });
    }

    writeDB(db);

    return res.json({
      success: true,
      message: `Product '${req.params.id}' deleted successfully`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error deleting product',
      error: error.message
    });
  }
});

export default router;

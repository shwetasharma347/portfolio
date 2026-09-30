import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// POST /api/orders - Submit a new order
router.post('/', (req, res) => {
  try {
    const { items, customer, deliveryMethod, paymentMethod, subtotal, tax, shippingCost, total } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    const db = readDB();
    const orderNumber = `SLK-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      customer: customer || {
        firstName: 'Valued',
        lastName: 'Customer',
        city: 'New York',
        state: 'NY'
      },
      deliveryMethod: deliveryMethod || 'standard',
      estimatedDelivery: deliveryMethod === 'express' ? '1-2 Business Days' : '3-5 Business Days',
      paymentMethod: paymentMethod || 'card',
      items,
      pricing: {
        subtotal: subtotal || 0,
        tax: tax || 0,
        shippingCost: shippingCost || 0,
        total: total || 0
      }
    };

    db.orders.unshift(newOrder);
    writeDB(db);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error creating order', error: error.message });
  }
});

// GET /api/orders/:id - Get order by order number
router.get('/:id', (req, res) => {
  try {
    const db = readDB();
    const order = db.orders.find(o => o.orderNumber.toLowerCase() === req.params.id.toLowerCase());

    if (!order) {
      return res.status(404).json({ success: false, message: `Order '${req.params.id}' not found` });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching order', error: error.message });
  }
});

export default router;

import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// GET /api/orders - Get all orders
router.get('/', (req, res) => {
  try {
    const db = readDB();
    const orders = db.orders || [];
    return res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving orders',
      error: error.message
    });
  }
});

// POST /api/orders - Submit a new order
router.post('/', (req, res) => {
  try {
    const { items, customer, deliveryMethod, paymentMethod, subtotal, tax, shippingCost, total, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    if (!customer || !customer.firstName || !customer.street || !customer.city) {
      return res.status(400).json({
        success: false,
        message: 'Customer shipping address (first name, street, city) is required'
      });
    }

    const db = readDB();
    db.orders = db.orders || [];

    const orderNumber = `SLK-${Math.floor(100000 + Math.random() * 900000)}`;
    const isExpress = deliveryMethod === 'express';

    // Calculate or verify totals
    const calculatedSubtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const calculatedTax = calculatedSubtotal * 0.085;
    const calculatedShipping = isExpress ? 15.0 : 0.0;
    const discount = (couponCode && couponCode.toUpperCase() === 'SILK15') ? (calculatedSubtotal * 0.15) : 0;
    const calculatedTotal = calculatedSubtotal + calculatedTax + calculatedShipping - discount;

    const newOrder = {
      orderNumber,
      id: orderNumber,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      customer: {
        firstName: customer.firstName.trim(),
        lastName: (customer.lastName || '').trim(),
        street: customer.street.trim(),
        city: customer.city.trim(),
        state: (customer.state || 'NY').trim(),
        zip: (customer.zip || '').trim(),
        email: customer.email || ''
      },
      deliveryMethod: isExpress ? 'express' : 'standard',
      estimatedDelivery: isExpress ? '1-2 Business Days' : '3-5 Business Days',
      paymentMethod: paymentMethod || 'card',
      paymentDetails: {
        cardLast4: customer.cardNumber ? customer.cardNumber.slice(-4) : '4242',
        paidAt: new Date().toISOString()
      },
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        size: item.size || 10,
        color: item.color || 'Standard',
        image: item.image || ''
      })),
      pricing: {
        subtotal: subtotal !== undefined ? subtotal : parseFloat(calculatedSubtotal.toFixed(2)),
        tax: tax !== undefined ? tax : parseFloat(calculatedTax.toFixed(2)),
        shippingCost: shippingCost !== undefined ? shippingCost : calculatedShipping,
        discount: parseFloat(discount.toFixed(2)),
        total: total !== undefined ? total : parseFloat(calculatedTotal.toFixed(2))
      }
    };

    db.orders.unshift(newOrder);
    writeDB(db);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error creating order',
      error: error.message
    });
  }
});

// GET /api/orders/:id - Get order by order number or ID
router.get('/:id', (req, res) => {
  try {
    const db = readDB();
    const orders = db.orders || [];
    const query = req.params.id.toLowerCase();
    const order = orders.find(o => o.orderNumber.toLowerCase() === query || (o.id && o.id.toLowerCase() === query));

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order '${req.params.id}' not found`
      });
    }

    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching order',
      error: error.message
    });
  }
});

// PATCH /api/orders/:id/status - Update order tracking status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(', ')}`
      });
    }

    const db = readDB();
    db.orders = db.orders || [];
    const query = req.params.id.toLowerCase();
    const index = db.orders.findIndex(o => o.orderNumber.toLowerCase() === query || (o.id && o.id.toLowerCase() === query));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Order '${req.params.id}' not found`
      });
    }

    db.orders[index].status = status;
    db.orders[index].updatedAt = new Date().toISOString();
    writeDB(db);

    return res.json({
      success: true,
      message: `Order status updated to '${status}'`,
      data: db.orders[index]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating order status',
      error: error.message
    });
  }
});

// DELETE /api/orders/:id - Cancel/remove an order
router.delete('/:id', (req, res) => {
  try {
    const db = readDB();
    db.orders = db.orders || [];
    const query = req.params.id.toLowerCase();
    const initialLen = db.orders.length;

    db.orders = db.orders.filter(o => o.orderNumber.toLowerCase() !== query && (!o.id || o.id.toLowerCase() !== query));

    if (db.orders.length === initialLen) {
      return res.status(404).json({
        success: false,
        message: `Order '${req.params.id}' not found`
      });
    }

    writeDB(db);

    return res.json({
      success: true,
      message: `Order '${req.params.id}' cancelled successfully`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error cancelling order',
      error: error.message
    });
  }
});

export default router;

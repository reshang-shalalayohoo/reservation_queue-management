const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/orders — Create order (customer)
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, reservation_id, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    // Calculate total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const [menuItem] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [item.menu_item_id]);
      if (menuItem.length === 0) {
        return res.status(400).json({ error: `Menu item ${item.menu_item_id} not found.` });
      }
      if (!menuItem[0].available) {
        return res.status(400).json({ error: `${menuItem[0].name} is currently unavailable.` });
      }

      const subtotal = menuItem[0].price * item.quantity;
      total += subtotal;
      orderItems.push({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: menuItem[0].price,
        subtotal,
      });
    }

    // Create order
    const [result] = await pool.query(
      'INSERT INTO orders (customer_id, reservation_id, total, notes) VALUES (?, ?, ?, ?)',
      [req.user.id, reservation_id || null, total, notes || null]
    );

    // Insert order items
    for (const oi of orderItems) {
      await pool.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
        [result.insertId, oi.menu_item_id, oi.quantity, oi.unit_price, oi.subtotal]
      );
    }

    // Get the full order
    const [order] = await pool.query(
      `SELECT o.*, u.name as customer_name, u.phone as customer_phone
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       WHERE o.id = ?`,
      [result.insertId]
    );

    const [fullItems] = await pool.query(
      `SELECT oi.*, mi.name as item_name, mi.image_url
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = ?`,
      [result.insertId]
    );

    const io = req.app.get('io');
    io.to('kitchen').emit('order:new', { ...order[0], items: fullItems });
    io.to('staff').emit('order:new', { ...order[0], items: fullItems });

    res.status(201).json({
      message: 'Order placed successfully.',
      order: { ...order[0], items: fullItems },
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/orders — Get orders
router.get('/', authenticate, async (req, res) => {
  try {
    let query, params;

    if (req.user.role === 'customer') {
      query = `SELECT o.*, 
                 (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
               FROM orders o
               WHERE o.customer_id = ?
               ORDER BY o.created_at DESC`;
      params = [req.user.id];
    } else {
      query = `SELECT o.*, u.name as customer_name, u.phone as customer_phone,
                 (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
               FROM orders o
               JOIN users u ON o.customer_id = u.id
               ORDER BY o.created_at DESC`;
      params = [];
    }

    const [orders] = await pool.query(query, params);
    res.json({ orders });
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/orders/:id — Get order with items
router.get('/:id', authenticate, async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (req.user.role === 'customer' && orders[0].customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const [items] = await pool.query(
      `SELECT oi.*, mi.name as item_name, mi.description as item_description, mi.image_url, mi.category
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ order: { ...orders[0], items } });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/orders/:id/status — Update order status (kitchen/staff)
router.put('/:id/status', authenticate, authorize('kitchen_staff', 'reservation_staff', 'management'), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

    const [order] = await pool.query(
      `SELECT o.*, u.name as customer_name
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (order.length > 0) {
      const io = req.app.get('io');
      io.to(`user:${order[0].customer_id}`).emit('order:update', order[0]);
      io.to('kitchen').emit('order:update', order[0]);
      io.to('staff').emit('order:update', order[0]);
    }

    res.json({ message: 'Order status updated.', order: order[0] });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;

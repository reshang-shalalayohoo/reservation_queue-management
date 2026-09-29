const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/menu — Get all menu items (public for customers)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM menu_items';
    let params = [];

    if (category && category !== 'all') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY category, name';

    const [items] = await pool.query(query, params);
    res.json({ items });
  } catch (err) {
    console.error('Get menu error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/menu/:id — Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const [items] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [req.params.id]);

    if (items.length === 0) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    res.json({ item: items[0] });
  } catch (err) {
    console.error('Get menu item error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/menu — Create menu item (management)
router.post('/', authenticate, authorize('management'), async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO menu_items (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category || 'main_course', image_url || null]
    );

    const [item] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [result.insertId]);
    res.status(201).json({ message: 'Menu item created.', item: item[0] });
  } catch (err) {
    console.error('Create menu item error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/menu/:id — Update menu item (management)
router.put('/:id', authenticate, authorize('management'), async (req, res) => {
  try {
    const { name, description, price, category, image_url, available } = req.body;

    await pool.query(
      `UPDATE menu_items SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        category = COALESCE(?, category),
        image_url = COALESCE(?, image_url),
        available = COALESCE(?, available)
       WHERE id = ?`,
      [name, description, price, category, image_url, available, req.params.id]
    );

    const [item] = await pool.query('SELECT * FROM menu_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Menu item updated.', item: item[0] });
  } catch (err) {
    console.error('Update menu item error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/menu/:id — Delete menu item (management)
router.delete('/:id', authenticate, authorize('management'), async (req, res) => {
  try {
    await pool.query('DELETE FROM menu_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Menu item deleted.' });
  } catch (err) {
    console.error('Delete menu item error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;

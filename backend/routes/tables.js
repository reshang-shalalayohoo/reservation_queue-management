const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/tables — Get all tables
router.get('/', authenticate, async (req, res) => {
  try {
    const [tables] = await pool.query(
      'SELECT * FROM restaurant_tables ORDER BY area, table_number'
    );
    res.json({ tables });
  } catch (err) {
    console.error('Get tables error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/tables — Create table (staff/management)
router.post('/', authenticate, authorize('reservation_staff', 'management'), async (req, res) => {
  try {
    const { table_number, capacity, area } = req.body;

    if (!table_number || !capacity) {
      return res.status(400).json({ error: 'Table number and capacity are required.' });
    }

    const [result] = await pool.query(
      'INSERT INTO restaurant_tables (table_number, capacity, area) VALUES (?, ?, ?)',
      [table_number, capacity, area || 'main']
    );

    const [table] = await pool.query('SELECT * FROM restaurant_tables WHERE id = ?', [result.insertId]);

    const io = req.app.get('io');
    io.to('staff').emit('table:update', table[0]);

    res.status(201).json({ message: 'Table created.', table: table[0] });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Table number already exists.' });
    }
    console.error('Create table error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/tables/:id — Update table
router.put('/:id', authenticate, authorize('reservation_staff', 'management'), async (req, res) => {
  try {
    const { table_number, capacity, area } = req.body;

    await pool.query(
      `UPDATE restaurant_tables SET
        table_number = COALESCE(?, table_number),
        capacity = COALESCE(?, capacity),
        area = COALESCE(?, area)
       WHERE id = ?`,
      [table_number, capacity, area, req.params.id]
    );

    const [table] = await pool.query('SELECT * FROM restaurant_tables WHERE id = ?', [req.params.id]);

    const io = req.app.get('io');
    io.to('staff').emit('table:update', table[0]);

    res.json({ message: 'Table updated.', table: table[0] });
  } catch (err) {
    console.error('Update table error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/tables/:id/status — Update table status
router.put('/:id/status', authenticate, authorize('reservation_staff', 'management'), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['available', 'occupied', 'reserved', 'maintenance'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    await pool.query('UPDATE restaurant_tables SET status = ? WHERE id = ?', [status, req.params.id]);

    const [table] = await pool.query('SELECT * FROM restaurant_tables WHERE id = ?', [req.params.id]);

    const io = req.app.get('io');
    io.to('staff').emit('table:update', table[0]);

    res.json({ message: 'Table status updated.', table: table[0] });
  } catch (err) {
    console.error('Update table status error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/tables/:id — Delete table
router.delete('/:id', authenticate, authorize('management'), async (req, res) => {
  try {
    await pool.query('DELETE FROM restaurant_tables WHERE id = ?', [req.params.id]);

    const io = req.app.get('io');
    io.to('staff').emit('table:deleted', { id: parseInt(req.params.id) });

    res.json({ message: 'Table deleted.' });
  } catch (err) {
    console.error('Delete table error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;

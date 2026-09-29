const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/seating — Get all seating records
router.get('/', authenticate, authorize('reservation_staff', 'management'), async (req, res) => {
  try {
    const [records] = await pool.query(
      `SELECT s.*, t.table_number, t.capacity, t.area,
              r.reservation_date, r.reservation_time, r.guests,
              u.name as customer_name, u.phone as customer_phone
       FROM seating s
       JOIN restaurant_tables t ON s.table_id = t.id
       JOIN reservations r ON s.reservation_id = r.id
       JOIN users u ON r.customer_id = u.id
       ORDER BY s.seated_at DESC`
    );
    res.json({ seating: records });
  } catch (err) {
    console.error('Get seating error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/seating — Assign customer to table
router.post('/', authenticate, authorize('reservation_staff', 'management'), async (req, res) => {
  try {
    const { reservation_id, table_id } = req.body;

    if (!reservation_id || !table_id) {
      return res.status(400).json({ error: 'Reservation ID and table ID are required.' });
    }

    // Check table is available
    const [tables] = await pool.query('SELECT * FROM restaurant_tables WHERE id = ?', [table_id]);
    if (tables.length === 0) {
      return res.status(404).json({ error: 'Table not found.' });
    }
    if (tables[0].status !== 'available' && tables[0].status !== 'reserved') {
      return res.status(400).json({ error: 'Table is not available.' });
    }

    // Create seating record
    const [result] = await pool.query(
      'INSERT INTO seating (reservation_id, table_id) VALUES (?, ?)',
      [reservation_id, table_id]
    );

    // Update table status to occupied
    await pool.query('UPDATE restaurant_tables SET status = "occupied" WHERE id = ?', [table_id]);

    // Update reservation status to seated and assign table
    await pool.query('UPDATE reservations SET status = "seated", table_id = ? WHERE id = ?', [table_id, reservation_id]);

    // Update queue entry to seated
    await pool.query('UPDATE queue_entries SET status = "seated" WHERE reservation_id = ?', [reservation_id]);

    // Get the customer_id for notification
    const [reservation] = await pool.query('SELECT customer_id FROM reservations WHERE id = ?', [reservation_id]);

    const [seating] = await pool.query(
      `SELECT s.*, t.table_number, t.area, u.name as customer_name
       FROM seating s
       JOIN restaurant_tables t ON s.table_id = t.id
       JOIN reservations r ON s.reservation_id = r.id
       JOIN users u ON r.customer_id = u.id
       WHERE s.id = ?`,
      [result.insertId]
    );

    const io = req.app.get('io');
    if (reservation.length > 0) {
      io.to(`user:${reservation[0].customer_id}`).emit('reservation:update', { id: reservation_id, status: 'seated' });
      io.to(`user:${reservation[0].customer_id}`).emit('queue:update', { reservation_id, status: 'seated' });
    }
    io.to('staff').emit('seating:update', seating[0]);
    io.to('staff').emit('table:update', { ...tables[0], status: 'occupied' });

    res.status(201).json({ message: 'Customer seated.', seating: seating[0] });
  } catch (err) {
    console.error('Create seating error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/seating/:id/finish — Mark as finished
router.put('/:id/finish', authenticate, authorize('reservation_staff', 'management'), async (req, res) => {
  try {
    await pool.query(
      'UPDATE seating SET status = "finished", left_at = NOW() WHERE id = ?',
      [req.params.id]
    );

    // Get seating to find table and reservation
    const [seating] = await pool.query('SELECT * FROM seating WHERE id = ?', [req.params.id]);
    if (seating.length > 0) {
      // Free the table
      await pool.query('UPDATE restaurant_tables SET status = "available" WHERE id = ?', [seating[0].table_id]);

      // Complete the reservation
      await pool.query('UPDATE reservations SET status = "completed" WHERE id = ?', [seating[0].reservation_id]);

      const [reservation] = await pool.query('SELECT customer_id FROM reservations WHERE id = ?', [seating[0].reservation_id]);

      const io = req.app.get('io');
      if (reservation.length > 0) {
        io.to(`user:${reservation[0].customer_id}`).emit('reservation:update', { id: seating[0].reservation_id, status: 'completed' });
      }
      io.to('staff').emit('table:update', { id: seating[0].table_id, status: 'available' });
      io.to('staff').emit('seating:update', { id: parseInt(req.params.id), status: 'finished' });
    }

    res.json({ message: 'Seating finished. Table freed.' });
  } catch (err) {
    console.error('Finish seating error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;

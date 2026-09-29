const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/reservations — Create reservation (customer)
router.post('/', authenticate, async (req, res) => {
  try {
    const { reservation_date, reservation_time, guests, table_preference, notes } = req.body;

    if (!reservation_date || !reservation_time || !guests) {
      return res.status(400).json({ error: 'Date, time, and number of guests are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO reservations (customer_id, reservation_date, reservation_time, guests, table_preference, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, reservation_date, reservation_time, guests, table_preference || 'any', notes || null]
    );

    const [reservation] = await pool.query(
      `SELECT r.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
       FROM reservations r
       JOIN users u ON r.customer_id = u.id
       WHERE r.id = ?`,
      [result.insertId]
    );

    // Notify staff
    const io = req.app.get('io');
    io.to('staff').emit('reservation:new', reservation[0]);

    res.status(201).json({ message: 'Reservation created.', reservation: reservation[0] });
  } catch (err) {
    console.error('Create reservation error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/reservations — Get reservations
router.get('/', authenticate, async (req, res) => {
  try {
    let query, params;

    if (req.user.role === 'customer') {
      query = `SELECT r.*, t.table_number, t.area as table_area
               FROM reservations r
               LEFT JOIN restaurant_tables t ON r.table_id = t.id
               WHERE r.customer_id = ?
               ORDER BY r.reservation_date DESC, r.reservation_time DESC`;
      params = [req.user.id];
    } else {
      // Staff and management see all
      query = `SELECT r.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
                      t.table_number, t.area as table_area
               FROM reservations r
               JOIN users u ON r.customer_id = u.id
               LEFT JOIN restaurant_tables t ON r.table_id = t.id
               ORDER BY r.reservation_date DESC, r.reservation_time DESC`;
      params = [];
    }

    const [reservations] = await pool.query(query, params);
    res.json({ reservations });
  } catch (err) {
    console.error('Get reservations error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/reservations/:id — Get single reservation
router.get('/:id', authenticate, async (req, res) => {
  try {
    const [reservations] = await pool.query(
      `SELECT r.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
              t.table_number, t.capacity as table_capacity, t.area as table_area
       FROM reservations r
       JOIN users u ON r.customer_id = u.id
       LEFT JOIN restaurant_tables t ON r.table_id = t.id
       WHERE r.id = ?`,
      [req.params.id]
    );

    if (reservations.length === 0) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    // Customers can only see their own
    if (req.user.role === 'customer' && reservations[0].customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // Get queue entry if exists
    const [queue] = await pool.query(
      'SELECT * FROM queue_entries WHERE reservation_id = ?',
      [req.params.id]
    );

    // Get seating if exists
    const [seating] = await pool.query(
      `SELECT s.*, t.table_number, t.area
       FROM seating s
       JOIN restaurant_tables t ON s.table_id = t.id
       WHERE s.reservation_id = ?`,
      [req.params.id]
    );

    res.json({
      reservation: reservations[0],
      queue: queue[0] || null,
      seating: seating[0] || null,
    });
  } catch (err) {
    console.error('Get reservation error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/reservations/:id — Update reservation
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { reservation_date, reservation_time, guests, table_preference, notes, table_id } = req.body;

    const [existing] = await pool.query('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    // Customers can only edit their own pending reservations
    if (req.user.role === 'customer') {
      if (existing[0].customer_id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied.' });
      }
      if (existing[0].status !== 'pending') {
        return res.status(400).json({ error: 'Can only edit pending reservations.' });
      }
    }

    await pool.query(
      `UPDATE reservations SET
        reservation_date = COALESCE(?, reservation_date),
        reservation_time = COALESCE(?, reservation_time),
        guests = COALESCE(?, guests),
        table_preference = COALESCE(?, table_preference),
        notes = COALESCE(?, notes),
        table_id = COALESCE(?, table_id)
       WHERE id = ?`,
      [reservation_date, reservation_time, guests, table_preference, notes, table_id, req.params.id]
    );

    const [updated] = await pool.query(
      `SELECT r.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
              t.table_number, t.area as table_area
       FROM reservations r
       JOIN users u ON r.customer_id = u.id
       LEFT JOIN restaurant_tables t ON r.table_id = t.id
       WHERE r.id = ?`,
      [req.params.id]
    );

    const io = req.app.get('io');
    io.to(`user:${updated[0].customer_id}`).emit('reservation:update', updated[0]);
    io.to('staff').emit('reservation:update', updated[0]);

    res.json({ message: 'Reservation updated.', reservation: updated[0] });
  } catch (err) {
    console.error('Update reservation error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/reservations/:id/status — Update reservation status (staff)
router.put('/:id/status', authenticate, authorize('reservation_staff', 'management'), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'queued', 'seated', 'completed', 'cancelled', 'no_show'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const [existing] = await pool.query('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    await pool.query('UPDATE reservations SET status = ? WHERE id = ?', [status, req.params.id]);

    // If approved and no queue entry yet, create one
    if (status === 'queued') {
      const [maxQueue] = await pool.query('SELECT MAX(queue_number) as max_num FROM queue_entries');
      const nextNum = (maxQueue[0].max_num || 0) + 1;

      const [maxPos] = await pool.query(
        'SELECT MAX(position) as max_pos FROM queue_entries WHERE status = "waiting"'
      );
      const nextPos = (maxPos[0].max_pos || 0) + 1;

      await pool.query(
        'INSERT INTO queue_entries (reservation_id, queue_number, position) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE status = "waiting", position = ?',
        [req.params.id, nextNum, nextPos, nextPos]
      );
    }

    const [updated] = await pool.query(
      `SELECT r.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone,
              t.table_number, t.area as table_area
       FROM reservations r
       JOIN users u ON r.customer_id = u.id
       LEFT JOIN restaurant_tables t ON r.table_id = t.id
       WHERE r.id = ?`,
      [req.params.id]
    );

    const io = req.app.get('io');
    io.to(`user:${updated[0].customer_id}`).emit('reservation:update', updated[0]);
    io.to('staff').emit('reservation:update', updated[0]);

    res.json({ message: 'Status updated.', reservation: updated[0] });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/reservations/:id — Cancel reservation
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM reservations WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    if (req.user.role === 'customer' && existing[0].customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    await pool.query('UPDATE reservations SET status = "cancelled" WHERE id = ?', [req.params.id]);
    await pool.query('UPDATE queue_entries SET status = "cancelled" WHERE reservation_id = ?', [req.params.id]);

    const io = req.app.get('io');
    io.to(`user:${existing[0].customer_id}`).emit('reservation:update', { ...existing[0], status: 'cancelled' });
    io.to('staff').emit('reservation:update', { ...existing[0], status: 'cancelled' });

    res.json({ message: 'Reservation cancelled.' });
  } catch (err) {
    console.error('Cancel reservation error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;

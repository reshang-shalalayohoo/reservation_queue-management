const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/queue — Get all queue entries (staff)
router.get('/', authenticate, async (req, res) => {
  try {
    let query, params;

    if (req.user.role === 'customer') {
      // Customer gets their own queue entries
      query = `SELECT q.*, r.reservation_date, r.reservation_time, r.guests, r.status as reservation_status,
                      u.name as customer_name
               FROM queue_entries q
               JOIN reservations r ON q.reservation_id = r.id
               JOIN users u ON r.customer_id = u.id
               WHERE r.customer_id = ?
               ORDER BY q.position ASC`;
      params = [req.user.id];
    } else {
      query = `SELECT q.*, r.reservation_date, r.reservation_time, r.guests, r.table_preference,
                      r.status as reservation_status, u.name as customer_name, u.phone as customer_phone
               FROM queue_entries q
               JOIN reservations r ON q.reservation_id = r.id
               JOIN users u ON r.customer_id = u.id
               ORDER BY q.position ASC`;
      params = [];
    }

    const [entries] = await pool.query(query, params);
    res.json({ queue: entries });
  } catch (err) {
    console.error('Get queue error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/queue/my — Get customer's current queue status
router.get('/my', authenticate, async (req, res) => {
  try {
    const [entries] = await pool.query(
      `SELECT q.*, r.reservation_date, r.reservation_time, r.guests, r.status as reservation_status
       FROM queue_entries q
       JOIN reservations r ON q.reservation_id = r.id
       WHERE r.customer_id = ? AND q.status IN ('waiting', 'called')
       ORDER BY q.created_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (entries.length === 0) {
      return res.json({ queue: null, message: 'No active queue entry.' });
    }

    // Get total waiting count
    const [waiting] = await pool.query(
      'SELECT COUNT(*) as total FROM queue_entries WHERE status = "waiting"'
    );

    // Get people ahead
    const [ahead] = await pool.query(
      'SELECT COUNT(*) as count FROM queue_entries WHERE status = "waiting" AND position < ?',
      [entries[0].position]
    );

    res.json({
      queue: entries[0],
      totalWaiting: waiting[0].total,
      peopleAhead: ahead[0].count,
    });
  } catch (err) {
    console.error('Get my queue error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/queue/:id/position — Update queue position (staff)
router.put('/:id/position', authenticate, authorize('reservation_staff', 'management'), async (req, res) => {
  try {
    const { position } = req.body;

    if (!position || position < 1) {
      return res.status(400).json({ error: 'Valid position required.' });
    }

    await pool.query('UPDATE queue_entries SET position = ? WHERE id = ?', [position, req.params.id]);

    const [updated] = await pool.query(
      `SELECT q.*, r.customer_id, u.name as customer_name
       FROM queue_entries q
       JOIN reservations r ON q.reservation_id = r.id
       JOIN users u ON r.customer_id = u.id
       WHERE q.id = ?`,
      [req.params.id]
    );

    if (updated.length > 0) {
      const io = req.app.get('io');
      io.to(`user:${updated[0].customer_id}`).emit('queue:update', updated[0]);
      io.to('staff').emit('queue:update', updated[0]);
    }

    res.json({ message: 'Position updated.', entry: updated[0] });
  } catch (err) {
    console.error('Update position error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/queue/:id/status — Update queue status (staff)
router.put('/:id/status', authenticate, authorize('reservation_staff', 'management'), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['waiting', 'called', 'seated', 'cancelled', 'no_show'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    await pool.query('UPDATE queue_entries SET status = ? WHERE id = ?', [status, req.params.id]);

    // If seated, update reservation status too
    if (status === 'seated') {
      const [entry] = await pool.query('SELECT reservation_id FROM queue_entries WHERE id = ?', [req.params.id]);
      if (entry.length > 0) {
        await pool.query('UPDATE reservations SET status = "seated" WHERE id = ?', [entry[0].reservation_id]);
      }
    }

    const [updated] = await pool.query(
      `SELECT q.*, r.customer_id, u.name as customer_name
       FROM queue_entries q
       JOIN reservations r ON q.reservation_id = r.id
       JOIN users u ON r.customer_id = u.id
       WHERE q.id = ?`,
      [req.params.id]
    );

    if (updated.length > 0) {
      const io = req.app.get('io');
      io.to(`user:${updated[0].customer_id}`).emit('queue:update', updated[0]);
      io.to('staff').emit('queue:update', updated[0]);
    }

    res.json({ message: 'Queue status updated.', entry: updated[0] });
  } catch (err) {
    console.error('Update queue status error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/dashboard/stats — Dashboard statistics (management)
router.get('/stats', authenticate, authorize('management', 'reservation_staff'), async (req, res) => {
  try {
    // Today's date
    const today = new Date().toISOString().split('T')[0];

    // Reservation stats
    const [totalReservations] = await pool.query('SELECT COUNT(*) as count FROM reservations');
    const [todayReservations] = await pool.query(
      'SELECT COUNT(*) as count FROM reservations WHERE reservation_date = ?', [today]
    );
    const [pendingReservations] = await pool.query(
      'SELECT COUNT(*) as count FROM reservations WHERE status = "pending"'
    );
    const [approvedReservations] = await pool.query(
      'SELECT COUNT(*) as count FROM reservations WHERE status = "approved"'
    );

    // Queue stats
    const [waitingQueue] = await pool.query(
      'SELECT COUNT(*) as count FROM queue_entries WHERE status = "waiting"'
    );
    const [calledQueue] = await pool.query(
      'SELECT COUNT(*) as count FROM queue_entries WHERE status = "called"'
    );

    // Table stats
    const [totalTables] = await pool.query('SELECT COUNT(*) as count FROM restaurant_tables');
    const [availableTables] = await pool.query(
      'SELECT COUNT(*) as count FROM restaurant_tables WHERE status = "available"'
    );
    const [occupiedTables] = await pool.query(
      'SELECT COUNT(*) as count FROM restaurant_tables WHERE status = "occupied"'
    );

    // Seating stats
    const [currentlySeated] = await pool.query(
      'SELECT COUNT(*) as count FROM seating WHERE status = "seated"'
    );

    // Order stats
    const [totalOrders] = await pool.query('SELECT COUNT(*) as count FROM orders');
    const [pendingOrders] = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE status = "pending"'
    );
    const [preparingOrders] = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE status = "preparing"'
    );
    const [readyOrders] = await pool.query(
      'SELECT COUNT(*) as count FROM orders WHERE status = "ready"'
    );
    const [todayRevenue] = await pool.query(
      'SELECT COALESCE(SUM(total), 0) as revenue FROM orders WHERE DATE(created_at) = ? AND status != "cancelled"',
      [today]
    );

    // Recent reservations
    const [recentReservations] = await pool.query(
      `SELECT r.*, u.name as customer_name, t.table_number
       FROM reservations r
       JOIN users u ON r.customer_id = u.id
       LEFT JOIN restaurant_tables t ON r.table_id = t.id
       ORDER BY r.created_at DESC
       LIMIT 10`
    );

    // Recent orders
    const [recentOrders] = await pool.query(
      `SELECT o.*, u.name as customer_name
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );

    // Table breakdown by area
    const [tablesByArea] = await pool.query(
      `SELECT area,
              COUNT(*) as total,
              SUM(status = 'available') as available,
              SUM(status = 'occupied') as occupied,
              SUM(status = 'reserved') as reserved,
              SUM(status = 'maintenance') as maintenance
       FROM restaurant_tables
       GROUP BY area`
    );

    res.json({
      reservations: {
        total: totalReservations[0].count,
        today: todayReservations[0].count,
        pending: pendingReservations[0].count,
        approved: approvedReservations[0].count,
      },
      queue: {
        waiting: waitingQueue[0].count,
        called: calledQueue[0].count,
      },
      tables: {
        total: totalTables[0].count,
        available: availableTables[0].count,
        occupied: occupiedTables[0].count,
        byArea: tablesByArea,
      },
      seating: {
        currentlySeated: currentlySeated[0].count,
      },
      orders: {
        total: totalOrders[0].count,
        pending: pendingOrders[0].count,
        preparing: preparingOrders[0].count,
        ready: readyOrders[0].count,
        todayRevenue: todayRevenue[0].revenue,
      },
      recentReservations,
      recentOrders,
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
